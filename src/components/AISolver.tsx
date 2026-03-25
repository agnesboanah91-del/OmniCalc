import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Send, Sparkles, Loader2, Info } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';

export default function AISolver() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ answer: string; explanation: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const solveProblem = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = 'gemini-3-flash-preview';
      
      const prompt = `Solve this math problem and provide a clear answer and a step-by-step explanation. 
      Format the output as a JSON object with "answer" and "explanation" fields.
      Problem: ${input}`;

      const result = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = result.text;
      if (text) {
        const parsed = JSON.parse(text);
        setResponse(parsed);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to solve problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response, loading]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3" /> Powered by Gemini
        </div>
        <h2 className="text-3xl font-bold tracking-tight">AI Math Solver</h2>
        <p className="text-zinc-500 text-sm">Ask any math question, from basic arithmetic to algebra</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Solve 2x + 5 = 15 or What is 15% of 250?"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 pt-6 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all min-h-[120px] resize-none text-white"
          />
          <button
            onClick={solveProblem}
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
            >
              <Info className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Final Answer</span>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {response.answer}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-800/30 border border-zinc-800/50">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 block">Explanation</span>
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {response.explanation}
                </div>
              </div>
              <div ref={scrollRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {!response && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Solve 3x^2 - 12 = 0",
              "What is the derivative of x^2?",
              "Calculate 25% of 1,200",
              "Simplify (x+2)(x-3)"
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInput(example)}
                className="text-left p-3 rounded-xl bg-zinc-800/20 border border-zinc-800/50 text-zinc-500 text-xs hover:bg-zinc-800/40 hover:text-zinc-300 transition-all"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
