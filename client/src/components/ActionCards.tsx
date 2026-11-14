import React from 'react';
import { Search, CheckSquare, MessageSquareText, ArrowRight } from 'lucide-react';

interface ActionCardsProps {
  onBrowseDirectory: () => void;
  onCheckEligibility: () => void;
  onAskAI: () => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  onBrowseDirectory,
  onCheckEligibility,
  onAskAI,
}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Find Schemes */}
        <div
          onClick={onBrowseDirectory}
          className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1850b5] flex items-center justify-center group-hover:bg-[#1850b5] group-hover:text-white transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                500+ Schemes
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#1850b5] transition-colors">
              Find Schemes
            </h3>
            <div className="text-sm font-semibold text-slate-500 mb-3">
              (योजना शोधा)
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Browse 500+ verified Maharashtra & Central Government schemes categorised systematically by life stage, trade, sector, and caste category.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-[#1850b5] group-hover:translate-x-1 transition-transform">
            <span>Browse Scheme Directory</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>

        {/* Card 2: Check Eligibility */}
        <div
          onClick={onCheckEligibility}
          className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckSquare className="w-6 h-6" />
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                3 Min Evaluation
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
              Check Eligibility
            </h3>
            <div className="text-sm font-semibold text-slate-500 mb-3">
              (पात्रता तपासा)
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Answer 4 simple questions (age, landholding, income, district) to get an instant checklist of eligible schemes without bureaucratic jargon.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
            <span>Start 4-Step Check</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>

        {/* Card 3: Ask GramSathi AI */}
        <div
          onClick={onAskAI}
          className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1850b5] flex items-center justify-center group-hover:bg-[#1850b5] group-hover:text-white transition-colors">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <span className="bg-blue-50 text-[#1850b5] border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                Voice & Chat
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#1850b5] transition-colors">
              Ask GramSathi AI
            </h3>
            <div className="text-sm font-semibold text-slate-500 mb-3">
              (ग्रामसाथी विचार)
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Conversational guidance in simple spoken Marathi, Hindi, or English. Audio responses supported for low-literacy citizens.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-[#1850b5] group-hover:translate-x-1 transition-transform">
            <span>Start Voice & Chat Assistant</span>
            <span className="ml-1.5">💬</span>
          </div>
        </div>
      </div>
    </section>
  );
};
