import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sprout,
  Mic,
  Bell,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Globe,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { lang, changeLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const languages = [
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'en', label: 'English' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-agri-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-700 to-agri-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-agri-900 group-hover:text-agri-700 transition-colors">
                {t('brand')}
              </span>
              <span className="block text-xs font-semibold text-agri-600 -mt-1">
                {t('brandTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 font-medium text-sm text-gray-700">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navHome')}
            </Link>
            <Link
              to="/disease-detection"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/disease-detection') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navDisease')}
            </Link>
            <Link
              to="/fertilizer-recommendation"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/fertilizer-recommendation') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navFertilizer')}
            </Link>
            <Link
              to="/market-prices"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/market-prices') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navMandi')}
            </Link>
            <Link
              to="/weather"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/weather') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navWeather')}
            </Link>
            <Link
              to="/schemes"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/schemes') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navSchemes')}
            </Link>
            <Link
              to="/equipment-rental"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/equipment-rental') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navEquipment')}
            </Link>
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/marketplace') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navMarketplace')}
            </Link>
            <Link
              to="/profit-calculator"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/profit-calculator') ? 'bg-agri-50 text-agri-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              {t('navCalculator')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Voice Assistant Shortcut */}
            <Link
              to="/voice-assistant"
              className="p-2 text-agri-700 bg-agri-50 hover:bg-agri-100 rounded-full transition-all flex items-center justify-center relative group"
              title="Voice Assistant / व्हॉइस असिस्टंट"
            >
              <Mic className="w-5 h-5 text-agri-700" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                AI Voice Assistant
              </span>
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="p-2 text-gray-600 hover:text-agri-700 hover:bg-gray-100 rounded-full transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Link>

            {/* Cart Icon */}
            <Link
              to="/marketplace"
              className="p-2 text-gray-600 hover:text-agri-700 hover:bg-gray-100 rounded-full transition-colors relative"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-agri-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-colors border border-gray-200"
              >
                <Globe className="w-3.5 h-3.5 text-agri-700" />
                <span>{languages.find(l => l.code === lang)?.label.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-agri-50 transition-colors ${lang === l.code ? 'text-agri-700 font-bold bg-agri-50' : 'text-gray-700'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons / Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-agri-50 hover:bg-agri-100 text-agri-800 px-3 py-1.5 rounded-lg border border-agri-200 transition-colors"
                >
                  <div className="w-7 h-7 bg-agri-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'F'}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-agri-700" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-agri-50 hover:text-agri-700 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {t('navDashboard')}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-agri-50 hover:text-agri-700 font-medium"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('navProfile')}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('navLogout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-agri-700 hover:text-agri-900 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold bg-agri-700 hover:bg-agri-800 text-white rounded-lg shadow-sm transition-all hover:shadow"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}

          </div>

          {/* Mobile menu trigger button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link to="/voice-assistant" className="p-2 text-agri-700 bg-agri-50 rounded-full">
              <Mic className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          {/* Language bar mobile */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-2">
            <span className="text-xs font-bold text-gray-500 flex items-center">
              <Globe className="w-4 h-4 mr-1 text-agri-600" /> भाषा निवडा / Language:
            </span>
            <div className="flex space-x-1">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => changeLanguage(l.code)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium ${lang === l.code ? 'bg-agri-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navHome')}</Link>
            <Link to="/disease-detection" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navDisease')}</Link>
            <Link to="/fertilizer-recommendation" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navFertilizer')}</Link>
            <Link to="/market-prices" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navMandi')}</Link>
            <Link to="/weather" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navWeather')}</Link>
            <Link to="/schemes" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navSchemes')}</Link>
            <Link to="/crop-insurance" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navInsurance')}</Link>
            <Link to="/equipment-rental" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navEquipment')}</Link>
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navMarketplace')}</Link>
            <Link to="/profit-calculator" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-lg text-gray-800">{t('navCalculator')}</Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-agri-800 flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-1" /> {user.name} (डॅशबोर्ड)
                </Link>
                <button onClick={logout} className="text-xs text-red-600 font-semibold">{t('navLogout')}</button>
              </div>
            ) : (
              <div className="flex space-x-3 w-full">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 bg-gray-100 text-gray-800 text-xs font-bold rounded-lg">{t('navLogin')}</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 bg-agri-700 text-white text-xs font-bold rounded-lg">{t('navRegister')}</Link>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
