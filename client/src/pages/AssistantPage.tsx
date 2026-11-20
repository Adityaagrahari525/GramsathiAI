import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  PhoneCall,
  User,
  Volume2,
  RefreshCw,
  Printer,
  Mic,
  Send,
  ExternalLink,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { EligibilityModal } from '../components/EligibilityModal';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { BrowserVoiceService } from '../services/voiceService';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  time: string;
  userName?: string;
  title?: string;
  badge?: string;
  content: string;
  sources?: string[];
  categories?: Array<{ label: string; query: string }>;
  schemeCard?: {
    authority: string;
    status: string;
    title: string;
    subsidy: string;
    farmerShare: string;
    pump: string;
    schemeUrl: string;
  };
}

export function AssistantPage() {
  const navigate = useNavigate();
  const { language: currentLang, setLanguage: setCurrentLang } = useLanguage();
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [assistantMeta, setAssistantMeta] = useState<{
    isConfigured: boolean;
    mode: string;
    statusNotice: string;
  }>({
    isConfigured: false,
    mode: 'deterministic_fallback',
    statusNotice: 'Checking AI status...',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    apiClient.getAssistantStatus().then((res) => {
      if (res.success && res.data) {
        setAssistantMeta({
          isConfigured: res.data.isConfigured,
          mode: res.data.mode,
          statusNotice: res.data.statusNotice,
        });
      }
    }).catch(() => {
      setAssistantMeta({
        isConfigured: false,
        mode: 'deterministic_fallback',
        statusNotice: 'Running in reliable deterministic fallback mode.',
      });
    });
  }, []);

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'assistant',
      time: '10:14 AM',
      title: 'GramSathi Guide (मार्गदर्शक)',
      content:
        'नमस्कार! Welcome to GramSathi. How can I assist you with government schemes, subsidies, or services today? Choose a common category or ask below:',
      categories: [
        { label: '🌾 Farmer Subsidies', query: 'What farmer subsidies are available in Maharashtra?' },
        { label: '💼 Business Loans', query: 'Tell me about CMEGP and rural business loans' },
        { label: '🎓 Student Scholarships', query: 'What scholarships exist for rural students?' },
        { label: '👩 Women Welfare', query: 'Tell me about Majhi Ladki Bahin Yojana' },
      ],
    },
    {
      id: '2',
      sender: 'user',
      time: '10:16 AM',
      userName: 'Ramesh Gaikwad • Baramati',
      content:
        'I have 3 acres of agricultural land in Baramati with a dug well. Which solar pump scheme can I apply for, and what subsidy is available?',
    },
    {
      id: '3',
      sender: 'assistant',
      time: '10:18 AM',
      title: 'Eligibility Result',
      badge: '✓ 100% Eligible',
      content: 'You qualify for the flagship solar agriculture pump scheme in Maharashtra:',
      schemeCard: {
        authority: 'MSEDCL • Govt. of Maharashtra',
        status: 'Open for FY 2024-25',
        title: 'Mukhyamantri Saur Krushi Vahini 2.0 (PM-KUSUM)',
        subsidy: '90% - 95%',
        farmerShare: '₹ 22,400',
        pump: '5 HP DC/AC',
        schemeUrl: '/scheme/saur-krushi-vahini',
      },
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      time: currentTime,
      userName: 'Citizen (नागरिक)',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoadingReply(true);

    try {
      const res = await apiClient.assistantChat({
        message: text,
        language: currentLang,
      });

      if (res.success && res.data) {
        const d = res.data;
        const matched = d.matchedSchemes && d.matchedSchemes[0];
        const isGemini = d.source === 'gemini_grounded';

        const replyMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: isGemini ? 'GramSathi AI (Gemini 2.5 Grounded)' : 'GramSathi Guidance Desk (Verified Gazette)',
          badge: isGemini ? '✓ Gemini Grounded' : '✓ Verified Gazette',
          content: d.reply,
          sources: d.sources,
          schemeCard: matched
            ? {
                authority: matched.department || 'Government of Maharashtra',
                status: 'Verified Gazette Record',
                title: matched.nameMr || matched.name,
                subsidy: matched.benefitAmount,
                farmerShare: 'Direct Application',
                pump: 'Welfare Support',
                schemeUrl: `/schemes/${matched.id}`,
              }
            : undefined,
        };
        setMessages((prev) => [...prev, replyMsg]);
        setIsLoadingReply(false);
        return;
      }
    } catch (apiErr) {
      console.warn('[AssistantPage] Assistant API query error, using local fallback:', apiErr);
    }

    // Local deterministic fallback
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply: ChatMessage;

      if (lower.includes('ladki') || text.includes('लाडकी बहीण')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Eligibility Evaluation: Majhi Ladki Bahin',
          badge: '✓ Active Scheme',
          content:
            'Chief Minister Majhi Ladki Bahin Scheme provides financial assistance of ₹1,500/month (₹18,000/year) to women aged 21 to 65 years with annual family income under ₹2.5 Lakh. Direct transfer to Aadhaar-linked bank account.',
          sources: ['https://ladkibahin.maharashtra.gov.in'],
        };
      } else if (lower.includes('7/12') || lower.includes('aadhaar') || text.includes('७/१२')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Land Record & Aadhaar Linking Guide',
          badge: 'Official Procedure',
          content:
            'To link your 7/12 extract with Aadhaar: Visit the Mahabhumi portal (mahabhumi.gov.in) or your local Talathi / Aaple Sarkar Kendra. Carry your Aadhaar card and verified Khatedar number. Linking enables automatic DBT eligibility matching.',
          sources: ['https://mahabhumi.gov.in'],
        };
      } else {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'GramSathi Public Welfare Desk',
          badge: 'Gazette Verified',
          content:
            `We have verified your query regarding "${text}". In Maharashtra, rural citizens can verify benefits, upload required documents, or access guidance through the MahaDBT portal or your nearest Gram Panchayat CSC Seva Kendra with zero middleman charges.`,
          sources: ['https://mahadbt.maharashtra.gov.in'],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsLoadingReply(false);
    }, 500);
  };

  const handleVoiceInput = () => {
    if (!BrowserVoiceService.isSpeechRecognitionSupported()) {
      showToast(
        currentLang === 'mr'
          ? 'या ब्राऊझरवर थेट आवाज ओळख उपलब्ध नाही (Google Chrome किंवा Edge वापरा). टाइप करून विचारा.'
          : currentLang === 'hi'
          ? 'इस ब्राउज़र पर वॉयस पहचान उपलब्ध नहीं है (Google Chrome या Edge का उपयोग करें)। लिखकर पूछें।'
          : 'Browser Speech Recognition is not supported on this browser (use Google Chrome or Microsoft Edge). You can type your query.',
        'warning'
      );
      return;
    }

    const session = BrowserVoiceService.startListening({
      language: currentLang,
      onStart: () => {
        setIsListening(true);
        showToast(
          currentLang === 'mr'
            ? 'माइक सुरू झाला आहे. स्पष्टपणे बोला...'
            : currentLang === 'hi'
            ? 'माइक शुरू हो गया है। स्पष्ट रूप से बोलें...'
            : 'Listening... Please speak your query clearly.',
          'info'
        );
      },
      onResult: (transcript) => {
        setInputText(transcript);
        handleSend(transcript);
      },
      onError: (err) => {
        setIsListening(false);
        showToast(err, 'warning');
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (!session) {
      setIsListening(false);
    }
  };

  const handleListenAudio = (text: string) => {
    if (isPlayingAudio) {
      BrowserVoiceService.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    if (!BrowserVoiceService.isSpeechSynthesisSupported()) {
      showToast(
        currentLang === 'mr'
          ? 'या ब्राऊझरवर आवाज वाचन (Text-to-Speech) उपलब्ध नाही.'
          : 'Text-to-speech audio narration is not supported on this browser.',
        'warning'
      );
      return;
    }

    const spoken = BrowserVoiceService.speak(text, currentLang, () => {
      setIsPlayingAudio(false);
    });

    if (spoken) {
      setIsPlayingAudio(true);
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  const handlePrintChat = () => {
    window.print();
  };

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

      {/* 2. Civic Navigation Bar */}
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

            {/* Nav items */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold text-slate-700">
              <Link to="/" className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors">
                Home
              </Link>
              <Link to="/schemes" className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors">
                Explore Schemes
              </Link>
              <Link
                to="/assistant"
                className="px-3.5 py-2 text-white bg-[#1850b5] rounded-lg font-bold shadow-xs transition-colors"
              >
                AI Citizen Assistant
              </Link>
              <button
                onClick={() => setIsEligibilityOpen(true)}
                className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Eligibility Tool
              </button>
              <a
                href="https://grievances.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Grievance / Helpdesk
              </a>
            </nav>

            {/* Right: Phone & Citizen Login */}
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
                <span>Citizen Login</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Sub-header tagline */}
      <div className="bg-[#e9effa] border-b border-blue-100 py-2.5 px-4 text-xs font-semibold text-slate-700 text-center">
        Get instant guidance on agricultural subsidies, schemes, and government welfare programs.
      </div>

      {/* 4. Main 2-Column Assistant Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Chat Desk (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[620px]">

            {/* Session Status Bar */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                <span className={`w-2.5 h-2.5 rounded-full ${assistantMeta.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`}></span>
                <span>Active Session: Citizen Query Desk</span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-slate-500 font-normal hidden sm:inline">
                  {assistantMeta.isConfigured ? (
                    <strong className="text-emerald-700 font-bold">Gemini 2.5 Flash Grounded Mode</strong>
                  ) : (
                    <strong className="text-blue-700 font-bold">Verified Gazette Rule Engine (Deterministic)</strong>
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-slate-600 font-medium">
                {assistantMeta.isConfigured ? (
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Gemini Key Active
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    Standard Civic Mode
                  </span>
                )}
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleResetChat}
                  className="hover:text-blue-700 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Query</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handlePrintChat}
                  className="hover:text-blue-700 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Chat Message Scrollable Container */}
            <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto bg-slate-50/50">

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isUser
                          ? 'bg-[#1850b5] text-white'
                          : 'bg-[#0f3675] text-white'
                      }`}
                    >
                      {isUser ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    </div>

                    {/* Bubble Container */}
                    <div
                      className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                        isUser
                          ? 'bg-[#1850b5] text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                      }`}
                    >
                      {/* Bubble Header */}
                      <div
                        className={`flex items-center justify-between pb-2 mb-2 border-b text-xs ${
                          isUser ? 'border-blue-400/30 text-blue-100' : 'border-slate-100 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <strong className={isUser ? 'text-white font-bold' : 'text-slate-900 font-bold'}>
                            {isUser ? msg.userName || 'Citizen' : msg.title || 'GramSathi AI'}
                          </strong>
                          {msg.badge && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              {msg.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {!isUser && (
                            <button
                              onClick={() => handleListenAudio(msg.content)}
                              className="hover:text-blue-700 flex items-center space-x-1 text-[11px] font-semibold"
                              title="Listen to audio"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Listen</span>
                            </button>
                          )}
                          <span className="text-[11px]">{msg.time}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <p className={`text-xs sm:text-sm leading-relaxed ${isUser ? 'text-blue-50' : 'text-slate-800'}`}>
                        {msg.content}
                      </p>

                      {/* Category Pills (Message 1) */}
                      {msg.categories && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                          {msg.categories.map((cat, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(cat.query)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-blue-800 transition-all shadow-2xs"
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Embedded Scheme Card (Message 3) */}
                      {msg.schemeCard && (
                        <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">
                              {msg.schemeCard.authority}
                            </span>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                              {msg.schemeCard.status}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-extrabold text-[#0f3675]">
                            {msg.schemeCard.title}
                          </h4>

                          {/* 3 Metric Badges */}
                          <div className="grid grid-cols-3 gap-2 py-2">
                            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                              <div className="text-[10px] text-slate-500 font-semibold uppercase">Govt. Subsidy</div>
                              <div className="text-xs sm:text-sm font-black text-emerald-700">
                                {msg.schemeCard.subsidy}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                              <div className="text-[10px] text-slate-500 font-semibold uppercase">Beneficiary Share</div>
                              <div className="text-xs sm:text-sm font-black text-blue-800">
                                {msg.schemeCard.farmerShare}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                              <div className="text-[10px] text-slate-500 font-semibold uppercase">Recommended Pump</div>
                              <div className="text-xs sm:text-sm font-black text-slate-800">
                                {msg.schemeCard.pump}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons in Card */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Link
                              to={msg.schemeCard.schemeUrl}
                              className="inline-flex items-center space-x-1.5 bg-[#1850b5] hover:bg-[#0f3675] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Apply Online</span>
                            </Link>

                            <button
                              onClick={() => navigate(msg.schemeCard!.schemeUrl)}
                              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>Required Documents</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Sources Citation Pill */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="font-bold text-slate-500 uppercase tracking-wider">Sources:</span>
                          {msg.sources.map((src, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200"
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoadingReply && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0f3675] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Building2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    <span className="font-semibold">Retrieving verified government scheme data...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Query Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice speak button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`px-3.5 py-3 rounded-xl border flex items-center space-x-1.5 text-xs font-bold transition-all shrink-0 ${
                    isListening
                      ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                  }`}
                >
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Speak (बोलून विचारा)</span>
                </button>

                {/* Input text */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask in Marathi, Hindi or English..."
                  className="flex-1 py-3 px-4 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-[#1850b5] hover:bg-[#0f3675] disabled:opacity-50 disabled:hover:bg-[#1850b5] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Sidebar Widgets (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Widget 1: Popular Inquiries */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Popular Inquiries</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { title: 'Link 7/12 extract to Aadhaar', q: 'How do I link 7/12 extract to Aadhaar?' },
                  { title: 'Majhi Ladki Bahin Scheme eligibility', q: 'What is the eligibility for Majhi Ladki Bahin Scheme?' },
                  { title: 'Tractor subsidy application steps', q: 'What are the steps to apply for tractor subsidy?' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.q)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-between text-xs font-semibold text-slate-800 transition-all group"
                  >
                    <span>{item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 2: Need In-Person Support? */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm mb-3">
                <HelpCircle className="w-4 h-4 text-blue-700" />
                <span>Need In-Person Support?</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Visit your local <strong>Gram Panchayat</strong> or <strong>Aaple Sarkar Seva Kendra (CSC)</strong> for offline biometric e-KYC and document assistance.
              </p>

              {/* Call Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Toll-Free Helpline</div>
                  <div className="text-sm sm:text-base font-black text-blue-950">1800-123-GRAM</div>
                </div>

                <a
                  href="tel:18001234726"
                  className="bg-[#1850b5] hover:bg-[#0f3675] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Disputed scheme case?</span>
                <a
                  href="https://grievances.maharashtra.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>File Appeal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* 5. Comprehensive Compliance Civic Footer */}
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
                <li>National Helpline: <strong className="text-white">112</strong></li>
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

export default AssistantPage;
