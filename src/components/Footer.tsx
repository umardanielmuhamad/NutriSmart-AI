import React from 'react';
import { Leaf, Sparkles, Award, ShieldCheck, Heart, QrCode } from 'lucide-react';
import { Language } from '../types/product';
import { translations } from '../utils/translations';

interface FooterProps {
  currentLang: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate }) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-[#0E281B] text-[#D8F3DC] border-t border-[#1F4E36] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Project Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52B788] to-[#1B4332] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#0E281B] rounded-[10px] flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#52B788]" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                NutriSmart <span className="text-[#52B788]">AI</span>
              </span>
            </div>
            
            <p className="text-xs text-[#95D5B2]/90 leading-relaxed max-w-sm">
              The digital food information and nutritional intelligence component for <strong>SorghuBites</strong>. Bridging physical packaging with on-demand food science education through smart QR technology and Google Gemini AI.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#143826] border border-[#2D5A40] text-xs font-mono text-[#E9C46A]">
              <Award className="w-4 h-4 text-[#E9C46A]" />
              <span>{t.footer.schoolProject}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              System Modules
            </h4>
            <ul className="space-y-2 text-xs text-[#B7E4C7]/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('product')} className="hover:text-white transition-colors">
                  {t.nav.product} Dossier
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nutrition')} className="hover:text-white transition-colors">
                  {t.nav.nutrition}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ingredients')} className="hover:text-white transition-colors">
                  {t.nav.ingredients}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai')} className="hover:text-white transition-colors">
                  {t.nav.aiChat}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('qr')} className="hover:text-white transition-colors">
                  {t.nav.qrGenerator}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors">
                  {t.nav.admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Regulatory & Safety Disclaimers */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#52B788]" />
              <span>Scientific Compliance</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-[#143826] border border-[#2D5A40] text-[11px] text-[#B7E4C7]/80 space-y-2 leading-relaxed">
              <p>
                <strong>Sugar Transparency:</strong> SorghuBites contains no added refined white sugar. Dates and honey naturally contribute fructose and glucose; it is not a sugar-free food.
              </p>
              <p>
                <strong>Gluten Notice:</strong> Formulated without wheat flour. Official certified gluten-free status requires ISO 17025 laboratory quantification.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-8 border-t border-[#1F4E36] flex flex-wrap items-center justify-between gap-4 text-xs text-[#74C69D]">
          <p>© 2026 NutriSmart AI × SorghuBites Innovation Team. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-bold text-white">Google Gemini 3.8 Flash</span>
            <span>&</span>
            <span className="font-bold text-white">React Full-Stack</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
