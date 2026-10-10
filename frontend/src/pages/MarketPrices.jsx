import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  BarChart2,
  MapPin,
  ArrowUpDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MarketPrices() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortBy, setSortBy] = useState('modal_price_desc');

  const districts = ['Nashik', 'Pune', 'Kolhapur', 'Sangli', 'Solapur', 'Akola', 'Nagpur', 'Latur', 'Amravati'];
  const popularCrops = ['Onion', 'Sugarcane', 'Tomato', 'Grapes', 'Cotton', 'Soybean', 'Wheat', 'Pomegranate'];

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop, selectedDistrict]);

  const fetchPrices = () => {
    setLoading(true);
    const params = {};
    if (selectedCrop) params.crop = selectedCrop;
    if (selectedDistrict) params.district = selectedDistrict;

    api.getMandiPrices(params)
      .then(res => {
        if (res.success) setPrices(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const filteredPrices = prices.filter(p =>
    p.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mandi_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'modal_price_desc') return b.modal_price - a.modal_price;
    if (sortBy === 'modal_price_asc') return a.modal_price - b.modal_price;
    return 0;
  });

  // Chart Data preparation
  const topCropsChartData = {
    labels: filteredPrices.slice(0, 8).map(p => `${p.crop_name.split(' ')[0]} (${p.mandi_name.split(' ')[0]})`),
    datasets: [
      {
        label: 'कमीत कमी भाव (Min ₹)',
        data: filteredPrices.slice(0, 8).map(p => p.min_price),
        backgroundColor: 'rgba(234, 179, 8, 0.7)',
      },
      {
        label: 'सरासरी भाव (Modal ₹)',
        data: filteredPrices.slice(0, 8).map(p => p.modal_price),
        backgroundColor: 'rgba(22, 163, 74, 0.8)',
      },
      {
        label: 'जास्तीत जास्त भाव (Max ₹)',
        data: filteredPrices.slice(0, 8).map(p => p.max_price),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
              <span>MSAMB Verified Market Data</span>
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
              थेट बाजारभाव (Live Mandi Prices)
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              महाराष्ट्रातील सर्व प्रमुख कृषी उत्पन्न बाजार समित्यांचे ताजे आवक व दर
            </p>
          </div>

          <button
            onClick={fetchPrices}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            <span>भाव अपडेट करा</span>
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="पीक किंवा बाजार समितीचे नाव शोधा (e.g. कांदा, लासलगाव)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-agri-500"
              />
            </div>

            {/* District Filter */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-agri-500"
              >
                <option value="">सर्व जिल्हे (All Districts)</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-agri-500"
              >
                <option value="modal_price_desc">भाव: जास्त ते कमी (High to Low)</option>
                <option value="modal_price_asc">भाव: कमी ते जास्त (Low to High)</option>
              </select>
            </div>

          </div>

          {/* Quick Crop Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500 shrink-0">पिके:</span>
            <button
              onClick={() => setSelectedCrop('')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 ${selectedCrop === '' ? 'bg-agri-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              सर्व पिके
            </button>
            {popularCrops.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 ${selectedCrop === c ? 'bg-agri-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        {/* Price Comparison Chart */}
        {filteredPrices.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <BarChart2 className="w-4 h-4 text-agri-600 mr-2" />
                बाजार समितीनुसार दर तुलना (Market Price Comparison Chart)
              </h3>
              <span className="text-xs text-gray-500 font-medium">दर: ₹/क़्विंटल किंवा ₹/टन</span>
            </div>
            <div className="h-72">
              <Bar data={topCropsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        )}

        {/* Mandi Prices Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-700">
            <span>एकूण नोंद: {filteredPrices.length} बाजार समित्या</span>
            <span>तारीख: ०९ ऑक्टोबर २०२६</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-agri-900 text-white">
                  <th className="p-3.5 font-bold">पीक (Crop)</th>
                  <th className="p-3.5 font-bold">बाजार समिती (Mandi)</th>
                  <th className="p-3.5 font-bold">जिल्हा (District)</th>
                  <th className="p-3.5 font-bold text-right">कमीत कमी भाव</th>
                  <th className="p-3.5 font-bold text-right">जास्तीत जास्त भाव</th>
                  <th className="p-3.5 font-bold text-right bg-agri-800">सरासरी दर (Modal)</th>
                  <th className="p-3.5 font-bold text-center">एकक (Unit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500 animate-pulse">
                      बाजारभाव लोड होत आहेत...
                    </td>
                  </tr>
                ) : filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      कोणतीही नोंद सापडली नाही.
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((item, idx) => (
                    <tr key={idx} className="hover:bg-agri-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-gray-900">{item.crop_name}</td>
                      <td className="p-3.5 font-semibold text-agri-800">{item.mandi_name}</td>
                      <td className="p-3.5 text-gray-600">{item.district}</td>
                      <td className="p-3.5 text-right font-medium text-amber-700">₹{item.min_price}</td>
                      <td className="p-3.5 text-right font-medium text-blue-700">₹{item.max_price}</td>
                      <td className="p-3.5 text-right font-extrabold text-green-700 bg-agri-50/80">₹{item.modal_price}</td>
                      <td className="p-3.5 text-center text-gray-500">{item.unit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
