import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Sparkles,
  Compass,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  PhoneCall,
  ExternalLink
} from 'lucide-react';

interface HomeNavbarProps {
  currentLang: 'en' | 'mr' | 'hi';
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ currentLang }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollNav = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── Main Sticky Horizontal Navbar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs select-none">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">

            {/* Left: Sidebar Toggle + Logo & Identity */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Sliding Sidebar Trigger Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-600 hover:text-[#1850b5] hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center border border-slate-200 shadow-2xs"
                title="Open Sidebar Navigation / मेनू"
                aria-label="Open Sidebar"
              >
                <Menu className="w-5 h-5 text-[#1850b5]" />
              </button>

              {/* Logo */}
              <div
                className="flex items-center space-x-2.5 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f3675] to-[#1850b5] flex items-center justify-center text-white shadow-md shadow-blue-900/10 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-baseline space-x-0.5">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f3675]">GramSathi</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#1850b5]">.AI</span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                    {currentLang === 'mr' ? 'सार्वजनिक डिजिटल मदतनीस' : 'DIGITAL PUBLIC SERVICE ASSISTANT'}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Strictly Horizontal Sliding Navigation Bar */}
            <div className="relative flex-1 min-w-0 max-w-4xl mx-1 sm:mx-2 flex items-center">
              {/* Optional left scroll arrow */}
              <button
                onClick={() => scrollNav('left')}
                className="hidden md:flex p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors shrink-0 z-10"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Horizontal Scroll / Slide Container */}
              <div
                ref={scrollContainerRef}
                className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* 1. Home (Active pill) */}
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-3.5 py-2 text-[#1850b5] font-bold bg-[#ebf3fc] rounded-xl hover:bg-blue-100/80 transition-colors shrink-0 text-xs sm:text-sm"
                >
                  {currentLang === 'mr' ? 'मुख्यपृष्ठ' : 'Home'}
                </button>

                {/* 2. Explore Schemes (2-line stacked) */}
                <Link
                  to="/schemes"
                  className="px-2.5 py-1 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-center text-xs font-semibold leading-tight"
                >
                  <div>Explore</div>
                  <div className="text-[11px] text-slate-500">Schemes</div>
                </Link>

                {/* 3. Find by Need (2-line stacked) */}
                <Link
                  to="/needs"
                  className="px-2.5 py-1 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-center text-xs font-semibold leading-tight"
                >
                  <div>Find</div>
                  <div className="text-[11px] text-slate-500">by Need</div>
                </Link>

                {/* 4. Saved Schemes (2-line stacked) */}
                <Link
                  to="/saved"
                  className="px-2.5 py-1 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-center text-xs font-semibold leading-tight"
                >
                  <div>Saved</div>
                  <div className="text-[11px] text-slate-500">Schemes</div>
                </Link>

                {/* 5. Tracker */}
                <Link
                  to="/tracker"
                  className="px-2.5 py-2 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-xs font-semibold"
                >
                  {currentLang === 'mr' ? 'मागोवा' : 'Tracker'}
                </Link>

                {/* 6. Synergy */}
                <Link
                  to="/synergy"
                  className="px-2.5 py-2 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-xs font-semibold"
                >
                  {currentLang === 'mr' ? 'संयोग' : 'Synergy'}
                </Link>

                {/* 7. Fraud Check (Red accent text as in Stitch screenshot) */}
                <Link
                  to="/fraud-check"
                  className="px-2.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-colors shrink-0 text-center text-xs font-bold leading-tight"
                >
                  <div className="text-red-600">Fraud</div>
                  <div className="text-[11px] text-red-500">Check</div>
                </Link>

                {/* 8. Eligibility Tool (2-line stacked) */}
                <Link
                  to="/eligibility"
                  className="px-2.5 py-1 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-center text-xs font-semibold leading-tight"
                >
                  <div>Eligibility</div>
                  <div className="text-[11px] text-slate-500">Tool</div>
                </Link>

                {/* 9. AI Assistant (with New badge) */}
                <Link
                  to="/assistant"
                  className="px-2.5 py-1 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-center text-xs font-semibold leading-tight relative"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>AI</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold">New</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Assistant</div>
                </Link>

                {/* 10. About Us (2-line stacked) */}
                <a
                  href="#about"
                  className="px-2.5 py-1 text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-center text-xs font-semibold leading-tight"
                >
                  <div>About</div>
                  <div className="text-[11px] text-slate-500">Us</div>
                </a>

                {/* 11. Grievances */}
                <a
                  href="https://grievances.maharashtra.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-2 text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-xl transition-colors shrink-0 text-xs font-semibold"
                >
                  {currentLang === 'mr' ? 'तक्रार निवारण' : 'Grievances'}
                </a>
              </div>

              {/* Optional right scroll arrow */}
              <button
                onClick={() => scrollNav('right')}
                className="hidden md:flex p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors shrink-0 z-10"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Sign in Button */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <Link
                to="/signin"
                className="flex items-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] shrink-0"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang === 'mr' ? 'नागरिक लॉगिन' : 'Sign In / नोंदणी'}</span>
                <span className="sm:hidden">लॉगिन</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ── Sliding Sidebar Drawer (Exclusive to Home Page) ── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-r border-slate-200 animate-in slide-in-from-left duration-250">
            {/* Top Bar inside Sidebar */}
            <div className="p-5 border-b border-slate-100 bg-[#0f3675] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-base tracking-tight leading-none">GramSathi .AI</div>
                  <div className="text-[10px] text-blue-200 font-medium mt-1">Civic Public Service Portal</div>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links inside Sidebar */}
            <div className="p-4 space-y-1 flex-1 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                Citizen Services & Navigation
              </div>

              {/* 1. Home */}
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold text-[#1850b5] bg-blue-50 rounded-xl"
              >
                <Home className="w-4 h-4 text-[#1850b5]" />
                <span>Home / मुख्यपृष्ठ</span>
              </button>

              {/* 2. Explore Schemes */}
              <Link
                to="/schemes"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Explore Government Schemes (500+)</span>
              </Link>

              {/* 3. Find by Need */}
              <Link
                to="/needs"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Find Support by Citizen Need</span>
              </Link>

              {/* 4. Eligibility Tool */}
              <Link
                to="/eligibility"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Scheme Eligibility Checker (4-Step Tool)</span>
              </Link>

              {/* 5. AI Assistant */}
              <Link
                to="/assistant"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>GramSathi AI Assistant</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">New</span>
              </Link>

              {/* 6. Saved Schemes */}
              <Link
                to="/saved"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span>Saved Schemes & Bookmarks</span>
              </Link>

              {/* 7. Tracker */}
              <Link
                to="/tracker"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Scheme Journey & Status Tracker</span>
              </Link>

              {/* 8. Fraud Check */}
              <Link
                to="/fraud-check"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Anti-Fraud & Scam Verification</span>
              </Link>

              {/* 9. Citizen Profile */}
              <Link
                to="/profile"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#1850b5] hover:bg-slate-50 rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Citizen Profile & Vault</span>
              </Link>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <a
                  href="#about"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>About GramSathi AI</span>
                </a>
                <a
                  href="https://grievances.maharashtra.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 hover:text-red-600"
                >
                  <span className="flex items-center space-x-3">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Grievance Redressal Portal</span>
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Bottom Support Widget inside Sidebar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs">
              <div className="flex items-center space-x-2 text-slate-700 font-bold mb-1">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Toll-Free Helpline: 1800-120-8040</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Official Maharashtra Civic Assistance (Available 24x7)
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeNavbar;
