import React from 'react';
import { ArrowRight, Sparkles, QrCode, ShieldAlert, CheckCircle2, Bot, Wheat, Flame, Award, Smartphone } from 'lucide-react';
import { Language, ProductData } from '../types/product';
import { translations } from '../utils/translations';

interface HeroSectionProps {
  currentLang: Language;
  product: ProductData | null;
  onNavigate: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  product,
  onNavigate,
}) => {
  const t = translations[currentLang];
  const isVerified = product?.verificationStatus === 'VERIFIED';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#143826] via-[#1B4332] to-[#2D5A40] text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative organic background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#52B788]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-[#E9C46A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Product Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E281B]/80 border border-[#52B788]/40 text-[#95D5B2] text-xs font-semibold tracking-wide shadow-sm">
              <Award className="w-4 h-4 text-[#E9C46A]" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              <span className="text-[#E9C46A] underline decoration-[#52B788]/50 decoration-wavy">
                {t.hero.titleHighlight}
              </span>{' '}
              <br className="hidden sm:inline" />
              <span className="text-white">{t.hero.titleRest}</span>
            </h1>

            <p className="text-base sm:text-lg text-[#D8F3DC]/90 max-w-2xl font-normal leading-relaxed">
              {product ? product.shortDescription[currentLang] : t.hero.description}
            </p>

            {/* Quick Formulation Highlights Pill Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#0E281B]/60 border border-[#2D5A40] rounded-xl p-3">
                <span className="text-[11px] uppercase tracking-wider text-[#95D5B2] font-mono block">Flour Base</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Wheat className="w-4 h-4 text-[#E9C46A]" />
                  100% Sorghum Grain
                </span>
                <span className="text-[11px] text-[#B7E4C7]/70 block mt-0.5">Zero wheat flour used</span>
              </div>

              <div className="bg-[#0E281B]/60 border border-[#2D5A40] rounded-xl p-3">
                <span className="text-[11px] uppercase tracking-wider text-[#95D5B2] font-mono block">Sweetening</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#52B788]" />
                  Dates & Honey
                </span>
                <span className="text-[11px] text-[#B7E4C7]/70 block mt-0.5">No added refined sugar</span>
              </div>

              <div className="bg-[#0E281B]/60 border border-[#2D5A40] rounded-xl p-3 col-span-2 sm:col-span-1">
                <span className="text-[11px] uppercase tracking-wider text-[#95D5B2] font-mono block">Verification</span>
                <span className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${isVerified ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Lab Verified
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Pending Lab Test
                    </>
                  )}
                </span>
                <span className="text-[11px] text-[#B7E4C7]/70 block mt-0.5">
                  {isVerified ? 'ISO 17025 certified' : 'Testing in progress'}
                </span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigate('product')}
                className="px-6 py-3.5 bg-[#52B788] hover:bg-[#40916C] text-[#0E281B] font-bold rounded-xl shadow-lg shadow-[#52B788]/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.hero.scanPackagingCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('ai')}
                className="px-5 py-3.5 bg-[#0E281B] hover:bg-[#1B4332] text-white font-semibold rounded-xl border border-[#40916C] flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Bot className="w-4 h-4 text-[#E9C46A]" />
                <span>{t.hero.askAiCta}</span>
              </button>

              <button
                onClick={() => onNavigate('qr')}
                className="px-4 py-3.5 bg-transparent hover:bg-white/10 text-[#D8F3DC] text-sm font-medium rounded-xl border border-white/20 flex items-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.hero.downloadQrCta}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Physical Product & QR Innovation Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-[#FBF9F4] text-[#17261D] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#E9C46A]/40 ring-1 ring-black/5 overflow-hidden">
              
              {/* Product Badge */}
              <div className="flex items-center justify-between border-b border-[#EADFC9] pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
                    Innovation Batch • Product of Malaysia
                  </span>
                  <h3 className="font-heading text-2xl font-black text-[#143826]">
                    SorghuBites
                  </h3>
                </div>
                <span className="px-3 py-1 bg-[#143826] text-[#E9C46A] rounded-full text-xs font-bold font-mono">
                  Glass Jar Prototype
                </span>
              </div>

              {/* Physical Prototype Image Showcase Card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-[#FDFBF7] to-[#F3EDE0] p-3 border-2 border-[#EADFC9] shadow-inner overflow-hidden mb-4 group cursor-pointer"
                   onClick={() => onNavigate('product')}>
                <div className="relative aspect-[3/4] max-h-64 w-full flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-xs">
                  <img
                    src="/assets/aistudio/photo_2026-11-10_15.45.03_ce988b6b.jpeg"
                    alt="SorghuBites Physical Prototype Glass Jar"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#143826]/90 backdrop-blur-xs text-[#E9C46A] text-[10px] font-mono px-2 py-0.5 rounded-md font-bold border border-[#E9C46A]/30">
                    Physical Prototype
                  </div>
                  <div className="absolute bottom-2 inset-x-2 bg-[#0E281B]/90 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#95D5B2]">Sorghum 40% • Dates 30% • Butter 25% • Honey 5%</span>
                    <span className="text-[10px] text-[#E9C46A] font-bold underline">Inspect</span>
                  </div>
                </div>
              </div>

              {/* 3 Physical Badges from the Jar Label */}
              <div className="grid grid-cols-3 gap-1.5 mb-4 text-center">
                <div className="bg-[#FAF7F0] border border-[#E5DEC9] rounded-lg py-1.5 px-1">
                  <span className="text-[10px] font-extrabold text-[#8C3A27] block leading-tight">HIGH FIBER</span>
                  <span className="text-[9px] text-[#55695C]">Whole Grains</span>
                </div>
                <div className="bg-[#FAF7F0] border border-[#E5DEC9] rounded-lg py-1.5 px-1">
                  <span className="text-[10px] font-extrabold text-[#1B4332] block leading-tight">WHEAT FREE</span>
                  <span className="text-[9px] text-[#55695C]">100% Sorghum</span>
                </div>
                <div className="bg-[#FAF7F0] border border-[#E5DEC9] rounded-lg py-1.5 px-1">
                  <span className="text-[10px] font-extrabold text-[#A66D38] block leading-tight">NO ADDED SUGAR</span>
                  <span className="text-[9px] text-[#55695C]">Fruit Sweetened</span>
                </div>
              </div>

              {/* QR Flow Explanation */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E5DEC9] shadow-sm">
                  <div className="p-2 rounded-lg bg-[#EBF7EE] text-[#1B4332] shrink-0">
                    <Smartphone className="w-5 h-5 text-[#2D5A40]" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-[#143826] font-bold block mb-0.5">
                      {currentLang === 'ms' ? 'Langkah 1: Imbas Bungkusan' : 'Step 1: Scan On-Pack QR'}
                    </strong>
                    <span className="text-[#55695C]">
                      {currentLang === 'ms'
                        ? 'Gunakan kamera biasa telefon pintar untuk membuka maklumat saintifik tanpa sebarang muat turun.'
                        : 'Point phone camera at packaging QR to open instant food science intelligence.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E5DEC9] shadow-sm">
                  <div className="p-2 rounded-lg bg-[#FEF6E4] text-[#A66D38] shrink-0">
                    <Bot className="w-5 h-5 text-[#B38A2E]" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-[#143826] font-bold block mb-0.5">
                      {currentLang === 'ms' ? 'Langkah 2: Tanya NutriSmart AI' : 'Step 2: Ask NutriSmart AI'}
                    </strong>
                    <span className="text-[#55695C]">
                      {currentLang === 'ms'
                        ? 'Pembantu berasaskan Gemini menjawab peranan bahan & sains pemakanan dalam Bahasa Melayu & Inggeris.'
                        : 'Gemini-powered assistant answers ingredient roles & nutrition concepts in English & Malay.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Link to QR generation */}
              <button
                onClick={() => onNavigate('qr')}
                className="w-full mt-4 py-2.5 bg-[#143826] hover:bg-[#1B4332] text-[#D8F3DC] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#E9C46A]" />
                <span>{currentLang === 'ms' ? 'Buka Kod QR Bungkusan' : 'Open Packaging QR Code'}</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
