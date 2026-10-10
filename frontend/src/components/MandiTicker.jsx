import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { TrendingUp, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MandiTicker() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    api.getMandiPrices()
      .then(res => {
        if (res.success) setPrices(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!prices || prices.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border-y border-amber-200 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-amber-300/50">
          <div className="p-1.5 bg-amber-500 text-white rounded-lg">
            <TrendingUp className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block leading-tight">थेट बाजारभाव (Live Mandi)</span>
            <span className="text-[10px] text-amber-800 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-0.5 text-green-700" /> MSAMB Verified
            </span>
          </div>
        </div>

        {/* Ticker marquee / cards */}
        <div className="flex space-x-6 overflow-x-auto no-scrollbar py-1 text-xs">
          {prices.map((item, idx) => (
            <div key={idx} className="shrink-0 flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
              <span className="font-bold text-gray-900">{item.crop_name}</span>
              <span className="text-gray-500">({item.mandi_name})</span>
              <span className="font-extrabold text-green-700">₹{item.modal_price}</span>
              <span className="text-[10px] text-gray-400">{item.unit}</span>
            </div>
          ))}
        </div>

        <Link
          to="/market-prices"
          className="shrink-0 pl-4 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center underline"
        >
          <span>सर्व भाव पहा</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>

      </div>
    </div>
  );
}
