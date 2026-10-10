import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, PhoneCall, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-agri-dark text-gray-200 border-t-4 border-agri-500 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: Brand & Tagline */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-agri-500 text-white flex items-center justify-center font-bold">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {t('brand')}
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-4">
            {t('heroSubheading')}
          </p>
          <div className="flex items-center space-x-2 text-xs text-agri-300 bg-agri-900/60 p-2.5 rounded-lg border border-agri-700/50">
            <ShieldCheck className="w-4 h-4 text-agri-400 shrink-0" />
            <span>महाराष्ट्र शासन व कृषी विज्ञान केंद्राचे अधिकृत माहिती सहाय्यक</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-agri-800 pb-2">
            महत्त्वाच्या सेवा (Services)
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/disease-detection" className="hover:text-agri-400 transition-colors">AI पीक रोग निदान (Disease Detection)</Link></li>
            <li><Link to="/fertilizer-recommendation" className="hover:text-agri-400 transition-colors">माती व खत मार्गदर्शन (Fertilizer Rec)</Link></li>
            <li><Link to="/market-prices" className="hover:text-agri-400 transition-colors">थेट बाजारभाव (Live Mandi Prices)</Link></li>
            <li><Link to="/weather" className="hover:text-agri-400 transition-colors">हवामान अंदाज (Weather Forecast)</Link></li>
            <li><Link to="/schemes" className="hover:text-agri-400 transition-colors">सरकारी कृषी योजना (Govt Schemes)</Link></li>
            <li><Link to="/profit-calculator" className="hover:text-agri-400 transition-colors">स्मार्ट नफा कॅल्क्युलेटर (Profit Calculator)</Link></li>
          </ul>
        </div>

        {/* Col 3: Useful Links & Support */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-agri-800 pb-2">
            इतर दुवे (Quick Links)
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/crop-insurance" className="hover:text-agri-400 transition-colors">पीक विमा अर्ज माहिती (Crop Insurance)</Link></li>
            <li><Link to="/equipment-rental" className="hover:text-agri-400 transition-colors">कृषी अवजारे भाड्याने (Equipment Rental)</Link></li>
            <li><Link to="/marketplace" className="hover:text-agri-400 transition-colors">कृषी साहित्य दुकान (Agri Marketplace)</Link></li>
            <li><Link to="/about" className="hover:text-agri-400 transition-colors">आमच्याबद्दल (About ShetSathi)</Link></li>
            <li><Link to="/contact" className="hover:text-agri-400 transition-colors">संपर्क व मदतकेंद्र (Contact Support)</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact & Helpline */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-agri-800 pb-2">
            कृषी मदत केंद्र (Kisan Helpline)
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3">
              <PhoneCall className="w-4 h-4 text-agri-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">टोल-फ्री शेतकरी हेल्पलाइन:</span>
                <span className="text-agri-300 font-bold text-sm">1800-180-1551 / 0253-2345678</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-agri-400 shrink-0" />
              <span>help@shetsathi.agri.in</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-agri-400 shrink-0 mt-0.5" />
              <span>कृषी भवन, अशोक स्तंभ रोड, नाशिक - ४२२००२, महाराष्ट्र.</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-agri-900 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
        <p>© 2026 ShetSathi – Smart Farming Assistant. सर्वाधिकार सुरक्षित (All Rights Reserved).</p>
        <p className="flex items-center mt-2 md:mt-0">
          Made with <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-current" /> for Indian & Maharashtra Farmers.
        </p>
      </div>
    </footer>
  );
}
