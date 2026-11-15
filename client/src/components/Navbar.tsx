import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, User, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentLang: 'en' | 'mr' | 'hi';
  onOpenDirectory?: () => void;
  onOpenEligibility: () => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onOpenDirectory: _onOpenDirectory,
  onOpenEligibility: _onOpenEligibility,
  onOpenAssistant: _onOpenAssistant,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f3675] to-[#1850b5] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold tracking-tight text-[#0f3675]">GramSathi</span>
                <span className="text-2xl font-extrabold text-[#1850b5]">.AI</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                {currentLang === 'mr' ? 'डिजिटल लोकसेवा सहाय्यक' : 'Digital Public Service Assistant'}
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3.5 py-2 text-[#1850b5] font-semibold bg-blue-50/80 rounded-lg hover:bg-blue-100/70 transition-colors"
            >
              {currentLang === 'mr' ? 'मुख्यपृष्ठ' : 'Home'}
            </button>
            <Link
              to="/schemes"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'योजना शोधा' : 'Explore Schemes'}
            </Link>
            <Link
              to="/needs"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'गरजेनुसार' : 'Find by Need'}
            </Link>
            <Link
              to="/saved"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'जतन केलेल्या' : 'Saved Schemes'}
            </Link>
            <Link
              to="/tracker"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'मागोवा' : 'Tracker'}
            </Link>
            <Link
              to="/synergy"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'संयोग' : 'Synergy'}
            </Link>
            <Link
              to="/fraud-check"
              className="px-3.5 py-2 hover:text-red-700 hover:bg-red-50 text-red-600 font-semibold rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'फसवणूक तपासणी' : 'Fraud Check'}
            </Link>
            <Link
              to="/eligibility"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'पात्रता तपासा' : 'Eligibility Tool'}
            </Link>
            <Link
              to="/assistant"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <span>{currentLang === 'mr' ? 'AI सहाय्यक' : 'AI Assistant'}</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">New</span>
            </Link>
            <a
              href="#about"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'आमच्याबद्दल' : 'About Us'}
            </a>
            <a
              href="https://grievances.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {currentLang === 'mr' ? 'तक्रार निवारण' : 'Grievances'}
            </a>
          </nav>

          {/* Right Action & Citizen Sign In */}
          <div className="flex items-center space-x-4">
            {/* Toll Free Helpline */}
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-[11px] text-slate-500 font-medium flex items-center justify-end space-x-1">
                <PhoneCall className="w-3 h-3 text-emerald-600 inline mr-1" />
                {currentLang === 'mr' ? 'मोफत नागरिक हेल्पलाईन' : 'Toll Free Call'}
              </span>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                1800-120-8040
              </span>
            </div>

            {/* Sign in Button */}
            <Link
              to="/signin"
              className="flex items-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              <span>{currentLang === 'mr' ? 'नागरिक लॉगिन' : 'Sign In / नागरिक लॉगिन'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
