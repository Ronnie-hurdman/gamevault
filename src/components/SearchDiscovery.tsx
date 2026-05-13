import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon, Star, Filter, Info, Plus, Loader2, Sparkles } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';
import { Platform } from '../types';

// Mock Discovery Data for demonstration
const DISCOVERY_MOCKS = [
  { title: "Elden Ring", platform: "Steam" as Platform, status: "wishlist" as const, playedStatus: "unplayed" as const, price: "$59.99", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1612285330310-24430e7bb124?auto=format&fit=crop&q=80&w=600" },
  { title: "Ghost of Tsushima", platform: "Sony" as Platform, status: "wishlist" as const, playedStatus: "unplayed" as const, price: "$69.99", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1612285330310-24430e7bb124?auto=format&fit=crop&q=80&w=600" },
  { title: "The Legend of Zelda: Tears of the Kingdom", platform: "Nintendo" as Platform, status: "wishlist" as const, playedStatus: "unplayed" as const, price: "$69.99", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1612285330310-24430e7bb124?auto=format&fit=crop&q=80&w=600" },
  { title: "Cyberpunk 2077", platform: "Steam" as Platform, status: "wishlist" as const, playedStatus: "unplayed" as const, price: "$29.99", rating: 4.2, imageUrl: "https://images.unsplash.com/photo-1612285330310-24430e7bb124?auto=format&fit=crop&q=80&w=600" },
  { title: "Horizon Forbidden West", platform: "Sony" as Platform, status: "wishlist" as const, playedStatus: "unplayed" as const, price: "$49.99", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1612285330310-24430e7bb124?auto=format&fit=crop&q=80&w=600" },
  { title: "Super Mario Odyssey", platform: "Nintendo" as Platform, status: "wishlist" as const, playedStatus: "unplayed" as const, price: "$59.99", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1612285330310-24430e7bb124?auto=format&fit=crop&q=80&w=600" },
];

export default function SearchDiscovery() {
  const { addGame } = useGames();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(DISCOVERY_MOCKS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API fetch
    setTimeout(() => {
      setResults(DISCOVERY_MOCKS.filter(m => m.title.toLowerCase().includes(query.toLowerCase())));
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="space-y-10">
      <header className="max-w-2xl border-b-4 border-cyan-400 pb-8 pixel-shadow">
        <h2 className="text-3xl pixel-heading text-white leading-tight drop-shadow-[0_0_8px_#00ffea]">Discovery Protocol</h2>
        <p className="text-pink-400 mt-2 text-xs pixel-heading">Search across Steam, PlayStation, and Nintendo systems.</p>
      </header>

      <div className="max-w-xl">
        <form onSubmit={handleSearch} className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 group-focus-within:text-pink-400 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search global stores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black border-2 border-cyan-400 rounded-lg py-3 pl-11 pr-32 text-sm pixel-heading text-cyan-300 outline-none focus:ring-2 focus:ring-pink-500 shadow-xl transition-all placeholder:text-pink-400"
          />
          <button 
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 arcade-btn text-xs font-bold"
          >
            {isSearching ? <Loader2 className="animate-spin" size={16} /> : "Search"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((game, i) => (
          <motion.div
            key={game.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GameCard 
              game={{ ...game, userId: 'demo' } as any}
              variant="search"
              onUpdate={(updates) => {
                addGame({ ...game, ...updates, userId: 'demo' } as any);
                alert(`${game.title} added!`);
              }}
            />
          </motion.div>
        ))}
      </div>

      {results.length === 0 && !isSearching && (
        <div className="py-20 text-center border-4 border-dashed border-pink-500 rounded-lg bg-black/80 pixel-shadow">
          <Sparkles className="mx-auto mb-4 text-pink-400" size={48} />
          <h3 className="text-sm pixel-heading font-bold text-cyan-300 uppercase tracking-widest">No results in proximity</h3>
        </div>
      )}
    </div>
  );
}
