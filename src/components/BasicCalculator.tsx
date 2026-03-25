import React, { useState, useEffect } from 'react';
import { create, all } from 'mathjs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Delete, 
  Equal, 
  Divide, 
  X, 
  Minus, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';

const math = create(all);

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [isScientific, setIsScientific] = useState(false);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setDisplay(prev => {
      const lastChar = prev.slice(-1);
      if (['+', '-', '*', '/'].includes(lastChar)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
  };

  const calculate = () => {
    try {
      // Replace some visual operators with mathjs compatible ones
      const expression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/sin\(/g, 'sin(deg ')
        .replace(/cos\(/g, 'cos(deg ')
        .replace(/tan\(/g, 'tan(deg ');
      
      const result = math.evaluate(expression);
      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
      
      setHistory(prev => [display + ' = ' + formattedResult, ...prev].slice(0, 5));
      setDisplay(formattedResult);
    } catch (error) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const clear = () => setDisplay('0');
  const backspace = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');

  const buttons = [
    { label: 'C', onClick: clear, className: 'text-red-500' },
    { label: '(', onClick: () => handleNumber('(') },
    { label: ')', onClick: () => handleNumber(')') },
    { label: '÷', onClick: () => handleOperator('/'), icon: Divide, className: 'text-indigo-500' },
    { label: '7', onClick: () => handleNumber('7') },
    { label: '8', onClick: () => handleNumber('8') },
    { label: '9', onClick: () => handleNumber('9') },
    { label: '×', onClick: () => handleOperator('*'), icon: X, className: 'text-indigo-500' },
    { label: '4', onClick: () => handleNumber('4') },
    { label: '5', onClick: () => handleNumber('5') },
    { label: '6', onClick: () => handleNumber('6') },
    { label: '-', onClick: () => handleOperator('-'), icon: Minus, className: 'text-indigo-500' },
    { label: '1', onClick: () => handleNumber('1') },
    { label: '2', onClick: () => handleNumber('2') },
    { label: '3', onClick: () => handleNumber('3') },
    { label: '+', onClick: () => handleOperator('+'), icon: Plus, className: 'text-indigo-500' },
    { label: '0', onClick: () => handleNumber('0'), className: 'col-span-1' },
    { label: '.', onClick: () => handleNumber('.') },
    { label: '⌫', onClick: backspace, icon: Delete },
    { label: '=', onClick: calculate, icon: Equal, className: 'bg-indigo-600 text-white hover:bg-indigo-700' },
  ];

  const scientificButtons = [
    { label: 'sin', onClick: () => handleNumber('sin(') },
    { label: 'cos', onClick: () => handleNumber('cos(') },
    { label: 'tan', onClick: () => handleNumber('tan(') },
    { label: 'log', onClick: () => handleNumber('log(') },
    { label: 'ln', onClick: () => handleNumber('ln(') },
    { label: '√', onClick: () => handleNumber('sqrt(') },
    { label: 'x²', onClick: () => handleNumber('^2') },
    { label: 'π', onClick: () => handleNumber('PI') },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      {/* Display Area */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-inner">
        <div className="h-12 overflow-hidden text-right">
          <AnimatePresence mode="popLayout">
            {history.map((h, i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1 - i * 0.2, y: 0 }}
                className="text-zinc-500 text-sm font-medium"
              >
                {h}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-right mt-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <span className="text-5xl font-bold tracking-tight">
            {display}
          </span>
        </div>
      </div>

      {/* Mode Toggle */}
      <button 
        onClick={() => setIsScientific(!isScientific)}
        className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors"
      >
        {isScientific ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {isScientific ? 'Hide Scientific' : 'Show Scientific'}
      </button>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3">
        {isScientific && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="col-span-4 grid grid-cols-4 gap-3 mb-3"
          >
            {scientificButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                className="h-14 rounded-2xl bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 font-medium transition-all active:scale-95"
              >
                {btn.label}
              </button>
            ))}
          </motion.div>
        )}

        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className={cn(
              "h-16 rounded-2xl flex items-center justify-center text-xl font-semibold transition-all active:scale-95",
              btn.className || "bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-200"
            )}
          >
            {btn.icon ? <btn.icon className="w-6 h-6" /> : btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
