import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  CheckCircle,
  FileText,
  PhoneCall,
  ExternalLink,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function CropInsurance() {
  const { t } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInsurance()
      .then(res => {
        if (res.success) setPrograms(res.programs);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>प्रधानमंत्री पीक विमा संरक्षण</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            पीक विमा माहिती व अर्ज (Crop Insurance)
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            अस्मानी संकटे, अवकाळी पाऊस आणि गारपीट यांपासून तुमच्या पिकाला सुरक्षित करा.
          </p>
        </div>

        {/* Insurance Programs Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white p-12 rounded-3xl text-center text-gray-500 animate-pulse">
              पीक विमा माहिती लोड होत आहे...
            </div>
          ) : (
            programs.map((prog) => (
              <div key={prog.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                
                {/* Header Title */}
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase border border-blue-200">
                    शासकीय पीक विमा योजना
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
                    {prog.scheme_name}
                  </h2>
                </div>

                {/* Eligible Crops & Regions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="font-bold text-gray-900 block mb-1">पात्र पिके (Eligible Crops):</span>
                    <p className="text-gray-700 font-semibold">{prog.eligible_crops}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="font-bold text-gray-900 block mb-1">लागू क्षेत्र (Notified Regions):</span>
                    <p className="text-gray-700 font-semibold">{prog.regions}</p>
                  </div>
                </div>

                {/* Eligibility & Documents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200">
                    <span className="font-bold text-blue-950 block mb-1">पात्रता आणि हप्ता दर (Eligibility & Premium):</span>
                    <p className="text-blue-900 leading-relaxed">{prog.eligibility}</p>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200">
                    <span className="font-bold text-blue-950 block mb-1">लागणारी कागदपत्रे (Required Documents):</span>
                    <p className="text-blue-900 leading-relaxed">{prog.documents}</p>
                  </div>
                </div>

                {/* Claim Information */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold block text-amber-950">नुकसान भरपाई दाव्याची प्रक्रिया (Claim Info):</span>
                  <p className="leading-relaxed">{prog.claim_info}</p>
                </div>

                {/* Official Link Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 flex items-center">
                    <PhoneCall className="w-4 h-4 text-blue-600 mr-1.5" />
                    टोल-फ्री विमा मदत: 1800-180-1551
                  </span>

                  <a
                    href={prog.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    <span>अधिकृत पोर्टलरवरून पीक विमा भरा</span>
                    <ExternalLink className="w-4 h-4 ml-1.5" />
                  </a>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
