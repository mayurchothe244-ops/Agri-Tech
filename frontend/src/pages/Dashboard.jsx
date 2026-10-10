import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  User,
  LayoutDashboard,
  CloudSun,
  TrendingUp,
  Scan,
  Calculator,
  Tractor,
  Bell,
  Package,
  Sprout,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [weather, setWeather] = useState(null);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [profitHistory, setProfitHistory] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      api.getWeather(user.location ? user.location.split(',')[0] : 'Nashik')
        .then(res => res.success && setWeather(res));

      api.getMandiPrices({ crop: 'Onion' })
        .then(res => res.success && setMandiPrices(res.data.slice(0, 4)));

      api.getDiseaseHistory()
        .then(res => res.success && setDiseaseHistory(res.history));

      api.getProfitHistory()
        .then(res => res.success && setProfitHistory(res.records));

      api.getMyRentals()
        .then(res => res.success && setMyRentals(res.rentals));

      api.getNotifications()
        .then(res => res.success && setNotifications(res.notifications));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md text-center max-w-md space-y-4">
          <LayoutDashboard className="w-12 h-12 text-agri-700 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">कृपया प्रथम लॉगिन करा</h2>
          <p className="text-xs text-gray-600">शेतकरी डॅशबोर्ड वापरण्यासाठी तुमचे खाते लॉगिन करणे आवश्यक आहे.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-agri-700 text-white font-bold text-xs rounded-xl shadow">
            लॉगिन करा (Login)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Farmer Profile Header */}
        <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-agri-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-agri-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-agri-600 text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center border-2 border-agri-400">
              {user.name ? user.name[0].toUpperCase() : 'F'}
            </div>
            <div>
              <span className="text-xs font-bold text-agri-300 uppercase tracking-widest block">शेतकरी डॅशबोर्ड</span>
              <h1 className="text-2xl font-extrabold text-white mt-0.5">{user.name}</h1>
              <p className="text-xs text-gray-300 mt-1">
                ठिकाण: {user.location} • आवडती पिके: {user.preferred_crops}
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            className="px-4 py-2 bg-agri-700 hover:bg-agri-600 text-white font-bold text-xs rounded-xl border border-agri-500 shadow transition-colors"
          >
            प्रोफाइल संपादन (Edit Profile)
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Modules Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/disease-detection" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-agri-400 transition-all text-center">
                <Scan className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-900 block">AI रोग निदान</span>
              </Link>
              <Link to="/market-prices" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-agri-400 transition-all text-center">
                <TrendingUp className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-900 block">थेट बाजारभाव</span>
              </Link>
              <Link to="/profit-calculator" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-agri-400 transition-all text-center">
                <Calculator className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-900 block">नफा कॅल्क्युलेटर</span>
              </Link>
              <Link to="/equipment-rental" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-agri-400 transition-all text-center">
                <Tractor className="w-6 h-6 text-green-700 mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-900 block">अवजारे भाड्याने</span>
              </Link>
            </div>

            {/* Disease Detection Scan History */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  <Scan className="w-4 h-4 text-emerald-600 mr-2" /> अलीकडील पीक रोग तपासणी (Recent Disease Scans)
                </h3>
                <Link to="/disease-detection" className="text-xs font-bold text-agri-700">नवी तपासणी &rarr;</Link>
              </div>

              {diseaseHistory.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">अजून कोणतीही रोग तपासणी केलेली नाही.</p>
              ) : (
                <div className="space-y-3">
                  {diseaseHistory.map((item, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">{item.predicted_disease}</span>
                        <span className="text-[10px] text-gray-500">पीक: {item.crop_type} • तारीख: {item.created_at}</span>
                      </div>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        {Math.round(item.confidence * 100)}% Match
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profit Calculator Records History */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  <Calculator className="w-4 h-4 text-purple-600 mr-2" /> नफा कॅल्क्युलेटर इतिहास (Saved Profit Records)
                </h3>
                <Link to="/profit-calculator" className="text-xs font-bold text-agri-700">नवीन गणित &rarr;</Link>
              </div>

              {profitHistory.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">अजून कोणतेही नफा गणित जतन केलेले नाही.</p>
              ) : (
                <div className="space-y-3">
                  {profitHistory.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">{rec.crop_name} ({rec.land_area} एकर)</span>
                        <span className="text-[10px] text-gray-500">उत्पन्न: ₹{rec.expected_revenue} | खर्च: ₹{rec.total_cost}</span>
                      </div>
                      <span className={`font-extrabold text-sm ${rec.profit_loss >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        ₹{rec.profit_loss.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Local Weather Card */}
            {weather && (
              <div className="bg-gradient-to-br from-agri-900 to-agri-800 text-white p-6 rounded-3xl shadow-md border border-agri-700">
                <span className="text-xs text-agri-300 font-bold block mb-1">स्थानिक हवामान ({weather.location})</span>
                <div className="flex items-center justify-between my-2">
                  <span className="text-3xl font-extrabold">{weather.current.temp_c}°C</span>
                  <span className="text-xs bg-agri-950/80 px-2.5 py-1 rounded-full border border-agri-600">{weather.current.condition}</span>
                </div>
                <div className="pt-2 border-t border-agri-700/50 flex justify-between text-[11px] text-agri-200">
                  <span>आद्रता: {weather.current.humidity}%</span>
                  <span>पाऊस: {weather.current.rain_probability}</span>
                </div>
              </div>
            )}

            {/* Notifications Panel */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  <Bell className="w-4 h-4 text-agri-600 mr-2" /> कृषी सूचना व इशारे (Notifications)
                </h3>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">कोणतीही नवीन सूचना नाही.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n, idx) => (
                    <div key={idx} className="p-3 bg-agri-50/60 rounded-xl border border-agri-200 text-xs space-y-1">
                      <span className="font-bold text-gray-900 block">{n.title}</span>
                      <p className="text-gray-600 text-[11px]">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
