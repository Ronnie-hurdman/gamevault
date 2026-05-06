import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search as SearchIcon, SlidersHorizontal, LayoutGrid, List, Gamepad2 } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';
import { PlayedStatus, Platform } from '../types';
import { cn } from '../lib/utils';

export default function LibraryView() {
  const { ownedGames, updateGame, removeGame } = useGames();
  const [filter, setFilter] = useState<Platform | 'All'>('All');
  const [playedFilter, setPlayedFilter] = useState<PlayedStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredGames = ownedGames.filter(g => {
    const matchesPlatform = filter === 'All' || g.platform === filter;
    const matchesPlayed = playedFilter === 'All' || g.playedStatus === playedFilter;
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesPlayed && matchesSearch;
  });

  const platforms: (Platform | 'All')[] = ['All', 'Sony', 'Nintendo', 'Steam'];
  const playedStatuses: (PlayedStatus | 'All')[] = ['All', 'unplayed', 'currently-playing', 'played'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic tracking-tighter">Collection</h2>
          <p className="text-slate-500 mt-2 text-[10px] font-bold uppercase tracking-[0.3em]">Operational Assets Index: {ownedGames.length}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded transition-all", viewMode === 'grid' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded transition-all", viewMode === 'list' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}
          >
            <List size={16} />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Query database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
            />
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-lg border border-slate-800">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={cn(
                  "flex-1 py-1 px-3 rounded text-[10px] font-bold transition-all uppercase tracking-wider",
                  filter === p ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-lg border border-slate-800">
            {playedStatuses.map(s => (
              <button
                key={s}
                onClick={() => setPlayedFilter(s)}
                className={cn(
                  "flex-1 py-1 px-3 rounded text-[10px] font-bold transition-all uppercase tracking-wider",
                  playedFilter === s ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {s === 'currently-playing' ? 'Live' : s}
              </button>
            ))}
          </div>

          {/* Advanced */}
          <button className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-bold transition-all text-slate-300">
            <SlidersHorizontal size={14} /> Advanced Filter
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"
      )}>
        <AnimatePresence>
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onUpdate={(upd) => updateGame(game.id!, upd)}
                onRemove={() => removeGame(game.id!)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
              <Gamepad2 size={40} className="mb-4 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest">No matching records found</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
