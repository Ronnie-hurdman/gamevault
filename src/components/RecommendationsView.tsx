import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, RefreshCw, Plus, ArrowRight, Dna } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { GeminiConfigError, getGameRecommendations } from '../services/geminiService';
import { Recommendation } from '../types';

export default function RecommendationsView() {
  const { ownedGames, addGame } = useGames();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [preference, setPreference] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const generateRecs = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const recs = await getGameRecommendations(ownedGames, preference || "Modern RPGs and indies");
      setRecommendations(recs);
    } catch (e) {
      setRecommendations([]);
      if (e instanceof GeminiConfigError) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage('Recommendation service is temporarily unavailable. Please try again shortly.');
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="max-w-3xl border-b-4 border-pink-500 pb-8 pixel-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded bg-pink-600 border-2 border-cyan-400 text-white pixel-shadow">
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-3xl pixel-heading text-white uppercase tracking-tighter drop-shadow-[0_0_8px_#00ffea]">Neural Engine</h2>
        </div>
        <p className="text-cyan-300 text-base pixel-heading leading-relaxed">Gemini AI analyzes your played history and preference variables to identify synergistic gaming experiences.</p>
      </header>

      <div className="p-6 rounded-lg glass-card pixel-shadow border-4 border-cyan-400">
        <label className="block text-[10px] pixel-heading text-pink-400 uppercase tracking-[0.3em] mb-4">Input Preference Variables</label>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            placeholder="e.g. 'Atmospheric narratives', 'Couch co-op', 'Tactical depth'..."
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="flex-1 bg-black border-2 border-cyan-400 rounded-lg px-5 py-3 text-sm pixel-heading outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium placeholder:text-pink-400 text-cyan-300"
          />
          <button 
            onClick={generateRecs}
            disabled={loading}
            className="arcade-btn disabled:opacity-50 text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Dna size={16} />}
            {loading ? "PROCESSING..." : "CALIBRATE"}
          </button>
        </div>
        {errorMessage && (
          <p className="mt-4 rounded-lg border-2 border-pink-500 bg-black/80 px-4 py-3 text-sm text-pink-400 pixel-heading">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-lg glass-card pixel-shadow border-4 border-pink-500 relative group overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="px-2 py-0.5 rounded bg-black border-2 border-cyan-400 text-pink-400 text-[9px] pixel-heading font-black uppercase tracking-widest mb-2 inline-block">
                    {rec.platform}
                  </span>
                  <h3 className="text-lg pixel-heading font-bold text-white drop-shadow-[0_0_8px_#00ffea]">{rec.title}</h3>
                </div>
                <span className="text-cyan-300 pixel-heading font-bold text-xs">{rec.estimatedPrice}</span>
              </div>

              <p className="text-pink-400 text-xs pixel-heading leading-relaxed mb-6 italic">"{rec.reason}"</p>

              <button 
                onClick={() => {
                  addGame({
                    title: rec.title,
                    platform: rec.platform,
                    status: 'wishlist',
                    playedStatus: 'Unplayed',
                    price: rec.estimatedPrice,
                    userId: 'demo'
                  } as any);
                  alert(`${rec.title} indexed.`);
                }}
                className="w-full py-2.5 rounded-lg arcade-btn text-xs font-bold flex items-center justify-center gap-2"
              >
                Index Target <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && recommendations.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center border-4 border-dashed border-cyan-400 rounded-lg bg-black/80 pixel-shadow">
         <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center mb-6 pixel-shadow">
           <Sparkles className="text-white" size={24} />
         </div>
         <h4 className="text-xs pixel-heading font-black text-cyan-300 uppercase tracking-widest">Neural Engine Standby</h4>
        </div>
      )}
    </div>
  );
}
