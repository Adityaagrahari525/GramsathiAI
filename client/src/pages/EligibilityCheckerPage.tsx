import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function EligibilityCheckerPage() {
  const navigate = useNavigate();

  // Wizard Step (1 to 4) - Default is Step 3 matching the Stitch design
  const [currentStep, setCurrentStep] = useState<number>(3);

  // Form Profile State
  const [profile, setProfile] = useState({
    name: 'Ramesh Dattatray Gaikwad',
    nameMr: 'रमेश दत्तात्रय गायकवाड',
    gender: 'Male',
    age: 44,
    occupation: 'Small Farmer',
    landholding: '2.50 Acres (1.01 Hectare)',
    landCategory: 'Small Farmer (2.5 A...)',
    socialCategory: 'OBC (Non-Creamy)',
    waterSource: 'Perennial Dug Well',
    incomeSlab: 'upto_120k', // upto_120k, 120k_250k, 250k_800k, above_800k
    district: 'Baramati, Pune',
    pincode: '413102',
    hasElectricPump: false,
    hasJointHolding: true
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioSpeech = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }
    if ('speechSynthesis' in window) {
      const text =
        "Step 3: Household Income and Economic Criteria. " +
        "What is your total annual household income from all sources? " +
        "Option 1: Up to 1 lakh 20 thousand rupees per year. " +
        "Option 2: 1 lakh 20 thousand to 2 lakh 50 thousand rupees. " +
        "Option 3: 2 lakh 50 thousand to 8 lakh rupees. " +
        "Option 4: Above 8 lakh rupees per year.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      navigate('/eligibility/results');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* ── 1. Top Civic Government Ribbon ── */}
      <div className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-2.5 rounded-xs bg-linear-to-b from-orange-500 via-white to-green-600 border border-slate-300 inline-block shrink-0" />
            <span className="font-semibold text-slate-800">महाराष्ट्र शासन</span>
            <span className="text-slate-400">|</span>
            <span className="font-medium text-slate-700 truncate">Government of Maharashtra</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <div className="hidden sm:flex items-center space-x-1 text-slate-500">
              <button className="px-1 hover:text-slate-900 font-semibold">A-</button>
              <button className="px-1 hover:text-slate-900 font-bold">A</button>
              <button className="px-1 hover:text-slate-900 font-extrabold">A+</button>
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline hover:underline cursor-pointer">Screen Reader</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="flex items-center space-x-1.5 font-semibold">
              <span className="bg-blue-700 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">मराठी</span>
              <span className="text-slate-600 hover:text-blue-700 cursor-pointer text-xs">हिंदी</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600 hover:text-blue-700 cursor-pointer text-xs">English</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Civic Navbar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f3675] to-[#1850b5] flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-blue-900/10">
                GS
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold tracking-tight text-[#0f3675]">GramSathi</span>
                  <span className="text-2xl font-extrabold text-[#1850b5]">.AI</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                  सरकारी AI नागरिक मदतनीस
                </div>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
              <button onClick={() => navigate('/')} className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Home
              </button>
              <button onClick={() => navigate('/schemes')} className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Explore Schemes
              </button>
              <button onClick={() => navigate('/')} className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                AI Citizen Assistant
              </button>
              <button onClick={() => navigate('/eligibility')} className="px-3.5 py-2 text-[#1850b5] font-semibold bg-blue-50/90 rounded-lg">
                Eligibility Tool
              </button>
              <button onClick={() => navigate('/')} className="px-3.5 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Grievance Helpdesk
              </button>
            </nav>

            {/* Helpline & Login */}
            <div className="flex items-center space-x-4">
              <div className="hidden xl:flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span>📞</span>
                <span>1800-120-GRAM</span>
              </div>
              <button
                onClick={() => navigate('/signin')}
                className="flex items-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                <span>👤 Citizen Login</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── 3. Page Header: Title & Subtitle ── */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scheme Eligibility Checker <span className="text-[#1850b5]">(पात्रता पडताळणी साधन)</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 max-w-4xl leading-relaxed font-medium">
            Answer 4 simple questions to instantly find which Maharashtra & Central government welfare schemes and subsidies you qualify for. No documents or login required for checking.
          </p>

          {/* ── Progress Tracker Box ── */}
          <div className="mt-6 bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#1850b5] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  STEP {currentStep} OF 4
                </span>
                <span className="text-slate-800 text-xs sm:text-sm">
                  {currentStep === 1 && 'Citizen Profile & Primary Demographics (नागरिक प्राथमिक माहिती)'}
                  {currentStep === 2 && 'Landholding, Occupation & Irrigation (जमीन, व्यवसाय व पाणी साठा)'}
                  {currentStep === 3 && 'Household Income & Economic Criteria (कुटुंबाचे वार्षिक उत्पन्न)'}
                  {currentStep === 4 && 'Special Category Safeguards & Review (विशेष प्रवर्ग व अंतिम पडताळणी)'}
                </span>
              </div>
              <span className="text-[#1850b5] font-extrabold text-xs sm:text-sm">
                {currentStep === 1 ? '25% Completed' : currentStep === 2 ? '50% Completed' : currentStep === 3 ? '75% Completed' : '100% Completed'}
              </span>
            </div>

            {/* Progress Bar Line */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-[#1850b5] h-full transition-all duration-300 rounded-full"
                style={{ width: `${currentStep * 25}%` }}
              />
            </div>

            {/* 4 Step Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              {/* Step 1 */}
              <div
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  currentStep === 1
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                    : currentStep > 1
                    ? 'bg-white border-slate-200 text-slate-700 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep > 1 ? 'bg-blue-600 text-white' : currentStep === 1 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </span>
                <div>
                  <div className="font-bold text-[11px] leading-tight">1. Citizen Profile</div>
                  <div className="text-[10px] text-slate-400">{currentStep > 1 ? 'Completed' : 'Active'}</div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => setCurrentStep(2)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  currentStep === 2
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                    : currentStep > 2
                    ? 'bg-white border-slate-200 text-slate-700 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep > 2 ? 'bg-blue-600 text-white' : currentStep === 2 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </span>
                <div>
                  <div className="font-bold text-[11px] leading-tight">2. Land & Occupation</div>
                  <div className="text-[10px] text-slate-400">{currentStep > 2 ? 'Completed' : currentStep === 2 ? 'Active Step' : 'Upcoming'}</div>
                </div>
              </div>

              {/* Step 3 */}
              <div
                onClick={() => setCurrentStep(3)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  currentStep === 3
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                    : currentStep > 3
                    ? 'bg-white border-slate-200 text-slate-700 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep > 3 ? 'bg-blue-600 text-white' : currentStep === 3 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </span>
                <div>
                  <div className="font-bold text-[11px] leading-tight">3. Annual Income</div>
                  <div className="text-[10px] text-slate-400">{currentStep === 3 ? 'Active Step' : currentStep > 3 ? 'Completed' : 'Upcoming'}</div>
                </div>
              </div>

              {/* Step 4 */}
              <div
                onClick={() => setCurrentStep(4)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  currentStep === 4
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 4 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  4
                </span>
                <div>
                  <div className="font-bold text-[11px] leading-tight">4. Special Categories</div>
                  <div className="text-[10px] text-slate-400">{currentStep === 4 ? 'Active Step' : 'Next Step'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Main Two-Column Wizard Layout ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left Column: Active Step Questions Card ── */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">

            {/* ── STEP 3: Household Income & Economic Criteria (Design Match) ── */}
            {currentStep === 3 && (
              <div>
                {/* Header Tag & Speak Button */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold text-[#1850b5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    INCOME & ECONOMIC GROUP
                  </span>
                  <button
                    onClick={handleAudioSpeech}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1850b5] hover:text-[#0f3675] bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                  >
                    <span>🔊</span>
                    <span>{isPlayingAudio ? 'थांबवा (Stop)' : 'बोलून सांगा (Speak)'}</span>
                  </button>
                </div>

                {/* Big Question */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  What is your total annual household income from all sources?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-medium">
                  Includes total combined income of all family members from farming, daily farm labor wages, milk dairy, or village micro-enterprises.
                </p>

                {/* 4 Interactive Option Cards */}
                <div className="space-y-3.5 mt-6">

                  {/* Option 1: Up to ₹1,20,000 per year (Selected in Stitch) */}
                  <div
                    onClick={() => setProfile(prev => ({ ...prev, incomeSlab: 'upto_120k' }))}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      profile.incomeSlab === 'upto_120k'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          profile.incomeSlab === 'upto_120k' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}>
                          {profile.incomeSlab === 'upto_120k' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-base font-bold text-slate-900">Up to ₹1,20,000 per year</div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            Below Poverty Line (BPL) / Priority Household Ration Card (पिवळे / अंत्योदय / केशरी शिधापत्रिका). Qualifies for maximum 90%-100% financial assistance.
                          </p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        profile.incomeSlab === 'upto_120k'
                          ? 'bg-[#1850b5] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {profile.incomeSlab === 'upto_120k' ? 'Selected' : 'BPL / AAY'}
                      </span>
                    </div>
                  </div>

                  {/* Option 2: ₹1,20,000 to ₹2,50,000 per year */}
                  <div
                    onClick={() => setProfile(prev => ({ ...prev, incomeSlab: '120k_250k' }))}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      profile.incomeSlab === '120k_250k'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          profile.incomeSlab === '120k_250k' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}>
                          {profile.incomeSlab === '120k_250k' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-base font-bold text-slate-900">₹1,20,000 to ₹2,50,000 per year</div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            Economically Weaker Section (EWS) & Small Landholder Category (अल्प व अत्यल्प भूधारक). Eligible for Majhi Ladki Bahin, DBT kits, and PM-KUSUM grants.
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        Yellow / Kesari
                      </span>
                    </div>
                  </div>

                  {/* Option 3: ₹2,50,000 to ₹8,00,000 per year */}
                  <div
                    onClick={() => setProfile(prev => ({ ...prev, incomeSlab: '250k_800k' }))}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      profile.incomeSlab === '250k_800k'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          profile.incomeSlab === '250k_800k' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}>
                          {profile.incomeSlab === '250k_800k' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-base font-bold text-slate-900">₹2,50,000 to ₹8,00,000 per year</div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            Non-Creamy Layer OBC, SEBC, VJNT, Open Ews Category with valid income certificate. Standard 50% to 75% machinery and solar subsidy tier.
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        NCL-OBC / SEBC
                      </span>
                    </div>
                  </div>

                  {/* Option 4: Above ₹8,00,000 per year */}
                  <div
                    onClick={() => setProfile(prev => ({ ...prev, incomeSlab: 'above_800k' }))}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      profile.incomeSlab === 'above_800k'
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          profile.incomeSlab === 'above_800k' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}>
                          {profile.incomeSlab === 'above_800k' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-base font-bold text-slate-900">Above ₹8,00,000 per year</div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            General category without income-ceiling exemptions. Eligible for grid-interactive net metering, infrastructure loans, and agricultural credit schemes.
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        General Non-Subsidy
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                  >
                    <span>←</span>
                    <span>Back (मागील पायरी)</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-7 py-3 bg-[#1850b5] hover:bg-[#0f3675] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-[0.98]"
                  >
                    <span>Continue to Step 4</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: Citizen Profile (Fallback view) ── */}
            {currentStep === 1 && (
              <div>
                <span className="text-[11px] font-extrabold text-[#1850b5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                  STEP 1: PRIMARY DEMOGRAPHICS
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mt-3">
                  Confirm Citizen Name, Age & District
                </h2>
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Full Name (संपूर्ण नाव)</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full mt-1.5 p-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Age (वय)</label>
                      <input
                        type="number"
                        value={profile.age}
                        onChange={e => setProfile(prev => ({ ...prev, age: Number(e.target.value) }))}
                        className="w-full mt-1.5 p-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">District (जिल्हा)</label>
                      <input
                        type="text"
                        value={profile.district}
                        onChange={e => setProfile(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full mt-1.5 p-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button onClick={handleNextStep} className="px-7 py-3 bg-[#1850b5] text-white font-bold text-sm rounded-xl">
                    Continue to Step 2 →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Land & Occupation ── */}
            {currentStep === 2 && (
              <div>
                <span className="text-[11px] font-extrabold text-[#1850b5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                  STEP 2: LAND & OCCUPATION
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mt-3">
                  What is your primary occupation & agricultural landholding?
                </h2>
                <div className="space-y-3 mt-6">
                  {['Marginal Landholder (< 2.5 Acres)', 'Small Farmer (2.5 to 5.0 Acres)', 'Large Farmer (> 5 Acres)', 'Landless Rural Artisan / Labour'].map(opt => (
                    <div
                      key={opt}
                      onClick={() => setProfile(prev => ({ ...prev, occupation: opt }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer font-bold text-sm ${
                        profile.occupation === opt ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={handlePrevStep} className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm">← Back</button>
                  <button onClick={handleNextStep} className="px-7 py-3 bg-[#1850b5] text-white font-bold text-sm rounded-xl">Continue to Step 3 →</button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Special Categories & Finalization ── */}
            {currentStep === 4 && (
              <div>
                <span className="text-[11px] font-extrabold text-[#1850b5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                  STEP 4: SPECIAL CATEGORY & REVIEW
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mt-3">
                  Any special category benefits or joint titles?
                </h2>
                <div className="space-y-4 mt-6">
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.hasJointHolding}
                      onChange={e => setProfile(prev => ({ ...prev, hasJointHolding: e.target.checked }))}
                      className="w-5 h-5 rounded text-[#1850b5]"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-800">Joint Land Title / Samayik Khathedar (समाईक ७/१२ खातेदार)</div>
                      <div className="text-xs text-slate-500">Requires standard No-Objection Consent from co-owners before grant survey.</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.hasElectricPump}
                      onChange={e => setProfile(prev => ({ ...prev, hasElectricPump: e.target.checked }))}
                      className="w-5 h-5 rounded text-[#1850b5]"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-800">Existing Operational Electric Agricultural Pump (विद्युत कृषी पंप)</div>
                      <div className="text-xs text-slate-500">Solar subsidies require non-electrified agricultural survey plots.</div>
                    </div>
                  </label>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={handlePrevStep} className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm">← Back</button>
                  <button
                    onClick={() => navigate('/eligibility/results')}
                    className="px-7 py-3 bg-[#1850b5] hover:bg-[#0f3675] text-white font-bold text-sm rounded-xl shadow-xs"
                  >
                    View Official Results (पात्रता निकाल पहा) →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: "Active Profile" Summary Card ── */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span>📋</span>
                <span>Active Profile</span>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold text-[#1850b5] hover:underline flex items-center gap-1"
              >
                <span>✎</span>
                <span>Edit</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 mb-4 leading-relaxed">
              Verified answers recorded for instant scheme calculation:
            </p>

            {/* Profile Tiles List */}
            <div className="space-y-3">
              {/* Tile 1 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                  🚜
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Occupation & Land Size</div>
                  <div className="text-xs font-bold text-slate-800 truncate">{profile.landCategory}</div>
                </div>
              </div>

              {/* Tile 2 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                  👥
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Social Category (जात)</div>
                  <div className="text-xs font-bold text-slate-800 truncate">{profile.socialCategory}</div>
                </div>
              </div>

              {/* Tile 3 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                  💧
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Water & Irrigation</div>
                  <div className="text-xs font-bold text-slate-800 truncate">{profile.waterSource}</div>
                </div>
              </div>

              {/* Tile 4 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                  ₹
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Income Slab (Step 3)</div>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {profile.incomeSlab === 'upto_120k' ? 'Under ₹1.20 Lakh' : profile.incomeSlab === '120k_250k' ? '₹1.20L - ₹2.50L' : 'Above ₹2.50 Lakh'}
                  </div>
                </div>
              </div>

              {/* Tile 5 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                  📍
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">District / Region</div>
                  <div className="text-xs font-bold text-slate-800 truncate">{profile.district}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Bottom Live Section: Instant Scheme Matching & Evaluation Results ── */}
        <section className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-block bg-[#1850b5] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2">
                REAL-TIME EVALUATION
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Instant Scheme Matching & Evaluation Results
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Simulated results based directly on verified government resolution criteria for your selected profile.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Showing 2 evaluated schemes</span>
            </div>
          </div>

          <div className="space-y-5">
            {/* ── Match Card 1: 100% Eligible (Mukhyamantri Saur Krushi Vahini) ── */}
            <article className="bg-white rounded-2xl border-2 border-blue-500/80 shadow-xs overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-semibold text-slate-500">
                    Department: Department of Energy & MEDA - Govt of Maharashtra
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-0.5 rounded-full text-xs font-bold self-start sm:self-auto">
                    <span>✓</span>
                    <span>Potentially Eligible (100% Match)</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  Mukhyamantri Saur Krushi Vahini Yojana 2.0 (मुख्यमंत्री सौर कृषी वाहिनी योजना 2.0)
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  High capacity standalone off-grid Solar Agricultural Water Pump (3 HP / 5 HP) for un-electrified farmlands.
                </p>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Govt Subsidy Assistance</div>
                    <div className="text-xl font-extrabold text-[#1850b5]">90% Govt Subsidy</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Estimated Farmer Contribution</div>
                    <div className="text-xl font-extrabold text-slate-900">₹22,400 <span className="text-xs font-normal text-slate-500">(3 HP DC Pump)</span></div>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Application Status</div>
                    <div className="text-xl font-extrabold text-emerald-800">Open Active (Phase 2)</div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500 font-medium flex items-center gap-1.5">
                    <span>📄</span>
                    <span>Required: 7/12 Extract, 8-A Extract, Aadhaar, Bank Passbook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/schemes/saur-krushi-vahini')}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors"
                    >
                      View Guidelines
                    </button>
                    <button
                      onClick={() => navigate('/eligibility/results')}
                      className="px-5 py-2 bg-[#1850b5] hover:bg-[#0f3675] text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Apply via Mahavitaran ↗
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* ── Match Card 2: More Info Required (Dr. Ambedkar Krishi Swavalamban) ── */}
            <article className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-semibold text-slate-500">
                    Department: Department of Agriculture, Maharashtra
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-0.5 rounded-full text-xs font-bold self-start sm:self-auto">
                    <span>⚠</span>
                    <span>More Info Required (Partial Match)</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana (नवीन विहीर व ठिबक सिंचन अनुदान)
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Financial assistance for construction of new irrigation wells, in-well boring, and micro-drip systems up to ₹4,00,000.
                </p>

                {/* 2-Column Comparison Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-5">
                  {/* Left: Criteria Matched */}
                  <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
                      <span>✓</span>
                      <span>Criteria Matched</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>Permanent resident of Maharashtra with documented rural landholding.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>Landholding is below 6.0 hectares (Applicant holds 2.5 acres).</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right: Caste Verification Needed */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
                      <span>⚠</span>
                      <span>Caste Category Verification Needed</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      This specific welfare grant is legislatively reserved for Scheduled Caste (SC) or Neo-Buddhist farmers. Your preliminary profile indicates OBC.
                    </p>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500 font-medium flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Submit caste verification or explore general irrigation schemes.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/schemes')}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors"
                    >
                      See General Schemes
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-5 py-2 bg-[#0f3675] hover:bg-[#1850b5] text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Provide Additional Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* ── 6. Civic Footer ── */}
      <footer className="bg-[#0f3675] text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-blue-900 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <div>
            <div className="text-base font-bold text-white mb-1">GramSathi AI — Public Civic Service Platform</div>
            <div>Demystifying government schemes for every citizen of Maharashtra. Official civic guidance portal.</div>
          </div>
          <div className="text-right space-y-1">
            <div>Toll Free Helpline: <strong className="text-white">1800-120-8040</strong> | Citizen Portal: <strong className="text-white">14555</strong></div>
            <div className="text-blue-300">© 2026 GramSathi AI. Aligned with Aaple Sarkar & National Portal of India.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EligibilityCheckerPage;
