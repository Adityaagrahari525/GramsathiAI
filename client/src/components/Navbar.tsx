import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, User, ShieldCheck, LogOut } from 'lucide-react';
import { useCitizenProfile } from '../context/CitizenProfileContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentLang?: 'en' | 'mr' | 'hi';
  onOpenDirectory?: () => void;
  onOpenEligibility?: () => void;
  onOpenAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang: _propLang,
}) => {
  const { t, language } = useLanguage();
  const { profile, logout } = useCitizenProfile();
  const { count: savedCount } = useSavedSchemes();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f3675] to-[#1850b5] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold tracking-tight text-[#0f3675]">GramSathi</span>
                <span className="text-2xl font-extrabold text-[#1850b5]">.AI</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                {t('brand.subtitle')}
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
            <Link
              to="/"
              className="px-3.5 py-2 text-[#1850b5] font-semibold bg-blue-50/80 rounded-lg hover:bg-blue-100/70 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/schemes"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('nav.explore_schemes')}
            </Link>
            <Link
              to="/needs"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('nav.find_by_need')}
            </Link>
            <Link
              to="/saved"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-1"
            >
              <span>{t('nav.saved_schemes')}</span>
              {savedCount > 0 && (
                <span className="bg-blue-100 text-[#1850b5] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </Link>
            <Link
              to="/tracker"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('nav.tracker')}
            </Link>
            <Link
              to="/synergy"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('nav.synergy')}
            </Link>
            <Link
              to="/fraud-check"
              className="px-3.5 py-2 hover:text-red-700 hover:bg-red-50 text-red-600 font-semibold rounded-lg transition-colors"
            >
              {t('nav.fraud_check')}
            </Link>
            <Link
              to="/eligibility"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('nav.eligibility')}
            </Link>
            <Link
              to="/assistant"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <span>{t('nav.ai_assistant')}</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">New</span>
            </Link>
            <a
              href="#about"
              className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('nav.about_us')}
            </a>
            <a
              href="https://grievances.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('nav.grievances')}
            </a>
          </nav>

          {/* Right Action & Citizen Sign In */}
          <div className="flex items-center space-x-4">
            {/* Toll Free Helpline */}
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-[11px] text-slate-500 font-medium flex items-center justify-end space-x-1">
                <PhoneCall className="w-3 h-3 text-emerald-600 inline mr-1" />
                {t('Toll Free Call')}
              </span>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                1800-120-8040
              </span>
            </div>

            {/* Sign in / Profile Button */}
            <div className="flex items-center space-x-2">
              <Link
                to={profile.isLoggedIn ? "/profile" : "/signin"}
                className="flex items-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
              >
                <User className="w-4 h-4" />
                <span>
                  {profile.isLoggedIn
                    ? t('Citizen Profile')
                    : (language === 'mr' ? 'नागरिक लॉगिन' : language === 'hi' ? 'नागरिक लॉगिन' : 'Sign In / Profile')}
                </span>
              </Link>
              {profile.isLoggedIn && (
                <button
                  onClick={logout}
                  className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors"
                  title={t('Sign Out')}
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
