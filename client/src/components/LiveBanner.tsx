import React from 'react';
import { Shield } from 'lucide-react';

interface LiveBannerProps {
  currentLang: 'en' | 'mr' | 'hi';
}

export const LiveBanner: React.FC<LiveBannerProps> = ({ currentLang }) => {
  return (
    <div className="bg-[#eef4ff] border-b border-blue-100 text-xs py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-700">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <span className="bg-[#1850b5] text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center space-x-1 uppercase tracking-wider">
            <Shield className="w-3 h-3 inline mr-1" />
            Official Civic Portal
          </span>
          <span className="font-semibold text-slate-800">
            {currentLang === 'mr'
              ? 'महाराष्ट्रातील १० कोटी+ नागरिक आणि ग्रामीण उद्योगांना सक्षम बनवत आहे | ५००+ सक्रिय योजना'
              : 'Empowering 10 Cr+ Civic Citizens & Rural Enterprises in Maharashtra | 500+ Active Public Schemes'}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-600">
          <span className="hidden md:inline text-slate-500">
            {currentLang === 'mr' ? 'शासन निर्णय राजपत्रातून दररोज अद्यतनित' : 'Portal Updated Daily from Maharashtra State Gazettes'}
          </span>
          <span className="flex items-center space-x-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Sync: Active</span>
          </span>
        </div>
      </div>
    </div>
  );
};
