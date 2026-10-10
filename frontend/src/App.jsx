import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import FertilizerRec from './pages/FertilizerRec';
import WeatherPage from './pages/WeatherPage';
import MarketPrices from './pages/MarketPrices';
import GovernmentSchemes from './pages/GovernmentSchemes';
import CropInsurance from './pages/CropInsurance';
import EquipmentRental from './pages/EquipmentRental';
import Marketplace from './pages/Marketplace';
import ProfitCalculator from './pages/ProfitCalculator';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import NotificationsPage from './pages/NotificationsPage';
import ContactUs from './pages/ContactUs';
import UserProfile from './pages/UserProfile';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-agri-800 font-bold text-sm">
        माहिती लोड होत आहे (Loading User Session)...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50 selection:bg-agri-200 selection:text-agri-900">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/disease-detection" element={<DiseaseDetection />} />
                  <Route path="/fertilizer-recommendation" element={<FertilizerRec />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/market-prices" element={<MarketPrices />} />
                  <Route path="/schemes" element={<GovernmentSchemes />} />
                  <Route path="/crop-insurance" element={<CropInsurance />} />
                  <Route path="/equipment-rental" element={<EquipmentRental />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/profit-calculator" element={<ProfitCalculator />} />
                  <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
