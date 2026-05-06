import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, Gamepad2, Search, Heart, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    title: "The Command Center",
    desc: "Your Dashboard provides a real-time overview of your collection across Sony, Nintendo, and Steam. Track your progress at a glance.",
    icon: Gamepad2,
    color: "indigo"
  },
  {
    title: "Discovery Protocol",
    desc: "Search for any game globally. Our terminal fetches active pricing and platform availability instantly.",
    icon: Search,
    color: "blue"
  },
  {
    title: "Library Management",
    desc: "Categorize your owned games. Mark them as played, unplayed, or currently playing to keep your backlog under control.",
    icon: CheckCircle2,
    color: "emerald"
  },
  {
    title: "AI Integration",
    desc: "The Neural Engine uses Gemini to analyze your taste. Input preferences to receive high-precision game suggestions.",
    icon: Sparkles,
    color: "violet"
  }
];

export default function Walkthrough() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center border-b border-slate-800 pb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic tracking-tighter mb-2">Systems Briefing</h2>
        <p className="text-slate-500 text-sm font-medium">Master the GameVault operational interface.</p>
      </header>

      <div className="relative aspect-video bg-black rounded-xl border border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center group">
        {/* Simulated Video Player */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 p-12 flex flex-col items-center justify-center text-center bg-slate-950/40 backdrop-blur-sm"
          >
             <div className={`p-4 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 mb-6 shadow-xl`}>
               <step.icon size={48} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-3 uppercase italic tracking-tight">{step.title}</h3>
             <p className="text-slate-400 text-base max-w-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Video UI Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Play fill="white" size={24} className="ml-1" />
           </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 bg-indigo-500' : 'w-1 bg-white/10'}`} 
            />
          ))}
        </div>

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SECURE STREAM // V-0.8</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-bold transition-all disabled:opacity-0"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex gap-2">
           {currentStep === STEPS.length - 1 ? (
             <button 
              onClick={() => alert("System Initialized.")}
              className="px-8 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-xl shadow-indigo-600/20"
             >
               Launch Vault
             </button>
           ) : (
            <button 
              onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-bold transition-all"
            >
              Continue <ChevronRight size={16} />
            </button>
           )}
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Technical Specifications</h4>
          <ul className="space-y-3 text-slate-500 text-xs font-medium">
            <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-indigo-500" /> Neural engine powered by Gemini 2.0</li>
            <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-indigo-500" /> Distributed platform sync protocol</li>
            <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-indigo-500" /> Real-time pricing index monitoring</li>
          </ul>
        </div>
        <div className="p-6 rounded-xl bg-indigo-600/5 border border-indigo-500/10 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-3 italic">Operational Note</h4>
          <p className="text-slate-500 text-xs leading-relaxed italic">
            Toggle between standard and grid views to optimize library navigation. Use the 'Detection Protocol' for accurate asset acquisition projections.
          </p>
        </div>
      </section>
    </div>
  );
}
