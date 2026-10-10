import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Bell, CloudSun, Send, CheckCircle2, Phone, MapPin, ShieldCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscription state
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [submitting, setSubmitting] = useState(false);
  const [subMessage, setSubMessage] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    api.getNotifications()
      .then(res => {
        if (res.success) setNotifications(res.notifications);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleMarkRead = (id) => {
    api.markNotificationRead(id)
      .then(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      })
      .catch(err => console.error(err));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setSubMessage({ type: 'error', text: 'कृपया वैध 10 अंकी मोबाईल नंबर प्रविष्ट करा.' });
      return;
    }

    setSubmitting(true);
    setSubMessage(null);

    api.subscribeAlerts({
      phone,
      district,
      alert_types: ['Weather Alerts', 'Daily Mandi Prices', 'Govt Schemes']
    })
      .then(res => {
        if (res.success) {
          setSubMessage({ type: 'success', text: res.message || 'सदस्यता यशस्वीरित्या सुरू झाली!' });
          fetchNotifications();
        } else {
          setSubMessage({ type: 'error', text: res.error || 'सदस्यता नोंदवताना अडचण आली.' });
        }
      })
      .catch(() => setSubMessage({ type: 'error', text: 'सर्व्हरशी संपर्क होऊ शकला नाही.' }))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3 py-1 rounded-full border border-agri-200">
            <Bell className="w-3.5 h-3.5 text-agri-600" />
            <span>कृषी सूचना केंद्र (Alerts Center)</span>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900">
            महत्त्वाच्या सूचना व SMS/WhatsApp अलर्ट्स
          </h1>
          <p className="text-xs text-gray-600">
            हवामान अंदाज, खत फवारणी रिमाइंडर, रोजचे बाजारभाव आणि शासकीय योजनांचे मोफत अलर्ट्स.
          </p>
        </div>

        {/* SMS / WhatsApp Alert Subscription Box */}
        <div className="bg-gradient-to-br from-agri-900 to-agri-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <Phone className="w-6 h-6 text-agri-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">मोफत SMS व WhatsApp अलर्ट सेवा</h2>
              <p className="text-xs text-agri-200">तुमच्या जिल्ह्यात होणारा पाऊस, हवामान आणि रोजचे बाजारभाव मोबाईलवर मिळवा.</p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-agri-200 mb-1">मोबाईल नंबर (Phone Number)</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-agri-300 focus:outline-none focus:ring-2 focus:ring-agri-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-agri-200 mb-1">जिल्हा (District)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 bg-agri-900 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-agri-400 text-sm"
              >
                <option value="Nashik">नाशिक (Nashik)</option>
                <option value="Pune">पुणे (Pune)</option>
                <option value="Ahmednagar">अहमदनगर (Ahmednagar)</option>
                <option value="Aurangabad">छत्रपती संभाजीनगर</option>
                <option value="Solapur">सोलापूर (Solapur)</option>
                <option value="Satara">सातारा (Satara)</option>
                <option value="Kolhapur">कोल्हापूर (Kolhapur)</option>
                <option value="Amravati">अमरावती (Amravati)</option>
                <option value="Nagpur">नागपूर (Nagpur)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-agri-500 hover:bg-agri-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'नोंदणी होत आहे...' : 'अलर्ट सुरू करा (Subscribe)'}</span>
              </button>
            </div>
          </form>

          {subMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${subMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'}`}>
              <ShieldCheck className="w-4 h-4" />
              <span>{subMessage.text}</span>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b pb-3">
            <Bell className="w-5 h-5 text-agri-600" />
            <span>अलीकडील सर्व सूचना (Recent System Alerts)</span>
          </h2>

          {loading ? (
            <div className="py-8 text-center text-gray-500 animate-pulse">सूचना लोड होत आहेत...</div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-400">कोणतीही सूचना उपलब्ध नाही.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`p-4 rounded-2xl border transition-colors flex items-start justify-between space-x-4 cursor-pointer ${n.is_read ? 'bg-white border-gray-100 opacity-75' : 'bg-agri-50/70 border-agri-200 shadow-sm'}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${n.is_read ? 'bg-gray-100 text-gray-500' : 'bg-agri-100 text-agri-700'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center">
                      <span>{n.title_mr || n.title}</span>
                      {!n.is_read && <span className="ml-2 w-2 h-2 bg-agri-600 rounded-full"></span>}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gray-400 block pt-1">{n.created_at}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-gray-400 hover:text-agri-700 shrink-0">
                  {n.is_read ? 'वाचले' : 'वाचले म्हणून चिन्हांकित करा'}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
