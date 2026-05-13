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
      <header className="flex items-end justify-between border-b-4 border-pink-500 pb-8 pixel-shadow">
        <div>
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded bg-pink-600 border-2 border-cyan-400 text-white pixel-shadow">
               <Heart size={24} fill="currentColor" />
            </div>
            <h2 className="text-3xl pixel-heading text-white uppercase tracking-tighter drop-shadow-[0_0_8px_#00ffea]">Active Wishlist</h2>
          </div>
          <p className="text-cyan-300 pixel-heading text-xs">Tracking {wishlist.length} desired assets across multi-platform sectors.</p>
        </div>

        <div className="hidden md:block bg-black border-4 border-cyan-400 rounded-lg p-5 text-right pixel-shadow">
           <p className="text-[10px] pixel-heading text-pink-400 uppercase font-black tracking-widest mb-1">Total Value</p>
           <p className="text-2xl font-black text-cyan-300 pixel-heading">${totalValue.toFixed(2)}</p>
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
        <div className="py-32 flex flex-col items-center justify-center text-pink-400 bg-black rounded-lg border-4 border-dashed border-cyan-400 pixel-shadow">
          <ShoppingBag size={40} className="mb-4 opacity-20" />
          <h3 className="text-sm pixel-heading font-bold uppercase tracking-widest">Wishlist Vault Empty</h3>
        </div>
      )}
    </div>
  );
}
