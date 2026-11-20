import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Download,
  ExternalLink,
  Layers,
  Shield,
  FileText
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';

export function BenefitSynergyPage() {
  const { t, language } = useLanguage();
  const { fontSizeOffset } = useAccessibility();

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f4f7fc] text-slate-900 selection:bg-blue-100 selection:text-blue-900"
      style={{ fontSize: `${100 + fontSizeOffset * 6}%` }}
    >
      {/* 1. Official Government Top Accessibility Bar */}
      <TopBar />

      {/* 2. Main Civic Navigation Header */}
      <Navbar />

      {/* 3. Breadcrumb & Status */}
      <section className="bg-white border-b border-slate-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            GramSathi AI / {t('Direct Benefits & Welfare')} / <strong className="text-slate-800">{t('Citizen Services')}</strong>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{t('Demonstration Workflow • MahaDBT & PM-Kisan Model')}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Title Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-blue-700 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{t('MULTI-SCHEME OPTIMIZATION & ANTI-DUPLICATION ENGINE')}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f3675] tracking-tight">
                {t('Scheme Combination & Benefit Synergy Analysis')}{' '}
                <span className="text-xl sm:text-2xl font-bold text-slate-700 block sm:inline">
                  {language === 'mr' ? '(योजना संयोग व समन्वय मूल्यांकन)' : language === 'hi' ? '(योजना संयोजन एवं समन्वय विश्लेषण)' : '(Scheme Combination & Synergy Analysis)'}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {t('Evaluate how departmental agricultural, water, and energy schemes can be jointly utilized for your parcel without violating CAG double-subsidy prohibitions. Review compatibility rules, statutory exclusions, and separate survey mandates.')}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="self-start lg:self-center shrink-0 inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>{t('Download Advisory PDF')}</span>
            </button>
          </div>
        </div>

        {/* Statutory Public Advisory: Anti-Double Subsidy Rule Banner */}
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-5 text-xs text-red-950 space-y-2">
          <div className="flex items-center space-x-2.5 font-bold text-red-900 text-sm">
            <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <span>{t('महत्त्वाची वैधानिक सूचना (Statutory Public Advisory: Anti-Double Subsidy Rule)')}</span>
          </div>
          <p className="leading-relaxed pl-9 text-slate-700">
            {t('Government subsidies cannot be automatically bunched, co-funded on the same physical asset, or claimed through a single combined voucher. Each approved scheme requires an independent online application via official portals (MahaDBT / Mahavitaran), autonomous field survey, geo-tagged GPS photographs, and separate empanelled vendor billing. Claiming duplicate subsidies on the same physical machinery is a punishable civil offense under Maharashtra Audit Norms.')}
          </p>
        </div>

        {/* 4 Analytics Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t('Analyzed Programs')}</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">04 {t('Schemes')}</div>
            <div className="text-[11px] text-slate-600">{t('Cross-referenced for 2.5 Acres land')}</div>
            <div className="text-[10px] font-bold text-emerald-700 pt-1">✓ {t('Verified against 2024-25 GRs')}</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t('Recommended Package')}</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-700">01 {t('Synergy')}</div>
            <div className="text-[11px] text-slate-600">{t('Solar Pump + Drip Irrigation')}</div>
            <div className="text-[10px] font-bold text-blue-700 pt-1">● {t('Safe concurrent filing allowed')}</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t('Conflict Interceptions')}</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-red-600">01 {t('Prohibited')}</div>
            <div className="text-[11px] text-slate-600">{t('Dual Solar Capital Subsidies')}</div>
            <div className="text-[10px] font-bold text-red-700 pt-1">⚠️ {t('Exclusion enforced by CAG')}</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t('Combined Public Relief')}</span>
              <span className="text-xs font-bold text-slate-400">₹</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">₹2,45,000</div>
            <div className="text-[11px] text-slate-600">{t('Maximum cumulative state aid')}</div>
            <div className="text-[10px] font-bold text-slate-500 pt-1">🧾 {t('Requires 2 separate invoices')}</div>
          </div>
        </div>

        {/* Compatibility Index Legend Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-bold text-slate-800 flex items-center space-x-2">
            <span>{t('Maharashtra Civic Scheme Compatibility Index')}</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="inline-flex items-center space-x-1.5 font-semibold text-blue-800">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>{t('Fully Compatible (Safe)')}</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 font-semibold text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>{t('Conditional (Clearance Needed)')}</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 font-semibold text-red-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>{t('Mutually Exclusive (Illegal)')}</span>
            </span>
          </div>
        </div>

        {/* Section 1: Recommended Complementary Synergy (Safe to Combine) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t('Recommended Complementary Synergy (Safe to Combine)')}
              </h2>
            </div>

            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {t('Compatible Asset Categories • Concurrent Filing')}
            </span>
          </div>

          {/* Optimal Combo Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-200/60 px-2 py-0.5 rounded">
                  {t('OPTIMAL COMBO Target Need: Reliable Daytime Irrigation & Low Water Consumption')}
                </span>
                <h3 className="text-lg font-black text-[#0f3675] mt-1.5">
                  {t('Solar Agricultural Pumping (MSKVY 2.0 / PM-KUSUM) + Micro-Drip Irrigation System (PMKSY)')}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed max-w-3xl mt-1">
                  <strong>{t('Technical Synergy Rationale:')}</strong> {t('The solar pump provides independent zero-cost electrical extraction from your existing dug well during peak sunshine hours. The micro-drip system regulates that flow with pressurized filtration, conserving water by up to 55% and preventing over-extraction from the 2.5-acre aquifer.')}
                </p>
              </div>

              {/* Combined Value Pill */}
              <div className="bg-white rounded-xl border border-blue-200 p-4 text-center shrink-0 min-w-[200px]">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Combined Farmer Direct Value</div>
                <div className="text-2xl font-black text-blue-950 mt-0.5">₹1,95,000</div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">Ramesh Gaikwad Share: ~₹24,500 total</div>
              </div>
            </div>
          </div>

          {/* 2 Components Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Component 1 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-800 uppercase text-[10px] bg-blue-100/70 px-2 py-0.5 rounded">
                  Component 1: Water Extraction
                </span>
                <span className="font-semibold text-slate-500">Mahavitaran / MSEDCL</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                Mukhyamantri Saur Krushi Vahini Yojana (MSKVY 2.0 / PM-KUSUM Component-B)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provision of 3 HP / 5 HP DC surface/submersible solar agricultural pumps with 90% combined central and state subsidy.
              </p>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subsidy Amount:</span>
                  <strong className="text-emerald-700">90% of Capital Cost (Approx. ₹1,42,000)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer Contribution:</span>
                  <strong className="text-slate-800">10% (₹15,000 for 3 HP)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Eligibility Check:</span>
                  <span className="text-slate-700">0.5 to 2.5 Acres, Dug Well, No Grid Pump</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ramesh Profile Fit:</span>
                  <span className="text-emerald-700 font-bold">✓ 100% Eligible (2.5 Acres)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Portal: mahadiscom / solar-mskvy</span>
                <Link to="/scheme/saur-krushi-vahini" className="text-blue-700 font-bold hover:underline flex items-center space-x-1">
                  <span>View Guidelines</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Component 2 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800 uppercase text-[10px] bg-emerald-100/70 px-2 py-0.5 rounded">
                  Component 2: Water Conveyance
                </span>
                <span className="font-semibold text-slate-500">Krishi Vibhag (Mahagov)</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct bank transfer subsidy for inline/online micro-drip irrigation infrastructure covering up to 2.5 Hectares.
              </p>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subsidy Amount:</span>
                  <strong className="text-emerald-700">80% for Small Farmers (Approx. ₹53,000)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer Contribution:</span>
                  <strong className="text-slate-800">20% (Approx. ₹9,500)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Eligibility Check:</span>
                  <span className="text-slate-700">Permanent Water Source Registered on 7/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ramesh Profile Fit:</span>
                  <span className="text-emerald-700 font-bold">✓ 100% Eligible (Well on 7/12)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">Portal: mahadbt.maharashtra.gov.in</span>
                <a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline flex items-center space-x-1">
                  <span>View Guidelines</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Why This Combination is Permitted & Strict Audit Safeguards */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Why This Combination is Permitted & Strict Audit Safeguards:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <strong className="font-bold text-slate-900 block">Distinct Asset Codes</strong>
                <p className="text-slate-600 leading-relaxed">
                  Solar panels and inverters fall under Energy Equipment (Item #01-302). Drip lines, filters, and venturis fall under Agricultural Hardware (Item #AG-104). No asset overlap exists.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <strong className="font-bold text-slate-900 block">Independent GST Invoices</strong>
                <p className="text-slate-600 leading-relaxed">
                  You must have two distinct invoices: one issued by the MSEDCL-contracted solar vendor (e.g. Tata Power / Medha), and one by the empanelled drip manufacturer (e.g. Jain Irrigation / Netafim).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <strong className="font-bold text-slate-900 block">Dual Field Verification</strong>
                <p className="text-slate-600 leading-relaxed">
                  Field officers will conduct two separate visits: MSEDCL Junior Engineer for pump synchronization, and Krishi Sahayak (Agri Assistant) for drip lateral spacing verification.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Civic Footer */}
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
    </div>
  );
}

export default BenefitSynergyPage;
