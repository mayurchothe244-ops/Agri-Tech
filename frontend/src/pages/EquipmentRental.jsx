import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Tractor,
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  Search,
  PlusCircle,
  X
} from 'lucide-react';

export default function EquipmentRental() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [equipmentList, setEquipmentList] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquip, setSelectedEquip] = useState(null);

  // Form State
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-14');
  const [bookingMsg, setBookingMsg] = useState(null);
  const [bookingErr, setBookingErr] = useState(null);

  useEffect(() => {
    fetchEquipment();
    if (user) fetchMyRentals();
  }, [user]);

  const fetchEquipment = () => {
    setLoading(true);
    api.getEquipment()
      .then(res => {
        if (res.success) setEquipmentList(res.equipment);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchMyRentals = () => {
    api.getMyRentals()
      .then(res => {
        if (res.success) setMyRentals(res.rentals);
      })
      .catch(err => console.error(err));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setBookingErr('उपकरण भाड्याने घेण्यासाठी कृपया प्रथम लॉगिन करा.');
      return;
    }

    setBookingErr(null);
    setBookingMsg(null);

    const payload = {
      equipment_id: selectedEquip.id,
      equipment_name: selectedEquip.name,
      start_date: startDate,
      end_date: endDate,
      total_price: selectedEquip.price_per_day * 2
    };

    api.rentEquipment(payload)
      .then(data => {
        if (data.success) {
          setBookingMsg(data.message);
          fetchMyRentals();
          setTimeout(() => setSelectedEquip(null), 2500);
        } else {
          setBookingErr(data.message);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-green-800 bg-green-100 px-3.5 py-1.5 rounded-full border border-green-200">
            <Tractor className="w-3.5 h-3.5 text-green-600" />
            <span>कृषी यंत्रसामग्री व अवजारे भाडे</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            कृषी अवजारे भाड्याने (Equipment Rental)
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            ट्रॅक्टर, रोटाव्हेटर, फवारणी यंत्र आणि हार्वेस्टर वाजवी दरात जवळच्या मालकाकडून भाड्याने मिळवा.
          </p>
        </div>

        {/* My Active Bookings Section (If logged in) */}
        {user && myRentals.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-agri-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
              <Clock className="w-4 h-4 text-agri-600 mr-1.5" /> माझी भाड्याची उपकरणे (My Active Rental Bookings)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRentals.map(r => (
                <div key={r.id} className="p-4 bg-agri-50/70 rounded-2xl border border-agri-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-gray-900">{r.equipment_name}</span>
                    <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {r.status}
                    </span>
                  </div>
                  <span className="text-gray-600 block">कालावधी: {r.start_date} ते {r.end_date}</span>
                  <span className="font-bold text-agri-800 block">एकूण भाडे: ₹{r.total_price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Listings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full bg-white p-12 rounded-3xl text-center text-gray-500 animate-pulse">
              उपकरणांची यादी लोड होत आहे...
            </div>
          ) : (
            equipmentList.map(item => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="relative">
                    <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-agri-800 font-bold text-xs px-2.5 py-1 rounded-full shadow border border-gray-100">
                      {item.availability}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <span className="text-[11px] font-bold uppercase text-agri-700 bg-agri-50 px-2.5 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{item.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>

                    <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-700">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-red-500 mr-1.5" />
                        <span>ठिकाण: {item.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-agri-600 mr-1.5" />
                        <span>मालक: {item.owner_name} ({item.contact})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block">भाडे दर:</span>
                    <span className="text-base font-extrabold text-agri-800">₹{item.price_per_day} <span className="text-xs font-normal text-gray-500">/ दिवस</span></span>
                  </div>

                  <button
                    onClick={() => setSelectedEquip(item)}
                    className="px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    भाड्याने बुक करा
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rental Booking Modal */}
        {selectedEquip && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative border border-gray-200 animate-fadeIn">
              
              <button
                onClick={() => setSelectedEquip(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-xs font-bold text-agri-700 bg-agri-50 px-2.5 py-0.5 rounded">बुकिंग अर्ज</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedEquip.name}</h3>
                <span className="text-xs text-gray-500 block">दर: ₹{selectedEquip.price_per_day} / दिवस</span>
              </div>

              {bookingMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{bookingMsg}</span>
                </div>
              )}

              {bookingErr && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
                  {bookingErr}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">प्रारंभ तारीख (Start Date):</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">अंतिम तारीख (End Date):</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium"
                    required
                  />
                </div>

                <div className="p-3 bg-agri-50 rounded-xl border border-agri-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">अंदाजे एकूण भाडे:</span>
                  <span className="text-sm font-extrabold text-agri-800">₹{selectedEquip.price_per_day * 2}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors"
                >
                  बुकिंग निश्चित करा (Confirm Booking)
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
