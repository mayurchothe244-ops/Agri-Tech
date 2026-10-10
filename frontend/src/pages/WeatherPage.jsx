import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  AlertTriangle,
  Search,
  Thermometer,
  Eye,
  Umbrella
} from 'lucide-react';

export default function WeatherPage() {
  const { t } = useLanguage();
  const [searchLocation, setSearchLocation] = useState('Nashik');
  const [currentCity, setCurrentCity] = useState('Nashik');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultCities = ['Nashik', 'Pune', 'Kolhapur', 'Solapur', 'Nagpur', 'Latur', 'Amravati'];

  useEffect(() => {
    fetchWeatherData(currentCity);
  }, [currentCity]);

  const fetchWeatherData = (city) => {
    setLoading(true);
    api.getWeather(city)
      .then(res => {
        if (res.success) setWeather(res);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      setCurrentCity(searchLocation.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Village Search */}
        <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-agri-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-agri-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-agri-300 uppercase tracking-widest flex items-center">
                <CloudSun className="w-4 h-4 mr-1 text-amber-400" /> ५-दिवसीय हवामान अंदाज
              </span>
              <h1 className="text-3xl font-extrabold mt-1 text-white">
                कृषी हवामान केंद्र (Agri Weather Dashboard)
              </h1>
              <p className="text-xs text-gray-300 mt-1">
                तुमच्या गावातील अचूक तापमान, पाऊस, वारा आणि आद्रता माहिती
              </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <div className="relative">
                <MapPin className="w-4 h-4 text-agri-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="तुमचे गाव किंवा तालुका..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-agri-950/80 border border-agri-600 text-white rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-agri-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-agri-600 hover:bg-agri-500 text-white text-xs font-bold rounded-xl shadow"
              >
                शोधा
              </button>
            </form>
          </div>

          {/* Quick Village Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-6 mt-4 border-t border-agri-700/50">
            <span className="text-xs text-agri-300 font-bold shrink-0">प्रमुख शहरे/गावे:</span>
            {defaultCities.map(c => (
              <button
                key={c}
                onClick={() => setCurrentCity(c)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 ${currentCity === c ? 'bg-amber-400 text-gray-900 font-extrabold' : 'bg-agri-800 text-agri-100 hover:bg-agri-700'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-3xl text-center text-gray-500 animate-pulse">
            हवामान अपडेट लोड होत आहे...
          </div>
        ) : weather ? (
          <div className="space-y-8">
            
            {/* Severe Weather Alert */}
            {weather.alerts && weather.alerts.length > 0 && (
              <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl text-amber-900 flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-sm">{weather.alerts[0].title}</h3>
                  <p className="text-xs mt-0.5">{weather.alerts[0].message}</p>
                </div>
              </div>
            )}

            {/* Current Weather Highlight Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Temp Big display */}
              <div className="lg:col-span-5 flex items-center space-x-6 border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:pr-6">
                <div className="p-4 bg-amber-100 text-amber-600 rounded-3xl">
                  <Sun className="w-16 h-16" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{weather.location}</span>
                  <div className="text-5xl font-extrabold text-gray-900 my-1">{weather.current.temp_c}°C</div>
                  <span className="inline-block bg-agri-50 text-agri-800 font-bold text-xs px-3 py-1 rounded-full border border-agri-200">
                    {weather.current.condition}
                  </span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                  <Droplets className="w-5 h-5 text-sky-600 mb-1" />
                  <span className="text-gray-500 block">आद्रता (Humidity)</span>
                  <span className="text-base font-extrabold text-gray-900">{weather.current.humidity}%</span>
                </div>

                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                  <Wind className="w-5 h-5 text-teal-600 mb-1" />
                  <span className="text-gray-500 block">वाऱ्याचा वेग</span>
                  <span className="text-base font-extrabold text-gray-900">{weather.current.wind_speed}</span>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <Umbrella className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-gray-500 block">पावसाची शक्यता</span>
                  <span className="text-base font-extrabold text-gray-900">{weather.current.rain_probability}</span>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <Thermometer className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="text-gray-500 block">मातीचे तापमान</span>
                  <span className="text-base font-extrabold text-gray-900">{weather.current.soil_temperature}</span>
                </div>
              </div>

            </div>

            {/* 5 Day Forecast Cards */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                आगामी ५ दिवसांचा सविस्तर हवामान अंदाज
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {weather.forecast.map((d, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-2 hover:border-agri-400 transition-colors">
                    <span className="font-bold text-gray-900 block text-sm">{d.day}</span>
                    <span className="text-xs text-gray-400 block">{d.date}</span>
                    <div className="py-2 flex justify-center text-amber-500">
                      {d.condition.includes('Rain') ? <CloudRain className="w-8 h-8 text-sky-500" /> : <Sun className="w-8 h-8" />}
                    </div>
                    <span className="text-sm font-extrabold block">{d.high}° / {d.low}°</span>
                    <span className="text-[11px] text-gray-600 block">{d.condition}</span>
                    <span className="inline-block text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                      {d.rain_prob} rain
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
