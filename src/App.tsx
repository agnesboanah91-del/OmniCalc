import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator as CalcIcon, 
  RefreshCw, 
  Clock, 
  Brain, 
  ChevronRight,
  Delete,
  X,
  Plus,
  Minus,
  Divide,
  Equal,
  History,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Sub-components
import BasicCalculator from './components/BasicCalculator';
import CurrencyConverter from './components/CurrencyConverter';
import TimeCalculator from './components/TimeCalculator';
import AISolver from './components/AISolver';

type Tab = 'calculator' | 'currency' | 'time' | 'ai';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const tabs = [
    { id: 'calculator', name: 'Calculator', icon: CalcIcon },
    { id: 'currency', name: 'Currency', icon: RefreshCw },
    { id: 'time', name: 'Time', icon: Clock },
    { id: 'ai', name: 'AI Solver', icon: Brain },
  ];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-zinc-50 text-zinc-900"
    )}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <CalcIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">OmniCalc</h1>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 max-w-4xl mx-auto min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {activeTab === 'calculator' && <BasicCalculator />}
            {activeTab === 'currency' && <CurrencyConverter />}
            {activeTab === 'time' && <TimeCalculator />}
            {activeTab === 'ai' && <AISolver />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-1.5 rounded-2xl flex gap-1 shadow-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300",
                  isActive 
                    ? "text-white" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-indigo-600 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="text-sm font-medium relative z-10 hidden sm:block">
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
