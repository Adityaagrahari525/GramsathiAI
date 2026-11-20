import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SECTORS_LIST, type Scheme } from '../data/schemesData';
import { SchemeService } from '../services/schemeService';
import { EligibilityModal } from '../components/EligibilityModal';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { extractQueryTokens, matchIntentFromQuery } from '../utils/searchHelper';

// ─── Icons ────────────────────────────────────────────────────────────────────
function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function MicIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function BookmarkIcon({ saved, onClick }: { saved?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`p-1.5 rounded-lg border transition-colors ${saved
        ? 'bg-amber-50 border-amber-300 text-amber-600'
        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
        }`}
      title={saved ? 'Remove bookmark' : 'Save scheme'}
    >
      <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}

function EyeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function CheckIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function RefreshIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function ListIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function GridIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function XIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MAHARASHTRA_DISTRICTS = [
  'All 36 Districts (महाराष्ट्र सर्व जिल्हे)',
  'Ahmednagar (अहमदनगर)',
  'Akola (अकोला)',
  'Amravati (अमरावती)',
  'Chhatrapati Sambhajinagar / Aurangabad (छत्रपती संभाजीनगर)',
  'Beed (बीड)',
  'Bhandara (भंडारा)',
  'Buldhana (बुलढाणा)',
  'Chandrapur (चंद्रपूर)',
  'Dhule (धुळे)',
  'Gadchiroli (गडचिरोली)',
  'Gondia (गोंदिया)',
  'Hingoli (हिंगोली)',
  'Jalgaon (जळगाव)',
  'Jalna (जालना)',
  'Kolhapur (कोल्हापूर)',
  'Latur (लातूर)',
  'Mumbai City (मुंबई शहर)',
  'Mumbai Suburban (मुंबई उपनगर)',
  'Nagpur (नागपूर)',
  'Nanded (नांदेड)',
  'Nandurbar (नंदुरबार)',
  'Nashik (नाशिक)',
  'Dharashiv / Osmanabad (धाराशिव)',
  'Palghar (पालघर)',
  'Parbhani (परभणी)',
  'Pune (पुणे)',
  'Raigad (रायगड)',
  'Ratnagiri (रत्नागिरी)',
  'Sangli (सांगली)',
  'Satara (सातारा)',
  'Sindhudurg (सिंधुदुर्ग)',
  'Solapur (सोलापूर)',
  'Thane (ठाणे)',
  'Wardha (वर्धा)',
  'Washim (वाशिम)',
  'Yavatmal (यवतमाळ)'
];

const POPULAR_SEARCH_PILLS = [
  'PM-KUSUM Solar Pump',
  '★ Majhi Ladki Bahin',
  'Pik Vima (Crop Insurance 1₹)',
  'MahaDBT Post-Matric',
  'Sanjay Gandhi Niradhar',
  '7/12 Land Drip Subsidy'
];

interface FilterState {
  levelGov: string[];
  beneficiaryCat: string[];
  benefitType: string[];
  socialCat: string[];
  district: string;
  searchQuery: string;
  sectorTab: string;
  sortBy: 'relevant' | 'newest' | 'benefit_high';
}

// ─── Scheme Detail Modal ──────────────────────────────────────────────────────
function SchemeDetailModal({ scheme, onClose, onCheckEligibility }: { scheme: Scheme; onClose: () => void; onCheckEligibility: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {scheme.headerBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.variant === 'green'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : badge.variant === 'amber'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : badge.variant === 'blue'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{scheme.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5 font-medium">{scheme.nameMr}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Department */}
          <div className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-lg">🏛</span>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Governing Department</div>
              <div className="font-semibold text-slate-800">{scheme.department}</div>
            </div>
          </div>

          {/* Highlight Benefit Box */}
          <div className={`p-4 rounded-xl border ${scheme.highlightVariant === 'green'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : scheme.highlightVariant === 'amber'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : scheme.highlightVariant === 'purple'
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                : 'bg-blue-50/70 border-blue-200 text-blue-950'
            }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-current/10">
                <CheckIcon className="w-3.5 h-3.5" />
              </span>
              <span>{scheme.highlightTitle}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed pl-7">{scheme.highlightText}</p>
            <div className="mt-3 pl-7">
              <span className="inline-block bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                Total Benefit: {scheme.benefitAmount}
              </span>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About the Scheme</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{scheme.summary}</p>
          </div>

          {/* Target Beneficiaries */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Target Beneficiary Profile</h3>
            <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
              {scheme.targetBeneficiaryText}
            </p>
          </div>

          {/* Mandatory Civic Documents */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">Mandatory Civic Documents Required</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scheme.mandatoryDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Rules */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">Official Qualification Criteria</h3>
            <ul className="space-y-2">
              {scheme.eligibility.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3" />
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mode & Official Application Link */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Application Mode</div>
              <div className="text-sm font-bold text-slate-800">{scheme.applicationMode}</div>
            </div>
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
            >
              <span>Visit Official Govt Portal</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onCheckEligibility();
            }}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#1850b5] hover:bg-[#0f3675] rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            Check My Eligibility
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Schemes Page ────────────────────────────────────────────────────────
export function SchemesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSaved, toggleSave } = useSavedSchemes();
  const { showToast } = useToast();

  const initialQuery = searchParams.get('q') || '';
  const initialSector = searchParams.get('sector') || 'all';

  // Filter State initialized matching Stitch screen defaults
  const [filters, setFilters] = useState<FilterState>({
    levelGov: ['Maharashtra State Govt'],
    beneficiaryCat: ['Small / Marginal Farmer'],
    benefitType: [],
    socialCat: [],
    district: 'All 36 Districts (महाराष्ट्र सर्व जिल्हे)',
    searchQuery: initialQuery,
    sectorTab: initialSector,
    sortBy: 'relevant'
  });

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { t, language } = useLanguage();
  // REST API Dynamic Scheme State
  const [schemesList, setSchemesList] = useState<Scheme[]>(() => SchemeService.getAll());
  const [_isApiLoading, setIsApiLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setIsApiLoading(true);
    SchemeService.fetchAllAsync()
      .then((data: Scheme[]) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setSchemesList(data);
        }
      })
      .finally(() => {
        if (mounted) setIsApiLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Sync URL query updates
  useEffect(() => {
    const q = searchParams.get('q');
    const s = searchParams.get('sector');
    if (q !== null) {
      setFilters(prev => ({ ...prev, searchQuery: q }));
      setSearchInput(q);
    }
    if (s !== null) {
      setFilters(prev => ({ ...prev, sectorTab: s }));
    }
  }, [searchParams]);

  // Toggle bookmark using central persistent store
  const toggleBookmark = (id: string) => {
    toggleSave(id);
  };

  // Toggle helper for multi-select arrays
  const toggleCheckbox = (category: 'levelGov' | 'beneficiaryCat' | 'benefitType' | 'socialCat', val: string) => {
    setFilters(prev => {
      const list = prev[category];
      const nextList = list.includes(val) ? list.filter(item => item !== val) : [...list, val];
      return { ...prev, [category]: nextList };
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      levelGov: [],
      beneficiaryCat: [],
      benefitType: [],
      socialCat: [],
      district: 'All 36 Districts (महाराष्ट्र सर्व जिल्हे)',
      searchQuery: '',
      sectorTab: 'all',
      sortBy: 'relevant'
    });
    setSearchInput('');
  };

  // Search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery: searchInput }));
  };

  // Select quick popular pill
  const handlePopularPillClick = (pill: string) => {
    const cleanPill = pill.replace('★ ', '');
    setSearchInput(cleanPill);
    setFilters(prev => ({ ...prev, searchQuery: cleanPill }));
  };

  // Filter computation
  const filteredSchemes = useMemo(() => {
    return schemesList.filter(scheme => {
      // 1. Sector Tab filter
      if (filters.sectorTab !== 'all' && scheme.sector !== filters.sectorTab) {
        return false;
      }

      // 2. Search query filter with Intent & Synonym Recognition
      if (filters.searchQuery.trim()) {
        const rawQuery = filters.searchQuery.trim();
        const q = rawQuery.toLowerCase();

        // Exact substring checks
        const matchName = scheme.name.toLowerCase().includes(q);
        const matchMr = scheme.nameMr.toLowerCase().includes(q);
        const matchHi = (scheme.nameHi || '').toLowerCase().includes(q);
        const matchDept = scheme.department.toLowerCase().includes(q);
        const matchTags = scheme.tags.some(t => t.toLowerCase().includes(q));
        const matchSummary = scheme.summary.toLowerCase().includes(q);
        const matchBeneficiaries = scheme.targetBeneficiaries.some(b => b.toLowerCase().includes(q));

        if (matchName || matchMr || matchHi || matchDept || matchTags || matchSummary || matchBeneficiaries) {
          // Direct hit
        } else {
          // Concept & Intent matching (e.g. "find me schemes for farmers", "फाउंड स्कीम्स फॉर फार्मर्स", "sheti anudan")
          const intent = matchIntentFromQuery(rawQuery);
          if (intent.isMatchFound) {
            const sectorMatch = intent.matchedSectors.includes(scheme.sector);
            const tagMatch = scheme.tags.some(t => intent.matchedTags.includes(t.toLowerCase()));
            const catMatch = scheme.targetBeneficiaries.some(b =>
              intent.matchedCategories.some(c => b.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(b.toLowerCase()))
            );
            const tokenHit = extractQueryTokens(rawQuery).some(token =>
              token.length >= 3 && (
                scheme.name.toLowerCase().includes(token) ||
                scheme.nameMr.includes(token) ||
                scheme.summary.toLowerCase().includes(token) ||
                scheme.targetBeneficiaryText.toLowerCase().includes(token)
              )
            );

            if (!sectorMatch && !tagMatch && !catMatch && !tokenHit) {
              return false;
            }
          } else {
            // Check individual token hits of length >= 3
            const tokens = extractQueryTokens(rawQuery).filter(t => t.length >= 3);
            const hasAnyToken = tokens.some(token =>
              scheme.name.toLowerCase().includes(token) ||
              scheme.nameMr.includes(token) ||
              scheme.summary.toLowerCase().includes(token) ||
              scheme.tags.some(t => t.toLowerCase().includes(token)) ||
              scheme.targetBeneficiaries.some(b => b.toLowerCase().includes(token))
            );
            if (!hasAnyToken) {
              return false;
            }
          }
        }
      }

      // 3. Level of Gov filter
      if (filters.levelGov.length > 0) {
        const matchesMh = filters.levelGov.includes('Maharashtra State Govt') && (scheme.level === 'Maharashtra' || scheme.level === 'Joint');
        const matchesCentral = filters.levelGov.includes('Central Govt (Centrally Sponsored)') && (scheme.level === 'Central' || scheme.level === 'Joint');
        if (!matchesMh && !matchesCentral) {
          return false;
        }
      }

      // 4. Beneficiary category filter
      if (filters.beneficiaryCat.length > 0) {
        const matchesBeneficiary = filters.beneficiaryCat.some(cat => {
          const lowerCat = cat.toLowerCase();
          if (lowerCat.includes('farmer') && (scheme.sector === 'agriculture' || scheme.targetBeneficiaries.some(b => b.toLowerCase().includes('farmer')))) {
            return true;
          }
          if (lowerCat.includes('women') && (scheme.sector === 'women' || scheme.targetBeneficiaries.some(b => b.toLowerCase().includes('women')))) {
            return true;
          }
          if (lowerCat.includes('student') && (scheme.sector === 'education' || scheme.targetBeneficiaries.some(b => b.toLowerCase().includes('student')))) {
            return true;
          }
          return scheme.targetBeneficiaries.some(b => b.toLowerCase().includes(cat.toLowerCase().split('/')[0].trim()));
        });
        if (!matchesBeneficiary) {
          return false;
        }
      }

      return true;
    });
  }, [filters, schemesList]);

  // Sidebar Filter UI component (reused in desktop and mobile drawer)
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {(filters.levelGov.length > 0 || filters.beneficiaryCat.length > 0 || filters.benefitType.length > 0) && (
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Filters ({filters.levelGov.length + filters.beneficiaryCat.length + filters.benefitType.length})</div>
          <div className="flex flex-wrap gap-1.5">
            {filters.levelGov.map(l => (
              <span key={l} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                {l.replace(' Govt', '').replace(' (Centrally Sponsored)', '')}
                <button onClick={() => toggleCheckbox('levelGov', l)} className="hover:text-blue-900">
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.beneficiaryCat.map(b => (
              <span key={b} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                {b}
                <button onClick={() => toggleCheckbox('beneficiaryCat', b)} className="hover:text-blue-900">
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.benefitType.map(bt => (
              <span key={bt} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                {bt}
                <button onClick={() => toggleCheckbox('benefitType', bt)} className="hover:text-blue-900">
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Group 1: Level of Government */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <span>{t('Level of Government')}</span>
          <span className="text-slate-400 text-[10px]">▲</span>
        </div>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.levelGov.includes('Maharashtra State Govt')}
                onChange={() => toggleCheckbox('levelGov', 'Maharashtra State Govt')}
                className="w-4 h-4 rounded text-[#1850b5] border-slate-300 focus:ring-blue-500"
              />
              <span>{t('Maharashtra State Govt')}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">418</span>
          </label>
          <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.levelGov.includes('Central Govt (Centrally Sponsored)')}
                onChange={() => toggleCheckbox('levelGov', 'Central Govt (Centrally Sponsored)')}
                className="w-4 h-4 rounded text-[#1850b5] border-slate-300 focus:ring-blue-500"
              />
              <span>{t('Central Govt (Centrally Sponsored)')}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">114</span>
          </label>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Group 2: Beneficiary Category */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <span>{t('Beneficiary Category')}</span>
          <span className="text-slate-400 text-[10px]">▲</span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Small / Marginal Farmer', count: 144 },
            { label: 'Women & SHG Members', count: 76 },
            { label: 'Students & Youth (18-35)', count: 84 },
            { label: 'Senior Citizens (60+)', count: 42 },
            { label: 'Divyangjan (Persons with Disability)', count: 31 },
            { label: 'Rural Artisans / Traditional Labor', count: 27 },
          ].map(item => (
            <label key={item.label} className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.beneficiaryCat.includes(item.label)}
                  onChange={() => toggleCheckbox('beneficiaryCat', item.label)}
                  className="w-4 h-4 rounded text-[#1850b5] border-slate-300 focus:ring-blue-500"
                />
                <span>{t(item.label)}</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">{item.count}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Group 3: Benefit Type */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <span>{t('Benefit Type')}</span>
          <span className="text-slate-400 text-[10px]">▲</span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Direct Cash DBT to Bank', count: 210 },
            { label: 'Capital Subsidy on Equipment', count: 154 },
            { label: 'Tuition / Fee Waiver Scholarship', count: 78 },
            { label: 'Subsidized Bank Loan / Interest Subvention', count: 64 },
          ].map(item => (
            <label key={item.label} className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.benefitType.includes(item.label)}
                  onChange={() => toggleCheckbox('benefitType', item.label)}
                  className="w-4 h-4 rounded text-[#1850b5] border-slate-300 focus:ring-blue-500"
                />
                <span>{t(item.label)}</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">{item.count}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Group 4: Social Category / जात प्रवर्ग */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <span>{t('Social Category / जात प्रवर्ग')}</span>
          <span className="text-slate-400 text-[10px]">▲</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['General / Open', 'OBC', 'SC', 'ST', 'VJNT / NT-A', 'Minority'].map(cat => (
            <label key={cat} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.socialCat.includes(cat)}
                onChange={() => toggleCheckbox('socialCat', cat)}
                className="w-3.5 h-3.5 rounded text-[#1850b5] border-slate-300 focus:ring-blue-500"
              />
              <span>{t(cat)}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Group 5: Target District */}
      <div>
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('Target District (Maharashtra)')}</div>
        <select
          value={filters.district}
          onChange={e => setFilters(prev => ({ ...prev, district: e.target.value }))}
          className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MAHARASHTRA_DISTRICTS.map(dist => (
            <option key={dist} value={dist}>{t(dist)}</option>
          ))}
        </select>
      </div>

      {/* Bottom Callout: Uncertain of Eligibility? */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 mt-6">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
          ?
        </div>
        <h4 className="text-sm font-bold text-slate-900 mb-1">{t('Uncertain of Eligibility?')}</h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {t('Answer 4 basic questions about your landholding, income, and category to receive guaranteed matching schemes.')}
        </p>
        <button
          onClick={() => setIsEligibilityOpen(true)}
          className="text-xs font-bold text-[#1850b5] hover:text-[#0f3675] flex items-center gap-1 group"
        >
          <span>{t('Start 2-Min Wizard')}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      {/* ── 1. Top Government Ribbon ── */}
      <TopBar />

      {/* ── 2. Civic Navbar ── */}
      <Navbar />

      {/* ── 3. Breadcrumb & Live Data Sync Status Bar ── */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <span className="hover:text-blue-700 cursor-pointer" onClick={() => navigate('/')}>{t('nav.home')}</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">{t('nav.explore_schemes')}</span>
          </div>

          {/* Sync status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-slate-600 font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span>{t('Demonstration Workflow • MahaDBT & PM-Kisan Model')}</span>
            </div>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => showToast(t('Demonstration scheme database refreshed with latest Maharashtra benchmarks'), 'info')}
              className="flex items-center space-x-1 text-[#1850b5] hover:text-[#0f3675] font-semibold hover:underline"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
              <span>{t('Refresh Data')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Hero Section with Title & Right Stat Tiles ── */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Title & Description */}
            <div className="lg:col-span-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>532 Verified Active Schemes • Central & Maharashtra Portals</span>
              </div>

              {/* Headings */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f3675] tracking-tight leading-tight">
                {t('Explore Government Schemes')}
              </h1>
              <div className="text-lg sm:text-xl font-bold text-slate-700 mt-1">
                {language === 'mr' ? 'शासकीय योजना शोधा व थेट हक्काचा लाभ मिळवा' : language === 'hi' ? 'सरकारी योजना खोजें और प्रत्यक्ष लाभ प्राप्त करें' : 'Discover Government Schemes & Direct Benefits'}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-2.5 max-w-3xl">
                {t('Search, filter, and compare 532+ verified welfare, subsidy, and scholarship initiatives across all 36 districts of Maharashtra. Check real-time qualification rules, mandatory 7/12 land records, and direct MahaDBT application links.')}
              </p>
            </div>

            {/* Right Stat Cards */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              {/* Stat 1: 38 Departments */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center space-x-3.5 w-full sm:w-64 lg:w-72 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  🏛
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('Central & State Portals')}</div>
                  <div className="text-xl font-extrabold text-[#0f3675]">38 {t('Departments')}</div>
                </div>
              </div>

              {/* Stat 2: 100% Aadhaar DBT */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center space-x-3.5 w-full sm:w-64 lg:w-72 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  ₹
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('Direct Benefit Transfers')}</div>
                  <div className="text-xl font-extrabold text-emerald-800">100% Aadhaar DBT</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-6">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <SearchIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder={t('Search by scheme name, sector, or benefit (e.g. drip irrigation, tractor subsidy, ladki bahin, scholar...)')}
                  className="w-full pl-11 pr-36 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1850b5] focus:border-transparent transition-all shadow-xs"
                />
                {/* Voice Search inside bar */}
                <button
                  type="button"
                  onClick={() => showToast(t('Simulated speech recognition: Speak in Marathi, Hindi, or English...'), 'info')}
                  className="absolute inset-y-1.5 right-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#1850b5] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MicIcon className="w-3.5 h-3.5" />
                  <span>{t('Voice Search (बोलून शोधा)')}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#1850b5] hover:bg-[#0f3675] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]"
              >
                <span>{t('Search Schemes')}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex items-center gap-2 mt-3.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">{t('Popular Searches:')}</span>
            {POPULAR_SEARCH_PILLS.map(pill => (
              <button
                key={pill}
                onClick={() => handlePopularPillClick(pill)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${pill.includes('Majhi Ladki')
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/50'
                  }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Category Navigation Tabs ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto py-3 no-scrollbar">
            {SECTORS_LIST.map(tab => {
              const isActive = filters.sectorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilters(prev => ({ ...prev, sectorTab: tab.id }))}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${isActive
                    ? 'bg-[#1850b5] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-transparent'
                    }`}
                >
                  <span>{tab.title}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}>
                    {tab.schemesCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Main 2-Column Content: Sidebar Filters + Schemes Cards ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left Column: Filters Sidebar (Desktop) ── */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span>⚙</span>
                  <span>Filter Schemes</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#1850b5] hover:underline"
                >
                  Reset All
                </button>
              </div>

              <div className="pt-4">
                <FilterSidebar />
              </div>
            </div>
          </aside>

          {/* ── Right Column: Scheme Cards List ── */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-4">

            {/* Results Header Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  <span>⚙ Filter Schemes</span>
                </button>

                <div className="text-sm font-bold text-slate-900">
                  <span className="text-[#1850b5]">{filteredSchemes.length} Schemes</span>
                  <span className="text-slate-500 font-medium ml-1">
                    found {filters.sectorTab !== 'all' ? `in ${SECTORS_LIST.find(s => s.id === filters.sectorTab)?.title}` : 'across all sectors'}
                  </span>
                </div>
              </div>

              {/* Sort & View Mode */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-medium">Sort By:</span>
                  <select
                    value={filters.sortBy}
                    onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="newest">Newest First</option>
                    <option value="benefit_high">Highest Financial Benefit</option>
                  </select>
                </div>

                {/* View switcher */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'}`}
                    title="List View"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'}`}
                    title="Grid View"
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scheme Cards Container */}
            {filteredSchemes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Schemes Match Your Filter</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
                  Try clearing some filter criteria, broadening your search term, or selecting "All Schemes".
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#1850b5] text-white rounded-xl text-sm font-semibold hover:bg-[#0f3675] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                {filteredSchemes.map(scheme => {
                  const itemSaved = isSaved(scheme.id);

                  return (
                    <article
                      key={scheme.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                      style={{
                        borderLeftWidth: '5px',
                        borderLeftColor:
                          scheme.accentColor === 'emerald'
                            ? '#10b981'
                            : scheme.accentColor === 'amber'
                              ? '#f59e0b'
                              : scheme.accentColor === 'indigo'
                                ? '#6366f1'
                                : '#2563eb'
                      }}
                    >
                      <div className="p-5 sm:p-6">
                        {/* Top Badges & Bookmark */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {scheme.headerBadges.map((badge, idx) => (
                              <span
                                key={idx}
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.variant === 'green'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : badge.variant === 'amber'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : badge.variant === 'blue'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                              >
                                {badge.text}
                              </span>
                            ))}
                          </div>
                          <BookmarkIcon saved={itemSaved} onClick={() => toggleBookmark(scheme.id)} />
                        </div>

                        {/* Title & Department */}
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug hover:text-blue-700 transition-colors cursor-pointer" onClick={() => setSelectedScheme(scheme)}>
                          {language === 'mr' ? (scheme.nameMr || scheme.name) : language === 'hi' ? (scheme.nameHi || scheme.nameMr || scheme.name) : scheme.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                          <span>🏢</span>
                          <span>{t(scheme.department)}</span>
                        </div>

                        {/* Highlight Subsidy / Benefit Callout Box */}
                        <div className={`mt-3.5 p-3.5 rounded-xl border ${scheme.highlightVariant === 'green'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : scheme.highlightVariant === 'amber'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : scheme.highlightVariant === 'purple'
                              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                              : 'bg-blue-50/70 border-blue-200 text-blue-950'
                          }`}>
                          <div className="text-xs leading-relaxed font-medium">
                            <strong className="font-bold mr-1">{t(scheme.highlightTitle)}</strong>
                            {t(scheme.highlightText)}
                          </div>
                        </div>

                        {/* 2-Column Info Grid: Target Beneficiary + Mandatory Documents */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 pt-3.5 border-t border-slate-100 text-xs">
                          {/* Target Beneficiary */}
                          <div className="md:col-span-6">
                            <div className="font-bold text-slate-500 mb-1 flex items-center gap-1">
                              <span>🎯</span>
                              <span>{t('Target Beneficiary:')}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-medium">
                              {t(scheme.targetBeneficiaryText)}
                            </p>
                          </div>

                          {/* Mandatory Civic Documents */}
                          <div className="md:col-span-6">
                            <div className="font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                              <span>📄</span>
                              <span>{t('Mandatory Civic Documents:')}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {scheme.mandatoryDocs.map((doc, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-50/80 text-blue-800 border border-blue-200/80 rounded-md px-2 py-0.5 font-semibold text-[11px]"
                                >
                                  {t(doc)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Actions Bar */}
                      <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                          {scheme.bottomMeta.icon === 'mode' && <span>🌐</span>}
                          {scheme.bottomMeta.icon === 'beneficiaries' && <span>👥</span>}
                          {scheme.bottomMeta.icon === 'deadline' && <span>⏰</span>}
                          <span>{t(scheme.bottomMeta.text)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (scheme.id === 'saur-krushi-vahini') {
                                navigate('/scheme/saur-krushi-vahini');
                              } else {
                                setSelectedScheme(scheme);
                              }
                            }}
                            className="px-4 py-2 bg-white hover:bg-slate-100 text-[#1850b5] border border-blue-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>{t('View Details')}</span>
                          </button>
                          <button
                            onClick={() => setIsEligibilityOpen(true)}
                            className="px-4 py-2 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs active:scale-[0.98]"
                          >
                            <CheckIcon className="w-3.5 h-3.5" />
                            <span>{t('Check My Eligibility')}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── 7. Mobile Filters Drawer ── */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <span className="font-bold text-slate-900">Filter Schemes</span>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <XIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <FilterSidebar />
            </div>
            <div className="pt-4 border-t border-slate-100 mt-6">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#1850b5] text-white font-bold rounded-xl text-sm"
              >
                Show {filteredSchemes.length} Schemes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. Modals ── */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onCheckEligibility={() => setIsEligibilityOpen(true)}
        />
      )}

      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        currentLang="en"
      />

      {/* ── 9. Civic Footer ── */}
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

export default SchemesPage;
