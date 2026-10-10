import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShieldCheck, Users, Target, Heart, Award } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-agri-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-agri-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-md">
            <Sprout className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">शेतीसाथी – स्मार्ट फार्मिंग असिस्टंट</h1>
          <p className="text-sm text-agri-200 max-w-2xl mx-auto leading-relaxed">
            "Empowering Farmers with Smarter, Simpler Farming."<br />
            महाराष्ट्रातील शेतकरी बांधवांना समृद्ध आणि आत्मनिर्भर बनवण्यासाठी AI तंत्रज्ञानाचा ध्यास.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-agri-100 text-agri-700 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">आमचे ध्येय (Mission)</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              महाराष्ट्रातील प्रत्येक शेतकऱ्याला पिकांचे आजार शोधण्यासाठी AI निदान, थेट बाजारभावाची पारदर्शकता, हवामानाची माहिती आणि शासकीय योजनांचा लाभ एकाच व्यासपीठावर मोफत उपलब्ध करून देणे.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">वैशिष्ट्ये (Why ShetSathi?)</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              मराठी भाषेला प्राधान्य, सोपे वापरकर्ता डिझाईन, व्हॉईस असिस्टंट सहाय्य आणि कृषी तज्ञांचे प्रमाणित मार्गदर्शन यामुळे शेतीसाथी हे महाराष्ट्रातील १ नंबरचे स्मार्ट फार्मिंग प्लॅटफॉर्म बनत आहे.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
