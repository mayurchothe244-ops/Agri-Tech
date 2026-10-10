import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sun, CloudRain, CloudSun, Wind, Droplets, MapPin, AlertTriangle } from 'lucide-react';

export default function WeatherWidget() {
  const [city, setCity] = useState('Nashik');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cities = ['Nashik', 'Pune', 'Kolhapur', 'Solapur', 'Nagpur', 'Latur', 'Amravati'];

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = (selectedCity) => {
    setLoading(true);
    api.getWeather(selectedCity)
      .then(res => {
        if (res.success) {
          setWeatherData(res);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-gradient-to-br from-agri-900 to-agri-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-agri-700/50">
      
      {/* Header with City Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-agri-300 uppercase tracking-widest flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" /> हवामान अंदाज (Weather Forecast)
          </span>
          <h3 className="text-xl font-bold mt-1 text-white">
            {city} शेती हवामान
          </h3>
        </div>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-agri-950/80 border border-agri-600 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agri-400"
        >
          {cities.map(c => (
            <option key={c} value={c} className="bg-gray-900 text-white">{c} (महाराष्ट्र)</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-8 text-center text-agri-200 animate-pulse">हवामान अपडेट लोड होत आहे...</div>
      ) : weatherData ? (
        <div>
          {/* Main Temp & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-agri-950/40 p-5 rounded-2xl border border-agri-700/40 mb-6">
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-400/20 text-amber-300 rounded-2xl">
                <Sun className="w-10 h-10 animate-spin-slow" />
              </div>
              <div>
                <span className="text-4xl font-extrabold">{weatherData.current.temp_c}°C</span>
                <span className="block text-xs text-agri-200 font-medium">{weatherData.current.condition}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-y md:border-y-0 md:border-x border-agri-700/50 py-3 md:py-0 md:px-4">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="block text-gray-400">आद्रता (Humidity)</span>
                  <span className="font-bold">{weatherData.current.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-teal-300" />
                <div>
                  <span className="block text-gray-400">वारा (Wind)</span>
                  <span className="font-bold">{weatherData.current.wind_speed}</span>
                </div>
              </div>
            </div>

            <div className="text-xs">
              <span className="block text-gray-400 mb-1">पावसाची शक्यता (Rain):</span>
              <span className="inline-block bg-sky-500/20 text-sky-300 font-bold px-3 py-1 rounded-full border border-sky-400/30">
                {weatherData.current.rain_probability}
              </span>
              <span className="block text-[11px] text-agri-300 mt-2">मातीचे तापमान: {weatherData.current.soil_temperature}</span>
            </div>

          </div>

          {/* Alert banner if present */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div className="mb-6 p-3.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-200 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-100">{weatherData.alerts[0].title}</span>
                <span>{weatherData.alerts[0].message}</span>
              </div>
            </div>
          )}

          {/* 5 Day Forecast Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {weatherData.forecast.map((day, idx) => (
              <div key={idx} className="bg-agri-950/60 p-3 rounded-xl border border-agri-700/30 text-center text-xs">
                <span className="block font-bold text-white">{day.day}</span>
                <span className="block text-[10px] text-gray-400">{day.date}</span>
                <div className="my-2 flex justify-center text-amber-400">
                  {day.condition.includes('Rain') ? <CloudRain className="w-5 h-5 text-sky-400" /> : <CloudSun className="w-5 h-5" />}
                </div>
                <span className="font-bold">{day.high}° / {day.low}°</span>
                <span className="block text-[10px] text-sky-300 mt-0.5">{day.rain_prob} rain</span>
              </div>
            ))}
          </div>

        </div>
      ) : null}

    </div>
  );
}
