import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Sprout, Phone, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('9876543210');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !newPassword) {
      setErr('कृपया मोबाईल नंबर आणि नवीन पासवर्ड प्रविष्ट करा.');
      return;
    }

    setLoading(true);
    setErr(null);
    setMsg(null);

    api.forgotPassword({ phone, new_password: newPassword })
      .then(res => {
        if (res.success) {
          setMsg(res.message);
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setErr(res.message);
        }
      })
      .catch(e => {
        console.error(e);
        setErr('पासवर्ड रिसेट करताना अडचण आली.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-agri-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            पासवर्ड रीसेट करा (Forgot Password)
          </h2>
          <p className="text-xs text-gray-500">
            तुमचा नोंदणीकृत मोबाईल नंबर प्रविष्ट करून नवीन पासवर्ड सेट करा.
          </p>
        </div>

        {msg && (
          <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {err && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{err}</span>
          </div>
        )}

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
            <label className="block font-bold text-gray-800 mb-1">नवीन पासवर्ड (New Password):</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="नवीन पासवर्ड प्रविष्ट करा..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            <span>{loading ? 'पासवर्ड बदलेले जात आहे...' : 'पासवर्ड बदलावा (Reset Password)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs">
          <Link to="/login" className="font-bold text-agri-700 hover:underline">
            &larr; लॉगिन पृष्ठावर परत जा (Back to Login)
          </Link>
        </div>

      </div>
    </div>
  );
}
