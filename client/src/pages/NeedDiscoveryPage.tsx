import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ReverseDiscoveryService, PRESET_NEEDS } from '../services/reverseDiscoveryService';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';

export function NeedDiscoveryPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, language } = useLanguage();

  // Search query for natural language needs
  const [needQuery, setNeedQuery] = useState<string>('');

  // Active need category (default: 'farming')
  const [selectedNeed, setSelectedNeed] = useState<string>('farming');

  // Sub-filter pill (default: 'all')
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');

  // Sort by filter
  const [sortBy, setSortBy] = useState<'match' | 'subsidy' | 'steps'>('match');

  // Eligible only toggle
  const [eligibleOnly, setEligibleOnly] = useState<boolean>(true);

  // Dynamic Rule-Based Reverse Discovery Matching (REST API with instant fallback)
  const [matchedResults, setMatchedResults] = useState(() => {
    return ReverseDiscoveryService.matchNeeds(needQuery || selectedNeed, {
      eligibleOnly,
      userHolding: 2.5
    });
  });

  useEffect(() => {
    let mounted = true;
    ReverseDiscoveryService.matchNeedsAsync(needQuery || selectedNeed, {
      eligibleOnly,
      userHolding: 2.5
    }).then((results) => {
      if (mounted && Array.isArray(results) && results.length > 0) {
        setMatchedResults(results);
      }
    });

    return () => {
      mounted = false;
    };
  }, [needQuery, selectedNeed, eligibleOnly]);

  // Filtered and sorted results based on sub-filters and sort select
  const filteredAndSortedResults = useMemo(() => {
    let list = [...matchedResults];
    if (activeSubFilter !== 'all') {
      list = list.filter(item => {
        const text = (item.scheme.name + ' ' + item.scheme.summary + ' ' + item.scheme.tags.join(' ')).toLowerCase();
        if (activeSubFilter === 'solar') return text.includes('solar') || text.includes('pump') || text.includes('kusum');
        if (activeSubFilter === 'drip') return text.includes('drip') || text.includes('sprinkler') || text.includes('irrigation');
        if (activeSubFilter === 'pond') return text.includes('pond') || text.includes('well') || text.includes('water');
        if (activeSubFilter === 'machinery') return text.includes('tractor') || text.includes('machinery') || text.includes('equipment');
        return true;
      });
    }
    if (sortBy === 'subsidy') {
      list.sort((a, b) => b.scheme.benefitAmount.localeCompare(a.scheme.benefitAmount));
    } else if (sortBy === 'steps') {
      list.sort((a, b) => (a.scheme.applicationSteps?.length || 5) - (b.scheme.applicationSteps?.length || 5));
    } else {
      list.sort((a, b) => b.matchScore - a.matchScore);
    }
    return list;
  }, [matchedResults, activeSubFilter, sortBy]);

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
      <TopBar />

      {/* ── 2. Civic Navbar ── */}
      <Navbar />

      {/* ── 3. Breadcrumb & Sync Status ── */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-slate-500 font-medium">
            <span className="hover:text-blue-700 cursor-pointer" onClick={() => navigate('/')}>GramSathi AI</span>
            <span> / </span>
            <span className="hover:text-blue-700 cursor-pointer" onClick={() => navigate('/schemes')}>{t('Direct Benefits & Welfare')}</span>
            <span> / </span>
            <span className="text-slate-800 font-bold">{t('Citizen Services')}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>{t('Demonstration Workflow • MahaDBT & PM-Kisan Model')}</span>
          </div>
        </div>
      </div>

      {/* ── 4. Main Body ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">

        {/* ── 4.1 Page Title & Voice Search Banner ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t('Find Government Support by Your Need')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed font-medium">
              {t('Select what assistance your household needs today. GramSathi AI automatically matches verified subsidies, grants, and civic schemes you qualify for.')}
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
                {isPlayingAudio ? (language === 'mr' ? 'ऐकत आहे... बोलत राहा' : language === 'hi' ? 'सुन रहा है... बोलते रहें' : 'Listening... please speak') : t('Voice Search (बोलून शोधा)')}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {t('Speak in Marathi, Hindi, or English')}
              </div>
            </div>
          </div>
        </div>

        {/* ── 4.1b Describe Your Need Search Console (Rule-Based Matching) ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label htmlFor="needInput" className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {t('Describe what support you need (आपली गरज सांगा किंवा लिहा):')}
            </label>
            <span className="text-[11px] text-slate-500 font-medium">{t('Modular Rule-Based Intent Matching')}</span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-400 text-sm">🔍</span>
            <input
              id="needInput"
              type="text"
              value={needQuery}
              onChange={(e) => setNeedQuery(e.target.value)}
              placeholder={t('e.g. I want financial support for farming, I want to start a small business, I am a member of a self-help group...')}
              className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1850b5] focus:outline-none"
            />
            {needQuery && (
              <button
                type="button"
                onClick={() => setNeedQuery('')}
                className="absolute right-3 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md"
              >
                {t('Clear')}
              </button>
            )}
          </div>

          {/* Quick Need Preset Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-slate-500 font-medium text-[11px]">{t('Popular Needs:')}</span>
            {PRESET_NEEDS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setNeedQuery(preset.query);
                  setSelectedNeed(preset.targetCategory);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${needQuery === preset.query
                    ? 'bg-[#1850b5] text-white border-[#1850b5] shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <span>{preset.icon} {t(preset.query)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 4.2 Step 1: Choose Your Area of Need (6 Cards) ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {t('Step 1: Choose Your Area of Need')}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {t('Select a civic category to see tailored government programs')}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
              6 {t('Categories Available')}
            </span>
          </div>

          {/* 6 Grid Need Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Need Card 1: Farming & Agriculture (Selected) */}
            <div
              onClick={() => setSelectedNeed('farming')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${selectedNeed === 'farming'
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
                        {t('Selected')}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      16 {t('Schemes')}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{t('Farming & Agriculture')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  {t('Solar pumps, micro-irrigation, seed grants, and machinery subsidies.')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#1850b5] flex items-center justify-between">
                <span>16 {t('Active Programs')}</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 2: Business & Self-Employment */}
            <div
              onClick={() => setSelectedNeed('business')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${selectedNeed === 'business'
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
                    8 {t('Schemes')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{t('Business & Self-Employment')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  {t('Mudra loans, PMEGP subsidized credit, and village enterprise grants.')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('Up to 35% Subsidy')}</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 3: Education & Scholarships */}
            <div
              onClick={() => setSelectedNeed('education')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${selectedNeed === 'education'
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
                    11 {t('Schemes')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{t('Education & Scholarships')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  {t('Fee waivers, Swadhar hostel aid, and ITI training stipends.')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('Full Fee Reimbursements')}</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 4: Employment & Training */}
            <div
              onClick={() => setSelectedNeed('employment')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${selectedNeed === 'employment'
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
                    6 {t('Schemes')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{t('Employment & Training')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  {t('MGNREGA wage employment and Yuva apprentice monthly stipends.')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('Guaranteed Work & Stipend')}</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 5: Women & Child Welfare */}
            <div
              onClick={() => setSelectedNeed('women')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${selectedNeed === 'women'
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
                    9 {t('Schemes')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{t('Women & Child Welfare')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  {t('Ladki Bahin direct monthly benefit, SHG loans, and maternal aid.')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('₹1,500/month Direct Grant')}</span>
                <span>→</span>
              </div>
            </div>

            {/* Need Card 6: Pensions & Housing Aid */}
            <div
              onClick={() => setSelectedNeed('pensions')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${selectedNeed === 'pensions'
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
                    7 {t('Schemes')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{t('Pensions & Housing Aid')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  {t('Senior citizen pensions, disability allowances, and Gharkul housing.')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('Social Safety Net')}</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4.3 Sub-Filter Category Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200">
          <div>
            <div className="text-[11px] font-extrabold text-[#1850b5] uppercase tracking-wider mb-2">
              {t('FILTER CATEGORY: Farming & Agriculture Support')}
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeSubFilter === pill.id
                      ? 'bg-[#1850b5] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                >
                  {t(pill.label)}
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
            <span>{t('Filter to Eligible Only (2.5 Acres)')}</span>
          </label>
        </div>

        {/* ── 4.4 Recommended Schemes Section ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{t('Recommended Schemes')} ({filteredAndSortedResults.length} {t('Matches Found')})</span>
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">{t('Sort by:')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'match' | 'subsidy' | 'steps')}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="match">{t('Highest Match Percentage')}</option>
                <option value="subsidy">{t('Highest Subsidy Amount')}</option>
                <option value="steps">{t('Shortest Application Path')}</option>
              </select>
            </div>
          </div>

          {filteredAndSortedResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-400">
                🔍
              </div>
              <h4 className="text-base font-bold text-slate-800">{t('No schemes found matching this criteria')}</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t('Try clearing your search query or selecting a different civic need category above.')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNeedQuery('');
                  setActiveSubFilter('all');
                  setSelectedNeed('farming');
                }}
                className="px-4 py-2 bg-[#1850b5] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0f3675]"
              >
                {t('Reset Filters')}
              </button>
            </div>
          ) : (
            filteredAndSortedResults.map((result) => {
              const scheme = result.scheme;
              return (
                <article key={scheme.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500">{t(scheme.departmentShort || scheme.department)}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {result.matchScore}% {t('Profile Match')}
                      </span>
                      {scheme.level && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {scheme.level === 'Maharashtra' ? t('State Scheme') : scheme.level === 'Central' ? t('Central Scheme') : t('Joint (State + Central)')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 leading-snug">
                        {language === 'mr' ? (scheme.nameMr || scheme.name) : language === 'hi' ? (scheme.nameHi || scheme.nameMr || scheme.name) : scheme.name}
                      </h4>
                      <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs text-blue-950 font-medium mt-2">
                        ✓ {t(result.matchedReason)}
                      </div>
                      <div className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-700">{t('Key Eligibility:')}</span>
                        <span>{t(result.relevantEligibility)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() => navigate(result.detailUrl)}
                        className="px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                      >
                        <span>{t('Apply / Track')}</span>
                        <span>→</span>
                      </button>
                      <button
                        onClick={() => navigate(result.detailUrl)}
                        className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                      >
                        ◇ {t('Scheme Details')}
                      </button>
                      {scheme.officialUrl && (
                        <a
                          href={scheme.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                          title={t('Official Portal')}
                        >
                          {t('Official Portal')} ↗
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 3 Metric Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('Financial Benefit / Subsidy')}</div>
                      <div className="text-sm font-extrabold text-[#1850b5] mt-0.5 truncate">{scheme.benefitAmount}</div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">{t(scheme.highlightTitle || 'Direct Beneficiary Support')}</div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('Application Steps')}</div>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {scheme.applicationSteps?.length || 5} {t('Documented Stages')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">{t(scheme.applicationMode || 'Online via Portal')}</div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('Target Beneficiaries')}</div>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                        {scheme.targetBeneficiaries?.slice(0, 2).join(', ') || 'Rural Citizens'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">{scheme.targetBeneficiaryText || 'Verified resident households'}</div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* ── 4.5 Bottom CSC Assistance Callout ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">🏢</span>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('NEED IN-PERSON OR CALL ASSISTANCE?')}</div>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {t('Visit your nearest Aaple Sarkar Seva Kendra (CSC) in Baramati or call our free citizen helpline.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>📞</span>
              <span>1800-123-GRAM (24x7)</span>
            </div>
            <button
              onClick={() => showToast(t('Locating nearest CSC / Aaple Sarkar Seva Kendra in Baramati taluka...'), 'info')}
              className="px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              🏢 {t('Find Nearest CSC')}
            </button>
          </div>
        </div>
      </main>

      {/* ── 5. Civic Footer ── */}
      <footer className="bg-[#0f3675] text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-blue-900 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <div>
            <div className="text-base font-bold text-white mb-1">{t('GramSathi AI — Government of Maharashtra')}</div>
            <div>{t('© 2026 Government of Maharashtra, Rural Informatics Directorate.')}</div>
          </div>
          <div className="flex items-center gap-4 text-blue-300">
            <span className="hover:underline cursor-pointer">{t('Terms of Service')}</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">{t('Privacy Policy')}</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">{t('Accessibility Statement')}</span>
            <span>•</span>
            <span>{t('Helpline')}: <strong className="text-white">1800-123-GRAM</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NeedDiscoveryPage;
