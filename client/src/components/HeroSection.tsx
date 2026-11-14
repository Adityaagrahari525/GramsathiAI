import React, { useState } from 'react';
import { Search, Mic, CheckCircle2, Bot, Volume2, Sparkles, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  currentLang: 'en' | 'mr' | 'hi';
  onSearch: (query: string, scope: string) => void;
  onPopularSelect: (tag: string) => void;
  onVoiceTrigger: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onSearch,
  onPopularSelect,
  onVoiceTrigger,
}) => {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), scope);
    }
  };

  const popularTags = [
    { label: 'PM KISAN 19th Tranche', query: 'PM KISAN' },
    { label: 'Ladki Bahin Yojana', query: 'Ladki Bahin' },
    { label: 'Tractor Subsidy 2024', query: 'Tractor' },
    { label: 'Post-Matric Scholarship', query: 'Scholarship' },
    { label: 'PMAY Gramin House', query: 'PMAY' },
  ];

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f8fbff] to-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto text-center">
        {/* Verification Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1850b5] shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Aaple Sarkar Aligned AI Guidance</span>
          <span className="text-blue-300">•</span>
          <span className="font-normal text-slate-600">महाराष्ट्र शासन योजना डिजिटल सहाय्यक</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {currentLang === 'mr' ? (
            <>सरकारी योजना, आता सर्वांसाठी सोप्या.</>
          ) : (
            <>Government Schemes, Made Simple for Everyone.</>
          )}
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-10">
          {currentLang === 'mr'
            ? 'ग्रामसाथी एआय क्लिष्ट सरकारी अधिसूचना सुलभ करते, भाषेचे अडथळे दूर करते आणि ग्रामीण शेतकरी, महिला उद्योजक, कारागीर आणि तरुणांना त्यांच्या हक्काच्या लाभांपर्यंत थेट मार्गदर्शन करते.'
            : 'GramSathi AI decodes complex government notifications, breaks language barriers, and guides rural farmers, women entrepreneurs, artisans, and youth directly to the benefits they are entitled to.'}
        </p>

        {/* Search Container */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2.5 shadow-xl shadow-blue-900/5 border border-slate-200">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2">
            {/* Scope Dropdown */}
            <div className="relative w-full md:w-56">
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100/70 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">All Maharashtra & Central</option>
                <option value="maharashtra">Maharashtra State Only</option>
                <option value="central">Central Govt Only</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Input Field */}
            <div className="relative flex-1 w-full flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  currentLang === 'mr'
                    ? 'आपल्या गरजेबद्दल सांगा... (उदा. ठिबक सिंचन, कर्ज, पेन्शन)'
                    : 'Tell us what support you need... (e.g. drip irrigation, loan, pension)'
                }
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />

              {/* Voice Input Mic Button */}
              <button
                type="button"
                onClick={onVoiceTrigger}
                title="Speak in your language"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1850b5] text-xs font-semibold mr-1 transition-all"
              >
                <Mic className="w-3.5 h-3.5 text-[#1850b5]" />
                <span className="hidden sm:inline">माइक</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-700/20 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Search Schemes</span>
            </button>
          </form>
        </div>

        {/* Popular Searches */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Popular searches:</span>
          {popularTags.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setQuery(item.query);
                onPopularSelect(item.query);
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#1850b5] hover:border-blue-200 border border-slate-200/80 text-slate-700 font-medium transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-8 border-t border-slate-200/70 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Intermediaries / 100% Direct Benefit Transfer (DBT)</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Bot className="w-4 h-4 text-[#1850b5] shrink-0" />
            <span>AI Logic Grounded in Official Gazettes</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Instant Audio Guidance in Regional Dialects</span>
          </div>
        </div>
      </div>
    </section>
  );
};
