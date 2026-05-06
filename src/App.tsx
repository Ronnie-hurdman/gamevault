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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Gamepad2 size={20} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl text-white">GameVault</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:h-screen sticky top-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 hidden lg:flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">G</div>
            <h1 className="text-xl font-bold tracking-tight text-white">GameVault</h1>
          </div>

          <nav className="px-4 space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 pb-2">Menu</div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group relative",
                  activeView === item.id 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-transform group-hover:scale-110",
                  activeView === item.id ? "text-indigo-400" : "text-slate-500"
                )} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <p className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-wider">Operational Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Encrypted Link Active</span>
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
