import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Filter, ShoppingBag } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';

export default function WishlistView() {
  const { wishlist, updateGame, removeGame } = useGames();

  const totalValue = wishlist.reduce((acc, game) => {
    const price = parseFloat(game.price?.replace('$', '') || '0');
    return acc + price;
  }, 0);

  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between border-b border-slate-800 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
               <Heart size={24} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic tracking-tighter">Active Wishlist</h2>
          </div>
          <p className="text-slate-500 font-medium text-sm">Tracking {wishlist.length} desired assets across multi-platform sectors.</p>
        </div>

        <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-xl p-5 text-right shadow-xl">
           <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Investment Value</p>
           <p className="text-2xl font-black text-indigo-400 font-mono">${totalValue.toFixed(2)}</p>
        </div>
      </header>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <AnimatePresence>
            {wishlist.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                variant="wishlist"
                onUpdate={(upd) => updateGame(game.id!, upd)}
                onRemove={() => removeGame(game.id!)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-slate-600 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
          <ShoppingBag size={40} className="mb-4 opacity-10" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Wishlist Vault Empty</h3>
        </div>
      )}
    </div>
  );
}
