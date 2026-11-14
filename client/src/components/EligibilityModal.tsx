import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, FileText, Check } from 'lucide-react';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: 'en' | 'mr' | 'hi';
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '35',
    gender: 'female',
    landholding: 'small', // none, marginal (<2.5 acre), small (2.5-5 acre), large (>5 acre)
    annualIncome: 'under_2.5L',
    category: 'OBC',
    district: 'Pune',
  });
  const [completed, setCompleted] = useState(false);

  const districts = ['Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar', 'Kolhapur', 'Nagpur', 'Nanded', 'Nashik', 'Pune', 'Solapur', 'Yavatmal'];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-[#1850b5] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Check Eligibility (पात्रता तपासा)</h3>
            <p className="text-xs text-blue-100">
              {completed ? 'Evaluation Result • पात्रता निकाल' : `Step ${step} of 4: Instant Criteria Verification`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6">
          {!completed ? (
            <>
              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        s === step
                          ? 'bg-[#1850b5] text-white ring-4 ring-blue-100'
                          : s < step
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s < step ? <Check className="w-4 h-4" /> : s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded-full ${
                          s < step ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Age & Gender */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-base">
                    {currentLang === 'mr' ? '१. तुमचे वय आणि लिंग निवडा' : '1. Personal Profile (Age & Gender)'}
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Age (वय)
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gender (लिंग)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['female', 'male', 'other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`py-2.5 rounded-xl border text-xs font-semibold capitalize ${
                            formData.gender === g
                              ? 'bg-blue-50 border-[#1850b5] text-[#1850b5]'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {g === 'female' ? 'महिला (Female)' : g === 'male' ? 'पुरुष (Male)' : 'इतर (Other)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Landholding (7/12) */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-base">
                    {currentLang === 'mr' ? '२. शेतजमीन धारणा (7/12 उतारा)' : '2. Landholding (7/12 Record)'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    State the total cultivable land registered in your or your family's name.
                  </p>
                  <div className="space-y-2">
                    {[
                      { id: 'none', label: 'Landless / शेतजमीन नाही (कृषी कामगार किंवा कारागीर)' },
                      { id: 'marginal', label: 'Marginal Farmer / २.५ एकरापेक्षा कमी (अल्पभूधारक)' },
                      { id: 'small', label: 'Small Farmer / २.५ ते ५ एकर (मध्यम शेतकरी)' },
                      { id: 'large', label: 'Large Landholder / ५ एकरापेक्षा जास्त' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, landholding: item.id })}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium ${
                          formData.landholding === item.id
                            ? 'bg-blue-50 border-[#1850b5] text-[#1850b5]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Income & Social Category */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-base">
                    {currentLang === 'mr' ? '३. कौटुंबिक वार्षिक उत्पन्न आणि सामाजिक प्रवर्ग' : '3. Annual Family Income & Category'}
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Annual Family Income (वार्षिक कौटुंबिक उत्पन्न)
                    </label>
                    <select
                      value={formData.annualIncome}
                      onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium"
                    >
                      <option value="under_1L">Below ₹1,00,000 (दारिद्र्यरेषेखालील / पिवळे रेशनकार्ड)</option>
                      <option value="under_2.5L">₹1,00,000 to ₹2,50,000 (केशरी रेशनकार्ड)</option>
                      <option value="under_8L">₹2,50,000 to ₹8,00,000 (Non-Creamy Layer)</option>
                      <option value="above_8L">Above ₹8,00,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category (प्रवर्ग)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Open/General', 'OBC', 'SC', 'ST', 'VJNT', 'SBC'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`py-2 rounded-lg border text-xs font-medium ${
                            formData.category === cat
                              ? 'bg-blue-50 border-[#1850b5] text-[#1850b5]'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: District & Residence */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-base">
                    {currentLang === 'mr' ? '४. तुमचा जिल्हा (महाराष्ट्र)' : '4. District in Maharashtra'}
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      District (जिल्हा)
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-slate-700 flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {currentLang === 'mr'
                        ? 'माहिती सुरक्षित आहे. कोणत्याही खाजगी कंपनीसोबत सामायिक केली जात नाही.'
                        : 'Your data is evaluated client-side in memory and strictly protected under state civic standards.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-1.5 bg-[#1850b5] hover:bg-[#0f3675] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs"
                >
                  <span>{step === 4 ? 'Evaluate Schemes' : 'Next Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">
                    {currentLang === 'mr' ? 'अभिनंदन! आपण ३ प्रमुख योजनांसाठी पात्र आहात.' : 'Instant Match: You are eligible for 3 key schemes!'}
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Evaluated against active Maharashtra and Central guidelines.
                  </p>
                </div>
              </div>

              {/* Matched Schemes */}
              <div className="space-y-3">
                {formData.gender === 'female' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">Mukhyamantri Majhi Ladki Bahin Yojana</div>
                      <div className="text-xs text-emerald-600 font-semibold">Benefit: ₹1,500/month (Direct DBT)</div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Eligible</span>
                  </div>
                )}

                {formData.landholding !== 'none' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">PM KISAN Samman Nidhi</div>
                      <div className="text-xs text-emerald-600 font-semibold">Benefit: ₹6,000/year</div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Eligible</span>
                  </div>
                )}

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">MahaDBT Farm Mechanization / Self-Employment</div>
                    <div className="text-xs text-emerald-600 font-semibold">Subsidy: 50% to 90%</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Eligible</span>
                </div>
              </div>

              {/* Document Readiness Checklist */}
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4">
                <h5 className="font-bold text-xs text-blue-950 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>Actionable Document Checklist</span>
                </h5>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>Aadhaar Card (Linked with active Mobile Number for e-KYC)</li>
                  <li>7/12 & 8-A Land Record Extract (from Mahabhumi portal)</li>
                  <li>Tahsil Income Certificate (under ₹2.5 Lakh) or Orange Ration Card</li>
                  <li>Aadhaar-seeded Nationalized Bank Passbook</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="bg-[#1850b5] hover:bg-[#0f3675] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs"
                >
                  Close & Browse Schemes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
