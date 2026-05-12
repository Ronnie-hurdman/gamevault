import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Library, Heart, Sparkles, TrendingUp, Trophy, Plus } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { cn } from '../lib/utils';

export default function Dashboard({ setActiveView }: { setActiveView: (v: any) => void }) {
  const { games, ownedGames, wishlist } = useGames();

  const stats = [
    { label: 'Total Games', value: ownedGames.length, icon: Library, color: 'text-blue-400' },
    { label: 'Played', value: ownedGames.filter(g => g.playedStatus === 'Played').length, icon: Trophy, color: 'text-emerald-400' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'text-indigo-400' },
  ];

  const platforms = [
    { name: 'Sony', count: ownedGames.filter(g => g.platform === 'Sony').length, color: 'bg-indigo-600' },
    { name: 'Nintendo', count: ownedGames.filter(g => g.platform === 'Nintendo').length, color: 'bg-red-500' },
    { name: 'Steam', count: ownedGames.filter(g => g.platform === 'Steam').length, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-pink-500 pb-8 pixel-shadow">
        <div>
          <h2 className="text-3xl pixel-heading text-white leading-tight drop-shadow-[0_0_8px_#00ffea]">Recently Played</h2>
          <p className="text-cyan-300 mt-1 pixel-heading text-xs">Status overview across 3 connected platforms.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-lg glass-card pixel-shadow group hover:border-cyan-400 transition-all border-4 border-pink-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded bg-black border-2 border-cyan-400 pixel-heading", stat.color)}>
                <stat.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-green-400 drop-shadow-[0_0_8px_#00ffea]" />
            </div>
            <p className="text-pink-400 text-[10px] pixel-heading font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black mt-1 text-white pixel-heading drop-shadow-[0_0_8px_#00ffea]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Platform Breakdown */}
        <section className="lg:col-span-8 p-8 rounded-lg glass-card pixel-shadow border-4 border-cyan-400">
          <h3 className="text-lg pixel-heading mb-6 flex items-center gap-2 text-white uppercase tracking-tighter drop-shadow-[0_0_8px_#00ffea]">
            <Gamepad2 className="text-pink-400" size={20} /> Distribution Index
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((p) => {
              const percentage = ownedGames.length > 0 ? (p.count / ownedGames.length) * 100 : 0;
              return (
                <div key={p.name} className="space-y-3">
                  <div className="flex justify-between text-[11px] pixel-heading font-bold uppercase tracking-wider">
                    <span className="text-cyan-300">{p.name}</span>
                    <span className="text-pink-400">{p.count} Units</span>
                  </div>
                  <div className="relative h-2 w-full bg-black border-2 border-pink-500 rounded overflow-hidden pixel-shadow">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={cn("h-full rounded bg-cyan-400 pixel-shadow", p.color)} 
                    />
                  </div>
                  <p className="text-[10px] text-green-300 pixel-heading font-bold">{Math.round(percentage)}% of Library</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <button 
            onClick={() => setActiveView('search')}
            className="flex-1 p-6 rounded-lg arcade-btn flex items-center justify-between group pixel-shadow border-4 border-cyan-400"
          >
            <div className="text-left">
               <p className="text-[10px] pixel-heading font-black uppercase tracking-widest text-pink-400 mb-1">Action Protocol</p>
               <span className="text-lg pixel-heading font-bold">Discovery Terminal</span>
            </div>
            <Plus size={24} className="group-hover:rotate-90 transition-transform drop-shadow-[0_0_8px_#00ffea]" />
          </button>
          
          <button 
             onClick={() => setActiveView('recommendations')}
            className="flex-1 p-6 rounded-lg bg-black border-4 border-pink-500 text-cyan-300 flex items-center justify-between group pixel-heading pixel-shadow hover:bg-pink-900/30 transition-all"
          >
            <div className="text-left">
               <p className="text-[10px] pixel-heading font-black uppercase tracking-widest text-cyan-300 mb-1">Neural Engine</p>
               <span className="text-lg pixel-heading font-bold">Get Recs</span>
            </div>
            <Sparkles size={24} className="text-pink-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_#ff00cc]" />
          </button>
        </section>
      </div>
    </div>
  );
}


