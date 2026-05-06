import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Library, Heart, Sparkles, TrendingUp, Trophy, Plus } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { cn } from '../lib/utils';

export default function Dashboard({ setActiveView }: { setActiveView: (v: any) => void }) {
  const { games, ownedGames, wishlist } = useGames();

  const stats = [
    { label: 'Total Games', value: ownedGames.length, icon: Library, color: 'text-blue-400' },
    { label: 'Played', value: ownedGames.filter(g => g.playedStatus === 'played').length, icon: Trophy, color: 'text-emerald-400' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'text-indigo-400' },
  ];

  const platforms = [
    { name: 'Sony', count: ownedGames.filter(g => g.platform === 'Sony').length, color: 'bg-indigo-600' },
    { name: 'Nintendo', count: ownedGames.filter(g => g.platform === 'Nintendo').length, color: 'bg-red-500' },
    { name: 'Steam', count: ownedGames.filter(g => g.platform === 'Steam').length, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">Recently Played</h2>
          <p className="text-slate-500 mt-1">Status overview across 3 connected platforms.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl group hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-800", stat.color)}>
                <stat.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-emerald-500/50" />
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black mt-1 text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Platform Breakdown */}
        <section className="lg:col-span-8 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white italic uppercase tracking-tighter">
            <Gamepad2 className="text-indigo-500" size={20} /> Distribution Index
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((p) => {
              const percentage = ownedGames.length > 0 ? (p.count / ownedGames.length) * 100 : 0;
              return (
                <div key={p.name} className="space-y-3">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-slate-300">{p.name}</span>
                    <span className="text-slate-500">{p.count} Units</span>
                  </div>
                  <div className="relative h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]", p.color)} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold">{Math.round(percentage)}% of Library</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <button 
            onClick={() => setActiveView('search')}
            className="flex-1 p-6 rounded-2xl bg-indigo-600 text-white flex items-center justify-between group hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/10"
          >
            <div className="text-left">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Action Protocol</p>
               <span className="text-lg font-bold">Discovery Terminal</span>
            </div>
            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
          
          <button 
             onClick={() => setActiveView('recommendations')}
            className="flex-1 p-6 rounded-2xl bg-slate-800 border border-slate-700 text-white flex items-center justify-between group hover:bg-slate-700 transition-all shadow-xl"
          >
            <div className="text-left">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Neural Engine</p>
               <span className="text-lg font-bold">Get Recs</span>
            </div>
            <Sparkles size={24} className="text-indigo-400 group-hover:scale-110 transition-transform" />
          </button>
        </section>
      </div>
    </div>
  );
}


