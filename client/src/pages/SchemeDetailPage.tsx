import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Share2,
  Bookmark,
  Printer,
  ChevronRight,
  ExternalLink,
  Info,
  AlertTriangle,
  FileText,
  Volume2,
  Calculator,
  ArrowRight,
  Sun,
  Shield,
  Zap
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EligibilityModal } from '../components/EligibilityModal';
import { AskAssistantModal } from '../components/AskAssistantModal';

export function SchemeDetailPage() {

  const [currentLang, setCurrentLang] = useState<'en' | 'mr' | 'hi'>('en');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);

  // Modals
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Interactive Calculator State
  const [calcLandholding, setCalcLandholding] = useState<'upto25' | '25to50' | 'above50'>('25to50');
  const [calcCategory, setCalcCategory] = useState<'gen_obc' | 'sc_st'>('gen_obc');
  const [calcWaterSource, setCalcWaterSource] = useState<'well' | 'borewell' | 'pond' | 'canal'>('well');

  const handleFontSizeChange = (delta: number) => {
    if (delta === 0) setFontSizeOffset(0);
    else setFontSizeOffset((prev) => Math.max(-2, Math.min(3, prev + delta)));
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const text =
        "Chief Minister Solar Agriculture Pump Scheme, Mukhyamantri Saur Krushi Vahini Yojana 2.0. " +
        "Under this scheme, eligible farmers receive 90 to 95 percent government financial subsidy for 3 HP, 5 HP, and 7.5 HP solar water pumps. " +
        "Scheduled Caste and Scheduled Tribe farmers contribute only 5 percent beneficiary share, while general and OBC farmers contribute 10 percent share. " +
        "The scheme includes a 5-year free comprehensive maintenance contract, insurance, and assured daytime power for irrigation.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    } else {
      alert("Speech synthesis is not supported on this browser.");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculator logic
  const calcResult = useMemo(() => {
    let pump = '5 HP Solar Water Pump';
    let systemCost = 224000;
    let subsidyPct = calcCategory === 'sc_st' ? 95 : 90;
    let sharePct = calcCategory === 'sc_st' ? 5 : 10;

    if (calcLandholding === 'upto25') {
      pump = '3 HP Solar Water Pump (DC/AC)';
      systemCost = 165000;
    } else if (calcLandholding === '25to50') {
      pump = '5 HP Solar Water Pump (DC/AC)';
      systemCost = 224000;
    } else {
      pump = '7.5 HP Solar Water Pump (DC/AC)';
      systemCost = 315000;
    }

    const farmerShare = Math.round((systemCost * sharePct) / 100);

    return {
      pump,
      systemCost,
      subsidyPct,
      farmerShare,
      sharePct,
    };
  }, [calcLandholding, calcCategory]);

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900"
      style={{ fontSize: `${100 + fontSizeOffset * 6}%` }}
    >
      {/* 1. Accessibility Top Bar */}
      <TopBar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        fontSize={fontSizeOffset}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* 2. Main Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onOpenEligibility={() => setIsEligibilityOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* 3. Subnav & Breadcrumbs */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-slate-600">
            {/* Breadcrumb path */}
            <div className="flex items-center space-x-1.5 flex-wrap">
              <Link to="/" className="hover:text-blue-700 transition-colors flex items-center">
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link to="/schemes" className="hover:text-blue-700 transition-colors">
                Explore Schemes
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Agriculture & Farmers</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-blue-900 truncate max-w-xs md:max-w-md">
                Mukhyamantri Saur Krushi Vahini Yojana 2.0
              </span>
            </div>

            {/* Verification Status */}
            <div className="flex items-center space-x-3 text-xs">
              <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Gazette Verified
              </span>
              <span className="text-slate-500 hidden sm:inline">
                Last Verified: <strong className="text-slate-700">10 May 2024</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Container */}
      <main className="flex-1 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Scheme Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
                    Application Open (Active 2024-25)
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
                    Maharashtra State + Central Scheme (PM-KUSUM Component B)
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                    Subsidy: 90% to 95% Govt Financial Assistance
                  </span>
                </div>

                {/* Main Titles */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f3675] tracking-tight leading-tight">
                  Chief Minister Solar Agriculture Pump Scheme
                  <span className="block text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                    (Mukhyamantri Saur Krushi Vahini Yojana 2.0)
                  </span>
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1">
                  PM-KUSUM Component B — Off-Grid Solar Photovoltaic Water Pumping System
                </p>

                {/* Implementing Authority */}
                <div className="mt-4 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start space-x-2">
                  <span className="text-blue-700 font-bold text-base leading-none">🏛</span>
                  <div>
                    <strong className="text-blue-950 font-semibold">Implementing Authority:</strong>{' '}
                    Jointly implemented by Department of Energy & New and Renewable Energy (Govt of Maharashtra),
                    Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL / Mahavitaran), and Ministry of
                    New and Renewable Energy (MNRE, Govt of India).
                  </div>
                </div>

                {/* Summary Text */}
                <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                  The primary objective is to provide daytime assured power supply to farmers across Maharashtra
                  for irrigation, decouple agriculture power feeders from conventional grid load, and eliminate
                  power outages. Under this scheme, eligible small, marginal, and general farmers receive 3 HP, 5 HP,
                  and 7.5 HP solar water pumps with <strong className="text-slate-900 font-bold">90% to 95% government financial subsidy</strong>.
                </p>
              </div>

              {/* Audio Listen Box */}
              <div className="lg:w-72 shrink-0 flex flex-col items-start lg:items-end">
                <button
                  onClick={handleToggleAudio}
                  className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                    isPlayingAudio
                      ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 text-blue-700 ${isPlayingAudio ? 'animate-bounce text-amber-700' : ''}`} />
                  <div className="text-left">
                    <div className="font-bold">{isPlayingAudio ? 'Pause Audio Summary' : 'Listen Audio Summary'}</div>
                    <div className="text-[10px] text-slate-500 font-normal">Audio Narration in English & Marathi</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsEligibilityOpen(true)}
                  className="inline-flex items-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow active:scale-95"
                >
                  <span>Check My Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://www.mahadiscom.in/solar_MSKVY/index_mr.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:border-slate-400"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>
              </div>

              {/* Utility actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    isSaved
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} />
                  <span>{isSaved ? 'Saved' : 'Save Scheme'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Factsheet</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all relative"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Share Scheme</span>
                  {showShareToast && (
                    <span className="absolute -top-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow whitespace-nowrap">
                      Link copied to clipboard!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Main Content Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">

              {/* Section 1: Key Scheme Benefits */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-7">
                <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Key Scheme Benefits & Capital Subsidy Structure
                    </h2>
                    <p className="text-xs text-slate-500">Financial Assistance and Infrastructure Guarantee</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-black text-emerald-700 tracking-tight">90% to 95%</span>
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">Subsidy Assistance</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Scheduled Caste (SC) & Scheduled Tribe (ST) farmers contribute only <strong className="text-emerald-800">5% beneficiary share</strong>. General & OBC category farmers pay only <strong className="text-slate-800">10% share</strong>.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-white relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-blue-900">Daytime Power</span>
                      <Sun className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-xs font-semibold text-blue-700 mb-1">8 to 10 Hours Daily</div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">Eliminates Night Hazards</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Eliminates nighttime farm irrigation risks (snake bites, power surges). Guaranteed reliable daytime solar power directly on your agricultural field.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/70 to-white relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-black text-amber-700 tracking-tight">5 Years Free</span>
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">Maintenance & Insurance</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Comprehensive Maintenance Contract (CMC), theft insurance cover, and equipment manufacturer replacement warranty fully included for 5 years.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Official Share Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-7">
                <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    📊
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Cost & Official Share Breakdown (Official Quota Table)
                    </h2>
                    <p className="text-xs text-slate-500">Pump Capacity, Landholding Eligibility, and Beneficiary Contribution</p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100/80 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Pump Capacity</th>
                        <th className="py-3 px-4">Eligible Landholding</th>
                        <th className="py-3 px-4">Approx System Cost</th>
                        <th className="py-3 px-4 text-blue-900 bg-blue-50/50">General / OBC (10%)</th>
                        <th className="py-3 px-4 text-emerald-900 bg-emerald-50/50">SC / ST Share (5%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          3 HP (DC/AC)
                          <div className="text-[11px] font-normal text-slate-500">Submersible / Surface</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">Up to 2.5 Acres of Land</td>
                        <td className="py-3.5 px-4 text-slate-600">₹ 1,65,000/-</td>
                        <td className="py-3.5 px-4 font-bold text-blue-700 bg-blue-50/30">₹ 16,500/-</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700 bg-emerald-50/30">₹ 8,250/-</td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 transition-colors bg-blue-50/10">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          5 HP (DC/AC)
                          <div className="text-[11px] font-normal text-slate-500">Most Popular for Wells</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">2.5 to 5.0 Acres of Land</td>
                        <td className="py-3.5 px-4 text-slate-600">₹ 2,24,000/-</td>
                        <td className="py-3.5 px-4 font-bold text-blue-700 bg-blue-50/30">₹ 22,400/-</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700 bg-emerald-50/30">₹ 11,200/-</td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          7.5 HP (DC/AC)
                          <div className="text-[11px] font-normal text-slate-500">Large Holding / Deep Bore</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">More than 5.0 Acres</td>
                        <td className="py-3.5 px-4 text-slate-600">₹ 3,15,000/-</td>
                        <td className="py-3.5 px-4 font-bold text-blue-700 bg-blue-50/30">₹ 31,500/-</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700 bg-emerald-50/30">₹ 15,750/-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 text-[11px] text-slate-500 leading-relaxed italic">
                  * Note: Tender rates are subject to government revisions. Final payable amount is clearly specified on the official Mahavitaran demand note issued after field survey verification.
                </div>
              </div>

              {/* Section 3: Eligibility Criteria */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-7">
                <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    📋
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Eligibility Criteria (Who Can Apply)
                    </h2>
                    <p className="text-xs text-slate-500">Mandatory Citizen Eligibility Criteria for Selection</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700">
                      <strong className="text-slate-900 font-semibold">Resident Farmers of Maharashtra:</strong>{' '}
                      Applicant must be an individual farmer or farm group holding verified agricultural land within Maharashtra state.
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700">
                      <strong className="text-slate-900 font-semibold">Assured Water Source on Land:</strong>{' '}
                      The farm must possess an assured perennial water source such as an open well, borewell, farm pond (Shet Tale), or perennial river/canal (mandatory entry on 7/12 land record).
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700">
                      <strong className="text-slate-900 font-semibold">No Prior Conventional Grid Connection:</strong>{' '}
                      Farmers without traditional grid electricity for agricultural pumps, or those currently on the Paid-Pending Waiting List with Mahavitaran.
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700">
                      <strong className="text-slate-900 font-semibold">Landholding Slabs for Capacity:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                        <li>Up to 2.5 acres eligible for up to 3 HP pump.</li>
                        <li>2.5 to 5.0 acres eligible for 5 HP pump.</li>
                        <li>Above 5.0 acres eligible for 7.5 HP pump.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700">
                      <strong className="text-slate-900 font-semibold">Priority Areas:</strong>{' '}
                      Special preference is given to drought-prone talukas, suicide-prone agricultural districts, tribal sub-plan areas, and remote un-electrified villages.
                    </div>
                  </div>

                  {/* Ineligibility Warning */}
                  <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 flex items-start space-x-3 text-red-900">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <strong className="font-bold text-red-950">Ineligibility:</strong> Farmers who have previously availed solar agriculture pump subsidies under MMGSY, PM-KUSUM Scheme, or other state/central government subsidy programs are not eligible.
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Quick Eligibility Calculator */}
              <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 md:p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -z-0"></div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Quick Eligibility Calculator (15-second Instant Assessment)
                      </h2>
                      <p className="text-xs text-slate-500">Select your values to immediately calculate your eligible pump capacity and estimated cost</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    {/* Landholding */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Landholding Size
                      </label>
                      <select
                        value={calcLandholding}
                        onChange={(e) => setCalcLandholding(e.target.value as any)}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="upto25">Up to 2.5 Acres (Marginal)</option>
                        <option value="25to50">2.5 to 5.0 Acres (Small)</option>
                        <option value="above50">Above 5.0 Acres (Medium)</option>
                      </select>
                    </div>

                    {/* Social Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Social Category
                      </label>
                      <select
                        value={calcCategory}
                        onChange={(e) => setCalcCategory(e.target.value as any)}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="gen_obc">General / OBC / SEBC (10% Share)</option>
                        <option value="sc_st">SC / ST Category (5% Share)</option>
                      </select>
                    </div>

                    {/* Water Source */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Water Source
                      </label>
                      <select
                        value={calcWaterSource}
                        onChange={(e) => setCalcWaterSource(e.target.value as any)}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="well">Open Well / Vihir (विहीर)</option>
                        <option value="borewell">Borewell / Tube well (कूपनलिका)</option>
                        <option value="pond">Farm Pond / Shet Tale (शेततळे)</option>
                        <option value="canal">River / Canal Lift (नदी/कॅनॉल)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculator Output Card */}
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Eligibility Status: Highly Eligible
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold text-[#0f3675] mt-1.5">
                        Recommended: {calcResult.pump}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700 mt-1">
                        Govt Subsidy: <strong className="text-emerald-700">{calcResult.subsidyPct}%</strong> | Estimated Farmer Share:{' '}
                        <strong className="text-slate-900 font-bold">₹ {calcResult.farmerShare.toLocaleString('en-IN')}/-</strong>
                      </div>
                    </div>

                    <a
                      href="https://www.mahadiscom.in/solar_MSKVY/index_mr.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center justify-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow transition-all hover:shadow-md"
                    >
                      <span>Apply for this Scheme</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 5: Required Documents Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-7">
                <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Required Documents Checklist
                    </h2>
                    <p className="text-xs text-slate-500">Keep clear scanned copies (PDF/JPG under 500 KB each) ready before starting online application</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-slate-900">Digital 7/12 & 8-A Extract (७/१२ व ८-अ उतारा)</div>
                      <div className="text-slate-500 text-xs mt-0.5">Water source entry clearly recorded within last 3 months.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-slate-900">Aadhaar Card (आधार कार्ड)</div>
                      <div className="text-slate-500 text-xs mt-0.5">Mobile-linked Aadhaar for UIDAI OTP authentication.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-slate-900">Caste Certificate (जातीचा दाखला)</div>
                      <div className="text-slate-500 text-xs mt-0.5">Mandatory only for SC/ST farmers claiming 95% subsidy.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-slate-900">Bank Passbook / Cancelled Cheque</div>
                      <div className="text-slate-500 text-xs mt-0.5">Aadhaar-seeded bank account with visible IFSC code.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-slate-900">No-Dues / Self Declaration (स्वयंघोषणापत्र)</div>
                      <div className="text-slate-500 text-xs mt-0.5">Certificate declaring no prior agricultural solar pump subsidy.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-semibold text-slate-900">Passport Photograph of Farmer</div>
                      <div className="text-slate-500 text-xs mt-0.5">Recent color photograph of primary title holder.</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Scheme Factsheet Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 sticky top-24">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base">Scheme Factsheet</h3>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Official
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Scope:</span>
                    <span className="font-semibold text-slate-800 text-right">Maharashtra State + Central (PM-KUSUM)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Implementing Agency:</span>
                    <span className="font-semibold text-slate-800 text-right">Mahavitaran (MSEDCL)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Application Fee:</span>
                    <span className="font-bold text-emerald-700 text-right">Free (₹0 Official Portal Fee)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Disbursement Method:</span>
                    <span className="font-semibold text-slate-800 text-right">100% Online Direct Subsidy</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Subsidy Coverage:</span>
                    <span className="font-bold text-emerald-700 text-right">90% to 95%</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Farmer Share:</span>
                    <span className="font-semibold text-slate-800 text-right">5% (SC/ST) / 10% (Gen/OBC)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Warranty & AMC:</span>
                    <span className="font-semibold text-slate-800 text-right">5 Years Free Maintenance</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Expected Timeline:</span>
                    <span className="font-semibold text-slate-800 text-right">45 Days (Sanction to Commissioning)</span>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => setIsEligibilityOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white py-3 rounded-xl text-sm font-bold shadow transition-all hover:shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check My Eligibility</span>
                  </button>
                </div>
              </div>

              {/* Official Government Links */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
                <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                  Official Government Links
                </h3>

                <div className="space-y-2">
                  <a
                    href="https://www.mahadiscom.in/solar_MSKVY/index_mr.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <span className="flex items-center">
                      <ExternalLink className="w-4 h-4 text-blue-600 mr-2" />
                      Mahavitaran Solar Portal
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>

                  <a
                    href="https://mahadbt.maharashtra.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <span className="flex items-center">
                      <ExternalLink className="w-4 h-4 text-blue-600 mr-2" />
                      MahaDBT Farmer Portal
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>

                  <a
                    href="https://www.mahadiscom.in/solar_MSKVY/documents/GR_MSKVY_2.0.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <span className="flex items-center">
                      <Download className="w-4 h-4 text-emerald-600 mr-2" />
                      Official Government Resolution (GR) PDF
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">2.4 MB</span>
                  </a>
                </div>
              </div>

              {/* Need Assistance applying online? */}
              <div className="bg-blue-50/60 rounded-2xl border border-blue-200 p-5 md:p-6 text-xs sm:text-sm text-slate-800">
                <div className="flex items-center space-x-2 font-bold text-blue-950 mb-2">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span>Need Assistance applying online?</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Visit your nearest <strong>Aaple Sarkar Seva Kendra (CSC)</strong> or Gram Panchayat office. Authorized CSC VLE service charge is capped at ₹50/- maximum.
                </p>
                <div className="mt-3 inline-block bg-white text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs">
                  Authorized CSC Service Charge: ₹ 50/- (Maximum)
                </div>
              </div>

              {/* Official Anti-Fraud Advisory */}
              <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-5 md:p-6 text-xs sm:text-sm text-amber-950">
                <div className="flex items-center space-x-2 font-bold text-amber-900 mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Official Anti-Fraud Advisory</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-xs">
                  Do not pay cash or commissions to unauthorized agents or middlemen. All beneficiary payments must be made strictly through the official Mahavitaran online portal or authorized bank chalans.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Modals */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        currentLang={currentLang}
      />
      <AskAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
export default SchemeDetailPage;
