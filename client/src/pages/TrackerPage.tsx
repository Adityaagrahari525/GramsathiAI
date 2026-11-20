import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Upload,
  Download,
  ExternalLink,
  Volume2,
  Building2,
  ArrowRight,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  Check
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';
import { useJourneyTracker } from '../context/JourneyTrackerContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';

export function TrackerPage() {
  const {
    journey,
    hasUploaded8A,
    isSyncingDigiLocker,
    syncDigiLocker,
    upload8A,
    downloadDossier,
    setStage,
    toggleStageCompletion
  } = useJourneyTracker();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { fontSizeOffset } = useAccessibility();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isStage1Open, setIsStage1Open] = useState(false);
  const [activeDocModal, setActiveDocModal] = useState<string | null>(null);

  const handleAudioGuide = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const text =
        "Mukhyamantri Saur Krushi Vahini Yojana 2.0 Application Tracker. " +
        "You are currently at Stage 2: Required Document Dossier. 5 out of 6 documents are verified and ready. " +
        "Please upload a fresh 8-A land extract or fetch it directly from Aaple Sarkar DigiLocker to unlock Stage 3.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleDigiLockerSync = async () => {
    await syncDigiLocker();
  };

  const handleUploadFile = () => {
    upload8A();
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f4f7fc] text-slate-900 selection:bg-blue-100 selection:text-blue-900"
      style={{ fontSize: `${100 + fontSizeOffset * 6}%` }}
    >
      {/* 1. Official Government Top Accessibility Bar */}
      <TopBar />

      {/* 2. Main Civic Navigation Header */}
      <Navbar />

      {/* 3. Breadcrumb & Sync Status */}
      <section className="bg-white border-b border-slate-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            GramSathi AI / {t('Direct Benefits & Welfare')} / <strong className="text-slate-800">{t('Scheme Journey & Tracker')}</strong>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            {journey.persistenceMode === 'cloud_mongodb' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>MongoDB Atlas Connected • Auto-Saved</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Local Demonstration Mode (Offline Storage)</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 4. Statutory Civic Disclaimer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 sm:p-4 text-xs text-amber-950 leading-relaxed flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Civic Notice:</strong> GramSathi AI is a civic preparation and dossier readiness assistant. Official statutory application submission, biometric e-KYC, field survey, and subsidy sanction take place exclusively on Government of Maharashtra portals (MahaDBT / Mahavitaran). Until an official statutory registration number is issued, this application is not officially submitted to the government.
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Hero Scheme Card Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Department of Energy & Agriculture
                </span>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  PM-KUSUM Component B
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  90% Government Subsidy
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f3675] tracking-tight">
                Mukhyamantri Saur Krushi Vahini Yojana 2.0 (Solar Agri Pump Scheme)
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                3 HP DC Solar Agriculture Pump • Farmer Contribution: 10% (₹16,500/-)
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl shrink-0">
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Total Stages</div>
                <div className="text-lg font-black text-slate-800">5 Stages</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Document Status</div>
                <div className="text-lg font-black text-blue-700">
                  {hasUploaded8A ? '6 / 6 Ready' : '5 / 6 Ready'}
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Persistence</div>
                <div className="text-xs font-black text-slate-800">
                  {journey.persistenceMode === 'cloud_mongodb' ? (
                    <span className="text-emerald-700">MongoDB Atlas</span>
                  ) : (
                    <span className="text-amber-700">Local / Demo</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scheme Journey Map (Horizontal 5-Stage Stepper: Eligibility → Documents → Application → Verification → Benefit) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-slate-900">
                Scheme Journey Map: Eligibility → Documents → Application → Verification → Benefit
              </span>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {hasUploaded8A ? 'Stage 2 Complete • Ready for Stage 3' : 'Currently at Stage 2'}
            </span>
          </div>

          {/* Stepper Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                num: 1,
                title: 'Eligibility',
                desc: 'Deterministic Assessment: 4 of 4 statutory criteria verified (TRUE).',
                meta: 'Criteria Passed • Rule Verified'
              },
              {
                num: 2,
                title: 'Documents',
                desc: hasUploaded8A
                  ? 'Document Dossier: 6 of 6 verified documents ready.'
                  : 'Document Dossier: 5 of 6 verified, 1 pending action.',
                meta: hasUploaded8A ? 'Verified Gazette Checklist • 100%' : '8-A Extract Pending • 90%'
              },
              {
                num: 3,
                title: 'Application',
                desc: 'Portal Submission: Submit formal application dossier on Mahavitaran portal.',
                meta: journey.isStage3Unlocked ? 'Ready to Apply' : 'Unlocks after document dossier'
              },
              {
                num: 4,
                title: 'Verification',
                desc: 'Field Survey & Verification: Inspection by Circle Talathi & MSEDCL engineer.',
                meta: 'Well Geo-tagging & Technical NOC'
              },
              {
                num: 5,
                title: 'Benefit',
                desc: 'Subsidy & Benefit Release: 90% capital subsidy sanction and pump installation.',
                meta: 'Direct DBT / Vendor Subsidy Disbursement'
              }
            ].map((stage) => {
              const isCompleted = journey.completedStages?.includes(stage.num);
              const isActive = journey.currentStage === stage.num;
              return (
                <div
                  key={stage.num}
                  onClick={() => setStage(stage.num)}
                  className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-2 border-blue-600 bg-blue-50/60 shadow-xs'
                      : isCompleted
                      ? 'border border-emerald-300 bg-emerald-50/50'
                      : 'border border-slate-200 bg-slate-50/60 opacity-80 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : stage.num}
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isCompleted
                              ? 'text-emerald-800 bg-emerald-100'
                              : isActive
                              ? 'text-blue-900 bg-blue-100'
                              : 'text-slate-500 bg-slate-200'
                          }`}
                        >
                          {isCompleted ? 'Completed' : isActive ? 'Active Stage' : `Stage ${stage.num}`}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`text-xs font-bold uppercase ${
                        isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      Stage {stage.num}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{stage.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{stage.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span
                      className={`font-semibold ${
                        isCompleted ? 'text-emerald-800' : isActive ? 'text-blue-800' : 'text-slate-500'
                      }`}
                    >
                      {stage.meta}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStageCompletion(stage.num);
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-900 underline ml-1"
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {isCompleted ? 'Done ✓' : 'Mark'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom helper action */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-1.5 text-blue-900 font-semibold">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Stage 2 Next Action:{' '}
                {hasUploaded8A
                  ? 'All documents complete! You can now generate your consolidated dossier.'
                  : 'Please upload fresh 8-A extract or fetch directly from Aaple Sarkar.'}
              </span>
            </div>
            <div className="text-slate-400">
              💾 Progress Auto-Saved
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Active Stage Dossier & Documents (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Dossier Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Active Stage
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Stage 2: Required Document Dossier
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {hasUploaded8A
                      ? 'All 6 required documents for the Solar Agriculture Pump scheme are verified and ready.'
                      : '5 of 6 required documents for the Solar Agriculture Pump scheme are verified and ready.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAudioGuide}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Audio Guidance"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveDocModal('Digital Application Dossier (Consolidated PDFs)')}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Preview Dossier ({hasUploaded8A ? '6 PDFs' : '5 PDFs'})</span>
                  </button>
                </div>
              </div>

              {/* Document Checklist Items */}
              <div className="space-y-3">
                {/* 1. 7/12 Extract */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">7/12 Land Record Extract (Saat-Baara)</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Ready (Verified)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Gat No. 112/2, Area: 1.09 Hectare • Digitally Signed • Mahabhumi Portal Verified
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDocModal('7/12 Land Record Extract')}
                    className="self-end sm:self-center px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    View
                  </button>
                </div>

                {/* 2. Aadhaar Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">Aadhaar Card</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Ready (Verified)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        XXXX-XXXX-5921 • NPCI DBT Bank Seeded • Mobile OTP Verified
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDocModal('Aadhaar Card')}
                    className="self-end sm:self-center px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    View
                  </button>
                </div>

                {/* 3. Caste Certificate */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">Caste Certificate & Non-Creamy Layer (OBC)</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Ready (Verified)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Competent Authority Cert No. MH-PUN-OBC-09214 • Valid until March 31, 2026
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDocModal('Caste Certificate')}
                    className="self-end sm:self-center px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    View
                  </button>
                </div>

                {/* 4. Bank Passbook */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">Bank Passbook / Cancelled Cheque</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Ready (Verified)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Bank of Maharashtra, Baramati Branch • A/C No. XXXXXXXX4530 • IFSC MAHB0000123
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDocModal('Bank Passbook')}
                    className="self-end sm:self-center px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    View
                  </button>
                </div>

                {/* 5. Farm Well Self-Declaration */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">Farm Well Self-Declaration</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Ready (Verified)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Confirmed existing open dug well/borewell without prior agricultural power connection
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDocModal('Farm Well Self-Declaration')}
                    className="self-end sm:self-center px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    View
                  </button>
                </div>

                {/* 6. 8-A Land Record (Action Required or Complete) */}
                <div className={`p-4 rounded-xl border ${
                  hasUploaded8A ? 'border-emerald-300 bg-emerald-50/40' : 'border-blue-400 bg-blue-50/40'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">8-A Land Khata Record Extract</span>
                          {hasUploaded8A ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Verified via DigiLocker
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-white bg-blue-800 px-2 py-0.5 rounded">
                              Action Required
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {hasUploaded8A
                            ? 'Digitally signed 8-A record successfully linked to dossier.'
                            : 'Needs fresh post-April 2024 digitally signed 8-A record with verifiable QR code.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!hasUploaded8A && (
                    <div className="mt-3 pt-3 border-t border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-900">Option 1: Aaple Sarkar DigiLocker Sync (Simulated)</strong>
                        <div className="text-[11px] text-slate-500">Simulate 1-minute download via Aadhaar (Demonstration Mode).</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleDigiLockerSync}
                          disabled={isSyncingDigiLocker}
                          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center space-x-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDigiLocker ? 'animate-spin' : ''}`} />
                          <span>{isSyncingDigiLocker ? 'Syncing...' : 'Fetch from DigiLocker (Demo)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleUploadFile}
                          className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs flex items-center space-x-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stage 1 Summary Collapsible */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setIsStage1Open(!isStage1Open)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Stage 1 Summary: Eligibility Criteria Approved
                    </h4>
                    <p className="text-xs text-slate-500">Verified by GramSathi AI on Nov 10, 2024</p>
                  </div>
                </div>
                {isStage1Open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isStage1Open && (
                <div className="p-5 pt-0 border-t border-slate-100 text-xs text-slate-700 space-y-2 bg-slate-50/50">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span>Agricultural Landholding:</span>
                    <strong className="text-slate-900">1.09 Hectares (Eligible for 3 HP / 5 HP)</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span>Verified Water Source:</span>
                    <strong className="text-slate-900">Perennial Open Well recorded on 7/12</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span>Conventional Grid Connection:</span>
                    <strong className="text-slate-900">None (Eligible for Off-Grid Solar)</strong>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Beneficiary Quota Category:</span>
                    <strong className="text-slate-900">OBC (10% Farmer Share: ₹16,500)</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Citizen Advisory for Stages 3 & 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <span>Citizen Advisory for Stages 3 & 4</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <strong className="block font-bold text-slate-900 mb-1">
                    Joint Landholder No-Objection Certificate (NOC)
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    If multiple names appear on your 7/12 land extract, keep a stamped consent letter from co-holders ready for the Mahavitaran junior engineer field survey.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <strong className="block font-bold text-slate-900 mb-1">
                    Agricultural Well Geo-Tagging
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    During Stage 4 field inspection, ensure water depth is visible and GPS coordinates match your 7/12 Gat number.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar Action & Guidance (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Next Step Action Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 sticky top-24">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                ● Next Step
              </span>

              <h3 className="text-base font-bold text-slate-900 mt-2">
                Complete Documents & Unlock Stage 3 (Official Application)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Once the 8-A extract is submitted, your complete Digital Dossier (ZIP & consolidated PDF) will be prepared, and direct application links to Mahavitaran will unlock.
              </p>

              {/* Progress Bar */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Local Dossier Readiness</span>
                  <span className="text-blue-700 font-bold">{hasUploaded8A ? '100% (6/6 Documents)' : '90% (5/6 Documents)'}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: hasUploaded8A ? '100%' : '90%' }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                {!hasUploaded8A ? (
                  <button
                    onClick={handleUploadFile}
                    className="w-full flex items-center justify-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow transition-all hover:shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload 8-A Land Extract</span>
                  </button>
                ) : (
                  <a
                    href="https://www.mahadiscom.in/solar_MSKVY/index_mr.html"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow transition-all hover:shadow-md"
                  >
                    <span>Proceed to Mahavitaran Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={downloadDossier}
                  className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download Ready Dossier (PDF)</span>
                </button>
              </div>
            </div>

            {/* Official Mahavitaran Portal Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Official Mahavitaran Portal</span>
              </div>
              <div className="text-[11px] text-slate-500 mb-3">Govt of Maharashtra Official Domain</div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 mb-3">
                <div className="text-slate-500 text-[10px] uppercase font-bold">Official URL:</div>
                <a
                  href="https://www.mahadiscom.in/solar_MSKVY/index_mr.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 font-bold hover:underline break-all block"
                >
                  mahadiscom.in/solar-mskvy ↗
                </a>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Mahavitaran Solar Helpline:</div>
                <div className="text-sm font-extrabold text-blue-950 mt-0.5">1912 / 1800-233-3435</div>
                <div className="text-[10px] text-slate-500">24x7 Toll-Free</div>
              </div>

              <p className="text-[10px] text-slate-500 italic mt-3">
                * Notice: Only enter your personal and bank credentials on official government .gov.in or mahadiscom.in domains.
              </p>
            </div>

            {/* Citizen Assistance & Sharing Options */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Citizen Assistance & Sharing Options
              </div>

              <div className="space-y-2 text-xs">
                <a
                  href="https://wa.me/?text=GramSathi%20Scheme%20Tracker"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Receive Updates via WhatsApp</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors font-medium text-left"
                >
                  <span className="flex items-center space-x-2">
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Print Scheme Journey Roadmap (PDF)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <a
                  href="https://aaplesarkar.mahaonline.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Find Nearest Aaple Sarkar CSC Center</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Village Level Civic Support */}
            <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-5 text-xs text-blue-950">
              <div className="flex items-center space-x-2 font-bold mb-1">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Village Level Civic Support</span>
              </div>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                Baramati Rural Agriculture Support Desk • Talathi & Gram Sevak available Mon-Fri 10 AM - 5 PM.
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Document View Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">{activeDocModal}</h3>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-2 border border-slate-200">
              <div><strong>Status:</strong> <span className="text-emerald-700 font-bold">Verified on File</span></div>
              <div><strong>Source:</strong> Digitally signed from MahaBhumi / UIDAI e-KYC archive</div>
              <div><strong>Verification Hash:</strong> SHA256-MH-492194821049</div>
              <div><strong>Validity:</strong> Current Financial Year 2024-25</div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast(`Downloading simulated copy: ${activeDocModal || 'Document'}.pdf`, 'info');
                  setActiveDocModal(null);
                }}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
              >
                Download Copy
              </button>
            </div>
          </div>
        </div>
      )}

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

export default TrackerPage;
