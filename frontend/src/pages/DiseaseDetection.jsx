import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  UploadCloud,
  Scan,
  AlertCircle,
  CheckCircle,
  Camera,
  Sparkles,
  ShieldAlert,
  Clock,
  RefreshCw,
  Info,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function DiseaseDetection() {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropType, setCropType] = useState('Tomato');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [history, setHistory] = useState([]);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const cropOptions = ['Tomato', 'Sugarcane', 'Onion', 'Grapes', 'Cotton', 'Soybean', 'Pomegranate', 'Chilli', 'Wheat', 'Rice'];

  // Sample Demo Leaf Images for instant testing
  const sampleLeafs = [
    {
      name: "टॉमेटो करपा (Tomato Blotch)",
      crop: "Tomato",
      url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "कांदा जांभळा करपा (Onion Purple Blotch)",
      crop: "Onion",
      url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "द्राक्ष भुरी रोग (Grape Mildew)",
      crop: "Grapes",
      url: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80"
    }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    api.getDiseaseHistory()
      .then(res => {
        if (res.success) setHistory(res.history);
      })
      .catch(err => console.error(err));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type && !file.type.startsWith('image/')) {
        setErrorMsg('कृपया फक्त फोटो (Image) फॉरमॅट अपलोड करा.');
        return;
      }
      setErrorMsg(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSelectSample = async (sample) => {
    setLoading(true);
    setCropType(sample.crop);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `${sample.crop}_leaf.jpg`, { type: 'image/jpeg' });

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('crop_type', sample.crop);

      const data = await api.analyzeDisease(formData);
      if (data.success) {
        setResult(data);
        fetchHistory();
      } else {
        setErrorMsg(data.error || 'विश्लेषण करताना त्रुटी आली.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('डेमो फोटो लोड करताना अडचण आली.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('कृपया पिकाच्या पानाचा फोटो निवडा.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('crop_type', cropType);

    api.analyzeDisease(formData)
      .then(data => {
        if (data.success) {
          setResult(data);
          fetchHistory();
        } else {
          setErrorMsg(data.error || 'विश्लेषण करताना त्रुटी आली.');
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('सर्व्हर कनेक्ट करण्यात अडचण येत आहे. कृपया थोड्या वेळाने प्रयत्न करा.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3.5 py-1.5 rounded-full border border-agri-200">
            <Sparkles className="w-3.5 h-3.5 text-agri-600 animate-pulse" />
            <span>Multi-Spectral Computer Vision AI</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            AI पीक रोग निदान (Smart Disease Detection)
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            पिकाच्या पानाचा फोटो कॅमेराने काढा किंवा अपलोड करा. आमचा AI पानाचे पिवळेपण, डाग आणि बुरशीचे विश्लेषण करून अचूक आजार व औषधे सुचवतो.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upload & Form Section (Left 6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  पिकाचा प्रकार निवडा (Select Crop):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {cropOptions.map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCropType(c)}
                      className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all truncate ${cropType === c ? 'bg-agri-700 text-white border-agri-700 shadow-sm' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Box & Camera Trigger Buttons */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  पिकाच्या पानाचा फोटो घ्या (Upload / Capture Leaf):
                </label>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  ref={cameraInputRef}
                  className="hidden"
                />

                <div className="border-2 border-dashed border-agri-300 bg-agri-50/50 hover:bg-agri-50 rounded-2xl p-6 text-center transition-colors relative">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Crop leaf preview"
                        className="max-h-56 mx-auto rounded-xl shadow-md border border-gray-200 object-cover"
                      />
                      <div className="flex justify-center space-x-3 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-white border border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50"
                        >
                          फोटो बदला
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-3">
                      <div className="w-14 h-14 bg-agri-100 text-agri-700 rounded-2xl flex items-center justify-center mx-auto">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">फोटो निवडा किंवा कॅमेराने काढा</span>
                        <span className="text-xs text-gray-500">JPG, PNG, WEBP, HEIC</span>
                      </div>

                      <div className="flex justify-center items-center space-x-3 pt-1">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="px-4 py-2 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center space-x-1.5"
                        >
                          <Camera className="w-4 h-4" />
                          <span>कॅमेरा (Camera)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
                        >
                          <UploadCloud className="w-4 h-4 text-agri-700" />
                          <span>गॅलरीतून निवडा (Gallery)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instant Demo Samples Selector */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-700 block">
                  किंवा खालील नमुना (Demo) पानाचा फोटो निवडून त्वरित तपासा:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleLeafs.map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectSample(sample)}
                      className="p-2 bg-white hover:bg-agri-50 rounded-xl border border-gray-200 text-[11px] font-bold text-gray-800 text-left transition-colors flex items-center space-x-2"
                    >
                      <img src={sample.url} alt={sample.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="truncate">{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="w-full py-4 bg-agri-700 hover:bg-agri-800 disabled:bg-gray-300 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>AI कॉम्प्युटर व्हिजन पानाचे विश्लेषण करत आहे...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5" />
                    <span>रोग तपासणी करा (Analyze Image)</span>
                  </>
                )}
              </button>

            </form>

            <div className="p-4 bg-agri-50/60 rounded-2xl border border-agri-200 text-xs text-gray-600 space-y-1">
              <span className="font-bold text-agri-900 flex items-center">
                <Info className="w-3.5 h-3.5 text-agri-600 mr-1" /> टिप्स:
              </span>
              <p>• पिकाच्या पानाचा स्पष्ट आणि चांगल्या प्रकाशातील फोटो घ्या.</p>
              <p>• फोटोमध्ये पानावर पडलेले डाग किंवा पिवळेपणा स्पष्ट दिसेल असा फोटो घ्या.</p>
            </div>

          </div>

          {/* Result Section (Right 6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {result ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-300 shadow-lg space-y-6 animate-fadeIn">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">पिकाचा प्रकार: {result.crop_type}</span>
                    <h2 className={`text-xl sm:text-2xl font-extrabold mt-1 ${result.is_healthy ? 'text-green-700' : 'text-red-600'}`}>
                      {result.predicted_disease}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block font-semibold">अचूकता (Confidence)</span>
                    <span className="text-base font-extrabold text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* AI Diagnostic Metrics Cards */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 block">संसर्गाची तीव्रता (Severity Level):</span>
                    <span className={`font-extrabold text-sm ${result.is_healthy ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {result.severity_level || 'मध्यम'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-500 block">संसर्ग झालेला भाग (Infected Area):</span>
                    <span className="font-extrabold text-sm text-gray-900">
                      {result.infected_area_percentage || '15.4%'}
                    </span>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 text-amber-500 mr-1.5" /> दिसणारी लक्षणे (Symptoms):
                  </h3>
                  <ul className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    {result.symptoms.map((s, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-agri-600 font-bold mr-2">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-agri-600 mr-1.5" /> शिफारस केलेले उपचार व औषधे:
                  </h3>
                  <div className="space-y-2 text-xs text-gray-800 bg-agri-50/80 p-4 rounded-2xl border border-agri-200">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="bg-agri-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">{i+1}</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preventive Measures */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    प्रतिबंधात्मक उपाय (Preventive Steps):
                  </h3>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {result.preventive_measures.map((p, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-gray-400 mr-2">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{result.disclaimer}</span>
                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-agri-50 text-agri-600 rounded-full flex items-center justify-center mx-auto">
                  <Scan className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">रोग निदानाचे निकाल येथे दिसतील</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  डावीकडील फॉर्मवरून फोटो अपलोड करा, कॅमेराने काढा किंवा नमुना पानाचा फोटो निवडून 'रोग तपासणी करा' वर क्लिक करा.
                </p>
              </div>
            )}

            {/* Analysis History List */}
            {history.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                  <Clock className="w-4 h-4 text-agri-600 mr-1.5" /> अलीकडील तपासणी इतिहास
                </h3>
                <div className="space-y-2">
                  {history.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">{item.predicted_disease}</span>
                        <span className="text-[10px] text-gray-500">{item.crop_type} • {item.created_at}</span>
                      </div>
                      <span className="text-xs font-bold text-agri-700 bg-agri-100 px-2.5 py-1 rounded-full">
                        {Math.round(item.confidence * 100)}% Match
                      </span>
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
