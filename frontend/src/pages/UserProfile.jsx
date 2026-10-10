import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { User, Phone, Mail, MapPin, Globe, CheckCircle2, Save } from 'lucide-react';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const { lang, changeLanguage } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState(user?.location || 'Nashik, Maharashtra');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferred_language || lang);
  const [preferredCrops, setPreferredCrops] = useState(user?.preferred_crops || 'Sugarcane, Onion, Tomato, Grapes');
  
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const payload = {
      name,
      email,
      location,
      preferred_language: preferredLanguage,
      preferred_crops: preferredCrops
    };

    api.updateProfile(payload)
      .then(res => {
        if (res.success) {
          updateUser(res.user);
          changeLanguage(preferredLanguage);
          setMsg(res.message);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setSaving(false));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900">
            शेतकरी प्रोफाइल (User Profile)
          </h1>
          <p className="text-xs text-gray-600">
            तुमची वैयक्तिक माहिती, भाषा आणि पिकांचे प्राधान्य अद्यतनित करा.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          
          {msg && (
            <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold text-gray-800 mb-1">मोबाईल नंबर (बदल बदलता येत नाही):</label>
              <input type="text" value={user.phone} disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-600 cursor-not-allowed" />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">पूर्ण नाव:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-semibold" required />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">ईमेल पत्ता:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-semibold" />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">स्थान / जिल्हा (Location):</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-semibold" />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">प्राधान्य भाषा (Preferred Language):</label>
              <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold">
                <option value="mr">मराठी (Marathi - Default)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">निवडलेली पिके (Preferred Crops):</label>
              <input type="text" value={preferredCrops} onChange={(e) => setPreferredCrops(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-semibold" />
            </div>

            <button type="submit" disabled={saving} className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2">
              <Save className="w-4 h-4" />
              <span>{saving ? 'अद्यतनित होत आहे...' : 'प्रोफाइल सेव्ह करा (Save Profile)'}</span>
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
