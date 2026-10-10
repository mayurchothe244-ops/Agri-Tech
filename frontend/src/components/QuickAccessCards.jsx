import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  ScanLine,
  FlaskConical,
  TrendingUp,
  CloudSun,
  Landmark,
  ShieldCheck,
  Tractor,
  Calculator,
  ArrowRight
} from 'lucide-react';

export default function QuickAccessCards() {
  const { t } = useLanguage();

  const services = [
    {
      id: 'disease',
      title: t('diseaseCardTitle'),
      desc: t('diseaseCardDesc'),
      icon: ScanLine,
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50 text-emerald-700',
      borderColor: 'border-emerald-200',
      link: '/disease-detection'
    },
    {
      id: 'fertilizer',
      title: t('fertilizerCardTitle'),
      desc: t('fertilizerCardDesc'),
      icon: FlaskConical,
      color: 'bg-teal-500',
      lightBg: 'bg-teal-50 text-teal-700',
      borderColor: 'border-teal-200',
      link: '/fertilizer-recommendation'
    },
    {
      id: 'mandi',
      title: t('mandiCardTitle'),
      desc: t('mandiCardDesc'),
      icon: TrendingUp,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50 text-amber-700',
      borderColor: 'border-amber-200',
      link: '/market-prices'
    },
    {
      id: 'weather',
      title: t('weatherCardTitle'),
      desc: t('weatherCardDesc'),
      icon: CloudSun,
      color: 'bg-sky-500',
      lightBg: 'bg-sky-50 text-sky-700',
      borderColor: 'border-sky-200',
      link: '/weather'
    },
    {
      id: 'schemes',
      title: t('schemesCardTitle'),
      desc: t('schemesCardDesc'),
      icon: Landmark,
      color: 'bg-indigo-500',
      lightBg: 'bg-indigo-50 text-indigo-700',
      borderColor: 'border-indigo-200',
      link: '/schemes'
    },
    {
      id: 'insurance',
      title: t('insuranceCardTitle'),
      desc: t('insuranceCardDesc'),
      icon: ShieldCheck,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50 text-blue-700',
      borderColor: 'border-blue-200',
      link: '/crop-insurance'
    },
    {
      id: 'equipment',
      title: t('equipmentCardTitle'),
      desc: t('equipmentCardDesc'),
      icon: Tractor,
      color: 'bg-green-600',
      lightBg: 'bg-green-50 text-green-700',
      borderColor: 'border-green-200',
      link: '/equipment-rental'
    },
    {
      id: 'calculator',
      title: t('calculatorCardTitle'),
      desc: t('calculatorCardDesc'),
      icon: Calculator,
      color: 'bg-purple-500',
      lightBg: 'bg-purple-50 text-purple-700',
      borderColor: 'border-purple-200',
      link: '/profit-calculator'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            {t('quickAccessTitle')}
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            शेतीसाठी सर्व आवश्यक AI सेवा व सुविधा
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('quickAccessSub')}
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(item => {
            const IconComp = item.icon;
            return (
              <Link
                key={item.id}
                to={item.link}
                className={`group relative bg-white rounded-2xl p-6 border ${item.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 agri-card-hover flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.lightBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-agri-600 transition-colors">
                      उघडा &rarr;
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-agri-800 transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-agri-700 group-hover:translate-x-1 transition-transform">
                  <span>सुविधा वापरा</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
