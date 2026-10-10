import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Globe,
  RefreshCw
} from 'lucide-react';

export default function VoiceAssistantPage() {
  const { lang, changeLanguage } = useLanguage();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'नमस्कार शेतकरी बंधूंनो! मी शेतीसाथी AI व्हॉइस असिस्टंट आहे. तुमचा शेतीविषयक प्रश्न बोला किंवा टाईप करा.',
      lang: 'mr'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Setup SpeechRecognition if supported by browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'mr' ? 'mr-IN' : (lang === 'hi' ? 'hi-IN' : 'en-US');

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendMessage(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.lang = lang === 'mr' ? 'mr-IN' : (lang === 'hi' ? 'hi-IN' : 'en-US');
      recognitionRef.current.start();
    } else {
      alert('तुमच्या ब्राउझरमध्ये व्हॉइस इनपुट सपोर्ट उपलब्ध नाही. कृपया टेक्स्ट टाईप करा.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'mr' ? 'mr-IN' : (lang === 'hi' ? 'hi-IN' : 'en-US');
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = (textToSend = null) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add user msg
    const userMsg = { sender: 'user', text: query, lang };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    api.voiceChat(query, lang)
      .then(res => {
        if (res.success) {
          const botMsg = { sender: 'bot', text: res.reply, lang: res.language };
          setMessages(prev => [...prev, botMsg]);
          speakText(res.reply);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const suggestedQuestions = [
    "कांद्यावरील जांभळ्या करपा रोगासाठी कोणते औषध फवारावे?",
    "उसाच्या पिकासाठी रासायनिक खतांची योग्य मात्रा सांगा.",
    "लासलगाव बाजार समितीत आज कांद्याचा भाव काय आहे?",
    "पीएम-किसान योजनेचे ₹६,००० कसे मिळतात?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3.5 py-1.5 rounded-full border border-agri-200">
            <Sparkles className="w-3.5 h-3.5 text-agri-600 animate-pulse" />
            <span>AI बहुभाषिक कृषी व्हॉइस असिस्टंट</span>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900">
            व्हॉइस असिस्टंट (Multilingual Voice Assistant)
          </h1>
          <p className="text-xs text-gray-600">
            तुमच्या भाषेत शेतीविषयक प्रश्न बोला किंवा टाईप करा आणि तात्काळ आवाज व मजकुरात उत्तर मिळवा.
          </p>
        </div>

        {/* Chat Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[560px]">
          
          {/* Top Bar with Language Selector */}
          <div className="p-4 bg-agri-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-agri-700 rounded-xl flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm block">शेतीसाथी AI सहाय्यक</span>
                <span className="text-[10px] text-agri-300 block">24x7 कृषी सल्ला</span>
              </div>
            </div>

            {/* Language Pills */}
            <div className="flex items-center space-x-1 bg-agri-950/80 p-1 rounded-xl border border-agri-700">
              <button
                onClick={() => changeLanguage('mr')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${lang === 'mr' ? 'bg-agri-600 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${lang === 'hi' ? 'bg-agri-600 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${lang === 'en' ? 'bg-agri-600 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-agri-700 text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed space-y-2 shadow-sm ${msg.sender === 'user' ? 'bg-agri-700 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}
                >
                  <p>{msg.text}</p>
                  {msg.sender === 'bot' && (
                    <div className="pt-1 flex items-center justify-end">
                      {isSpeaking ? (
                        <button onClick={stopSpeaking} className="text-agri-600 hover:text-agri-800 flex items-center text-[10px] font-bold">
                          <VolumeX className="w-3.5 h-3.5 mr-1" /> थांबवा
                        </button>
                      ) : (
                        <button onClick={() => speakText(msg.text)} className="text-agri-700 hover:text-agri-900 flex items-center text-[10px] font-bold">
                          <Volume2 className="w-3.5 h-3.5 mr-1" /> ऐका (Listen)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-gray-500 animate-pulse py-2">
                <Bot className="w-4 h-4 text-agri-700" />
                <span>AI उत्तर तयार करत आहे...</span>
              </div>
            )}
          </div>

          {/* Question Suggestions */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-gray-400 shrink-0">सुचवलेले प्रश्न:</span>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1 bg-agri-50 hover:bg-agri-100 text-agri-800 text-[11px] font-semibold rounded-full border border-agri-200 shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-gray-200 flex items-center space-x-3">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-2xl transition-all shadow-md flex items-center justify-center ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-agri-100 text-agri-700 hover:bg-agri-200'}`}
              title="माइक्रोफोनवर बोला"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? 'बोलणे चालू आहे...' : 'येथे तुमचा प्रश्न टाईप करा...'}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-agri-500"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="p-3 bg-agri-700 hover:bg-agri-800 disabled:bg-gray-300 text-white rounded-2xl shadow transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
