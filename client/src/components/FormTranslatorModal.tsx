import React, { useState } from 'react';
import { X, Languages, CheckCircle2, Copy, Sparkles, Volume2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { BrowserVoiceService } from '../services/voiceService';

interface FormTranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: 'en' | 'mr' | 'hi';
}

interface TranslationField {
  officialTerm: string;
  sourceContext: string;
  englishExplanation: string;
  marathiExplanation: string;
  hindiExplanation: string;
  exampleInput: string;
  whereToFind: string;
}

const COMMON_CIVIC_FORM_FIELDS: TranslationField[] = [
  {
    officialTerm: 'खातेदार क्रमांक (Khatedar Number)',
    sourceContext: 'Village Form VII-XII / 7/12 & 8-A Revenue Record',
    englishExplanation: 'Unique numeric identifier assigned to a recognized landholder in the village revenue records.',
    marathiExplanation: 'गावातील महसूल नोंदीनुसार मान्यताप्राप्त भूधारक शेतकऱ्याला दिलेला अधिकृत खाते क्रमांक.',
    hindiExplanation: 'गाँव के राजस्व रिकॉर्ड के अनुसार भूस्वामी किसान को दिया गया आधिकारिक खाता नंबर।',
    exampleInput: 'e.g. 142 / ४२',
    whereToFind: 'Top-left or middle of Maharashtra 8-A Khate Extract / e-Mahabhumi',
  },
  {
    officialTerm: 'गट क्रमांक / सर्व्हे नंबर (Gat / Survey Number)',
    sourceContext: 'Agricultural Land Title (7/12 Extract)',
    englishExplanation: 'Specific land parcel demarcation number surveyed by the Revenue Department.',
    marathiExplanation: 'महसूल विभागाने जमिनीच्या तुकड्याला दिलेला अधिकृत गट किंवा सर्व्हे क्रमांक.',
    hindiExplanation: 'राजस्व विभाग द्वारा भूमि के टुकड़े को आवंटित सर्वे या गट नंबर।',
    exampleInput: 'e.g. Gat No. 45/2 (गट क्र. ४५/२)',
    whereToFind: 'Top of 7/12 Extract (गाव नमुना ७)',
  },
  {
    officialTerm: 'अधिवास प्रमाणपत्र (Domicile Certificate)',
    sourceContext: 'State Welfare & Educational Reservation',
    englishExplanation: 'Official proof certifying continuous 15-year residency in the State of Maharashtra.',
    marathiExplanation: 'अर्जदार महाराष्ट्रात किमान १५ वर्षांपासून कायमस्वरूपी वास्तव्यास असल्याचे महसूल प्रमाणपत्र.',
    hindiExplanation: 'प्रमाणपत्र जो प्रमाणित करता है कि आवेदक महाराष्ट्र में 15 वर्षों से रह रहा है।',
    exampleInput: 'Tehsildar issued certificate with barcode',
    whereToFind: 'Aaple Sarkar Portal / Taluka Tehsil Office',
  },
  {
    officialTerm: 'ई-पीक पाहणी (e-Pik Pahani Crop Sowing Record)',
    sourceContext: 'Pik Vima (Crop Insurance) & Minimum Support Price (MSP)',
    englishExplanation: 'Mobile GPS-based self-declaration of standing crops registered on Maharashtra Mahabhumi app.',
    marathiExplanation: 'शेतकऱ्याने स्वतःच्या शेतातील पिकांची मोबाईल ॲपद्वारे केलेली डिजिटल नोंद (७/१२ वर नोंद होते).',
    hindiExplanation: 'मोबाइल ऐप द्वारा खेत में खड़ी फसल की जीपीएस आधारित डिजिटल प्रविष्टि।',
    exampleInput: 'Kharif / Rabi seasonal registration ID',
    whereToFind: 'Maharashtra e-Pik Pahani Mobile Application',
  },
  {
    officialTerm: 'उत्पन्न दाखला (Tehsildar Income Certificate)',
    sourceContext: 'Welfare & Fee Reimbursement (EBC / Ladki Bahin)',
    englishExplanation: 'Statutory certificate signed by Executive Magistrate verifying gross annual family income.',
    marathiExplanation: 'कुटुंबाचे सर्व मार्गांनी मिळणारे वार्षिक उत्पन्न प्रमाणित करणारा सक्षम अधिकाऱ्याचा दाखला.',
    hindiExplanation: 'परिवार की वार्षिक कुल आय प्रमाणित करने वाला अधिकृत प्रमाणपत्र।',
    exampleInput: 'Income: ₹1,80,000 / annum',
    whereToFind: 'Sub-Divisional Officer / Tahsildar / CSC Center',
  },
  {
    officialTerm: 'आधार संलग्न बँक खाते (Aadhaar Seeded DBT Account)',
    sourceContext: 'Direct Benefit Transfer (DBT) Mandatory Requirement',
    englishExplanation: 'Savings account linked and active on NPCI Aadhaar Payment Bridge for direct welfare deposits.',
    marathiExplanation: 'एनपीसीआय (NPCI) मॅपरवर थेट शासकीय अनुदान जमा होण्यासाठी जोडलेले बँक खाते.',
    hindiExplanation: 'सरकारी सब्सिडी सीधे जमा होने के लिए एनपीसीआई से लिंक किया गया बैंक खाता।',
    exampleInput: 'Bank account with Aadhaar DBT active flag',
    whereToFind: 'Nearest Bank Branch / UIDAI Bank Linking Status',
  },
];

export const FormTranslatorModal: React.FC<FormTranslatorModalProps> = ({
  isOpen,
  onClose,
  currentLang: _currentLang,
}) => {
  if (!isOpen) return null;

  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<TranslationField>(COMMON_CIVIC_FORM_FIELDS[0]);
  const [customTerm, setCustomTerm] = useState('');
  const [customExplanation, setCustomExplanation] = useState<string | null>(null);

  const filteredFields = COMMON_CIVIC_FORM_FIELDS.filter(
    (f) =>
      f.officialTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.marathiExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.englishExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.sourceContext.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const handleCustomTranslate = () => {
    if (!customTerm.trim()) return;
    const lower = customTerm.toLowerCase();
    if (lower.includes('7/12') || lower.includes('satbara') || lower.includes('सातबारा')) {
      setCustomExplanation(
        'Village Form VII-XII (सातबारा उतारा): The legal document showing agricultural land ownership, cultivable rights, Gat number, and recorded crops in Maharashtra.'
      );
    } else if (lower.includes('dbt') || lower.includes('डीबीटी')) {
      setCustomExplanation(
        'Direct Benefit Transfer (DBT / थेट लाभ हस्तांतरण): Cash assistance credited straight to your Aadhaar-linked bank account without agents or middleman fees.'
      );
    } else if (lower.includes('ration') || lower.includes('रेशन')) {
      setCustomExplanation(
        'Ration Card (शिधापत्रिका): Official document issued by Food & Civil Supplies Dept indicating BPL, APL, or Antyodaya category for subsidized food grains.'
      );
    } else {
      setCustomExplanation(
        `Government Term Translation for "${customTerm}": In Maharashtra administrative procedures, this refers to a verified identification or clearance prerequisite under State Citizen Charter guidelines.`
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f3675] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Languages className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Government Form Translator</h2>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                  शब्दावली सहाय्यक
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Demystifying complex revenue, legal, and portal terminology into plain rural Marathi & Hindi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisory Bar */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Official Revenue & Civic Terminology:</strong> Simplified definitions grounded in Maharashtra Land Revenue Code & MahaDBT guidelines.
            </span>
          </div>
          <span className="text-[11px] text-blue-600 font-semibold hidden sm:inline">
            Aaple Sarkar Glossary
          </span>
        </div>

        {/* Content Body: Split Screen */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Left Column: List of Terms (5 cols) */}
          <div className="md:col-span-5 p-4 space-y-3 bg-slate-50/60">
            <div className="relative">
              <input
                type="text"
                placeholder="Search term (e.g. खातेदार, 7/12, Domicile)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredFields.map((field) => (
                <div
                  key={field.officialTerm}
                  onClick={() => setSelectedField(field)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedField.officialTerm === field.officialTerm
                      ? 'bg-white border-[#1850b5] shadow-sm ring-1 ring-[#1850b5]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 leading-snug">
                    {field.officialTerm}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {field.sourceContext}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Query Box */}
            <div className="pt-3 border-t border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Translate Custom Form Term:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter confusing Marathi/English term..."
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomTranslate()}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
                <button
                  onClick={handleCustomTranslate}
                  className="bg-[#1850b5] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0f3675] transition-colors"
                >
                  Explain
                </button>
              </div>

              {customExplanation && (
                <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950 leading-relaxed">
                  {customExplanation}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Explanation & Example (7 cols) */}
          <div className="md:col-span-7 p-6 space-y-5 bg-white">
            <div className="border-b border-slate-100 pb-4">
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                {selectedField.sourceContext}
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {selectedField.officialTerm}
              </h3>
            </div>

            {/* Native Dialect Plain Meaning */}
            <div className="space-y-3">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                  <span>मराठी सोपा अर्थ (Plain Rural Marathi):</span>
                  <button
                    onClick={() => BrowserVoiceService.speak(selectedField.marathiExplanation, 'mr')}
                    className="flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 font-semibold"
                    title="Listen in Marathi"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ऐका</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedField.marathiExplanation}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="text-xs font-bold text-slate-700 mb-1">
                  English Civic Definition:
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedField.englishExplanation}
                </p>
              </div>
            </div>

            {/* Where to find on documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-500 uppercase text-[10px]">
                  Where to find this in your papers:
                </div>
                <div className="font-semibold text-slate-800 mt-1">
                  {selectedField.whereToFind}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-500 uppercase text-[10px]">
                  Example Form Input Value:
                </div>
                <div className="font-semibold text-blue-700 mt-1 flex items-center justify-between">
                  <span>{selectedField.exampleInput}</span>
                  <button
                    onClick={() => handleCopy(selectedField.exampleInput)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500"
                    title="Copy sample"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Practical Civic Advice */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Aaple Sarkar Tip:</strong> Never pay unauthorized internet cafe operators for official registration numbers. You can verify your land titles for free on Mahabhumi portal (mahabhumi.gov.in) with zero middleman fee.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Plain civic language assistance powered by GramSathi AI
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
          >
            Close Translator
          </button>
        </div>
      </div>
    </div>
  );
};
