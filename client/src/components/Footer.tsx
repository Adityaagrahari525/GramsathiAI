import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

interface FooterProps {
  currentLang: 'en' | 'mr' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  return (
    <footer id="about" className="bg-[#0f172a] text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">GramSathi.AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {currentLang === 'mr'
                ? 'महाराष्ट्र शासन आणि केंद्र सरकारच्या कल्याणकारी योजनांसाठी बहुभाषिक डिजिटल लोकसेवा सहाय्यक.'
                : 'Empowering rural citizens, farmers, and women entrepreneurs across Maharashtra with verified government scheme discovery, AI assistance, and direct benefits.'}
            </p>
            <div className="text-emerald-400 font-semibold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>100% Free Public Service Platform</span>
            </div>
          </div>

          {/* Col 2: Key Portals */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">
              Official State Gateways
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <a
                  href="https://aaplesarkar.mahaonline.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 flex items-center justify-between"
                >
                  <span>Aaple Sarkar Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://mahadbt.maharashtra.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 flex items-center justify-between"
                >
                  <span>MahaDBT Farmer Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://mahabhumi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 flex items-center justify-between"
                >
                  <span>Mahabhumi (7/12 & 8-A)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 flex items-center justify-between"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Anti-Fraud & Citizens */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">
              Citizen Advisory & Safety
            </h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Government schemes have no private agent fees. Always apply through official government domains (.gov.in or .nic.in) or verified CSC centers.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-amber-300 text-[11px] font-medium">
              ⚠ Report unauthorized fees or fraudulent scheme links to your District Collectorate or Cyber Helpline 1930.
            </div>
          </div>

          {/* Col 4: Helplines */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">
              Civic Helplines
            </h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>State Civic Helpline: <strong>1800-120-8040</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Kisan Call Center: <strong>1800-180-1551</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Women Helpline: <strong>181</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} GramSathi AI • Public Civic Service Digital Platform. Non-commercial open civic initiative.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility Statement</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
