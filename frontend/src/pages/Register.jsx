import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  auth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  db, 
  doc, 
  setDoc 
} from '../firebase';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, User, Phone, Mail, MapPin, AlertCircle, ArrowRight, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Register() {
  const { loginUser } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [preferredCrops, setPreferredCrops] = useState('Onion, Sugarcane, Grapes');

  // Phone OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const initRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-reg', {
        size: 'invisible',
        callback: () => {
          console.log("Registration reCAPTCHA verified");
        }
      });
    }
    return window.recaptchaVerifier;
  };

  // Step 1: Send SMS OTP for phone verification
  const handleSendRegOtp = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('कृपया तुमचे नाव आणि १० अंकी मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('कृपया वैध १० अंकी भारतीय मोबाईल नंबर प्रविष्ट करा.');
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
      setSuccessMsg(`${formattedPhone} वर 6-अंकी पडताळणी कोड पाठवला गेला आहे.`);
    } catch (err) {
      console.error("Firebase Reg OTP error:", err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('मोबाईल नंबर फॉरमॅट अमान्य आहे (+91 सह 10 अंक टाका).');
      } else if (err.code === 'auth/too-many-requests') {
        setError('अतिप्रमाणात प्रयत्न केले गेले आहेत. काही वेळ थांबून पुन्हा प्रयत्न करा.');
      } else {
        setError(err.message || 'OTP पाठवताना त्रुटी आली. कृपया नंबर तपासा.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm OTP & Save profile to Firestore & Backend
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('कृपया ६ अंकी पडताळणी कोड प्रविष्ट करा.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      const user = userCredential.user;

      const profileData = {
        id: user.uid,
        name: name,
        phone: user.phoneNumber || phone,
        email: email || `${phone}@shetsathi.in`,
        location: location,
        preferred_language: lang || 'mr',
        preferred_crops: preferredCrops,
        created_at: new Date().toISOString()
      };

      // Save to Cloud Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, profileData, { merge: true });
      } catch (e) {
        console.warn("Firestore registration doc save:", e);
      }

      // Sync with backend API
      try {
        await api.register({
          name,
          phone,
          email,
          password: `FIREBASE_${user.uid}`,
          location,
          preferred_language: lang || 'mr',
          preferred_crops: preferredCrops
        });
      } catch (e) {}

      loginUser(user.accessToken || 'firebase_token', profileData);
      navigate('/dashboard');
    } catch (err) {
      console.error("OTP registration verification error:", err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('प्रविष्ट केलेला 6-अंकी OTP चुकीचा आहे.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP कालबाह्य झाला आहे. पुन्हा OTP पाठवा.');
      } else {
        setError('नोंदणी पडताळणी करताना त्रुटी आली.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div id="recaptcha-container-reg"></div>

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
            Firebase OTP पडताळणीद्वारे सुरक्षित खाते तयार करा!
          </p>
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

        {/* Form */}
        {!otpSent ? (
          <form onSubmit={handleSendRegOtp} className="space-y-3.5 text-xs">
            
            <div>
              <label className="block font-bold text-gray-800 mb-1">पूर्ण नाव (Full Name):</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="उदा. ज्ञानेश्वर पाटील"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-agri-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">मोबाईल नंबर (Phone Number):</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 font-bold text-gray-600 text-sm">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-14 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-agri-500"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>OTP पाठवत आहे...</span>
                </>
              ) : (
                <>
                  <span>नंबर पडताळणी व OTP मागवा (Send Reg OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-800 mb-1">मोबाईलवर आलेला 6-अंकी OTP टाका:</label>
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
                  <span>खाते तयार होत आहे...</span>
                </>
              ) : (
                <>
                  <span>OTP पडताळून खाते पूर्ण करा (Complete Registration)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[11px] font-bold text-gray-500 hover:text-agri-700"
              >
                ← माहिती दुरुस्त करा
              </button>
            </div>
          </form>
        )}

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
