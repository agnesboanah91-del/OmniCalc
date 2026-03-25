import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, Minus, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TimeCalculator() {
  const [time1, setTime1] = useState('12:00');
  const [duration, setDuration] = useState('00:30');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [result, setResult] = useState<string | null>(null);

  const calculateTime = () => {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = duration.split(':').map(Number);

    let totalMinutes1 = h1 * 60 + m1;
    let totalMinutes2 = h2 * 60 + m2;

    let finalMinutes = operation === 'add' 
      ? totalMinutes1 + totalMinutes2 
      : totalMinutes1 - totalMinutes2;

    // Handle negative results for subtraction
    if (finalMinutes < 0) finalMinutes += 24 * 60;
    
    // Wrap around 24 hours
    finalMinutes %= 24 * 60;

    const h = Math.floor(finalMinutes / 60);
    const m = finalMinutes % 60;

    setResult(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Time Calculator</h2>
        <p className="text-zinc-500 text-sm">Add or subtract time durations</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl">
        <div className="grid grid-cols-1 gap-6">
          {/* Base Time */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Start Time</label>
            <input
              type="time"
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
            />
          </div>

          {/* Operation Toggle */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setOperation('add')}
              className={cn(
                "flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                operation === 'add' 
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
              )}
            >
              <Plus className="w-4 h-4" /> Add
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={cn(
                "flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                operation === 'subtract' 
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
              )}
            >
              <Minus className="w-4 h-4" /> Subtract
            </button>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Duration (HH:MM)</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9:]/g, '');
                setDuration(val);
              }}
              placeholder="00:00"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
            />
          </div>

          <button
            onClick={calculateTime}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Calculate <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-6 border-t border-zinc-800 text-center"
          >
            <span className="text-zinc-500 text-sm mb-1 block">Calculated Time</span>
            <div className="text-5xl font-black text-indigo-400 tracking-tighter">
              {result}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
