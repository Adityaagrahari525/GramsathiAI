import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Search,
  Mic,
  ArrowRight,
  Share2,
  Download,
  PhoneCall,
  User,
  Trash2,
  Info,
  Clock
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { EligibilityModal } from '../components/EligibilityModal';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { SchemeService } from '../services/schemeService';
import { useToast } from '../context/ToastContext';

interface SavedSchemeItem {
  id: string;
  title: string;
  department: string;
  statusBadge: string;
  statusType: 'eligible' | 'action_required' | 'not_evaluated';
  savedDate: string;
  subtags: string[];
  benefitText: string;
  benefitHighlight: string;
  metaMetric: string;
  metaMetricLabel: string;
  checklist: string[];
  alertBanner?: string;
  primaryActionLabel: string;
  primaryActionUrl: string;
  detailsUrl: string;
  category: 'agri' | 'social' | 'education' | 'women';
}

export function SavedSchemesPage() {
  const { savedIds, removeSaved } = useSavedSchemes();
  const { showToast } = useToast();

  const [currentLang, setCurrentLang] = useState<'en' | 'mr' | 'hi'>('en');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'agri' | 'social' | 'education' | 'women'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'eligible' | 'action_required'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Baseline templates for the 3 Stitch preset screens
  const presetSchemesMap: Record<string, SavedSchemeItem> = {
    'saur-krushi-vahini': {
      id: 'saur-krushi-vahini',
      title: 'Mukhyamantri Saur Krushi Vahini Yojana 2.0 (Solar Agri Pump Scheme)',
      department: 'Dept. of Energy & Agriculture • Govt. of Maharashtra',
      statusBadge: '✓ Potentially Eligible (4/4 Criteria Matched)',
      statusType: 'eligible',
      savedDate: 'Nov 10, 2024',
      subtags: ['PM-KUSUM Component B', 'Active Quota', 'Solar Irrigation'],
      benefitHighlight: '90% Government Subsidy',
      benefitText: ' on 3 HP / 5 HP DC Solar Agriculture Water Pump. Farmer capital contribution only 10% (₹16,500 – ₹22,400).',
      metaMetricLabel: 'Avg. Timeline',
      metaMetric: '21 - 30 Working Days',
      checklist: ['✓ Aadhaar Linked', '✓ 7/12 & 8-A Land Extract on File', '✓ No Conventional Power Connection'],
      primaryActionLabel: 'Start Journey / Dossier',
      primaryActionUrl: '/tracker',
      detailsUrl: '/scheme/saur-krushi-vahini',
      category: 'agri',
    },
    'dr-ambedkar-krishi': {
      id: 'dr-ambedkar-krishi',
      title: 'Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana',
      department: 'Social Justice & Special Assistance Department',
      statusBadge: '⚠️ Info Needed (Caste Category Verification Required)',
      statusType: 'action_required',
      savedDate: 'Nov 10, 2024',
      subtags: ['Special Irrigation Assistance', 'Well & Micro-Irrigation', 'Scheduled Caste Target'],
      benefitHighlight: 'Financial assistance up to ₹4,00,000',
      benefitText: ' for construction of new in-well borings, micro-drip irrigation systems, and farm energization.',
      metaMetricLabel: 'Annual Cap',
      metaMetric: 'Max ₹4.00 Lakh',
      checklist: ['Caste Certificate Verification Pending', 'Minimum 0.20 Ha Land Required'],
      alertBanner: 'ⓘ Upload your Caste Certificate and validity receipt in Citizen Profile to auto-verify eligibility for this grant.',
      primaryActionLabel: 'Check Eligibility & Criteria',
      primaryActionUrl: '#eligibility',
      detailsUrl: '/schemes',
      category: 'agri',
    },
    'ramai-awas': {
      id: 'ramai-awas',
      title: 'Ramai Awas Gharkul Yojana (Rural Housing Scheme)',
      department: 'Rural Development & Housing Department',
      statusBadge: 'Not Evaluated Yet',
      statusType: 'not_evaluated',
      savedDate: 'Oct 28, 2024',
      subtags: ['Rural Housing Support', 'MahaDBT Housing', 'Gram Panchayat Listed'],
      benefitHighlight: 'Grant subsidy of ₹1,30,000',
      benefitText: ' for constructing a permanent pucca house with dedicated sanitary toilet unit for eligible rural families.',
      metaMetricLabel: 'Direct Grant',
      metaMetric: '₹1,30,000 in 3 Installments',
      checklist: ['BPL / SECC Status: Verification Required', 'Own Kutcha Land Documentation'],
      primaryActionLabel: 'Check Eligibility',
      primaryActionUrl: '#eligibility',
      detailsUrl: '/schemes',
      category: 'social',
    }
  };

  // Convert saved IDs to complete items
  const schemes: SavedSchemeItem[] = useMemo(() => {
    return savedIds.map((id) => {
      if (presetSchemesMap[id]) return presetSchemesMap[id];
      const found = SchemeService.getById(id);
      if (found) {
        let cat: SavedSchemeItem['category'] = 'agri';
        if (found.sector === 'women') cat = 'women';
        else if (found.sector === 'education') cat = 'education';
        else if (found.sector === 'msme') cat = 'social';

        return {
          id: found.id,
          title: found.name,
          department: found.department,
          statusBadge: '✓ Saved for Review',
          statusType: 'eligible',
          savedDate: 'Recently Saved',
          subtags: found.tags.slice(0, 3),
          benefitHighlight: found.benefitAmount,
          benefitText: found.highlightText,
          metaMetricLabel: 'Benefit Mode',
          metaMetric: found.benefitType.toUpperCase(),
          checklist: found.mandatoryDocs,
          primaryActionLabel: 'View Scheme Details',
          primaryActionUrl: `/schemes/${found.id}`,
          detailsUrl: `/schemes/${found.id}`,
          category: cat
        };
      }
      return {
        id,
        title: id,
        department: 'Government of Maharashtra',
        statusBadge: 'Saved Scheme',
        statusType: 'not_evaluated',
        savedDate: 'Recently Saved',
        subtags: ['Maharashtra Welfare'],
        benefitHighlight: 'State Benefit',
        benefitText: 'Government welfare assistance scheme.',
        metaMetricLabel: 'Status',
        metaMetric: 'Active',
        checklist: ['Aadhaar Card'],
        primaryActionLabel: 'Explore Details',
        primaryActionUrl: '/schemes',
        detailsUrl: '/schemes',
        category: 'agri'
      };
    });
  }, [savedIds]);

  const handleRemoveScheme = (id: string) => {
    removeSaved(id);
  };

  const handleShareWhatsApp = () => {
    const text = `GramSathi AI: I have saved ${schemes.length} verified Maharashtra government schemes on my civic profile. Check them out on GramSathi AI platform!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleExportPdf = () => {
    showToast('Preparing printable PDF factsheet of saved schemes...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      // Category
      if (activeCategory !== 'all' && s.category !== activeCategory) return false;
      // Status
      if (statusFilter === 'eligible' && s.statusType !== 'eligible') return false;
      if (statusFilter === 'action_required' && s.statusType !== 'action_required') return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchDept = s.department.toLowerCase().includes(q);
        const matchBenefit = s.benefitText.toLowerCase().includes(q);
        if (!matchTitle && !matchDept && !matchBenefit) return false;
      }
      return true;
    });
  }, [schemes, activeCategory, statusFilter, searchQuery]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f4f7fc] text-slate-900 selection:bg-blue-100 selection:text-blue-900"
      style={{ fontSize: `${100 + fontSizeOffset * 6}%` }}
    >
      {/* 1. Official Government Top Accessibility Bar */}
      <TopBar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        fontSize={fontSizeOffset}
        onFontSizeChange={(delta) => setFontSizeOffset((prev) => Math.max(-2, Math.min(3, prev + delta)))}
      />

      {/* 2. Main Civic Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-[#0f3675] flex items-center justify-center text-white font-black text-xl shadow-md">
                GS
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-[#0f3675]">
                  GramSathi AI
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  ग्रामसाथी AI नागरिक पोर्टल
                </div>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold text-slate-700">
              <Link to="/schemes" className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors">
                Explore Schemes
              </Link>
              <Link
                to="/saved"
                className="px-3.5 py-2 text-white bg-[#1850b5] rounded-lg font-bold shadow-xs transition-colors"
              >
                Saved Schemes
              </Link>
              <Link to="/assistant" className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors">
                AI Citizen Assistant
              </Link>
              <Link to="/tracker" className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors">
                Scheme Journey & Tracker
              </Link>
              <a
                href="https://grievances.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Grievance / Helpdesk
              </a>
            </nav>

            {/* Right: Phone & Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-blue-50/80 px-3.5 py-2 rounded-xl border border-blue-200 text-xs font-bold text-blue-950">
                <PhoneCall className="w-4 h-4 text-blue-700" />
                <span>1800-123-GRAM</span>
              </div>

              <Link
                to="/signin"
                className="flex items-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Citizen Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Breadcrumb & Action Bar */}
      <section className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">
                GramSathi AI / Citizen Benefits & Welfare / <strong className="text-slate-800">Saved Schemes & Bookmarks</strong>
              </div>
              <p className="text-xs text-slate-600">
                Review or proceed with saved schemes. Track documents preparation and official applications through integrated MahaDBT workflows.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleExportPdf}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export List (PDF)</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold shadow-2xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* 4. Stats Counters Strip (4 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{schemes.length}</div>
              <div className="text-[11px] font-semibold text-slate-500">Schemes Bookmarked</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700">2</div>
              <div className="text-[11px] font-semibold text-slate-500">Potentially Eligible</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-700">1</div>
              <div className="text-[11px] font-semibold text-slate-500">Criteria Verification Needed</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">Today, 11:42 AM</div>
              <div className="text-[11px] font-semibold text-slate-500">MahaDBT Model (Demo)</div>
            </div>
          </div>
        </div>

        {/* 5. Search & Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved schemes by keyword, department, or benefit (e.g. Solar Pumps, Subsidies, Baramati)..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="newest">Saved Date (Newest first)</option>
                <option value="oldest">Saved Date (Oldest first)</option>
              </select>
            </div>
          </div>

          {/* Categories & Status Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#1850b5] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Categories ({schemes.length})
              </button>
              <button
                onClick={() => setActiveCategory('agri')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeCategory === 'agri'
                    ? 'bg-[#1850b5] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Agriculture & Irrigation (2)
              </button>
              <button
                onClick={() => setActiveCategory('social')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeCategory === 'social'
                    ? 'bg-[#1850b5] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Social Welfare & Housing (1)
              </button>
              <button
                onClick={() => setActiveCategory('education')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeCategory === 'education'
                    ? 'bg-[#1850b5] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Education & Youth (0)
              </button>
              <button
                onClick={() => setActiveCategory('women')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeCategory === 'women'
                    ? 'bg-[#1850b5] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Women & Child Dev (0)
              </button>
            </div>

            {/* Status Quick Filter */}
            <div className="flex items-center space-x-1.5 text-xs shrink-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('eligible')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  statusFilter === 'eligible' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Potentially Eligible
              </button>
              <button
                onClick={() => setStatusFilter('action_required')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  statusFilter === 'action_required' ? 'bg-amber-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Action Required
              </button>
            </div>
          </div>
        </div>

        {/* 6. Saved Schemes Cards List */}
        <div className="space-y-4">
          {filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No saved schemes matched your filters</h3>
              <p className="text-xs text-slate-500">Try adjusting your search query or category filter above.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition-all hover:shadow-md space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600">{scheme.department}</span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                          scheme.statusType === 'eligible'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : scheme.statusType === 'action_required'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {scheme.statusBadge}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 text-[11px]">Saved on {scheme.savedDate}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {scheme.title}
                    </h2>

                    {/* Subtags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {scheme.subtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col sm:items-end space-y-2 shrink-0">
                    {scheme.primaryActionUrl === '#eligibility' ? (
                      <button
                        onClick={() => setIsEligibilityOpen(true)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                      >
                        {scheme.primaryActionLabel}
                      </button>
                    ) : (
                      <Link
                        to={scheme.primaryActionUrl}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 text-center"
                      >
                        {scheme.primaryActionLabel}
                      </Link>
                    )}

                    <Link
                      to={scheme.detailsUrl}
                      className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors text-center shadow-2xs"
                    >
                      View Full Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemoveScheme(scheme.id)}
                      className="text-[11px] text-red-500 hover:text-red-700 flex items-center space-x-1 pt-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove from Saved</span>
                    </button>
                  </div>
                </div>

                {/* Key Benefit Highlight Box */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-800 leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded mr-2">
                      Key Government Benefit
                    </span>
                    <strong className="font-bold text-slate-900">{scheme.benefitHighlight}</strong>
                    <span>{scheme.benefitText}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">{scheme.metaMetricLabel}</div>
                    <div className="text-xs font-black text-slate-900">{scheme.metaMetric}</div>
                  </div>
                </div>

                {/* In-Card Alert (if any) */}
                {scheme.alertBanner && (
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>{scheme.alertBanner}</div>
                  </div>
                )}

                {/* Checklist Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                  {scheme.checklist.map((c, i) => (
                    <span key={i} className="inline-flex items-center space-x-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 7. Educational Guide: How to Save Schemes for Quick Access */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center space-x-2.5 pb-4 mb-6 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                How to Save Schemes for Quick Access
              </h3>
              <p className="text-xs text-slate-500">Three simple steps to curate your civic welfare portfolio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Step 1 */}
            <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="w-6 h-6 rounded-md bg-[#1850b5] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Browse Schemes</h4>
              <p className="text-slate-600 leading-relaxed">
                Explore 650+ verified state and central welfare programs via the Explore Schemes portal or by consulting GramSathi AI.
              </p>
              <Link to="/schemes" className="text-blue-700 font-bold hover:underline inline-flex items-center space-x-1 pt-1">
                <span>Go to Schemes Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="w-6 h-6 rounded-md bg-[#1850b5] text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Click the Bookmark Icon</h4>
              <p className="text-slate-600 leading-relaxed">
                Look for the ribbon bookmark icon on any scheme summary card or scheme detail page.
              </p>
              <div className="text-slate-500 text-[11px] pt-1">
                Instant sync to your citizen profile
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="w-6 h-6 rounded-md bg-[#1850b5] text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Track & Apply Anytime</h4>
              <p className="text-slate-600 leading-relaxed">
                Access saved schemes anytime to evaluate eligibility with one click and generate pre-filled official application dossiers.
              </p>
              <Link to="/tracker" className="text-blue-700 font-bold hover:underline inline-flex items-center space-x-1 pt-1">
                <span>Download ready dossiers</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 8. Civic Legal Notice */}
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Important Civic Notice for Maharashtra Citizens:</strong> Saved schemes are stored securely in your GramSathi AI citizen session. Saving a scheme does not constitute an official government application until formally submitted on MahaDBT or department portals.
          </div>
        </div>

      </main>

      {/* 9. Civic Footer */}
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
                Empowering rural citizens, farmers, and village entrepreneurs across Maharashtra through accessible civic intelligence and real-time public services.
              </p>
              <div className="text-[11px] text-emerald-300 font-semibold">
                ✓ UX4G & ISO 27001 Certified
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3">
                National & State Portals
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">MahaDBT Maharashtra</a></li>
                <li><a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Digital India Portal</a></li>
                <li><a href="https://dbtbharat.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">DBT Bharat Direct Transfer</a></li>
                <li><a href="https://grievances.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Aaple Sarkar Grievance System</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3">
                Civic Helplines
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>GramSathi Toll-Free: <strong className="text-white">1800-123-GRAM</strong></li>
                <li>Kisan Call Center: <strong className="text-white">1800-180-1551</strong></li>
                <li>Mahavitaran Solar Help: <strong className="text-white">1912</strong></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3">
                Compliance & Accessibility
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed mb-3">
                Compliant with UX4G Accessibility Standards Level AA and Data Protection Guidelines for civic administrative portals.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="bg-blue-900/60 border border-blue-700/60 px-2 py-1 rounded">ISO 27001</span>
                <span className="bg-blue-900/60 border border-blue-700/60 px-2 py-1 rounded">UX4G AA</span>
                <span className="bg-blue-900/60 border border-blue-700/60 px-2 py-1 rounded">DigiLocker</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
            <div>
              © 2025 Government of Maharashtra. Designed and Maintained by GramSathi AI Rural Informatics Directorate.
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <a href="#terms" className="hover:text-white">Terms of Service</a>
              <span>|</span>
              <a href="#privacy" className="hover:text-white">Privacy Policy</a>
              <span>|</span>
              <a href="#hyperlink" className="hover:text-white">Hyperlinking Policy</a>
              <span>|</span>
              <a href="#accessibility" className="hover:text-white">Accessibility Statement</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Eligibility Modal if triggered */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}

export default SavedSchemesPage;
