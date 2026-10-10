import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Printer,
  Save,
  Clock,
  PieChart,
  HelpCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProfitCalculator() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Inputs
  const [cropName, setCropName] = useState('Onion');
  const [landArea, setLandArea] = useState(1.0);
  const [seedCost, setSeedCost] = useState(8000);
  const [fertilizerCost, setFertilizerCost] = useState(12000);
  const [pesticideCost, setPesticideCost] = useState(6000);
  const [laborCost, setLaborCost] = useState(15000);
  const [irrigationCost, setIrrigationCost] = useState(4000);
  const [machineryCost, setMachineryCost] = useState(7000);
  const [transportCost, setTransportCost] = useState(3000);
  const [otherCost, setOtherCost] = useState(2000);

  const [expectedYield, setExpectedYield] = useState(80); // Quintals
  const [expectedPrice, setExpectedPrice] = useState(2150); // ₹/Quintal

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    calculateLive();
    if (user) fetchHistory();
  }, [cropName, landArea, seedCost, fertilizerCost, pesticideCost, laborCost, irrigationCost, machineryCost, transportCost, otherCost, expectedYield, expectedPrice]);

  const calculateLive = () => {
    const payload = {
      crop_name: cropName,
      land_area: parseFloat(landArea) || 1,
      seed_cost: parseFloat(seedCost) || 0,
      fertilizer_cost: parseFloat(fertilizerCost) || 0,
      pesticide_cost: parseFloat(pesticideCost) || 0,
      labor_cost: parseFloat(laborCost) || 0,
      irrigation_cost: parseFloat(irrigationCost) || 0,
      machinery_cost: parseFloat(machineryCost) || 0,
      transport_cost: parseFloat(transportCost) || 0,
      other_cost: parseFloat(otherCost) || 0,
      expected_yield: parseFloat(expectedYield) || 1,
      expected_price: parseFloat(expectedPrice) || 0
    };

    api.calculateProfit(payload)
      .then(res => {
        if (res.success) setResult(res);
      })
      .catch(err => console.error(err));
  };

  const fetchHistory = () => {
    api.getProfitHistory()
      .then(res => {
        if (res.success) setHistory(res.records);
      })
      .catch(err => console.error(err));
  };

  const handlePrint = () => {
    window.print();
  };

  // Chart data
  const chartData = result ? {
    labels: Object.keys(result.breakdown),
    datasets: [
      {
        data: Object.values(result.breakdown),
        backgroundColor: [
          '#16a34a', '#0284c7', '#eab308', '#d97706',
          '#9333ea', '#0d9488', '#dc2626', '#64748b'
        ],
        borderWidth: 1
      }
    ]
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 print:bg-white print:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div>
            <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              <Calculator className="w-3.5 h-3.5 text-purple-600" />
              <span>स्मार्ट शेती नफा-तोटा गणित</span>
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
              स्मार्ट नफा कॅल्क्युलेटर (Profit Calculator)
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              उत्पादन खर्च, अपेक्षित उत्पन्न आणि ब्रेक-इव्हन विक्री दराचे तात्काळ अचूक गणित.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center space-x-2 self-start md:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>अहवाल प्रिंट करा / PDF (Export Report)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section (Left 6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5 print:shadow-none print:border-none">
            <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              १. शेती खर्चाचा तपशील प्रविष्ट करा (Enter Expenses)
            </h2>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">पिकाचे नाव (Crop):</label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold"
                  >
                    <option value="Onion">कांदा (Onion)</option>
                    <option value="Sugarcane">ऊस (Sugarcane)</option>
                    <option value="Tomato">टोमॅटो (Tomato)</option>
                    <option value="Grapes">द्राक्ष (Grapes)</option>
                    <option value="Cotton">कापूस (Cotton)</option>
                    <option value="Soybean">सोयाबीन (Soybean)</option>
                    <option value="Wheat">गहू (Wheat)</option>
                    <option value="Pomegranate">डाळिंब (Pomegranate)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">क्षेत्रफळ (एकरामध्ये):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Expense Fields Grid */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <span className="font-bold text-gray-900 block">खर्चाचे घटक (₹ मध्ये):</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-600 block">बियाणे खर्च (Seed):</label>
                    <input type="number" value={seedCost} onChange={(e) => setSeedCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block">खते व औषधे (Fertilizers):</label>
                    <input type="number" value={fertilizerCost} onChange={(e) => setFertilizerCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block">कीटकनाशके (Pesticides):</label>
                    <input type="number" value={pesticideCost} onChange={(e) => setPesticideCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block">मजुरी खर्च (Labor):</label>
                    <input type="number" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block">सिंचन व वीज (Irrigation):</label>
                    <input type="number" value={irrigationCost} onChange={(e) => setIrrigationCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block">ट्रॅक्टर भाडे (Machinery):</label>
                    <input type="number" value={machineryCost} onChange={(e) => setMachineryCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block">वाहतूक खर्च (Transport):</label>
                    <input type="number" value={transportCost} onChange={(e) => setTransportCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block">इतर खर्च (Other):</label>
                    <input type="number" value={otherCost} onChange={(e) => setOtherCost(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                </div>
              </div>

              {/* Yield & Price Expectations */}
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                <span className="font-bold text-purple-950 block">उत्पादन व अपेक्षित भाव:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-purple-900 block">अपेक्षित उत्पादन (क़्विंटल/टन):</label>
                    <input type="number" value={expectedYield} onChange={(e) => setExpectedYield(e.target.value)} className="w-full p-2.5 bg-white border rounded-lg font-bold text-sm" />
                  </div>
                  <div>
                    <label className="text-[11px] text-purple-900 block">अपेक्षित विक्री भाव (₹/एकक):</label>
                    <input type="number" value={expectedPrice} onChange={(e) => setExpectedPrice(e.target.value)} className="w-full p-2.5 bg-white border rounded-lg font-bold text-sm" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Output Calculations Section (Right 6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {result && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-200 shadow-lg space-y-6 animate-fadeIn">
                
                {/* Result Hero Banner */}
                <div className={`p-6 rounded-2xl border text-center ${result.is_profit ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                    {result.is_profit ? 'अपेक्षित निम्वळ नफा (Net Profit)' : 'अपेक्षित तोटा (Net Loss)'}
                  </span>
                  <div className="text-4xl font-extrabold my-1">
                    ₹{Math.abs(result.profit_loss).toLocaleString()}
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-xs font-bold mt-2">
                    <span className="bg-white/80 px-3 py-1 rounded-full border border-gray-200">
                      नफा प्रमाण: {result.profit_margin_pct}%
                    </span>
                    <span className="bg-white/80 px-3 py-1 rounded-full border border-gray-200">
                      ब्रेक-इव्हन दर: ₹{result.break_even_price}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-gray-500 block">एकूण उत्पादन खर्च (Total Cost)</span>
                    <span className="text-lg font-extrabold text-red-600">₹{result.total_cost.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 block">₹{result.cost_per_acre}/एकर</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-gray-500 block">एकूण उत्पन्न (Total Revenue)</span>
                    <span className="text-lg font-extrabold text-green-700">₹{result.expected_revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 block">{result.land_area} एकरासाठी</span>
                  </div>
                </div>

                {/* Expense Breakdown Doughnut Chart */}
                {chartData && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <h3 className="text-xs font-bold text-gray-800 mb-3 flex items-center">
                      <PieChart className="w-4 h-4 text-purple-600 mr-1.5" /> खर्चाची विभागणी (Expense Breakdown Chart)
                    </h3>
                    <div className="h-48 max-w-xs mx-auto">
                      <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } } } }} />
                    </div>
                  </div>
                )}

                {/* Scenario Matrix */}
                <div>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    विक्री भाव बदल दृश्य (Price Sensitivity Scenarios):
                  </h3>
                  <div className="space-y-2 text-xs">
                    {result.scenarios.map((s, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-900 block">{s.scenario}</span>
                          <span className="text-[10px] text-gray-500">विक्री दर: ₹{s.price}</span>
                        </div>
                        <span className={`font-extrabold ${s.profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                          ₹{s.profit.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
