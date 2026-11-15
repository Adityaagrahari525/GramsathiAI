import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  PhoneCall,
  User,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Clock,
  Sparkles,
  CreditCard,
  FileText,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { TopBar } from '../components/TopBar';

export function RegisterPage() {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<'en' | 'mr' | 'hi'>('mr');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  // Stepper state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('Ramesh Tukaram Patil (रमेश तुकाराम पाटील)');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('1984-06-15');
  const [mobile, setMobile] = useState('9876543210');
  const [aadhaar, setAadhaar] = useState('XXXX XXXX 1234');
  const [commLang, setCommLang] = useState<'mr' | 'hi' | 'en'>('mr');

  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Baramati');
  const [panchayat, setPanchayat] = useState('Malegaon Budruk (माळेगाव बुद्रुक)');
  const [pinCode, setPinCode] = useState('413115');

  const [socialCategory, setSocialCategory] = useState('OBC');
  const [occupation, setOccupation] = useState('Farmer');
  const [landholding, setLandholding] = useState('marginal');
  const [rationCard, setRationCard] = useState('orange');
  const [dbtLinked, setDbtLinked] = useState<'yes' | 'pending'>('yes');

  const [consentAadhaar, setConsentAadhaar] = useState(true);
  const [consentDeclaration, setConsentDeclaration] = useState(true);

  const [otpSent, setOtpSent] = useState(false);

  const talukasByDistrict: Record<string, string[]> = {
    Pune: ['Baramati', 'Haveli', 'Daund', 'Indapur', 'Shirur', 'Junner', 'Khed', 'Maval'],
    Satara: ['Karad', 'Wai', 'Phaltan', 'Koregaon', 'Mahabaleshwar', 'Patan'],
    Nashik: ['Niphad', 'Sinnar', 'Yeola', 'Dindori', 'Malegaon', 'Baglan'],
    Ahmednagar: ['Rahata', 'Sangamner', 'Shrirampur', 'Kopargaon', 'Newasa', 'Parner'],
    Kolhapur: ['Karvir', 'Hatkanangle', 'Shirol', 'Radhanagari', 'Panhala'],
  };

  const handleAudioGuide = () => {
    if ('speechSynthesis' in window) {
      const text =
        "नागरिक नोंदणी फॉर्म: कृपया आपले संपूर्ण नाव, आधार क्रमांक, गावाचा पत्ता आणि शेती तपशील भरा. यामुळे आपणास ६५० हून अधिक शासकीय योजनांचा लाभ थेट मिळेल.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'mr-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('नोंदणी यशस्वी झाली! आपले ग्रामसाथी डिजिटल ओळखपत्र तयार झाले आहे.');
    navigate('/schemes');
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
            Home / Citizen Registration / <strong className="text-slate-800">Create Digital Citizen Identity (नागरिक ओळख)</strong>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aadhaar e-KYC Compliant (UIDAI Standard)</span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Banner Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>New Citizen Registration</span>
                  <span className="text-sm font-bold text-slate-500">(नागरिक नोंदणी)</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Create your unified civic profile once to access 650+ Maharashtra & Central government schemes without repeating document verification.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 bg-blue-50/70 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-900 shrink-0">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Estimated Completion: <strong>2-3 Minutes</strong></span>
            </div>
          </div>

          {/* 3-Step Wizard Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setCurrentStep(1)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                currentStep === 1
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                currentStep === 1 ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                1
              </div>
              <div className="text-xs">
                <div className={`font-bold ${currentStep === 1 ? 'text-white' : 'text-slate-900'}`}>
                  पायरी १ / Step 1 {currentStep === 1 ? '(Active)' : ''}
                </div>
                <div className={currentStep === 1 ? 'text-blue-100' : 'text-slate-500'}>
                  Personal & Identity Verification
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                currentStep === 2
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                currentStep === 2 ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                2
              </div>
              <div className="text-xs">
                <div className={`font-bold ${currentStep === 2 ? 'text-white' : 'text-slate-900'}`}>
                  पायरी २ / Step 2 {currentStep === 2 ? '(Active)' : ''}
                </div>
                <div className={currentStep === 2 ? 'text-blue-100' : 'text-slate-500'}>
                  Rural Location & Panchayat
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                currentStep === 3
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                3
              </div>
              <div className="text-xs">
                <div className={`font-bold ${currentStep === 3 ? 'text-white' : 'text-slate-900'}`}>
                  पायरी ३ / Step 3 {currentStep === 3 ? '(Active)' : ''}
                </div>
                <div className={currentStep === 3 ? 'text-blue-100' : 'text-slate-500'}>
                  Landholding & Category
                </div>
              </div>
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column - Form Content (8 cols) */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">

              {/* SECTION 1: Basic Identity & Contact */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Section 1: Basic Identity & Contact
                      </h2>
                      <p className="text-xs text-slate-500">व्यक्तिगत माहिती व संपर्क तपशील</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAudioGuide}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Audio Guide</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Full Name (पूर्ण नाव) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-500">As printed on Aadhaar / आधार कार्डानुसार</span>
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Tukaram Patil (रमेश तुकाराम पाटील)"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Gender & DOB */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Gender (लिंग) <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['male', 'female', 'other'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                              gender === g
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {g === 'male' ? 'Male (पुरुष)' : g === 'female' ? 'Female (स्त्री)' : 'Other (इतर)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Date of Birth (जन्मतारीख) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile & Aadhaar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-800">
                          Mobile Number (नोंदणीकृत मोबाईल) <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-slate-500">Linked with Sim</span>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-slate-200 text-slate-700 px-3 py-2 text-xs font-bold rounded-l-xl border border-r-0 border-slate-300">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          maxLength={10}
                          className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-300 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setOtpSent(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs font-bold rounded-r-xl transition-colors whitespace-nowrap"
                        >
                          {otpSent ? 'OTP Sent' : 'Get OTP'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Aadhaar Number (आधार क्रमांक) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={aadhaar}
                          onChange={(e) => setAadhaar(e.target.value)}
                          maxLength={14}
                          className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Masked UIDAI-compliant e-KYC. Your Aadhaar is never shared publicly.
                      </p>
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Preferred Communication Medium & Language (संभाषणाची भाषा)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setCommLang('mr')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                          commLang === 'mr'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${commLang === 'mr' ? 'opacity-100' : 'opacity-0'}`} />
                        <span>मराठी (Default)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCommLang('hi')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                          commLang === 'hi'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${commLang === 'hi' ? 'opacity-100' : 'opacity-0'}`} />
                        <span>हिंदी (Hindi)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCommLang('en')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                          commLang === 'en'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${commLang === 'en' ? 'opacity-100' : 'opacity-0'}`} />
                        <span>English (Indian)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Village & Geographic Details */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Section 2: Village & Geographic Details
                      </h2>
                      <p className="text-xs text-slate-500">स्थानिक ग्रामपंचायत व भौगोलिक माहिती</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Zilla Parishad Mapping
                  </span>
                </div>

                <div className="space-y-4">
                  {/* District & Taluka */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        District (जिल्हा) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          setTaluka(talukasByDistrict[e.target.value]?.[0] || '');
                        }}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {Object.keys(talukasByDistrict).map((d) => (
                          <option key={d} value={d}>
                            {d} ({d === 'Pune' ? 'पुणे' : d === 'Satara' ? 'सातारा' : d === 'Nashik' ? 'नाशिक' : d === 'Ahmednagar' ? 'अहमदनगर' : 'कोल्हापूर'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Taluka (तालुका) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={taluka}
                        onChange={(e) => setTaluka(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {(talukasByDistrict[district] || []).map((t) => (
                          <option key={t} value={t}>
                            {t} ({t === 'Baramati' ? 'बारामती' : t})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Gram Panchayat & PIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Gram Panchayat / Village Name (गाव / ग्रामपंचायत) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={panchayat}
                        onChange={(e) => setPanchayat(e.target.value)}
                        placeholder="e.g. Malegaon Budruk (माळेगाव बुद्रुक)"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        PIN Code (पिन कोड) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        maxLength={6}
                        placeholder="413115"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Routing Callout */}
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 flex items-start space-x-2.5 text-xs text-blue-950">
                    <Building2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      GramSathi AI automatically routes your profile to your local <strong>Gram Sevak (ग्रामसेवक)</strong> and <strong>Talathi (तलाठी)</strong> office for fast-track local certification without in-person queuing.
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Socio-Economic & Farmer Profile */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Section 3: Socio-Economic & Farmer Profile
                      </h2>
                      <p className="text-xs text-slate-500">शेतकरी वर्गवारी, सामाजिक गट व अनुदान पात्रता</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    DBT Status: Eligible
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Category & Occupation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Social Category (सामाजिक प्रवर्ग) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={socialCategory}
                        onChange={(e) => setSocialCategory(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="OBC">OBC (इतर मागासवर्गीय)</option>
                        <option value="General">General / Open (खुला प्रवर्ग)</option>
                        <option value="SC">Scheduled Caste / SC (अनुसूचित जाती)</option>
                        <option value="ST">Scheduled Tribe / ST (अनुसूचित जमाती)</option>
                        <option value="VJNT">VJNT / NT (विमुक्त जाती व भटक्या जमाती)</option>
                        <option value="EWS">EWS (आर्थिक दुर्बल घटक)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Primary Occupation (मुख्य व्यवसाय) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Farmer">Farmer / Shetkari (शेतकरी)</option>
                        <option value="Laborer">Agricultural Laborer (कृषी मजूर)</option>
                        <option value="Artisan">Artisan / Karigar (कारागीर)</option>
                        <option value="Enterprise">Micro-Enterprise / Shopkeeper (लघु व्यावसायिक)</option>
                        <option value="Student">Student / Youth (विद्यार्थी / तरुण)</option>
                        <option value="SHG">Self Help Group Member (बचत गट सदस्य)</option>
                      </select>
                    </div>
                  </div>

                  {/* Landholding & Ration Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Agricultural Landholding (शेतीची धारणा क्षमता) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={landholding}
                        onChange={(e) => setLandholding(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="marginal">Marginal / अल्पभूधारक (&lt; 1 हेक्टर / 2.5 एकर)</option>
                        <option value="small">Small / लहान शेतकरी (1 ते 2 हेक्टर / 2.5 ते 5 एकर)</option>
                        <option value="medium">Medium / मध्यम (2 ते 5 हेक्टर)</option>
                        <option value="large">Large / मोठे शेतकरी (&gt; 5 हेक्टर)</option>
                        <option value="landless">Landless / भूमिहीन</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Ration Card Type (रेशन कार्ड प्रकार) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={rationCard}
                        onChange={(e) => setRationCard(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="orange">Saffron / Orange (केशरी रेशन कार्ड)</option>
                        <option value="yellow">Yellow / BPL / Antyodaya (पिवळे रेशन कार्ड)</option>
                        <option value="white">White / APL (पांढरे रेशन कार्ड)</option>
                      </select>
                    </div>
                  </div>

                  {/* Aadhaar Seeded Bank Account */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Aadhaar Seeded Bank Account (DBT Enablement)
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Direct benefit transfer goes directly into this bank account
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs font-semibold">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="dbt"
                            checked={dbtLinked === 'yes'}
                            onChange={() => setDbtLinked('yes')}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span>Yes, Linked (जोडलेले आहे)</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="dbt"
                            checked={dbtLinked === 'pending'}
                            onChange={() => setDbtLinked('pending')}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span>Pending (प्रलंबित)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MANDATORY CONSENT & DECLARATION */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Mandatory Consent & Declarations (कायदेशीर संमती व हमी)
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={consentAadhaar}
                      onChange={(e) => setConsentAadhaar(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      required
                    />
                    <span>
                      I voluntarily give my explicit consent to verify my identity and authenticate my record with UIDAI e-KYC and Maharashtra State Resident Data Hub (MSRDH) for scheme eligibility evaluation.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={consentDeclaration}
                      onChange={(e) => setConsentDeclaration(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      required
                    />
                    <span>
                      I solemnly affirm that the information submitted above is true and complete to the best of my knowledge under the Maharashtra Public Records Act.
                    </span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                  >
                    <span>Complete Registration & Unlock Schemes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </form>

            {/* Right Column - Sidebar Guides & Help (4 cols) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Card 1: Why Register on GramSathi? */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
                <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Why Register on GramSathi?</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  One single verification unlocks Maharashtra's comprehensive social welfare ecosystem without repeat trips.
                </p>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-bold block">20-Second Scheme Matching</strong>
                      <span className="text-slate-600">
                        Instant algorithm cross-matches 650+ state & central agricultural and social welfare grants.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-bold block">Direct DBT Transfers</strong>
                      <span className="text-slate-600">
                        Subsidies directly credited to Aadhaar-seeded accounts with zero middleman deduction.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-bold block">Auto-Filled Applications</strong>
                      <span className="text-slate-600">
                        Apply for MahaDBT, PM-KUSUM, and Namo Shetkari Mahasanman Nidhi in one tap.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-bold block">Zero Intermediary Fees</strong>
                      <span className="text-slate-600">
                        100% free citizen portal managed directly by Rural Development Dept, Govt. of Maharashtra.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Required Documents */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
                <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Required Documents</span>
                </div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Keep these handy during verification (no upload needed right now, verified via UIDAI e-KYC):
                </p>

                <ul className="space-y-2 text-xs text-slate-700 mb-4">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aadhaar Card with linked phone (आधार कार्ड)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ration Card (रेशनपत्रिका)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digital 7/12 & 8A Extract (if farmer)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bank Passbook / IFSC code for DBT</span>
                  </li>
                </ul>

                {/* Village Verification Photo */}
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-3 text-center">
                  <div className="text-[11px] font-semibold text-slate-600">
                    🏛 Village Verification & Biometric Support
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Available at your local Gram Panchayat office
                  </div>
                </div>
              </div>

              {/* Card 3: Need Offline Help? */}
              <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-5 md:p-6">
                <div className="flex items-center space-x-2 font-bold text-blue-950 text-sm mb-2">
                  <HelpCircle className="w-4 h-4 text-blue-700" />
                  <span>Need Offline Help?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  You can visit your nearest <strong>Aaple Sarkar Seva Kendra (आपले सरकार केंद्र)</strong> or Village CSC Operator for free guided registration.
                </p>

                <div className="pt-3 border-t border-blue-200/60">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Toll-Free Kisan & Citizen Support
                  </div>
                  <div className="text-base font-black text-blue-950 mt-0.5 flex items-center space-x-1">
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <span>1800-123-GRAM</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Active 24x7 across all 36 Districts of Maharashtra
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* 5. Civic Footer */}
      <footer className="bg-[#0f274a] text-white pt-10 pb-6 border-t border-slate-800 text-xs mt-12">
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

export default RegisterPage;
