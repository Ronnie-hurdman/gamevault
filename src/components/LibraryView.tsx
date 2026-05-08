import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, LayoutGrid, List, Gamepad2, ArrowUpDown, Heart } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';
import { PlayedStatus, Platform } from '../types';
import { cn } from '../lib/utils';

export default function LibraryView() {
  const { ownedGames, updateGame, removeGame } = useGames();
  const favoriteCount = ownedGames.filter((game) => game.isFavorite).length;
  const [filter, setFilter] = useState<Platform | 'All'>('All');
  const [playedFilter, setPlayedFilter] = useState<PlayedStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'platform' | 'createdAt' | 'playedStatus' | 'completionPercentage'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredGames = ownedGames.filter(g => {
    const matchesPlatform = filter === 'All' || g.platform === filter;
    const matchesPlayed = playedFilter === 'All' || g.playedStatus === playedFilter;
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesPlayed && matchesSearch;
  });

  const statusOrder: Record<PlayedStatus, number> = {
    Unplayed: 1,
    Playing: 2,
    Played: 3,
  };

  const sortedGames = [...filteredGames].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'platform') {
      comparison = a.platform.localeCompare(b.platform);
    } else if (sortBy === 'playedStatus') {
      comparison = statusOrder[a.playedStatus] - statusOrder[b.playedStatus];
    } else if (sortBy === 'completionPercentage') {
      comparison = (a.completionPercentage || 0) - (b.completionPercentage || 0);
    } else {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      comparison = aTime - bTime;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const platforms: (Platform | 'All')[] = ['All', 'Sony', 'Nintendo', 'Steam'];
  const playedStatuses: (PlayedStatus | 'All')[] = ['All', 'Unplayed', 'Playing', 'Played'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic tracking-tighter">Collection</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Operational Assets Index: {ownedGames.length}</p>
            <div className="inline-flex items-center gap-1 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-rose-200">
              <Heart size={10} className="fill-current" />
              <span>Favorites: {favoriteCount}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <div className="relative min-w-[130px]">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'title' | 'platform' | 'createdAt' | 'playedStatus' | 'completionPercentage')}
                className="w-full bg-slate-900 border border-slate-800 rounded py-2 pl-8 pr-2 text-[10px] font-bold uppercase tracking-wider text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500/50"
              >
                <option value="title">Title</option>
                <option value="platform">Platform</option>
                <option value="createdAt">Date Added</option>
                <option value="playedStatus">Status</option>
                <option value="completionPercentage">Progress</option>
              </select>
            </div>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title="Toggle sort direction"
            >
              {sortDirection === 'asc' ? 'Asc' : 'Desc'}
            </button>
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
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                {s}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"
      )}>
        <AnimatePresence>
          {sortedGames.length > 0 ? (
            sortedGames.map((game) => (
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
