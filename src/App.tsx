import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Search, 
  Library, 
  Heart, 
  Sparkles, 
  Settings, 
  Plus, 
  Menu,
  X,
  Play,
  Star,
  Monitor,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Game, Platform, GameStatus, PlayedStatus } from './types';
import Dashboard from './components/Dashboard';
import LibraryView from './components/LibraryView';
import WishlistView from './components/WishlistView';
import SearchDiscovery from './components/SearchDiscovery';
import RecommendationsView from './components/RecommendationsView';
import Walkthrough from './components/Walkthrough';

type View = 'dashboard' | 'library' | 'wishlist' | 'search' | 'recommendations' | 'walkthrough';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Gamepad2 },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'search', label: 'Discovery', icon: Search },
    { id: 'recommendations', label: 'AI Recs', icon: Sparkles },
    { id: 'walkthrough', label: 'Walkthrough', icon: PlayCircle },
  ];


    // --- RETRO ARCADE / PIXEL THEME ---
    return (
      <div className="min-h-screen bg-black text-green-300 font-sans selection:bg-pink-500/40 pixel-shadow">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-black border-b-4 border-pink-500 sticky top-0 z-50 pixel-shadow">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pink-600 border-4 border-cyan-400 rounded-md flex items-center justify-center shadow-lg pixel-shadow">
              <Gamepad2 size={22} className="text-white" />
            </div>
            <span className="font-bold pixel-heading text-2xl text-white drop-shadow-[0_0_8px_#00ffea]">GameVault</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="arcade-btn p-2 !px-3 !py-2"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-black border-r-4 border-pink-500 pixel-shadow transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:h-screen sticky top-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="p-6 hidden lg:flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-pink-600 border-4 border-cyan-400 rounded-md flex items-center justify-center font-bold text-white shadow-lg pixel-shadow">G</div>
              <h1 className="text-2xl font-bold pixel-heading text-white drop-shadow-[0_0_8px_#00ffea]">GameVault</h1>
            </div>

            <nav className="px-4 space-y-2">
              <div className="text-xs font-bold pixel-heading text-cyan-300 uppercase tracking-wider px-2 pb-2">Menu</div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as View);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 text-base pixel-heading rounded-md transition-all duration-200 group relative border-l-4",
                    activeView === item.id 
                      ? "nav-item-active" 
                      : "nav-item"
                  )}
                >
                  <item.icon size={20} className={cn(
                    "transition-transform group-hover:scale-125 drop-shadow-[0_0_8px_#00ffea]",
                    activeView === item.id ? "text-cyan-300" : "text-pink-400"
                  )} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="p-4 rounded-lg bg-black/80 border-4 border-cyan-400 pixel-shadow">
                <p className="text-[11px] pixel-heading text-pink-400 mb-2 font-bold uppercase tracking-wider">Arcade Link Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse pixel-shadow" />
                  <span className="text-[11px] pixel-heading text-cyan-300 uppercase tracking-widest font-bold">Online</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 lg:p-10 max-w-7xl mx-auto"
              >
                {activeView === 'dashboard' && <Dashboard setActiveView={setActiveView} />}
                {activeView === 'library' && <LibraryView />}
                {activeView === 'wishlist' && <WishlistView />}
                {activeView === 'search' && <SearchDiscovery />}
                {activeView === 'recommendations' && <RecommendationsView />}
                {activeView === 'walkthrough' && <Walkthrough />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    );
}
