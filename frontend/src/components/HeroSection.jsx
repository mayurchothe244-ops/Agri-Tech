import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, SunMedium, Scan } from 'lucide-react';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-agri-50 via-white to-gray-50 pt-8 pb-16 lg:pt-16 lg:pb-24">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-agri-200/40 via-agri-100/30 to-agri-300/30 blur-3xl -z-10 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-agri-100 text-agri-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-agri-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-agri-600 animate-pulse" />
              <span>{t('brandTagline')} • {t('tagline')}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {t('heroHeading')}
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t('heroSubheading')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/disease-detection"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-bold text-white bg-agri-700 hover:bg-agri-800 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <span>{t('btnExploreServices')}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-bold text-agri-900 bg-white hover:bg-gray-100 border-2 border-agri-600 rounded-xl shadow-sm transition-all"
              >
                <span>{t('btnGetStarted')}</span>
              </Link>
            </div>

            {/* Key Highlights */}
            <div className="pt-6 border-t border-gray-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="block text-2xl font-extrabold text-agri-700">100%</span>
                <span className="text-xs text-gray-600 font-medium">मोफत AI सल्ला</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-agri-700">50+</span>
                <span className="text-xs text-gray-600 font-medium">महाराष्ट्रातील बाजार समित्या</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-agri-700">24x7</span>
                <span className="text-xs text-gray-600 font-medium">व्हॉइस असिस्टंट मदत</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column with Floating Live Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-agri-100">
                <img
                  src="https://images.unsplash.com/photo-1595186884020-f5655767b43a?auto=format&fit=crop&w=800&q=80"
                  alt="Farmer in Green Agricultural Field"
                  className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider bg-agri-600/90 px-2.5 py-1 rounded">महाराष्ट्र शेती</span>
                  <p className="text-sm font-bold mt-1">शेतकऱ्यांचे सक्षमीकरण, समृद्ध शेती!</p>
                </div>
              </div>

              {/* Floating Badge 1: AI Leaf Disease Scan */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-3 animate-bounce-slow">
                <div className="p-2.5 bg-green-100 text-green-700 rounded-xl">
                  <Scan className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 font-medium">AI पीक रोग स्कॅन</span>
                  <span className="text-xs font-extrabold text-gray-900">९५% अचूक निदान</span>
                </div>
              </div>

              {/* Floating Badge 2: Live Mandi Price */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-3">
                <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 font-medium">ताजा लासलगाव भाव</span>
                  <span className="text-xs font-extrabold text-gray-900">कांदा ₹२,१५०/क्विंटल</span>
                </div>
              </div>

              {/* Floating Badge 3: Weather Alert */}
              <div className="absolute top-1/2 -right-6 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-100 hidden sm:flex items-center space-x-2">
                <SunMedium className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-gray-800">नाशिक: २८°C अनुकूल</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
