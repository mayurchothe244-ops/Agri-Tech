import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MandiTicker from '../components/MandiTicker';
import QuickAccessCards from '../components/QuickAccessCards';
import WeatherWidget from '../components/WeatherWidget';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Newspaper,
  Users,
  ChevronDown,
  ChevronUp,
  Award,
  PhoneCall,
  ArrowRight,
  Sprout,
  Scan,
  TrendingUp,
  Tractor
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "शेतीसाथी अँप किंवा वेबसाईट वापरण्यासाठी फी भरावी लागते का?",
      a: "नाही! शेतीसाथी हे महाराष्ट्रातील सर्व शेतकरी बांधवांसाठी पूर्णपणे मोफत (100% Free) डिजिटल व्यासपीठ आहे."
    },
    {
      q: "AI पीक रोग निदान कसे काम करते?",
      a: "तुम्ही तुमच्या पिकाच्या बाधित पानाचा फोटो मोबाईलवरून अपलोड करताच, आमचे AI तंत्रज्ञान काही सेकंदात रोगाची अचूक ओळख करून योग्य औषध आणि फवारणीचा सल्ला देते."
    },
    {
      q: "बाजारभाव (Mandi Prices) दररोज अपडेट होतात का?",
      a: "होय, महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB) कडून लासलगाव, पिंपळगाव, नाशिक, पुणे, कोल्हापूर यांसारख्या प्रमुख बाजार समित्यांचे ताजे बाजारभाव थेट अपडेट केले जातात."
    },
    {
      q: "शासकीय योजनांचा लाभ कसा घ्यावा?",
      a: "शासकीय योजना विभागात तुम्हाला PM-KISAN, पोकरा (PoChRa), आणि महाडीबीटी योजनांची पात्रता, लागणारी कागदपत्रे आणि अधिकृत अर्ज लिंक एकाच ठिकाणी मिळते."
    }
  ];

  const popularCrops = [
    { name: "कांदा (Onion)", img: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80", avgPrice: "₹2,150/क़्विंटल", region: "नाशिक, नगर, पुणे" },
    { name: "ऊस (Sugarcane)", img: "https://images.unsplash.com/photo-1595186884020-f5655767b43a?auto=format&fit=crop&w=400&q=80", avgPrice: "₹3,350/टन", region: "कोल्हापूर, सांगली" },
    { name: "द्राक्ष (Grapes)", img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80", avgPrice: "₹6,800/क़्विंटल", region: "नाशिक, सांगली, सोलापूर" },
    { name: "टोमॅटो (Tomato)", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80", avgPrice: "₹1,850/क़्विंटल", region: "नारायणगाव, नाशिक" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Live Mandi Prices Ticker Bar */}
      <MandiTicker />

      {/* 3. Quick Access Services Grid */}
      <QuickAccessCards />

      {/* 4. Weather Forecast Section */}
      <section className="py-12 bg-gray-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WeatherWidget />
        </div>
      </section>

      {/* 5. How ShetSathi Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
              कार्यपद्धती (How It Works)
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              शेतीसाथी वापरणे अत्यंत सोपे!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              अवघ्या ३ सोप्या टप्प्यांत मिळवा तुमच्या शेतीचे AI समाधान
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-agri-50 p-8 rounded-3xl border border-agri-200 text-center relative">
              <div className="w-16 h-16 bg-agri-700 text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                १
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">माहिती निवडा किंवा फोटो काढा</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                तुमच्या पिकाच्या पानाचा फोटो अपलोड करा किंवा तुमची जमीन व पिकाची माहिती प्रविष्ट करा.
              </p>
            </div>

            <div className="bg-agri-50 p-8 rounded-3xl border border-agri-200 text-center relative">
              <div className="w-16 h-16 bg-agri-700 text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                २
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI द्वारे अचूक विश्लेषण</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                आमचे AI इंजिन पानातील रोग, खतांची गरज आणि बाजारभावाचे अचूक विश्लेषण करते.
              </p>
            </div>

            <div className="bg-agri-50 p-8 rounded-3xl border border-agri-200 text-center relative">
              <div className="w-16 h-16 bg-agri-700 text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                ३
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">मार्गदर्शन व नफा मिळवा</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                योग्य फवारणी, खत नियोजन आणि योग्य बाजारपेठ निवडून शेतीचा नफा वाढवा.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Popular Maharashtra Crops */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
                प्रमुख पिके (Popular Crops)
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                महाराष्ट्रातील प्रमुख पिके व आजचा दर
              </h2>
            </div>
            <Link to="/market-prices" className="mt-4 sm:mt-0 text-sm font-bold text-agri-700 hover:text-agri-900 flex items-center">
              <span>सर्व पिकांचे भाव पहा</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCrops.map((crop, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img src={crop.img} alt={crop.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base">{crop.name}</h3>
                  <span className="text-xs text-gray-500 block mt-0.5">प्रमुख पट्टा: {crop.region}</span>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-600">सरासरी भाव:</span>
                    <span className="text-sm font-extrabold text-agri-700">{crop.avgPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Latest Agricultural News & Government Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
              कृषी बातम्या (Agricultural News)
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              ताजी शेतीविषयक माहिती व अपडेट्स
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded">शासकीय योजना</span>
              <h3 className="font-bold text-gray-900 text-base mt-3 mb-2">PM-KISAN योजनेचा १८ वा हप्ता लवकरच जमा होणार!</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                पात्र शेतकऱ्यांच्या खात्यात ₹२,००० थेट हस्तांतरित होणार आहेत. तुमचा e-KYC स्टेटस त्वरित तपासा.
              </p>
              <Link to="/schemes" className="inline-block text-xs font-bold text-agri-700 mt-4">सविस्तर वाचा &rarr;</Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">हवामान इशारा</span>
              <h3 className="font-bold text-gray-900 text-base mt-3 mb-2">नाशिक व नगर जिल्ह्यात ढगाळ हवामान, फवारणीचा सल्ला</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                आद्रता वाढल्याने कांदा व द्राक्ष पिकांवर करपा रोगाचा प्रादुर्भाव रोखण्यासाठी पूर्वकाळातील फवारणी करा.
              </p>
              <Link to="/weather" className="inline-block text-xs font-bold text-agri-700 mt-4">हवामान पहा &rarr;</Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded">बाजारपेठ</span>
              <h3 className="font-bold text-gray-900 text-base mt-3 mb-2">लासलगाव बाजारात कांद्याची आवक वाढली, भावात सुधारणा</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                लाल कांद्याला चांगला प्रतिसाद मिळून सरासरी भाव ₹२,१५० वर पोहोचला आहे.
              </p>
              <Link to="/market-prices" className="inline-block text-xs font-bold text-agri-700 mt-4">भाव तपासा &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Farmer Testimonials */}
      <section className="py-16 bg-agri-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-300 bg-agri-800 px-3 py-1 rounded-full">
              शेतकरी अनुभव (Farmer Testimonials)
            </span>
            <h2 className="text-3xl font-extrabold mt-2">
              महाराष्ट्रातील शेतकरी काय म्हणतात?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-agri-950/60 p-6 rounded-2xl border border-agri-700/50">
              <p className="text-xs text-gray-200 italic leading-relaxed mb-4">
                "माझ्या कांद्याच्या पिकावर जांभळा करपा आला होता. शेतीसाथीवर फोटो अपलोड केला आणि १० सेकंदात औषधाचे नाव मिळाले. माझे पीक वाचले!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-agri-700 rounded-full flex items-center justify-center font-bold">ग</div>
                <div>
                  <h4 className="font-bold text-sm">ज्ञानेश्वर जाधव</h4>
                  <span className="text-[11px] text-agri-300">कांदा उत्पादक शेतकरी, निफाड (नाशिक)</span>
                </div>
              </div>
            </div>

            <div className="bg-agri-950/60 p-6 rounded-2xl border border-agri-700/50">
              <p className="text-xs text-gray-200 italic leading-relaxed mb-4">
                "लासलगाव व पिंपळगावचे बाजारभाव रोज सकाळी मोबाईलवर मिळतात. यामुळे योग्य भावात माल विकणे सोपे झाले आहे."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-agri-700 rounded-full flex items-center justify-center font-bold">बा</div>
                <div>
                  <h4 className="font-bold text-sm">बाळासाहेब शिंदे</h4>
                  <span className="text-[11px] text-agri-300">द्राक्ष बागायतदार, तासगाव (सांगली)</span>
                </div>
              </div>
            </div>

            <div className="bg-agri-950/60 p-6 rounded-2xl border border-agri-700/50">
              <p className="text-xs text-gray-200 italic leading-relaxed mb-4">
                "स्मार्ट नफा कॅल्क्युलेटरमुळे माझ्या उसाचा एकूण खर्च आणि निव्वळ नफा एका मिनिटात स्पष्ट समजला. खूप उपयुक्त वेबसाईट!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-agri-700 rounded-full flex items-center justify-center font-bold">सं</div>
                <div>
                  <h4 className="font-bold text-sm">संजय कदम</h4>
                  <span className="text-[11px] text-agri-300">ऊस उत्पादक शेतकरी, शिरोळ (कोल्हापूर)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions (FAQ) */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
              सतत विचारले जाणारे प्रश्न (FAQ)
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              काही शंका आहेत? उत्तर शोधा
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 font-bold text-gray-900 text-sm flex items-center justify-between focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-agri-700 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Call to Action Banner */}
      <section className="py-12 bg-gradient-to-r from-agri-700 to-agri-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-3">आजच शेतीसाथी सोबत तुमची शेती बनवा स्मार्ट!</h2>
          <p className="text-sm text-agri-100 max-w-2xl mx-auto mb-6">
            मोफत नावनोंदणी करा आणि AI रोग निदान, थेट बाजारभाव आणि हवामान अंदाजाचा लाभ घ्या.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3.5 bg-white text-agri-900 font-extrabold text-sm rounded-xl shadow-lg hover:bg-gray-100 transition-all"
          >
            <span>शेतकरी नोंदणी करा (Free Register)</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

    </div>
  );
}
