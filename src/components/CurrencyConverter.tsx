import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GHS');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await res.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  const convertedAmount = rates[toCurrency] 
    ? (parseFloat(amount || '0') * rates[toCurrency]).toFixed(2)
    : '0.00';

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Currency Converter</h2>
        <p className="text-zinc-500 text-sm">Real-time exchange rates</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl">
        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
            Amount to convert
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="0.00"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
              {CURRENCIES.find(c => c.code === fromCurrency)?.symbol}
            </div>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-sm font-medium focus:outline-none"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapCurrencies}
            className="p-3 rounded-full bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 transition-colors mt-6"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-sm font-medium focus:outline-none"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="pt-6 border-t border-zinc-800">
          <div className="flex flex-col items-center">
            <span className="text-zinc-500 text-sm mb-1">Result</span>
            <div className="text-4xl font-black text-indigo-400">
              {CURRENCIES.find(c => c.code === toCurrency)?.symbol} {convertedAmount}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-600 uppercase tracking-tighter">
              <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
              Last updated: {lastUpdated || 'Never'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
