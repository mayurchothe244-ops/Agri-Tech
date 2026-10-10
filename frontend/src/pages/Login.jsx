import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, Lock, AlertCircle, ArrowRight, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { loginUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mode: 'otp' | 'google' | 'password'
  const [authMode, setAuthMode] = useState('otp');

  // OTP Login State
  const [phone, setPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [debugOtp, setDebugOtp] = useState(null);

  // Password Login State
  const [password, setPassword] = useState('password123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // 1. Send OTP Handler
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('कृपया 10 अंकी वैध मोबाईल नंबर टाका.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    api.sendOtp({ phone })
      .then(res => {
        if (res.success) {
          setOtpSent(true);
          setDebugOtp(res.otp_debug);
          setSuccessMsg(res.message);
        } else {
          setError(res.message || 'OTP पाठवता आला नाही.');
        }
      })
      .catch(() => setError('सर्व्हरशी संपर्क साधता आला नाही.'))
      .finally(() => setLoading(false));
  };

  // 2. Verify OTP Handler
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('कृपया 6 अंकी OTP प्रविष्ट करा.');
      return;
    }

    setLoading(true);
    setError(null);

    api.verifyOtp({ phone, otp: otpCode })
      .then(res => {
        if (res.success) {
          loginUser(res.token, res.user);
          navigate('/dashboard');
        } else {
          setError(res.message || 'OTP चुकीचा आहे.');
        }
      })
      .catch(() => setError('पडताळणी दरम्यान त्रुटी आली.'))
      .finally(() => setLoading(false));
  };

  // 3. Google Sign-In Handler
  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);

    // Simulate Google OAuth account response (or Firebase Auth integration)
    const mockGoogleEmail = "mayurchothe244@gmail.com";
    const mockGoogleName = "Mayur Chothe";

    api.googleLogin({ email: mockGoogleEmail, name: mockGoogleName, google_id: "google_123456" })
      .then(res => {
        if (res.success) {
          loginUser(res.token, res.user);
          navigate('/dashboard');
        } else {
          setError(res.message || 'Google लॉगिन अयशस्वी.');
        }
      })
      .catch(() => setError('Google सर्व्हर कनेक्ट होऊ शकला नाही.'))
      .finally(() => setLoading(false));
  };

  // 4. Password Login Handler
  const handlePasswordLogin = (e) => {
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
      .catch(() => setError('सर्व्हर एरर! कृपया थोड्या वेळाने प्रयत्न करा.'))
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
            शेतीसाथी मंचावर आपले मोफत स्वागत आहे!
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${authMode === 'otp' ? 'bg-white text-agri-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            📱 Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('google'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${authMode === 'google' ? 'bg-white text-agri-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            🌐 Google
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${authMode === 'password' ? 'bg-white text-agri-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            🔑 Password
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* AUTH MODE 1: MOBILE NUMBER + OTP */}
        {/* ---------------------------------------------------------------------- */}
        {authMode === 'otp' && (
          <div className="space-y-4 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">मोबाईल नंबर (Mobile Number):</label>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'OTP पाठवला जात आहे...' : 'OTP पाठवा (Send OTP)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {debugOtp && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold text-center">
                    🔑 तुमचे 6-अंकी OTP कोड: <span className="text-base text-agri-800">{debugOtp}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-gray-800 mb-1">6-अंकी OTP कोड टाका:</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6 अंकी OTP कोड..."
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-base tracking-widest focus:ring-2 focus:ring-agri-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'पडताळणी होत आहे...' : 'OTP पडताळणी करा व लॉगिन व्हा'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[11px] font-bold text-gray-500 hover:text-agri-700"
                  >
                    ← मोबाईल नंबर बदला
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* AUTH MODE 2: GOOGLE ONE-TAP LOGIN */}
        {/* ---------------------------------------------------------------------- */}
        {authMode === 'google' && (
          <div className="space-y-4 text-center py-4">
            <p className="text-xs text-gray-600">
              पासवर्ड किंवा मोबाईल नंबर न टाकता तुमच्या Google अकाऊंटने १-क्लिक मध्ये लॉगिन करा:
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-800 font-extrabold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google द्वारे चालू ठेवा (Continue with Google)</span>
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* AUTH MODE 3: TRADITIONAL PASSWORD LOGIN */}
        {/* ---------------------------------------------------------------------- */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
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
              <label className="block font-bold text-gray-800 mb-1">पासवर्ड (Password):</label>
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
              <span>{loading ? 'लॉगिन होत आहे...' : 'पासवर्डने लॉगिन करा (Password Login)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

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
