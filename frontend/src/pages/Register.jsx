import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, User, Phone, Mail, Lock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const { loginUser } = useAuth();
  const { lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [preferredCrops, setPreferredCrops] = useState('Onion, Sugarcane, Grapes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      setError('कृपया सर्व आवश्यक माहिती भरा.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name,
      phone,
      email,
      password,
      location,
      preferred_language: lang,
      preferred_crops: preferredCrops
    };

    api.register(payload)
      .then(data => {
        if (data.success) {
          loginUser(data.token, data.user);
          navigate('/dashboard');
        } else {
          setError(data.message || 'नोंदणी करता आली नाही.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('सर्व्हर कनेक्ट करण्यात अडचण येत आहे.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-agri-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            शेतकरी मोफत नोंदणी (Registration)
          </h2>
          <p className="text-xs text-gray-500">
            शेतीसाथी मंचावर जोडले जा आणि सर्व सेवांचा मोफत लाभ घ्या!
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div>
            <label className="block font-bold text-gray-800 mb-1">पूर्ण नाव (Full Name):</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="तुमचे नाव प्रविष्ट करा..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-agri-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">मोबाईल नंबर (Phone Number):</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="10 अंकी मोबाईल नंबर..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-agri-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">ईमेल पत्ता (पर्यायी Email):</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="उदा. farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-agri-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">जिल्हा / गाव (Location):</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="उदा. नाशिक, महाराष्ट्र"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-agri-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">पिकांची आवड (Preferred Crops):</label>
            <input
              type="text"
              placeholder="उदा. कांदा, ऊस, द्राक्ष"
              value={preferredCrops}
              onChange={(e) => setPreferredCrops(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-agri-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">पासवर्ड तयार करा (Password):</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="पासवर्ड..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-agri-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2 mt-2"
          >
            <span>{loading ? 'नोंदणी होत आहे...' : 'मोफत खाते तयार करा (Register)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500">आधीच खाते आहे? </span>
          <Link to="/login" className="font-bold text-agri-700 hover:underline">
            येथे लॉगिन करा (Login)
          </Link>
        </div>

      </div>
    </div>
  );
}
