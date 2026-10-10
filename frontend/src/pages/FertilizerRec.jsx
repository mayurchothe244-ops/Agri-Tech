import React, { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  FlaskConical,
  Sprout,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

export default function FertilizerRec() {
  const { t } = useLanguage();
  const [cropType, setCropType] = useState('Onion');
  const [soilPh, setSoilPh] = useState(6.8);
  const [soilType, setSoilType] = useState('Medium Black Soil');
  const [nVal, setNVal] = useState(120);
  const [pVal, setPVal] = useState(45);
  const [kVal, setKVal] = useState(50);
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [season, setSeason] = useState('Kharif');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendedCrops, setRecommendedCrops] = useState([]);

  const cropsList = ['Onion', 'Sugarcane', 'Tomato', 'Grapes', 'Cotton', 'Soybean', 'Wheat', 'Pomegranate'];
  const soilTypesList = ['Black Cotton Soil', 'Medium Black Soil', 'Red Loam', 'Alluvial Soil', 'Sandy Soil', 'Laterite Soil'];
  const seasonsList = ['Kharif (पावसाळी)', 'Rabi (हिवाळी)', 'Summer (उन्हाळी)'];

  const handleCalculate = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      crop_type: cropType,
      soil_ph: parseFloat(soilPh),
      soil_type: soilType,
      n_val: parseInt(nVal),
      p_val: parseInt(pVal),
      k_val: parseInt(kVal),
      location,
      season
    };

    Promise.all([
      api.getFertilizerRec(payload),
      api.getCropRec(payload)
    ])
      .then(([fertRes, cropRes]) => {
        if (fertRes.success) setResult(fertRes.data);
        if (cropRes.success) setRecommendedCrops(cropRes.recommended_crops);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3.5 py-1.5 rounded-full border border-teal-200">
            <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
            <span>वैज्ञानिक खत व पीक नियोजन</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            खत व पीक मार्गदर्शन (Fertilizer Advisory)
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            तुमच्या माती परीक्षण (Soil Test) घटकांनुसार योग्य खतांचे प्रमाण आणि पिकांचा योग्य सल्ला मिळवा.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form (Left 5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              माती व पिकाचा तपशील भरा (Enter Soil Details)
            </h2>

            <form onSubmit={handleCalculate} className="space-y-4 text-xs">
              
              {/* Crop Selector */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">पिक निवडा (Select Crop):</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500"
                >
                  {cropsList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">मातीचा प्रकार (Soil Type):</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500"
                >
                  {soilTypesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Soil pH Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-800">मातीचा सामू (Soil pH):</label>
                  <span className="font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-sm">{soilPh}</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="9.5"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(e.target.value)}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>Acidic (4.5)</span>
                  <span>Neutral (7.0)</span>
                  <span>Alkaline (9.5)</span>
                </div>
              </div>

              {/* NPK Values Grid */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="block font-bold text-gray-800 mb-2">मातीतील NPK प्रमाण (kg/hectare):</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block">Nitrogen (N)</label>
                    <input
                      type="number"
                      value={nVal}
                      onChange={(e) => setNVal(e.target.value)}
                      className="w-full p-2 bg-white border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block">Phosphorus (P)</label>
                    <input
                      type="number"
                      value={pVal}
                      onChange={(e) => setPVal(e.target.value)}
                      className="w-full p-2 bg-white border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block">Potassium (K)</label>
                    <input
                      type="number"
                      value={kVal}
                      onChange={(e) => setKVal(e.target.value)}
                      className="w-full p-2 bg-white border rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Season */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">जिल्हा / ठिकाण:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">हंगाम (Season):</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                  >
                    {seasonsList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <FlaskConical className="w-5 h-5" />
                <span>{loading ? 'खत नियोजन तयार होत आहे...' : 'खत शिफारस मिळवा (Get Advice)'}</span>
              </button>

            </form>
          </div>

          {/* Results (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {result ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-teal-200 shadow-lg space-y-6 animate-fadeIn">
                
                {/* Header */}
                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase">
                      {result.crop} खत मात्रा (प्रति एकर)
                    </span>
                    <h2 className="text-xl font-extrabold text-gray-900 mt-2">
                      रासायनिक व सेंद्रिय खत नियोजन
                    </h2>
                  </div>
                </div>

                {/* Chemical Fertilizers Cards */}
                <div>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    १. रासायनिक खते (Chemical Fertilizers per Acre):
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.chemical_fertilizers_per_acre.map((f, i) => (
                      <div key={i} className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200">
                        <span className="font-bold text-gray-900 text-xs block">{f.name}</span>
                        <span className="text-lg font-extrabold text-teal-800 block my-1">{f.dosage}</span>
                        <span className="text-[10px] text-gray-600 block">{f.application_timing}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organic Manure & Micronutrients */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                    <h4 className="font-bold text-xs text-amber-900 mb-2">२. सेंद्रिय खते (Organic Manure):</h4>
                    <ul className="space-y-1 text-xs text-amber-950">
                      {result.organic_manure.map((o, i) => <li key={i}>• {o}</li>)}
                    </ul>
                  </div>
                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
                    <h4 className="font-bold text-xs text-blue-900 mb-2">३. सूक्ष्म अन्नद्रव्ये (Micronutrients):</h4>
                    <ul className="space-y-1 text-xs text-blue-950">
                      {result.micronutrients.map((m, i) => <li key={i}>• {m}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Soil Remediation */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700">
                  <span className="font-bold text-gray-900 block mb-1">माती सामू (pH) सुधारणा सल्ला:</span>
                  <p>{result.ph_remediation}</p>
                </div>

                {/* Safety Precautions */}
                <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 text-xs text-red-900 space-y-1.5">
                  <span className="font-bold flex items-center text-red-800">
                    <ShieldAlert className="w-4 h-4 mr-1 text-red-600" /> सुरक्षा खबरदारी (Safety Precautions):
                  </span>
                  {result.safety_precautions.map((sp, i) => (
                    <p key={i}>• {sp}</p>
                  ))}
                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                  <FlaskConical className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">वैज्ञानिक खत सल्ला येथे दिसेल</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  मातीचे NPK प्रमाण प्रविष्ट करून 'खत शिफारस मिळवा' वर क्लिक करा.
                </p>
              </div>
            )}

            {/* Recommended Crops for soil */}
            {recommendedCrops.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
                  <Sprout className="w-4 h-4 text-agri-600 mr-1.5" /> तुमच्या जमिनीसाठी सर्वात योग्य इतर पिके:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedCrops.map((c, i) => (
                    <div key={i} className="p-3 bg-agri-50 rounded-xl border border-agri-200 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-agri-900">{c.crop}</span>
                        <span className="text-[10px] bg-agri-200 text-agri-800 font-bold px-2 py-0.5 rounded-full">{c.suitability_score}</span>
                      </div>
                      <p className="text-gray-600 text-[11px]">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
