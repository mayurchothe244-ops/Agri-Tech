import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Landmark,
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function GovernmentSchemes() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Financial Support', 'Irrigation & Climate Resilience', 'Agricultural Equipment & Subsidy', 'Farmer Assistance & Debt Relief'];

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory]);

  const fetchSchemes = () => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;

    api.getSchemes(params)
      .then(res => {
        if (res.success) setSchemes(res.schemes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const filtered = schemes.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-3.5 py-1.5 rounded-full border border-indigo-200">
            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>शासकीय कृषी योजना व अनुदान</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            शासकीय योजना (Government Schemes)
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            केंद्र व महाराष्ट्र शासनाच्या सर्व कृषी योजनांची पात्रता, आवश्यक कागदपत्रे व अधिकृत अर्ज प्रक्रिया.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="योजनेचे नाव शोधा (e.g. PM-KISAN, पोकरा, कर्जमुक्ती)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">सर्व प्रकार (All Categories)</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Schemes Cards List */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white p-12 rounded-3xl text-center text-gray-500 animate-pulse">
              योजनांची माहिती लोड होत आहे...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center text-gray-500">
              कोणतीही योजना सापडली नाही.
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all space-y-5">
                
                {/* Title & Category Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      {item.category}
                    </span>
                    <h2 className="text-xl font-extrabold text-gray-900 mt-2">
                      {item.title}
                    </h2>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium shrink-0">
                    अपडेट: {item.last_updated}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Eligibility & Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                    <span className="font-bold text-gray-900 flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-1.5" /> पात्रता (Eligibility Criteria):
                    </span>
                    <p className="text-gray-600 leading-relaxed">{item.eligibility}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                    <span className="font-bold text-gray-900 flex items-center">
                      <FileText className="w-4 h-4 text-indigo-600 mr-1.5" /> लागणारी कागदपत्रे (Required Documents):
                    </span>
                    <p className="text-gray-600 leading-relaxed">{item.documents}</p>
                  </div>

                </div>

                {/* Application Steps */}
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 text-xs">
                  <span className="font-bold text-indigo-950 block mb-1">अर्ज कसा करावा? (Application Steps):</span>
                  <p className="text-indigo-900 whitespace-pre-line leading-relaxed">{item.steps}</p>
                </div>

                {/* Official Link Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600 mr-1" /> शासनाचे अधिकृत वेब पोर्टल
                  </span>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    <span>अधिकृत वेबसाईटवरून अर्ज करा</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
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
