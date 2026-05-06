import React from 'react';
import { motion } from 'motion/react';
import { Star, Trash2, Gamepad2 } from 'lucide-react';
import { Game } from '../types';
import { cn } from '../lib/utils';

interface GameCardProps {
  game: Game;
  onUpdate?: (updates: Partial<Game>) => void;
  onRemove?: () => void;
  variant?: 'library' | 'search' | 'wishlist' | 'rec';
}

export default function GameCard({ game, onUpdate, onRemove, variant = 'library' }: GameCardProps) {
  const platformIcons = {
    Sony: <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase">PS5</span>,
    Nintendo: <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase">Switch</span>,
    Steam: <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white uppercase">Steam</span>
  };

  const statusColors = {
    played: 'text-emerald-400',
    unplayed: 'text-slate-400',
    'currently-playing': 'text-indigo-400',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-xl"
    >
      {/* Game Image */}
      <div className="h-32 bg-slate-800 relative overflow-hidden">
        {game.imageUrl ? (
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/50">
             {variant === 'wishlist' && <span className="text-slate-500 text-2xl font-bold tracking-tight mb-2">{game.price || '$59.99'}</span>}
             <Gamepad2 className="text-slate-700" size={32} />
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-2 right-2">
           {platformIcons[game.platform]}
        </div>

        {variant === 'library' && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">Archive ID: {game.id?.slice(0,4)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate text-white">{game.title}</h3>
        
        {variant === 'library' && (
          <div className="flex items-center justify-between mt-2">
             <span className={cn(
               "text-[10px] font-bold uppercase tracking-wide",
               statusColors[game.playedStatus]
             )}>
               {game.playedStatus.replace('-', ' ')}
             </span>
             <span className="text-[10px] text-slate-400">{game.playedStatus === 'played' ? '48 hrs' : '--'}</span>
          </div>
        )}

        {(variant === 'search' || variant === 'rec') && (
           <div className="mt-2">
             <p className="text-[10px] text-slate-400 line-clamp-1">{game.description || 'Highly rated RPG adventure...'}</p>
           </div>
        )}

        {/* Ratings */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-xs">★★★★☆</span>
            <span className="text-[10px] text-slate-500">({Math.floor(Math.random() * 1000)})</span>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             {variant === 'library' ? (
                <>
                  <button onClick={() => onUpdate?.({ rating: ((game.rating || 0) % 5) + 1 })} className="p-1 text-slate-500 hover:text-white transition-colors"><Star size={12} /></button>
                  <button onClick={onRemove} className="p-1 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={12} /></button>
                </>
             ) : variant === 'wishlist' ? (
                <>
                  <button onClick={() => onUpdate?.({ status: 'owned' })} className="bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-lg shadow-indigo-600/20">Buy</button>
                  <button onClick={onRemove} className="p-1 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={12} /></button>
                </>
             ) : (
                <button onClick={() => onUpdate?.({ status: 'owned' })} className="bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-lg shadow-indigo-600/20">Buy</button>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
