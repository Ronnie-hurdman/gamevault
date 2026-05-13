import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Trash2, Gamepad2, Check, ChevronDown, Heart, Clock, BarChart3, X, Pencil } from 'lucide-react';
import { Game, PlayedStatus } from '../types';
import { cn } from '../lib/utils';
import EditGameModal from './EditGameModal.tsx';

interface GameCardProps {
  game: Game;
  onUpdate?: (updates: Partial<Game>) => void;
  onRemove?: () => void;
  variant?: 'library' | 'search' | 'wishlist' | 'rec';
}

export default function GameCard({ game, onUpdate, onRemove, variant = 'library' }: GameCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const progressModalRef = useRef<HTMLDivElement>(null);

  const [progressForm, setProgressForm] = useState({
    dateStarted: game.dateStarted || '',
    dateFinished: game.dateFinished || '',
    completionPercentage: game.completionPercentage || 0,
    hoursPlayed: game.hoursPlayed || 0,
  });

  const platformIcons = {
    Sony: <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase">PS5</span>,
    Nintendo: <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase">Switch</span>,
    Steam: <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white uppercase">Steam</span>
  };

  const statusColors = {
    'Played': 'text-emerald-400',
    'Unplayed': 'text-slate-400',
    'Playing': 'text-indigo-400',
  };

  const statusOptions: PlayedStatus[] = ['Unplayed', 'Playing', 'Played'];

  const handleStatusChange = (newStatus: PlayedStatus) => {
    onUpdate?.({ playedStatus: newStatus });
    setShowStatusMenu(false);
  };

  const handleSaveProgress = () => {
    onUpdate?.(progressForm);
    setShowProgressModal(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
      if (progressModalRef.current && !progressModalRef.current.contains(event.target as Node)) {
        setShowProgressModal(false);
      }
    };

    if (showStatusMenu || showProgressModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStatusMenu, showProgressModal]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group relative rounded-lg overflow-visible pixel-shadow transition-colors glass-card border-4",
        variant === 'library' && game.isFavorite
          ? "border-pink-500 bg-black/90"
          : "border-cyan-400 bg-black/80"
      )}
    >
      {/* Game Image */}
      <div className="h-32 bg-black relative overflow-hidden rounded-t-lg border-b-4 border-cyan-400">
        {game.imageUrl ? (
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pixel-shadow"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'; }}
          />
        ) : (
           <div className="w-full h-full flex flex-col items-center justify-center bg-black/60">
             {variant === 'wishlist' && <span className="text-pink-400 text-2xl pixel-heading font-bold tracking-tight mb-2">{game.price || '$59.99'}</span>}
             <Gamepad2 className="text-cyan-400 pixel-shadow" size={32} />
           </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
           {variant === 'library' && game.isFavorite && (
             <div className="flex items-center gap-1 rounded-full border-2 border-pink-500 bg-pink-600/30 px-2 py-1 pixel-shadow">
               <Heart size={10} className="fill-pink-400 text-pink-400" />
               <span className="text-[8px] pixel-heading font-bold uppercase tracking-[0.24em] text-white">Favorite</span>
             </div>
           )}
           {platformIcons[game.platform]}
        </div>

        {variant === 'library' && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity pixel-shadow">
             <span className="text-[8px] pixel-heading font-bold uppercase tracking-widest text-cyan-300">Archive ID: {game.id?.slice(0,4)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 relative">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm pixel-heading font-semibold truncate text-white drop-shadow-[0_0_8px_#00ffea]">{game.title}</h3>
          {variant === 'library' && (
            <button
              onClick={() => onUpdate?.({ isFavorite: !game.isFavorite })}
              className={cn(
                "mt-0.5 shrink-0 rounded-full border-2 p-1.5 transition-colors pixel-shadow",
                game.isFavorite
                  ? "border-pink-500 bg-pink-600/30 text-white"
                  : "border-cyan-400 text-cyan-300 hover:border-pink-500 hover:text-white"
              )}
              title={game.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={game.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={12} className={cn(game.isFavorite && 'fill-current')} />
            </button>
          )}
        </div>
        
        {variant === 'library' && (
          <div className="flex items-center justify-between mt-2 relative" ref={statusMenuRef}>
             <button 
               onClick={() => setShowStatusMenu(!showStatusMenu)}
               className={cn(
                 "flex items-center gap-1 px-2 py-1 rounded transition-all cursor-pointer border-2 pixel-heading",
                 showStatusMenu 
                   ? "bg-black border-pink-500 text-pink-400" 
                   : "hover:bg-black/60 border-cyan-400 text-cyan-300",
                 statusColors[game.playedStatus]
               )}
               title="Click to change status"
             >
               <span className="text-[10px] pixel-heading font-bold uppercase tracking-wide">
                 {game.playedStatus}
               </span>
               <ChevronDown 
                 size={12} 
                 className={cn(
                   "transition-transform duration-200",
                   showStatusMenu && "rotate-180"
                 )}
               />
             </button>
             <button
               onClick={() => setShowProgressModal(true)}
               className="text-[10px] pixel-heading text-cyan-300 hover:text-pink-400 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-black/60 border-2 border-cyan-400"
               title="Edit progress"
             >
               <Clock size={12} />
               {game.hoursPlayed ? `${game.hoursPlayed}h` : '--'}
             </button>

             {/* Status Change Menu */}
             <AnimatePresence>
               {showStatusMenu && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95, y: -8 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: -8 }}
                   className="absolute left-0 top-full mt-2 bg-black border-2 border-pink-500 rounded-lg pixel-shadow z-50 overflow-visible min-w-[140px]"
                 >
                   {statusOptions.map(status => (
                     <button
                       key={status}
                       onClick={() => handleStatusChange(status)}
                       className={cn(
                         "w-full px-3 py-2 text-[10px] pixel-heading font-bold uppercase tracking-wide transition-colors flex items-center justify-between whitespace-nowrap border-b border-cyan-400 last:border-b-0",
                         game.playedStatus === status 
                           ? `text-pink-400 bg-black/80` 
                           : `text-cyan-300 hover:bg-pink-600/30 hover:text-white`
                       )}
                     >
                       <span>{status}</span>
                       {game.playedStatus === status && <Check size={14} className="ml-2" />}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Progress Edit Modal */}
             <AnimatePresence>
               {showProgressModal && (
                 <motion.div
                   ref={progressModalRef}
                   initial={{ opacity: 0, scale: 0.95, y: -8 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: -8 }}
                   className="absolute right-0 top-full mt-2 bg-black border-2 border-cyan-400 rounded-lg pixel-shadow z-50 p-4 w-64"
                 >
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-[10px] pixel-heading font-bold uppercase tracking-widest text-cyan-300">Gameplay Progress</h4>
                     <button
                       onClick={() => setShowProgressModal(false)}
                       className="text-pink-400 hover:text-white transition-colors"
                     >
                       <X size={14} />
                     </button>
                   </div>

                   <div className="space-y-3">
                     {/* Completion Percentage */}
                     <div>
                       <label className="block text-[9px] pixel-heading font-bold uppercase tracking-wide text-cyan-300 mb-1">
                         Completion: {progressForm.completionPercentage}%
                       </label>
                       <input
                         type="range"
                         min="0"
                         max="100"
                         value={progressForm.completionPercentage}
                         onChange={(e) => setProgressForm({ ...progressForm, completionPercentage: Number(e.target.value) })}
                         className="w-full h-2 bg-pink-600 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                       />
                     </div>

                     {/* Hours Played */}
                     <div>
                       <label className="block text-[9px] pixel-heading font-bold uppercase tracking-wide text-cyan-300 mb-1">
                         Hours Played
                       </label>
                       <input
                         type="number"
                         min="0"
                         step="0.5"
                         value={progressForm.hoursPlayed}
                         onChange={(e) => setProgressForm({ ...progressForm, hoursPlayed: Number(e.target.value) })}
                         className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
                       />
                     </div>

                     {/* Date Started */}
                     <div>
                       <label className="block text-[9px] font-bold uppercase tracking-wide text-slate-300 mb-1">
                         Date Started
                       </label>
                       <input
                         type="date"
                         value={progressForm.dateStarted}
                         onChange={(e) => setProgressForm({ ...progressForm, dateStarted: e.target.value })}
                         className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
                       />
                     </div>

                     {/* Date Finished */}
                     <div>
                       <label className="block text-[9px] font-bold uppercase tracking-wide text-slate-300 mb-1">
                         Date Finished
                       </label>
                       <input
                         type="date"
                         value={progressForm.dateFinished}
                         onChange={(e) => setProgressForm({ ...progressForm, dateFinished: e.target.value })}
                         className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
                       />
                     </div>

                     {/* Save Button */}
                     <button
                       onClick={handleSaveProgress}
                       className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded transition-colors"
                     >
                       Save Progress
                     </button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        )}

        {(variant === 'search' || variant === 'rec') && (
           <div className="mt-2">
             <p className="text-[10px] text-slate-400 line-clamp-1">{game.description || 'Highly rated RPG adventure...'}</p>
           </div>
        )}

        {/* Notes Display */}
        {variant === 'library' && game.notes && (
          <p className="mt-2 text-[9px] text-slate-500 italic leading-relaxed line-clamp-2">{game.notes}</p>
        )}

        {/* Progress Display */}
        {variant === 'library' && (game.completionPercentage !== undefined && game.completionPercentage > 0 || game.hoursPlayed !== undefined && game.hoursPlayed > 0) && (
          <div className="mt-3 space-y-2">
            {game.completionPercentage !== undefined && game.completionPercentage > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Progress</span>
                  <span className="text-[9px] font-bold text-indigo-400">{game.completionPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300"
                    style={{ width: `${game.completionPercentage}%` }}
                  />
                </div>
              </div>
            )}
            {game.hoursPlayed !== undefined && game.hoursPlayed > 0 && (
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Time</span>
                <span className="text-indigo-300 font-semibold">{game.hoursPlayed} hours</span>
              </div>
            )}
            {game.dateStarted && (
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Started</span>
                <span className="text-slate-400">{new Date(game.dateStarted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
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
                  <button onClick={() => setShowEditModal(true)} className="p-1 text-slate-500 hover:text-indigo-400 transition-colors" title="Edit game details"><Pencil size={12} /></button>
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

      {/* Edit Game Modal */}
      {variant === 'library' && (
        <EditGameModal
          game={game}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(updates: Partial<Game>) => onUpdate?.(updates)}
        />
      )}
    </motion.div>
  );
}
