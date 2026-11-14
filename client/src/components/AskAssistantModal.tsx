import React, { useState } from 'react';
import { X, Send, Bot, User, Mic } from 'lucide-react';

interface AskAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: 'en' | 'mr' | 'hi';
}

export const AskAssistantModal: React.FC<AskAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; sources?: string[] }>>([
    {
      sender: 'ai',
      text:
        currentLang === 'mr'
          ? 'नमस्कार! मी ग्रामसाथी एआय आहे. मी तुम्हाला महाराष्ट्र आणि केंद्र सरकारच्या सर्व कल्याणकारी योजना, पात्रता, आवश्यक कागदपत्रे आणि अर्ज प्रक्रियेबद्दल मार्गदर्शन करू शकतो. आपण कोणत्या योजनेबद्दल माहिती घेऊ इच्छिता?'
          : 'Namaste! I am GramSathi AI. I can guide you through Maharashtra & Central government welfare schemes, required documents, and verified application procedures. What support are you looking for today?',
      sources: ['Aaple Sarkar Portal', 'MahaDBT Gazettes'],
    },
  ]);

  const sampleQuestions = [
    'माझी लाडकी बहीण योजनेसाठी कोण पात्र आहे?',
    'Who is eligible for PM-KISAN 19th installment?',
    'ट्रॅक्टर व ठिबक सिंचनासाठी किती अनुदान मिळते?',
    'How do I get an income certificate in Maharashtra?',
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(newMsgs);
    setInput('');

    // Responsive intelligent civic answer simulation grounded in official rules
    setTimeout(() => {
      let reply = '';
      const sources = ['Maharashtra Government Gazette', 'MahaDBT Official Portal'];

      if (userText.includes('लाडकी बहीण') || userText.toLowerCase().includes('ladki')) {
        reply =
          currentLang === 'mr'
            ? 'मुख्यमंत्री माझी लाडकी बहीण योजनेची प्रमुख पात्रता:\n• २१ ते ६५ वयोगटातील विवाहित/अविवाहित/विधवा महिला\n• कुटुंबाचे वार्षिक उत्पन्न २.५ लाखांपेक्षा कमी असावे\n• लाभार्थी महिलेकडे आधार संलग्न बँक खाते असणे आवश्यक आहे.\n• दरमहा ₹१,५०० थेट खात्यात जमा केले जातात.'
            : 'Mukhyamantri Majhi Ladki Bahin Yojana Key Rules:\n• Women aged 21 to 65 years resident in Maharashtra.\n• Annual family income under ₹2.5 Lakh.\n• Bank account seeded with Aadhaar is mandatory.\n• Direct cash transfer of ₹1,500/month (₹18,000/year).';
      } else if (userText.toLowerCase().includes('kisan') || userText.includes('किसान')) {
        reply =
          currentLang === 'mr'
            ? 'पीएम किसान सन्मान निधी (१९ वा हप्ता):\n• नोंदणीकृत अल्प व अत्यल्प भूधारक शेतकरी.\n• ७/१२ उताऱ्यावरील नाव आणि ई-केवायसी पूर्ण असणे बंधनकारक.\n• वार्षिक ₹६,००० तीन हप्त्यांमध्ये (₹२,००० प्रत्येक) थेट बँकेत जमा होतात.'
            : 'PM KISAN Samman Nidhi (19th Tranche):\n• Small & marginal farmers with active cultivable land on 7/12 record.\n• Aadhaar e-KYC and bank Aadhaar-seeding is required.\n• ₹6,000 per year transferred in three equal ₹2,000 tranches.';
      } else {
        reply =
          currentLang === 'mr'
            ? `आपल्या प्रश्नाचे विश्लेषण चालू आहे: "${userText}".\nअधिकृत महाडीबीटी आणि आपले सरकार राजपत्रातील नियमांनुसार, आपण संबंधित तालुका कृषी अधिकारी कार्यालय किंवा जवळच्या सीएससी ग्रामपंचायत सेवा केंद्रात विहित कागदपत्रांसह (आधार, ७/१२ उतारा, उत्पन्न दाखला) संपर्क साधू शकता.`
            : `Civic Guidance for: "${userText}".\nAccording to Maharashtra State Gazettes, rural citizens can access these benefits via MahaDBT or local Gram Panchayat CSC Seva Kendras with their Aadhaar, land record, and income certificate. No middle-man fees required.`;
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply, sources }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col h-[600px] overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-[#0f3675] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-300/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base">Ask GramSathi AI</h3>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Grounded AI</span>
              </div>
              <p className="text-xs text-blue-200">
                {currentLang === 'mr' ? 'शासकीय योजना डिजिटल सहाय्यक • बहुभाषिक आवाज सक्षम' : 'Official Scheme Guidance • Multilingual Voice Enabled'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Chat message list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-[#1850b5] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1850b5] text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
                }`}
              >
                {msg.text}

                {msg.sources && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Official Citations:</span>
                    {msg.sources.map((s, sIdx) => (
                      <span key={sIdx} className="bg-blue-50 text-[#1850b5] px-1.5 py-0.5 rounded border border-blue-100 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-300 text-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Queries */}
        <div className="px-4 py-2 bg-white border-t border-slate-200/70 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Suggestions:</span>
          {sampleQuestions.map((q, qIdx) => (
            <button
              key={qIdx}
              onClick={() => handleSend(q)}
              className="bg-slate-100 hover:bg-blue-50 hover:text-[#1850b5] border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap text-slate-700 font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSend(currentLang === 'mr' ? 'माझ्याकडे २ एकर शेतजमीन आहे, मला कोणती योजना मिळेल?' : 'I have 2 acres of farmland, which schemes am I eligible for?')}
            className="p-2.5 rounded-xl bg-blue-50 text-[#1850b5] hover:bg-blue-100 transition-colors"
            title="Audio Input"
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder={
              currentLang === 'mr'
                ? 'आपला प्रश्न येथे टाइप करा किंवा बोला...'
                : 'Ask anything about Maharashtra & Central schemes...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={() => handleSend(input)}
            className="p-2.5 rounded-xl bg-[#1850b5] hover:bg-[#0f3675] text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
