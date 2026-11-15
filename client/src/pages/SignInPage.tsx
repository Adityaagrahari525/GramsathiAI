import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  PhoneCall,
  Volume2,
  RefreshCw,
  ArrowRight,
  MessageSquare,
  Lock,
  Building2,
  Smartphone,
  CreditCard,
  Mic,
  ArrowLeft
} from 'lucide-react';
import { TopBar } from '../components/TopBar';

export function SignInPage() {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<'en' | 'mr' | 'hi'>('mr');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  // Form State
  const [userRole, setUserRole] = useState<'citizen' | 'vle'>('citizen');
  const [authMode, setAuthMode] = useState<'mobile' | 'aadhaar'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otpSent, setOtpSent] = useState(true);
  const [otp, setOtp] = useState(['4', '8', '2', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(118); // 01:58
  const [captchaInput, setCaptchaInput] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [captchaCode, setCaptchaCode] = useState('7NX0K');

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown timer
  useEffect(() => {
    if (!otpSent || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance focus
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleRefreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  const handleAudioHelp = () => {
    if ('speechSynthesis' in window) {
      const text =
        currentLang === 'mr'
          ? "कृपया आपला नोंदणीकृत मोबाईल क्रमांक किंवा आधार क्रमांक टाका आणि ओटीपी द्वारे लॉगिन करा."
          : "Please enter your registered mobile number or Aadhaar number and verify using the 6-digit OTP.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    alert(
      currentLang === 'mr'
        ? 'लॉगिन यशस्वी! ग्रामसाथी नागरिक डॅशबोर्डवर आपले स्वागत आहे.'
        : 'Sign In Successful! Welcome to GramSathi Citizen Dashboard.'
    );
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900"
      style={{ fontSize: `${100 + fontSizeOffset * 6}%` }}
    >
      {/* 1. Official Government Top Accessibility Bar */}
      <TopBar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        fontSize={fontSizeOffset}
        onFontSizeChange={(delta) => setFontSizeOffset((prev) => Math.max(-2, Math.min(3, prev + delta)))}
      />

      {/* 2. Civic Portal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f3675] to-[#1850b5] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold tracking-tight text-[#0f3675]">GramSathi AI</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded uppercase tracking-wider">
                    CIVIC CELL
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-slate-500 tracking-wider">
                  Maharashtra Rural Citizen Digital Intelligence & Assistance Platform
                </div>
              </div>
            </Link>

            {/* Helpline & Profile */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Toll-Free Helpline (24x7)</div>
                  <div className="text-sm font-bold text-blue-950">1800-123-GRAM</div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Secondary Navigation Strip */}
      <nav className="bg-[#f0f4fa] border-b border-slate-200 py-2.5 px-4 text-xs font-medium text-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-5 flex-wrap">
            <Link to="/schemes" className="flex items-center space-x-1.5 text-blue-700 hover:text-blue-900 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home / Explore Schemes</span>
            </Link>
            <span className="text-slate-300">|</span>
            <a href="#vle" className="hover:text-blue-700">VLE & CSC Corner</a>
            <a href="#tracker" className="hover:text-blue-700">Application Tracker</a>
            <a href="#directory" className="hover:text-blue-700">Panchayat Directory</a>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Direct Citizen Subsidy & Land Portal</span>
          </div>
        </div>
      </nav>

      {/* 4. Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <div>
            Home / Citizen Access / <strong className="text-slate-800">Sign In / प्रवेश</strong>
          </div>
          <div className="flex items-center space-x-1.5 text-blue-900 font-medium">
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>Secure Aadhaar & MahaDBT Gateway (TLS 1.3)</span>
          </div>
        </div>
      </div>

      {/* Main Authentication Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">

          {/* Role Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 text-center font-bold text-xs sm:text-sm">
            <button
              onClick={() => setUserRole('citizen')}
              className={`py-3.5 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                userRole === 'citizen'
                  ? 'border-[#1850b5] text-[#1850b5] bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Sign In (नागरिक लॉगिन)</span>
            </button>
            <button
              onClick={() => setUserRole('vle')}
              className={`py-3.5 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                userRole === 'vle'
                  ? 'border-[#1850b5] text-[#1850b5] bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>VLE / CSC Operator (अधिकृत)</span>
            </button>
          </div>

          <form onSubmit={handleSignIn} className="p-6 sm:p-8 space-y-6">
            {/* Header in Card */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Verify Identity & Sign In
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Select your authentication mode registered with Aadhaar / Jan Dhan
                </p>
              </div>
              <button
                type="button"
                onClick={handleAudioHelp}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                title="Audio Guidance"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Authentication Mode Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Authentication Mode / प्रमाणीकरण पद्धत
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAuthMode('mobile')}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    authMode === 'mobile'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-blue-700" />
                      <span className="text-xs font-bold text-slate-900">Mobile Number + OTP</span>
                    </div>
                    <span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">FAST</span>
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Recommended for rural citizens. Instant SMS code.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('aadhaar')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    authMode === 'aadhaar'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-900">Aadhaar Number / VID</span>
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    UIDAI e-KYC linked with your biometric card.
                  </div>
                </button>
              </div>
            </div>

            {/* Input based on authMode */}
            {authMode === 'mobile' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Registered Mobile Number / नोंदणीकृत मोबाईल
                  </label>
                  <span className="text-[11px] text-slate-500">Linked to Jan Dhan or 7/12</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 border-r border-slate-200 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number (उदा. 987654...)"
                    className="w-full pl-14 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <button type="button" className="absolute right-3 text-slate-400 hover:text-slate-600">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  We will send a 6-digit verification code to this handset via BSNL/MahaGovt SMS gateway.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(true);
                    setTimerSeconds(118);
                  }}
                  className="mt-3 w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Get OTP on Mobile (ओटीपी मिळवा)</span>
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  12-Digit Aadhaar Number (आधार क्रमांक)
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="XXXX XXXX 1234"
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  UIDAI e-KYC compliant. Aadhaar details are processed via encrypted state gateway.
                </p>
              </div>
            )}

            {/* OTP Section (if active) */}
            {otpSent && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Enter 6-Digit OTP / ६ अंकी ओटीपी टाका
                  </label>
                  <span className="text-xs font-semibold text-red-600">
                    Expires in {formatTimer(timerSeconds)}
                  </span>
                </div>

                {/* 6 Digit Boxes */}
                <div className="grid grid-cols-6 gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpInputsRef.current[i] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-full h-12 text-center text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between mt-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setTimerSeconds(120)}
                    className="text-blue-700 hover:underline font-semibold"
                  >
                    Resend OTP via SMS
                  </button>
                  <button type="button" className="text-slate-600 hover:text-slate-900">
                    Get OTP via Automated Voice Call (व्हॉइस कॉल)
                  </button>
                </div>
              </div>
            )}

            {/* Captcha Verification */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Security Captcha Verification
              </label>
              <div className="flex items-center space-x-3">
                {/* Styled visual captcha */}
                <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 font-mono text-base font-black tracking-widest text-slate-800 select-none flex items-center space-x-2">
                  <span>{captchaCode}</span>
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    className="text-slate-500 hover:text-slate-800 p-1"
                    title="Refresh Captcha"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Captcha Input */}
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="TYPE LETTERS ABOVE (उदा. 7NX0K)"
                  className="flex-1 py-2.5 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium uppercase tracking-wider focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-start space-x-2 pt-1">
              <input
                id="rememberDevice"
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="rememberDevice" className="text-xs text-slate-600 leading-snug">
                Remember this device for 30 days on personal smartphone.{' '}
                <strong className="text-slate-800 font-semibold">(Do not select at public CSC / Cyber Cafes)</strong>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Sign In to GramSathi Citizen Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* First Time Citizen User Promo Card */}
            <div className="pt-4 border-t border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center mb-3">
                First Time Citizen User?
              </div>
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">New to GramSathi AI?</div>
                    <div className="text-slate-600">Link your ration card & register family profile in 3 minutes</div>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="shrink-0 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </form>

        </div>
      </main>

      {/* 5. Comprehensive Government Civic Footer */}
      <footer className="bg-[#0f274a] text-white pt-10 pb-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-blue-900/50">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-lg font-black tracking-tight text-white">GramSathi AI</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                An automated civic enablement initiative by Rural Development Department, Government of Maharashtra. Delivering direct welfare delivery, 7/12 extracts, and digital certificates to rural households.
              </p>
              <div className="text-[11px] text-emerald-300 font-semibold">
                ✓ ISO 27001 Certified & UMANG Compliant
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3">
                National Portals
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">MahaDBT Portal ↗</a></li>
                <li><a href="https://www.myscheme.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">myScheme Platform ↗</a></li>
                <li><a href="https://dbtbharat.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">DBT Bharat ↗</a></li>
                <li><a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Digital India Initiatives ↗</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3">
                Citizen Assistance
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>Toll-Free (24x7): <strong className="text-white">1800-123-GRAM</strong></li>
                <li>Land Record Helpdesk: <strong className="text-white">1800-233-1022</strong></li>
                <li>Email: <span className="text-slate-300">support.gramsathi@maharashtra.gov.in</span></li>
                <li>District Help Centres: All 36 Zilla Parishads</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3">
                Legal & Accessibility
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#terms" className="hover:text-white">Terms of Public Access</a></li>
                <li><a href="#privacy" className="hover:text-white">Data Privacy & Consent Policy</a></li>
                <li><a href="#hyperlink" className="hover:text-white">Hyperlinking Policy</a></li>
                <li><a href="#screen-reader" className="hover:text-white">Screen Reader Access Guidelines</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
            <div>
              © 2025 Rural Development Department, Government of Maharashtra. Content owned and maintained by State Digital Transformation Cell.
            </div>
            <div className="flex items-center space-x-3">
              <span>🛡 MeitY Guidelines</span>
              <span>•</span>
              <span>🔒 STQC Assured</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SignInPage;
