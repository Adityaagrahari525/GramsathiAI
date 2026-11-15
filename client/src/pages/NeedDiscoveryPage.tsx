import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function NeedDiscoveryPage() {
  const navigate = useNavigate();

  // Active need category (default: 'farming')
  const [selectedNeed, setSelectedNeed] = useState<string>('farming');

  // Sub-filter pill (default: 'solar')
  const [activeSubFilter, setActiveSubFilter] = useState<string>('solar');

  // Eligible only toggle
  const [eligibleOnly, setEligibleOnly] = useState<boolean>(true);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleVoiceSearch = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }
    if ('speechSynthesis' in window) {
      const text =
        "Voice Search activated. Please describe your civic need in Marathi, Hindi, or English. " +
        "For example, say: I need a solar agriculture water pump, or I need crop insurance for drought.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* ── 1. Top Civic Header Ribbon ── */}
      <div className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-2.5 rounded-xs bg-linear-to-b from-orange-500 via-white to-green-600 border border-slate-300 inline-block shrink-0" />
            <span className="font-semibold text-slate-800">Government of Maharashtra</span>
            <span className="text-slate-400">|</span>
            <span className="font-medium text-slate-700 truncate">Public Civic Service Portal</span>
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
              <span className="text-slate-600 hover:text-blue-700 cursor-pointer text-xs">मराठी</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 hover:text-blue-700 cursor-pointer text-xs">हिंदी</span>
              <span className="text-slate-300">/</span>
              <span className="bg-[#1850b5] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">English</span>
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
                  GramSathi AI Citizen Portal
                </div>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="hidden xl:flex items-center space-x-1 font-medium text-xs text-slate-700">
              <Link to="/schemes" className="px-3 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Explore Schemes
              </Link>
              <Link to="/schemes?saved=true" className="px-3 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Saved Schemes
              </Link>
              <Link to="/assistant" className="px-3 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                AI Citizen Assistant
              </Link>
              <Link to="/eligibility/results" className="px-3 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Eligibility Results
              </Link>
              <Link to="/needs" className="px-3.5 py-1.5 text-white font-bold bg-[#1850b5] rounded-lg shadow-2xs">
                Scheme Journey & Tracker
              </Link>
              <a href="https://grievances.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="px-3 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Grievance / Helpdesk
              </a>
              <Link to="/profile" className="px-3 py-2 hover:text-[#1850b5] hover:bg-slate-50 rounded-lg transition-colors">
                Citizen Profile
              </Link>
            </nav>

            {/* Helpline & Profile Button */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span>📞</span>
                <span>1800-123-GRAM</span>
              </div>
              <Link to="/profile" className="flex items-center space-x-2 bg-blue-50 text-[#1850b5] border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                <span>👤</span>
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── 3. Breadcrumb & Sync Status ── */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-slate-500 font-medium">
            <span className="hover:text-blue-700 cursor-pointer" onClick={() => navigate('/')}>GramSathi AI</span>
            <span> / </span>
            <span className="hover:text-blue-700 cursor-pointer" onClick={() => navigate('/schemes')}>Direct Benefits & Welfare</span>
            <span> / </span>
            <span className="text-slate-800 font-bold">Citizen Services</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
            <span>Workflow Sync: MahaDBT & PM-Kisan Live</span>
          </div>
        </div>
      </div>

      {/* ── 4. Main Body ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">

        {/* ── 4.1 Page Title & Voice Search Banner ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find Government Support by Your Need
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed font-medium">
              Select what assistance your household needs today. GramSathi AI automatically matches verified subsidies, grants, and civic schemes you qualify for.
            </p>
          </div>

          {/* Voice Search Pill Card */}
          <div
            onClick={handleVoiceSearch}
            className="bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 cursor-pointer transition-all shadow-xs shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1850b5] text-white flex items-center justify-center text-xl shadow-xs">
              🎙
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#0f3675]">
                {isPlayingAudio ? 'Listening... बोलत राहा' : 'Voice Search (बोलून शोधा)'}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Speak in Marathi, Hindi, or English
              </div>
            </div>
          </div>
        </div>

        {/* ── 4.2 Step 1: Choose Your Area of Need (6 Cards) ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Step 1: Choose Your Area of Need
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Select a civic category to see tailored government programs
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
              6 Categories Available
            </span>
          </div>

          {/* 6 Grid Need Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Need Card 1: Farming & Agriculture (Selected) */}
            <div
              onClick={() => setSelectedNeed('farming')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedNeed === 'farming'
                  ? 'border-blue-600 bg-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg">
                    🚜
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedNeed === 'farming' && (
                      <span className="bg-[#1850b5] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      16 Schemes
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">Farming & Agriculture</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Solar pumps, micro-irrigation, seed grants, and machinery subsidies.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#1850b5] flex items-center justify-between">
                <span>16 Active Programs</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 2: Business & Self-Employment */}
            <div
              onClick={() => setSelectedNeed('business')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedNeed === 'business'
                  ? 'border-blue-600 bg-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                    💼
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    8 Schemes
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">Business & Self-Employment</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Mudra loans, PMEGP subsidized credit, and village enterprise grants.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Up to 35% Subsidy</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 3: Education & Scholarships */}
            <div
              onClick={() => setSelectedNeed('education')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedNeed === 'education'
                  ? 'border-blue-600 bg-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                    🎓
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    11 Schemes
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">Education & Scholarships</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Fee waivers, Swadhar hostel aid, and ITI training stipends.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Full Fee Reimbursements</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 4: Employment & Training */}
            <div
              onClick={() => setSelectedNeed('employment')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedNeed === 'employment'
                  ? 'border-blue-600 bg-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                    👷
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    6 Schemes
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">Employment & Training</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  MGNREGA wage employment and Yuva apprentice monthly stipends.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Guaranteed Work & Stipend</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 5: Women & Child Welfare */}
            <div
              onClick={() => setSelectedNeed('women')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedNeed === 'women'
                  ? 'border-blue-600 bg-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                    👩‍👧
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    9 Schemes
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">Women & Child Welfare</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Ladki Bahin direct monthly benefit, SHG loans, and maternal aid.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>₹1,500/month Direct Grant</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 6: Pensions & Housing Aid */}
            <div
              onClick={() => setSelectedNeed('pensions')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedNeed === 'pensions'
                  ? 'border-blue-600 bg-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                    🏠
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    7 Schemes
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">Pensions & Housing Aid</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Senior citizen pensions, disability allowances, and Gharkul housing.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Social Safety Net</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4.3 Sub-Filter Category Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200">
          <div>
            <div className="text-[11px] font-extrabold text-[#1850b5] uppercase tracking-wider mb-2">
              FILTER CATEGORY: Farming & Agriculture Support
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Programs (16)' },
                { id: 'solar', label: 'Solar Pumps (2)' },
                { id: 'drip', label: 'Drip & Sprinklers (5)' },
                { id: 'pond', label: 'Farm Ponds & Wells (3)' },
                { id: 'machinery', label: 'Machinery (6)' }
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setActiveSubFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    activeSubFilter === pill.id
                      ? 'bg-[#1850b5] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Eligible Only */}
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none shrink-0 self-start sm:self-end">
            <input
              type="checkbox"
              checked={eligibleOnly}
              onChange={e => setEligibleOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#1850b5]"
            />
            <span>Filter to Eligible Only (2.5 Acres)</span>
          </label>
        </div>

        {/* ── 4.4 Recommended Schemes Section ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Recommended Schemes (4 Matches Found)</span>
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700">
                <option>Highest Subsidy Amount</option>
                <option>Shortest Processing Time</option>
                <option>Highest Match Percentage</option>
              </select>
            </div>
          </div>

          {/* Scheme Card 1 */}
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Dept. of Energy & MSEDCL</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  95% Profile Match
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-snug">
                  Mukhyamantri Saur Krushi Vahini / Solar Pump Yojana (MSKVY 2.0)
                </h4>
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs text-blue-950 font-medium mt-2">
                  ✓ Matched for your 2.5-acre Baramati holding: Provides up to 90% subsidy for off-grid daylight solar pumps.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate('/schemes/saur-krushi-vahini')}
                  className="px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <span>Apply Now</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/schemes/saur-krushi-vahini')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  ◇ Scheme Rules
                </button>
              </div>
            </div>

            {/* 3 Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Financial Subsidy</div>
                <div className="text-sm font-extrabold text-[#1850b5] mt-0.5">90% Subsidy</div>
                <div className="text-[10px] text-slate-500 font-medium">Farmer pays ~₹16,000 only</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Processing</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">21-30 Days</div>
                <div className="text-[10px] text-slate-500 font-medium">Includes site verification</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Land Holding</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">0.5 to 5 Acres</div>
                <div className="text-[10px] text-slate-500 font-medium">7/12 extract eligible</div>
              </div>
            </div>
          </article>

          {/* Scheme Card 2 */}
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Dept. of Agriculture (MahaDBT)</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Instant Match
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-snug">
                  PMKSY: Per Drop More Crop (Micro-Irrigation Drip & Sprinkler)
                </h4>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium mt-2">
                  ✓ Matched for water conservation: Up to 80% capital coverage for 50-inline drip irrigation and filters.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => window.open('https://mahadbt.maharashtra.gov.in', '_blank')}
                  className="px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <span>Apply via MahaDBT</span>
                  <span>↗</span>
                </button>
                <button
                  onClick={() => navigate('/schemes')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  ◇ Scheme Rules
                </button>
              </div>
            </div>

            {/* 3 Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Subsidy Coverage</div>
                <div className="text-sm font-extrabold text-[#1850b5] mt-0.5">55% to 80%</div>
                <div className="text-[10px] text-slate-500 font-medium">Direct-to-bank DBT</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Required Records</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">7/12 & 8-A</div>
                <div className="text-[10px] text-slate-500 font-medium">Water source registered</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kit Types</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">Inline Drip</div>
                <div className="text-[10px] text-slate-500 font-medium">Includes mainlines & valves</div>
              </div>
            </div>
          </article>

          {/* Scheme Card 3 */}
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Maharashtra State Plan</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Drought Support
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-snug">
                  Baliraja Sanjeevani Yojana (Farm Pond Lining Subsidy)
                </h4>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium mt-2">
                  ✓ Direct capital grant for 500-micron plastic sheet lining to prevent summer percolation loss.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => window.open('https://mahadbt.maharashtra.gov.in', '_blank')}
                  className="px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <span>Apply for Grant</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/schemes')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  ◇ Scheme Rules
                </button>
              </div>
            </div>

            {/* 3 Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lining Grant</div>
                <div className="text-sm font-extrabold text-[#1850b5] mt-0.5">₹75,000 Flat</div>
                <div className="text-[10px] text-slate-500 font-medium">Aadhaar linked account</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Prerequisite</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">Excavated Pond</div>
                <div className="text-[10px] text-slate-500 font-medium">Self-dug or Magel Tyala</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Inspection Mode</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">Geo-tag Photo</div>
                <div className="text-[10px] text-slate-500 font-medium">Krishi Sahayak mobile app</div>
              </div>
            </div>
          </article>
        </section>

        {/* ── 4.5 Bottom CSC Assistance Callout ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">🏢</span>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">NEED IN-PERSON OR CALL ASSISTANCE?</div>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                Visit your nearest <strong>Aaple Sarkar Seva Kendra (CSC)</strong> in Baramati or call our free citizen helpline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>📞</span>
              <span>1800-123-GRAM (24x7)</span>
            </div>
            <button
              onClick={() => alert('Locating nearest CSC Center in Baramati taluka...')}
              className="px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              🏢 Find Nearest CSC
            </button>
          </div>
        </div>
      </main>

      {/* ── 5. Civic Footer ── */}
      <footer className="bg-[#0f3675] text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-blue-900 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <div>
            <div className="text-base font-bold text-white mb-1">GramSathi AI — Government of Maharashtra</div>
            <div>© 2026 Government of Maharashtra, Rural Informatics Directorate.</div>
          </div>
          <div className="flex items-center gap-4 text-blue-300">
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Accessibility Statement</span>
            <span>•</span>
            <span>Helpline: <strong className="text-white">1800-123-GRAM</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NeedDiscoveryPage;
