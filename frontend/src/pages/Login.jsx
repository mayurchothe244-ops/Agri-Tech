import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { loginUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    api.login({ phone, password })
      .then(data => {
        if (data.success) {
          loginUser(data.token, data.user);
          navigate('/dashboard');
        } else {
          setError(data.message || 'लॉगिन करता आले नाही.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('सर्व्हर एरर! कृपया थोड्या वेळाने प्रयत्न करा.');
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
            शेतकरी लॉगिन (Farmer Login)
          </h2>
          <p className="text-xs text-gray-500">
            शेतीसाथी मंचावर आपले स्वागत आहे!
          </p>
        </div>

        {/* Demo Account Credentials Banner */}
        <div className="p-3.5 bg-agri-50 rounded-2xl border border-agri-200 text-xs text-agri-900 space-y-1">
          <span className="font-bold flex items-center">
            <ShieldCheck className="w-4 h-4 text-agri-700 mr-1" /> डेमो शेतकरी लॉगिन तपशील:
          </span>
          <p>मोबाईल: <span className="font-bold text-gray-900">9876543210</span> | पासवर्ड: <span className="font-bold text-gray-900">password123</span></p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-gray-800 mb-1">मोबाईल नंबर (Phone Number):</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="10 अंकी मोबाईल नंबर..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-agri-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-800">पासवर्ड (Password):</label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('पासवर्ड रीसेट करण्यासाठी 1800-180-1551 वर कॉल करा किंवा नवीन खाते तयार करा.'); }} className="text-[11px] text-agri-700 font-bold hover:underline">
                पासवर्ड विसरलात?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="तुमचा पासवर्ड..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-agri-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Login)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500">नवीन शेतकरी आहात? </span>
          <Link to="/register" className="font-bold text-agri-700 hover:underline">
            येथे मोफत नोंदणी करा (Register)
          </Link>
        </div>

      </div>
    </div>
  );
}
