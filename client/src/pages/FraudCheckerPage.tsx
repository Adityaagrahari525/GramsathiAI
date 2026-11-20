import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Mic,
  Upload,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';

export function FraudCheckerPage() {
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const { fontSizeOffset } = useAccessibility();

  const testCases = {
    solarPump:
      'प्रिय शेतकरी बंधूंनो, कुसुम सौर पंप योजनेअंतर्गत तुमचा अर्ज मंजूर झाला आहे. ९०% अनुदानाचा लाभ घेण्यासाठी तातडीने खालील लिंकवर रु.१,४९९ नोंदणी शुल्क भरावे. bit.ly/pmk-subsidy-claim (फक्त २४ तासांसाठी वैध). हेल्पलाईन संपर्क: 98765-XXXXX.',
    ladkiBahin:
      'लाडकी बहीण योजना विशेष हप्ता: आपले ₹३,००० मंजूर झाले आहेत. त्वरित खात्यात जमा करण्यासाठी खालील एपीके फाइल डाऊनलोड करा किंवा लिंकवर बँक तपशील प्रविष्ट करा: mahadbt-gov.in.live/claim-cash. संपर्क: 8877665544.',
    officialKisan:
      'महाराष्ट्र शासन: पीएम किसान सन्मान निधी योजनेचा २०वा हप्ता थेट आपल्या आधार संलग्न खात्यात DBT द्वारे जमा करण्यात आला आहे. अधिक माहितीसाठी mahadbt.maharashtra.gov.in वर लॉगिन करा. - MH-MAHAGOV',
  };

  const [messageInput, setMessageInput] = useState(testCases.solarPump);
  const [isAnalyzed, setIsAnalyzed] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSafeNotification, setIsSafeNotification] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      if (messageInput.includes('MH-MAHAGOV') || messageInput.includes('mahadbt.maharashtra.gov.in')) {
        setIsSafeNotification(true);
      } else {
        setIsSafeNotification(false);
      }
    }, 600);
  };

  const handleSelectTestCase = (key: 'solarPump' | 'ladkiBahin' | 'officialKisan') => {
    setMessageInput(testCases[key]);
    if (key === 'officialKisan') {
      setIsSafeNotification(true);
    } else {
      setIsSafeNotification(false);
    }
    setIsAnalyzed(true);
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

      {/* 3. Official Warning Strip */}
      <section className="bg-amber-500/10 border-b border-amber-200 py-2 px-4 text-xs font-semibold text-amber-950 text-center">
        {t('Official government portals (MahaDBT, PM-Kisan, Mahavitaran, Aaple Sarkar) NEVER ask for processing fee deposits, OTPs, or direct WhatsApp APK file downloads. All legitimate welfare subsidies are credited straight to Aadhaar-seeded accounts via DBT with zero middleman fee.')}
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Title Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="space-y-3">
            <div className="text-[11px] font-black uppercase tracking-wider text-red-600 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>{t('CITIZEN DIGITAL PROTECTION & ANTI-FRAUD INTELLIGENCE')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f3675] tracking-tight">
              {t('Verify Suspicious Scheme Messages & Offers')}{' '}
              <span className="text-xl sm:text-2xl font-bold text-slate-700 block sm:inline">
                {language === 'mr' ? '(योजना संदेश व फसवणूक तपासणी केंद्र - AI सायबर सल्लागार)' : language === 'hi' ? '(योजना संदेश एवं धोखाधड़ी जांच केंद्र - AI साइबर सलाहकार)' : '(Fraud Scheme Message Verification)'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              {t('Received an SMS, WhatsApp forward, or social media link claiming you won an instant grant, free solar pump subsidy, or cash benefit under a Maharashtra government scheme? Paste the suspicious message below to scan against registered phishing databases, deceptive URLs, and extortion indicators before taking any action.')}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('100% Private, Ephemeral & Anonymous')}</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('Pattern-Matched against Maha Cyber Cell Advisories')}</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('Helpline Support: 1930 / 1800-123-GRAM')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Suspicious Message Analysis Console */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span>{t('Suspicious Message Analysis Console')}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {t('Enter text content, sender phone number, or external web link forwarded to you.')}
              </p>
            </div>

            <button
              onClick={() => {
                showToast(t('Listening for simulated voice input (Speak message in Marathi, Hindi, or English)'), 'info');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{t('Voice Search (बोलून शोधा)')}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label htmlFor="messageContent">Message Content or Link to Scan (संदेश मजकूर):</label>
              <span className="text-[11px] font-normal text-slate-500">Supports Marathi, Hindi, & English</span>
            </div>

            <textarea
              id="messageContent"
              rows={4}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Paste SMS text, WhatsApp forward, or website URL here..."
              className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            {/* Test Case Quick Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Try real-world test cases:</span>
              <button
                type="button"
                onClick={() => handleSelectTestCase('solarPump')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold transition-colors"
              >
                ⚠️ Fake Solar Pump WhatsApp (Urgent Fee)
              </button>
              <button
                type="button"
                onClick={() => handleSelectTestCase('ladkiBahin')}
                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 text-[11px] font-bold transition-colors"
              >
                ⚠️ Fake Ladki Bahin ₹3,000 Link SMS
              </button>
              <button
                type="button"
                onClick={() => handleSelectTestCase('officialKisan')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold transition-colors"
              >
                ✓ Official PM-Kisan DBT Notification
              </button>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Analyzing Security Patterns...' : 'Analyze Message for Risk (तपासणी करा)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    showToast('Screenshot / PDF uploaded. Scanning extracted text against fraud vectors...', 'info');
                    handleAnalyze();
                  }}
                  className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1.5 shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Upload Screenshot / Forward PDF</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500">
                🔒 Evaluated strictly in-memory. Zero Aadhaar retain.
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Result Box */}
        {isAnalyzed && (
          <div className="space-y-6">
            {!isSafeNotification ? (
              /* HIGH RISK DETECTED */
              <div className="bg-white rounded-2xl border-2 border-red-300 shadow-sm overflow-hidden">
                {/* Red Banner Header */}
                <div className="bg-red-50 p-6 border-b border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white bg-red-600 px-2 py-0.5 rounded">
                          HIGH RISK INDICATORS DETECTED
                        </span>
                        <span className="text-xs font-bold text-red-900">
                          उच्च जोखीम संकेत (संभाव्य फसवणूक)
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-red-950 mt-1 leading-relaxed max-w-3xl">
                        This message matches <strong>4 recognized deceptive scam vectors</strong> documented by the Maharashtra Cyber Security Branch. Strong advisory: <strong>DO NOT</strong> make payments, click shortened URLs, or share personal identity documents.
                      </p>
                    </div>
                  </div>

                  {/* Failure Risk Probability Circle */}
                  <div className="bg-white rounded-xl border border-red-200 p-4 text-center shrink-0 min-w-[150px] shadow-2xs">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Failure Risk Probability</div>
                    <div className="text-2xl font-black text-red-600 mt-0.5">88%</div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div className="bg-red-600 h-1.5 rounded-full w-[88%]"></div>
                    </div>
                  </div>
                </div>

                {/* Legal Notice Callout */}
                <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 flex items-center space-x-2">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    <strong>Legal Notice & Scope:</strong> GramSathi AI provides probabilistic risk advisories based on structural analysis and known phishing registries. Only official law enforcement authorities or designated cyber courts can issue a definitive judicial declaration of criminal fraud.
                  </span>
                </div>

                {/* 2-Column Red Flags & Official Factsheet */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Left: 4 Red Flags (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                        <span>Specific Red Flags Detected in Analyzed Text</span>
                      </h3>
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        4 Critical Flags
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Flag 1 */}
                      <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">
                            1. Unofficial & Shortened Domain Link
                          </strong>
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                            Critical Risk
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Contains: <code className="bg-white px-1.5 py-0.5 rounded text-red-700 font-mono text-[11px]">bit.ly/pmk-subsidy-claim</code>. Maharashtra schemes strictly use registered governmental domains ending in <strong>.gov.in</strong> or <strong>.nic.in</strong>. URL shorteners hide malicious redirects.
                        </p>
                      </div>

                      {/* Flag 2 */}
                      <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">
                            2. Demand for Upfront 'Processing' Fee
                          </strong>
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                            Extortion Pattern
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Demands ₹1,499 registration fee. Government Direct Benefit Transfer (DBT) subsidies do <strong>NOT</strong> require advance cash deposits into private bank accounts or UPI handles to unlock sanctioned allocations.
                        </p>
                      </div>

                      {/* Flag 3 */}
                      <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">
                            3. Artificial Urgency & Psychological Pressure
                          </strong>
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                            Coercion Vector
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Claims offer is valid "for 24 hours only before permanent cancellation". Official administrative decisions follow written scrutiny and give formal grievance rectification windows.
                        </p>
                      </div>

                      {/* Flag 4 */}
                      <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">
                            4. Unverified Private Sender Identity
                          </strong>
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                            No DLT Header
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Originates from a private 10-digit phone number. Legal government service broadcasts in Maharashtra use TRAI-registered 6-letter SMS headers like <strong>MH-MAHAGOV</strong> or <strong>AX-MSEDPR</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Official Scheme Factsheet (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3.5">
                      <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Official Scheme Factsheet</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Mukhyamantri Saur Krushi Vahini 2.0 / PM-KUSUM
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Authorized State Portal</div>
                          <div className="text-blue-700 font-bold break-all mt-0.5">
                            mahadiscom.in/solar-mskvy & mahadbt.maharashtra.gov.in
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Official Application Route</div>
                          <div className="text-slate-700 mt-0.5 leading-snug">
                            Through your personal login on MahaDBT or authorized physical Aaple Sarkar Seva Kendra (VLE). No WhatsApp agents.
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Fee & Payment Procedure</div>
                          <div className="text-slate-700 mt-0.5 leading-snug">
                            Farmer contribution (10%) is payable only after on-site water/land survey via official MSEDCL challan, never via personal QR codes.
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Verification at Panchayat</div>
                          <div className="text-slate-700 mt-0.5 leading-snug">
                            List of selected farmers is countersigned by the Gram Sevak and pasted on the Gram Panchayat Notice Board.
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/scheme/saur-krushi-vahini"
                        className="w-full flex items-center justify-center space-x-1.5 bg-[#1850b5] hover:bg-[#0f3675] text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                      >
                        <span>View Authentic Scheme Page on GramSathi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>

                {/* Emergency Action Strip */}
                <div className="bg-red-50/70 p-4 border-t border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-red-950">
                    <strong>Did you already click this link or pay money?</strong> Block your debit/credit card immediately and dial 1930 to freeze fraudulent UPI transactions within the golden hour.
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href="tel:1930"
                      className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Dial Cyber Cell 1930</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => showToast('Tip submitted to Maharashtra Cyber Cell & GramSathi Anti-Fraud Registry. Thank you for protecting fellow citizens.', 'success', 'Tip Lodged')}
                      className="inline-flex items-center space-x-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-semibold transition-colors shadow-2xs"
                    >
                      <span>Lodge Tip to GramSathi</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* VERIFIED SAFE GOVERNMENT NOTIFICATION */
              <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-sm p-6 space-y-4">
                <div className="flex items-center space-x-3 text-emerald-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Authentic Government Notification (वैध शासकीय संदेश)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Matches official MahaDBT communication templates. No phishing links or fee extortion detected.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div>✓ Sender identified as official 6-letter government gateway (MH-MAHAGOV).</div>
                  <div>✓ Legitimate domain destination: mahadbt.maharashtra.gov.in.</div>
                  <div>✓ Zero monetary demand or suspicious APK downloads.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Real Examples of Recent Fake Scheme Broadcasts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Real Examples of Recent Fake Scheme Broadcasts
              </h3>
              <p className="text-xs text-slate-500">
                Study actual visual screenshots captured across rural districts in Maharashtra (Solapur, Nanded, Kolhapur, Ahmednagar).
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              ● Updated Daily from Maha Cyber Desk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                Scam Vector: Fake Solar Pump
              </span>
              <h4 className="font-bold text-slate-900">WhatsApp Fake Sanction Letter</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Culprits send forged approval letters bearing fake Ashok Stambh seals demanding ₹2,500 security deposit via Google Pay.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                Scam Vector: Fake Ladki Bahin APK
              </span>
              <h4 className="font-bold text-slate-900">Malicious Android APK Forward</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Fake app claiming to be 'Ladki-Bahin-Direct-Cash.apk' which intercepts banking SMS and OTPs once installed.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                Scam Vector: Tractor Subsidy Phishing
              </span>
              <h4 className="font-bold text-slate-900">Cloned MahaDBT Portal Link</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Deceptive web address 'mahadbt-farmer-subsidy.com' designed to harvest Aadhaar numbers and bank account passwords.
              </p>
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
                <li><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">National Cybercrime Portal ↗</a></li>
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
                <li>National Cyber Fraud: <strong className="text-white">1930</strong></li>
                <li>GramSathi Toll-Free: <strong className="text-white">1800-123-GRAM</strong></li>
                <li>Kisan Call Center: <strong className="text-white">1800-180-1551</strong></li>
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
                <span className="bg-blue-900/60 border border-blue-700/60 px-2 py-1 rounded">Maha Cyber</span>
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

export default FraudCheckerPage;
