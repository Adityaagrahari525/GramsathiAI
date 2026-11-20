import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCitizenProfile } from '../context/CitizenProfileContext';
import { useJourneyTracker } from '../context/JourneyTrackerContext';
import { useLanguage } from '../context/LanguageContext';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';

export function EligibilityResultsPage() {
  const navigate = useNavigate();
  const { profile } = useCitizenProfile();
  const { downloadDossier, hasUploaded8A } = useJourneyTracker();
  const { t, language } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioReadout = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }
    if ('speechSynthesis' in window) {
      const text =
        "Eligibility Evaluation Results. " +
        "Citizen profile assessed: Ramesh Dattatray Gaikwad. " +
        "Evaluation outcome: One flagship scheme match. " +
        "Mukhyamantri Saur Krushi Vahini Yojana 2.0 under PM-KUSUM. " +
        "You are eligible for 90 percent capital subsidy for a 3 HP DC solar agriculture water pump. " +
        "Estimated farmer contribution is 22 thousand 400 rupees. " +
        "Your document readiness score is 5 out of 6 ready. " +
        "Please update your 8-A extract to complete your application.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* ── 1. Top Civic Government Ribbon ── */}
      <div className="print:hidden">
        <TopBar />
      </div>

      {/* ── 2. Civic Navbar ── */}
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* ── 3. Page Header & Actions ── */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Eligibility Results')} <span className="text-[#1850b5]">({language === 'mr' ? 'योजना पात्रता निकाल' : language === 'hi' ? 'योजना पात्रता परिणाम' : 'Eligibility Evaluation Results'})</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed font-medium">
              {t('Based on your self-declared landholding, caste category, and water source profile, review your tailored subsidy matches, validation safeguards, and next statutory steps.')}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 print:hidden">
            <button
              onClick={handleAudioReadout}
              className="px-4 py-2 bg-blue-50/80 hover:bg-blue-100/80 text-[#1850b5] border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>🔊</span>
              <span>{isPlayingAudio ? 'थांबवा (Stop)' : 'ऐका ऑडिओ (Audio Readout)'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>🖨</span>
              <span>Print Summary</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. Main Body ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">

        {/* ── 4.1 Official Government Verification Notice ── */}
        <div className="bg-blue-50/60 border border-blue-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs mt-0.5">
            🏛
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-extrabold text-[#0f3675]">
                Official Government Verification Notice (अधिकृत शासकीय सूचना)
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.2 rounded-md border border-amber-200">
                Advisory Only
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              GramSathi AI provides provisional advisory matching in strict accordance with gazetted Government Resolutions (GRs) of the Department of Agriculture and MSEDCL. Final grant sanction is contingent upon field verification by the Circle Talathi, Gram Sevak, and Sub-Divisional Agriculture Officer (SDAO). No automated sanction or guaranteed fund disbursement is implied by this digital assessment.
            </p>
          </div>
        </div>

        {/* ── 4.2 Citizen Profile Assessed & Evaluation Outcome Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* Left: Profile Assessed Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CITIZEN PROFILE ASSESSED</div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {profile?.name || 'Ramesh Dattatray Gaikwad'} <span className="text-sm font-medium text-slate-500">({profile?.nameMr || 'रमेश दत्तात्रय गायकवाड'})</span>
              </h2>
            </div>

            {/* 4 Mini Demographic Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Landholding</div>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">{profile?.landholdingAcres || '2.50'} Acres</div>
                <div className="text-[10px] text-slate-500 font-medium">({profile?.landholding || 'Small Farmer'})</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Location / Village</div>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">{profile?.taluka || 'Baramati'}, {profile?.district || 'Pune'}</div>
                <div className="text-[10px] text-slate-500 font-medium">({profile?.pincode || '413102'})</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Social Category</div>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">{profile?.socialCategory || 'OBC'}</div>
                <div className="text-[10px] text-slate-500 font-medium">(Non-Creamy Layer)</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Water Infrastructure</div>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">{profile?.waterSource || 'Perennial Dug Well'}</div>
                <div className="text-[10px] text-slate-500 font-medium">(7/12 Verified)</div>
              </div>
            </div>

            {/* Timestamp & Registry Sync Verification */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
              <span>🕒 Assessed: Today, 11:28 AM IST</span>
              <span>•</span>
              <span className="text-slate-600 font-semibold flex items-center gap-1">
                <span>📋</span>
                <span>Simulated Assessment • Cross-referenced with MahaDBT & Mahavitaran 2024-25 Benchmarks (Demo)</span>
              </span>
            </div>
          </div>

          {/* Right: Evaluation Outcome Card (4 Cols) */}
          <div className="lg:col-span-4 bg-linear-to-br from-blue-50/80 to-slate-50 border border-blue-200/90 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">EVALUATION OUTCOME</span>
              <span className="bg-[#1850b5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">High Match</span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-[#0f3675]">1 Flagship Match</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              90% State & Central Capital Subsidy tier unlocked based on OBC small-holder status.
            </p>

            <div className="mt-4 pt-3 border-t border-blue-100 space-y-1.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Eligible (TRUE)</span>
                </span>
                <span className="text-emerald-700 font-bold">1 Flagship Scheme</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Pending Info (UNKNOWN)</span>
                </span>
                <span className="text-amber-700 font-bold">1 Scheme (Ambedkar Yoj)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Ineligible (FALSE)</span>
                </span>
                <span className="text-slate-500 font-bold">Filtered Out (Gender/Land)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4.3 Primary Scheme Match (प्राधान्य योजना) ── */}
        <section className="bg-white rounded-2xl border-2 border-blue-600 shadow-sm overflow-hidden">
          {/* Header Strip */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900">
                  Primary Scheme Match <span className="text-[#1850b5]">(प्राधान्य योजना)</span>
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  100% Core Criteria Met
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Recommended government initiative with maximum subsidy entitlement for your farm profile.
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <span>✓ Verified via GR: KUSUM-2023/CR-114</span>
            </div>
          </div>

          {/* Scheme Banner Strip (Deep Blue) */}
          <div className="bg-[#0f3675] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-md inline-block mb-1.5">
                AGRI-SOLAR INFRASTRUCTURE • COMPONENT B
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Mukhyamantri Saur Krushi Vahini Yojana 2.0 / PM-KUSUM
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mt-0.5 font-medium">
                (मुख्यमंत्री सौर कृषी वाहिनी योजना २.० - सौर कृषी पंप)
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold">
                <span>✓</span>
                <span>Deterministic Result: TRUE (Potentially Eligible)</span>
              </span>
              <span className="bg-white/10 text-blue-100 text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                Statutory Rule-Based
              </span>
            </div>
          </div>

          {/* 4 Key Figures Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">State & Central Subsidy</div>
              <div className="text-xl font-black text-[#1850b5] mt-0.5">90% Capital Subsidy</div>
              <div className="text-slate-400 text-[10px] font-medium">Max permissible support</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Beneficiary Share</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">₹22,400</div>
              <div className="text-slate-400 text-[10px] font-medium">For 3 HP DC Surface/Submersible</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Application Quota Status</div>
              <div className="text-xl font-black text-emerald-800 mt-0.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active (2024-25)</span>
              </div>
              <div className="text-slate-400 text-[10px] font-medium">Baramati taluka allotment open</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Implementation Agency</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">MSEDCL / MEDA</div>
              <div className="text-slate-400 text-[10px] font-medium">Direct vendor empanelment</div>
            </div>
          </div>

          {/* Two-Column Main Details Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Conditions Met & Points Requiring Caution (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Conditions Met by Profile */}
              <div>
                <div className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span>Conditions Met by Profile (पात्र ठरलेले निकष)</span>
                </div>

                <div className="space-y-3">
                  {/* Point 1 */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-blue-600 font-bold text-sm mt-0.5">✓</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Agricultural Landholding Threshold</div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                        Your holding of <strong>2.5 Acres</strong> satisfies the designated bracket (0.50 to 5.00 acres) required for 3 HP DC solar surface/submersible pump installation.
                      </p>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-blue-600 font-bold text-sm mt-0.5">✓</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Authentic Water Source Recorded</div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                        Dug well (विहीर) explicitly listed on your 7/12 extract Village Form VII-XII confirms permanent water source availability without pending disputes.
                      </p>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-blue-600 font-bold text-sm mt-0.5">✓</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Social Category Subsidy Enhancement</div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                        OBC (Other Backward Class with valid Non-Creamy Layer certification) unlocks the peak <strong>90% capital grant tier</strong> (10% farmer share).
                      </p>
                    </div>
                  </div>

                  {/* Point 4 */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-blue-600 font-bold text-sm mt-0.5">✓</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Feeder Electrification Priority</div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                        Gat No. 184 Baramati falls under the non-energized agri-feeder catchment, granting first priority dispatch for standalone solar pumps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Requiring Caution / Verification */}
              <div>
                <div className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                    !
                  </span>
                  <span>Points Requiring Caution / Verification (दक्षता व अटी)</span>
                </div>

                <div className="space-y-3">
                  {/* Warning 1 */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-950 mb-1">
                      <span>⚠</span>
                      <span>Zero Prior Energized Agricultural Electricity Connection</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Applicant must NOT hold an operational MSEDCL agricultural power connection on the same survey number. If a paid pending quotation (पेंडिंग कोटेशन) exists, it can be seamlessly converted to solar without penalty.
                    </p>
                  </div>

                  {/* Warning 2 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                      <span>📄</span>
                      <span>Joint Land Ownership Consent (सामूहिक ७/१२ संमतीपत्र)</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      If Gat No. 184 has joint family co-owners (समाईक खातेदार), a stamped No-Objection Certificate (NOC) on ₹100 stamp paper or standard Gram Panchayat format signed by all co-holders is legally required before physical survey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Document Readiness Checklist (5 Cols) */}
            <div className="lg:col-span-5 bg-[#f8fafc] border border-slate-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span>📁</span>
                  <span>Document Readiness</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {hasUploaded8A ? '6 of 6 Ready' : '5 of 6 Ready'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                All documents will be auto-compiled into your pre-filled MahaDBT / Saur Krushi application dossier.
              </p>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {[
                  { title: '7/12 Extract (७/१२ उतारा)', status: 'Ready', sub: 'Digital Sign Verified' },
                  { title: 'Aadhaar Card (आधार कार्ड)', status: 'Ready', sub: 'NPCI Bank-Linked' },
                  { title: 'OBC Caste Certificate', status: 'Ready', sub: 'NCL Valid up to 2026' },
                  { title: 'Bank Passbook / Cheque', status: 'Ready', sub: 'Bank of Maharashtra' },
                  { title: 'Farmland Self-Declaration', status: 'Ready', sub: 'Auto-Generated via AI' },
                  { title: '8-A Extract (८-अ नोंद)', status: hasUploaded8A ? 'Ready' : 'Pending', sub: hasUploaded8A ? 'Verified QR Copy Attached' : 'Needs 2024-25 QR Copy' },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        doc.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {doc.status === 'Ready' ? '✓' : '!'}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 leading-tight">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">{doc.sub}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      doc.status === 'Ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Upload 8-A Notice */}
              <div className="mt-5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 leading-relaxed font-medium">
                💡 Upload your digitally signed 8-A land holding extract to reach 100% application readiness score.
              </div>
            </div>
          </div>

          {/* Action Required to Complete Application Section */}
          <div className="bg-slate-50 px-6 py-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium">
              <span className="font-bold text-slate-900">Next Action:</span> Proceed to official portal with pre-verified dossier.
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={downloadDossier}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                Download Dossier PDF
              </button>

              <button
                onClick={() => navigate('/tracker')}
                className="px-6 py-2.5 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-[0.98]"
              >
                <span>Proceed to Dossier & Application Tracker</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── 5. Civic Footer ── */}
      <footer className="bg-[#0f3675] text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-blue-900 mt-auto print:hidden">
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

export default EligibilityResultsPage;
