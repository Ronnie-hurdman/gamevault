import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, RefreshCw, Plus, ArrowRight, Dna } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { getGameRecommendations } from '../services/geminiService';
import { Recommendation } from '../types';

export default function RecommendationsView() {
  const { ownedGames, addGame } = useGames();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [preference, setPreference] = useState('');

  const generateRecs = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const recs = await getGameRecommendations(ownedGames, preference || "Modern RPGs and indies");
      setRecommendations(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="max-w-3xl border-b border-slate-800 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400">
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic tracking-tighter">Neural Engine</h2>
        </div>
        <p className="text-slate-400 text-base leading-relaxed">Gemini AI analyzes your played history and preference variables to identify synergistic gaming experiences.</p>
      </header>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Input Preference Variables</label>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            placeholder="e.g. 'Atmospheric narratives', 'Couch co-op', 'Tactical depth'..."
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="flex-1 bg-slate-950/40 border border-slate-800 rounded-lg px-5 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-700"
          />
          <button 
            onClick={generateRecs}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3 rounded-lg text-xs font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Dna size={16} />}
            {loading ? "PROCESSING..." : "CALIBRATE"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl relative group overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-700 mb-2 inline-block">
                    {rec.platform}
                  </span>
                  <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-xs">{rec.estimatedPrice}</span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium italic">"{rec.reason}"</p>

              <button 
                onClick={() => {
                  addGame({
                    title: rec.title,
                    platform: rec.platform,
                    status: 'wishlist',
                    playedStatus: 'unplayed',
                    price: rec.estimatedPrice,
                    userId: 'demo'
                  } as any);
                  alert(`${rec.title} indexed.`);
                }}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                Index Target <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && recommendations.length === 0 && (
         <div className="py-20 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6">
             <Sparkles className="text-slate-600" size={24} />
          </div>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Neural Engine Standby</h4>
        </div>
      )}
    </div>
  );
}
