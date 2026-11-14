import React from 'react';
import { Mic, FileCheck, Landmark } from 'lucide-react';

interface StepsSectionProps {
  onStartStep: (stepNumber: number) => void;
}

export const StepsSection: React.FC<StepsSectionProps> = ({
  onStartStep,
}) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100 bg-[#fbfdff]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="text-xs font-bold text-[#1850b5] tracking-widest uppercase mb-1">
          Demystifying Civic Administration
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          How GramSathi AI Works in 3 Simple Steps
        </h2>
        <p className="text-sm text-slate-600">
          Designed specifically to bypass middle-men, eliminate application fraud, and ensure every eligible rupee reaches your DBT bank account directly.
        </p>
      </div>

      {/* 3 Step Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div
          onClick={() => onStartStep(1)}
          className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1850b5] text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STEP 01 / चरण १
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2.5">
              Describe Your Need or Profile
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Speak in your native dialect (Varhadi/Ahirani) or enter basic details: age, land size, annual family income, and taluka/district. No complicated government forms required.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-2 text-xs text-slate-700">
            <Mic className="w-4 h-4 text-[#1850b5] shrink-0" />
            <span className="font-medium">Supports 14 regional dialects across Maharashtra</span>
          </div>
        </div>

        {/* Step 2 */}
        <div
          onClick={() => onStartStep(2)}
          className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1850b5] text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STEP 02 / चरण २
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2.5">
              Get Instant Match & Checklist
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              GramSathi AI scans active Maharashtra Gazettes and provides an exact qualification breakdown plus an actionable document checklist (Aadhaar, 7/12 extract, caste certificates).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-2 text-xs text-slate-700">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Highlights documents needed to submit</span>
          </div>
        </div>

        {/* Step 3 */}
        <div
          onClick={() => onStartStep(3)}
          className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1850b5] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STEP 03 / चरण ३
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2.5">
              Apply with Verified Guidance
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Receive direct official links to MahaDBT or Aaple Sarkar, or locate your nearest Gram Panchayat Seva Kendra (CSC) with a ready-to-present application reference slip.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-2 text-xs text-slate-700">
            <Landmark className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">Zero agent fees. Zero fraud. Direct transfer ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};
