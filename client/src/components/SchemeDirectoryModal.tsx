import React, { useState } from 'react';
import { X, Search, ExternalLink, Bookmark, CheckCircle2, FileText } from 'lucide-react';
import { SCHEMES_DATABASE, type Scheme } from '../data/schemesData';

interface SchemeDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchQuery?: string;
  initialSector?: string;
}

export const SchemeDirectoryModal: React.FC<SchemeDirectoryModalProps> = ({
  isOpen,
  onClose,
  initialSearchQuery = '',
  initialSector = 'all',
}) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedSector, setSelectedSector] = useState(initialSector);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<string[]>([]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedSchemes.includes(id)) {
      setSavedSchemes(savedSchemes.filter((s) => s !== id));
    } else {
      setSavedSchemes([...savedSchemes, id]);
    }
  };

  const filteredSchemes = SCHEMES_DATABASE.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.nameMr.includes(searchTerm) ||
      scheme.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector =
      selectedSector === 'all' || scheme.sector === selectedSector;

    return matchesSearch && matchesSector;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[650px] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Top Modal Header */}
        <div className="bg-[#0f3675] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Scheme Directory (योजना सूची)</h3>
            <p className="text-xs text-blue-200">
              Verified Maharashtra & Central Government Public Service Catalog
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by scheme name, keyword, or department..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Sectors (सर्व क्षेत्रे)</option>
            <option value="agriculture">Agriculture & Farmers</option>
            <option value="women">Women Empowerment</option>
            <option value="irrigation">Irrigation & Solar</option>
            <option value="education">Education & Scholarships</option>
            <option value="housing">Housing & Sanitation</option>
            <option value="msme">Rural MSME & Enterprise</option>
          </select>
        </div>

        {/* Content Pane: Master-Detail Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left List */}
          <div className="w-full md:w-1/2 border-r border-slate-200 overflow-y-auto p-4 space-y-3">
            {filteredSchemes.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
                No schemes match your search filter. Try clearing keywords.
              </div>
            ) : (
              filteredSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => setSelectedScheme(scheme)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedScheme?.id === scheme.id
                      ? 'bg-blue-50/70 border-[#1850b5] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1850b5] bg-blue-100/70 px-2 py-0.5 rounded">
                      {scheme.level} • {scheme.sector}
                    </span>
                    <button
                      onClick={(e) => toggleSave(scheme.id, e)}
                      title="Bookmark scheme"
                      className="text-slate-400 hover:text-amber-500"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          savedSchemes.includes(scheme.id)
                            ? 'text-amber-500 fill-amber-500'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {scheme.name}
                  </h4>
                  <div className="text-xs text-slate-500 font-medium mb-2">
                    {scheme.nameMr}
                  </div>

                  <div className="text-xs text-emerald-700 font-semibold mb-2">
                    Benefit: {scheme.benefitAmount}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scheme.summary}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Right Detail Pane */}
          <div className="hidden md:flex flex-1 flex-col overflow-y-auto p-6 bg-slate-50/40">
            {selectedScheme ? (
              <div className="space-y-6">
                <div>
                  <div className="inline-block text-[11px] font-bold text-[#1850b5] uppercase tracking-wider bg-blue-100/80 px-2.5 py-0.5 rounded mb-2">
                    {selectedScheme.department}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                    {selectedScheme.name}
                  </h3>
                  <div className="text-sm font-semibold text-slate-600 mb-4">
                    {selectedScheme.nameMr}
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold">
                    Official Benefit: {selectedScheme.benefitAmount}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Scheme Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                    {selectedScheme.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Eligibility Criteria (पात्रता अटी)
                  </h4>
                  <ul className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                    {selectedScheme.eligibility.map((crit, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Required Documents (आवश्यक कागदपत्रे)
                  </h4>
                  <ul className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                    {selectedScheme.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-[#1850b5] shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href={selectedScheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#1850b5] hover:bg-[#0f3675] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-[11px] text-slate-500">
                    Zero application fee on official portals.
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
                <FileText className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-600">
                  Select a scheme on the left to read verified eligibility rules and document checklists.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
