import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  auth, 
  googleProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  db,
  doc,
  setDoc,
  getDoc
} from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, Lock, AlertCircle, ArrowRight, ShieldCheck, KeyRound, CheckCircle2, Mail, RefreshCw } from 'lucide-react';

export default function Login() {
  const { loginUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mode: 'otp' | 'google' | 'password'
  const [authMode, setAuthMode] = useState('otp');

  // Phone & OTP State
  const [phone, setPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Timer & Resend State
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Email & Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const recaptchaVerifierRef = useRef(null);

  // Initialize Firebase RecaptchaVerifier for Phone Auth
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.warn("Recaptcha clear warning:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, timer]);

  const initRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log("reCAPTCHA verified");
        },
        'expired-callback': () => {
          setError("reCAPTCHA कालबाह्य झाले. कृपया पुन्हा प्रयत्न करा.");
        }
      });
    }
    recaptchaVerifierRef.current = window.recaptchaVerifier;
    return window.recaptchaVerifier;
  };

  // Helper: Save user profile to Firestore & backend
  const syncUserProfile = async (userObj, extraData = {}) => {
    const uid = userObj.uid;
    const profile = {
      id: uid,
      name: extraData.name || userObj.displayName || userObj.phoneNumber || 'शेतकरी मित्र',
      phone: userObj.phoneNumber || extraData.phone || phone,
      email: userObj.email || extraData.email || `${phone}@shetsathi.in`,
      location: extraData.location || 'Maharashtra',
      preferred_language: 'mr',
      preferred_crops: 'Onion, Sugarcane',
      updated_at: new Date().toISOString()
    };

    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, profile, { merge: true });
    } catch (e) {
      console.warn("Firestore sync warning:", e);
    }

    loginUser(userObj.accessToken || 'firebase_auth_token', profile);
    navigate('/dashboard');
  };

  // ----------------------------------------------------------------------
  // 1. REAL FIREBASE PHONE NUMBER OTP LOGIN
  // ----------------------------------------------------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      setError('कृपया वैध 10 अंकी भारतीय मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    const formattedPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const appVerifier = initRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setTimer(60);
      setCanResend(false);
      setSuccessMsg(`${formattedPhone} वर 6-अंकी OTP पाठवला गेला आहे.`);
    } catch (err) {
      console.error("Firebase Phone Auth error:", err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('मोबाईल नंबर फॉरमॅट अमान्य आहे (+91 सह 10 अंक टाका).');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS कोटा संपला आहे. कृपया थोड्या वेळाने प्रयत्न करा.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('अतिप्रमाणात प्रयत्न केले गेले आहेत. काही वेळ थांबून पुन्हा प्रयत्न करा.');
      } else {
        setError(err.message || 'OTP पाठवताना त्रुटी आली. कृपया नंबर तपासा.');
      }
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId)); } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('कृपया 6 अंकी OTP कोड प्रविष्ट करा.');
      return;
    }

    if (!confirmationResult) {
      setError('पहिले OTP पाठवा वर क्लिक करा.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      setSuccessMsg('OTP पडताळणी यशस्वी झाली!');
      await syncUserProfile(userCredential.user, { phone: phone });
    } catch (err) {
      console.error("OTP confirm error:", err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('प्रविष्ट केलेला 6-अंकी OTP चुकीचा आहे.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP कालबाह्य (Expired) झाला आहे. Resend OTP वर क्लिक करा.');
      } else {
        setError('OTP पडताळणी अयशस्वी झाली. नंबर व OTP पुन्हा तपासा.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 2. REAL FIREBASE GOOGLE SIGN-IN
  // ----------------------------------------------------------------------
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setSuccessMsg(`Google लॉगिन यशस्वी: ${user.displayName || user.email}`);
      await syncUserProfile(user, { name: user.displayName, email: user.email });
    } catch (err) {
      console.error("Google Auth error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('गूगल साइन-इन विंडो बंद केली गेली.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('गूगल साइन-इन विनंती रद्द झाली.');
      } else {
        setError(err.message || 'गूगल साइन-इन करताना त्रुटी आली.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 3. REAL FIREBASE EMAIL & PASSWORD SIGN-IN
  // ----------------------------------------------------------------------
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('ई-मेल आणि पासवर्ड प्रविष्ट करणे आवश्यक आहे.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncUserProfile(userCredential.user, { email: email });
    } catch (err) {
      console.error("Email login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('ई-मेल किंवा पासवर्ड चुकीचा आहे.');
      } else {
        setError('लॉगिन करता आले नाही. ई-मेल व पासवर्ड तपासा.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset password via Firebase
  const handleResetPassword = async () => {
    if (!email) {
      setError('पासवर्ड रीसेट करण्यासाठी तुमचा ई-मेल प्रविष्ट करा.');
      return;
    }

    setLoading(true);
    setError(null);
    setResetSent(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setSuccessMsg(`${email} वर पासवर्ड रीसेट करण्याची लिंक पाठवली आहे.`);
    } catch (err) {
      setError('ई-मेल पाठवता आला नाही. ई-मेल अचूक आहे का ते तपासा.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Invisible Recaptcha Container required by Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

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
            Firebase Authentication द्वारे अत्यंत सुरक्षित व मोफत लॉगिन!
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setError(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl transition-all ${authMode === 'otp' ? 'bg-white text-agri-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            📱 Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('google'); setError(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl transition-all ${authMode === 'google' ? 'bg-white text-agri-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            🌐 Google
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setError(null); setSuccessMsg(null); }}
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
        {/* AUTH MODE 1: REAL FIREBASE PHONE OTP LOGIN */}
        {/* ---------------------------------------------------------------------- */}
        {authMode === 'otp' && (
          <div className="space-y-4 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">मोबाईल नंबर (+91 Mobile Number):</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 font-bold text-gray-600 text-sm">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-agri-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Firebase SMS पाठवत आहे...</span>
                    </>
                  ) : (
                    <>
                      <span>OTP पाठवा (Send Real SMS OTP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-800">SMS द्वारे आलेला 6-अंकी OTP टाका:</label>
                    <span className="text-[11px] font-bold text-agri-700">
                      {timer > 0 ? `00:${timer < 10 ? '0' : ''}${timer}` : ''}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-अंकी OTP कोड..."
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-base tracking-widest focus:ring-2 focus:ring-agri-500 text-center"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Firebase पडताळणी होत आहे...</span>
                    </>
                  ) : (
                    <>
                      <span>OTP पडताळणी करा व लॉगिन व्हा</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center pt-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setConfirmationResult(null); }}
                    className="font-bold text-gray-500 hover:text-agri-700"
                  >
                    ← मोबाईल नंबर बदला
                  </button>

                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleSendOtp}
                    className="font-bold text-agri-700 hover:underline disabled:opacity-40"
                  >
                    पुन्हा OTP पाठवा (Resend OTP)
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* AUTH MODE 2: REAL FIREBASE GOOGLE SIGN-IN */}
        {/* ---------------------------------------------------------------------- */}
        {authMode === 'google' && (
          <div className="space-y-4 text-center py-4">
            <p className="text-xs text-gray-600">
              पासवर्ड किंवा मोबाईल नंबर न टाकता तुमच्या अधिकृत Google अकाऊंटने १-क्लिक मध्ये सुरक्षित लॉगिन करा:
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-800 font-extrabold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'गूगल सर्व्हर जोडत आहे...' : 'Google द्वारे चालू ठेवा (Sign in with Google)'}</span>
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* AUTH MODE 3: REAL FIREBASE EMAIL & PASSWORD SIGN-IN */}
        {/* ---------------------------------------------------------------------- */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-800 mb-1">ई-मेल आयडी (Email Address):</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-agri-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-800">पासवर्ड (Password):</label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-[11px] text-agri-700 font-bold hover:underline"
                >
                  पासवर्ड विसरलात?
                </button>
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
              className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'लॉगिन होत आहे...' : 'पासवर्डने लॉगिन करा (Email & Password)'}</span>
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
