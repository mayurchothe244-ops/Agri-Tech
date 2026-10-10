import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3 py-1 rounded-full border border-agri-200">
            <PhoneCall className="w-3.5 h-3.5 text-agri-600" />
            <span>२४x७ शेतकरी मदत केंद्र</span>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900">
            संपर्क व सहाय्य केंद्र (Contact Us)
          </h1>
          <p className="text-xs text-gray-600">
            काही प्रश्न किंवा समस्या असल्यास आमच्या कृषी तज्ञांशी संपर्क साधा.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-agri-900 text-white p-8 rounded-3xl space-y-6 shadow-xl">
            <h2 className="text-xl font-bold border-b border-agri-700 pb-3">मदतकेंद्र तपशील (Helpdesk)</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <PhoneCall className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">टोल-फ्री हेल्पलाइन:</span>
                  <span className="text-agri-300 font-bold text-sm">1800-180-1551 / 0253-2345678</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">ईमेल:</span>
                  <span>help@shetsathi.agri.in</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">मुख्य कार्यालय:</span>
                  <span>कृषी भवन, अशोक स्तंभ रोड, नाशिक - ४२२००२, महाराष्ट्र.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">तुमचा संदेश यशस्वीरित्या प्राप्त झाला!</h3>
                <p className="text-xs text-gray-600">आमचे कृषी अधिकारी २४ तासांच्या आत तुमच्याशी संपर्क साधतील.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">तुमचे नाव:</label>
                  <input type="text" placeholder="नाव प्रविष्ट करा..." className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl" required />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">मोबाईल नंबर:</label>
                  <input type="tel" placeholder="मोबाईल नंबर..." className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl" required />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">तुमचा प्रश्न किंवा संदेश:</label>
                  <textarea rows="4" placeholder="येथे विस्तृत माहिती लिहा..." className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl" required></textarea>
                </div>

                <button type="submit" className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>संदेश पाठवा (Send Message)</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
