import React from 'react';
import { 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  Bot, 
  BarChart3, 
  QrCode, 
  Wheat, 
  Sun, 
  Sparkles, 
  ShieldCheck, 
  FileCheck2, 
  Calendar,
  X,
  Maximize2,
  HeartPulse
} from 'lucide-react';
import { Language, ProductData } from '../types/product';
import { translations } from '../utils/translations';

interface ProductPageProps {
  currentLang: Language;
  product: ProductData | null;
  onNavigate: (tab: string) => void;
  onAskAiQuestion: (question: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  currentLang,
  product,
  onNavigate,
  onAskAiQuestion,
}) => {
  const [showImageModal, setShowImageModal] = React.useState(false);
  const t = translations[currentLang];

  if (!product) {
    return (
      <div className="py-20 text-center text-[#55695C]">
        <div className="animate-spin w-8 h-8 border-4 border-[#2D5A40] border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading SorghuBites Product Dossier...</p>
      </div>
    );
  }

  const isVerified = product.verificationStatus === 'VERIFIED';

  const ingredientIcons: Record<string, React.ReactNode> = {
    'sorghum-flour': <Wheat className="w-5 h-5 text-[#B38A2E]" />,
    dates: <Sun className="w-5 h-5 text-[#D97706]" />,
    honey: <Sparkles className="w-5 h-5 text-[#EAB308]" />,
    butter: <ShieldCheck className="w-5 h-5 text-[#16A34A]" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3DCce] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#52796F] mb-1">
            <span>Catalog</span>
            <span>/</span>
            <span>Ancient Grain Innovations</span>
            <span>/</span>
            <span className="text-[#143826] font-bold">SorghuBites Dossier</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#143826]">
            {product.name}
          </h1>
          <p className="text-base text-[#4A6B53] mt-1">
            {product.category[currentLang]} — {product.tagline[currentLang]}
          </p>
        </div>

        {/* Verification Status Banner Pill */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
            isVerified 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            {isVerified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="block font-black">STATUS: VERIFIED</span>
                  <span className="text-[10px] font-normal text-emerald-700">ISO 17025 Accredited Laboratory</span>
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-600 animate-pulse" />
                <div>
                  <span className="block font-black">STATUS: PENDING</span>
                  <span className="text-[10px] font-normal text-amber-700">Lab Proximate Analysis In Progress</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => onNavigate('qr')}
            className="px-3.5 py-2 bg-[#143826] text-white hover:bg-[#1F4E36] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-[#E9C46A]" />
            <span>Packaging QR</span>
          </button>
        </div>
      </div>

      {/* Main Product Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Showcase Visual & Physical Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E3DCce] shadow-sm">
            
            {/* Visual Physical Prototype Jar Presentation */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#FDFBF7] to-[#F3EDE0] p-4 border border-[#DCD3C0] text-center overflow-hidden mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-3 py-1 bg-[#143826] text-[#E9C46A] rounded-full text-[10px] font-mono font-bold">
                  OFFICIAL PHYSICAL PROTOTYPE
                </span>
                <span className="text-[10px] font-mono font-bold text-[#2D5A40] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Product of Malaysia
                </span>
              </div>

              {/* Real Prototype Photo with Lightbox Click */}
              <div 
                onClick={() => setShowImageModal(true)}
                className="group relative aspect-[3/4] max-h-80 w-full mx-auto rounded-xl bg-white p-2 border border-[#E0D7C4] shadow-sm hover:shadow-md transition-all cursor-zoom-in flex items-center justify-center overflow-hidden"
              >
                <img
                  src="/assets/aistudio/photo_2026-11-10_15.45.03_ce988b6b.jpeg"
                  alt="SorghuBites Physical Prototype Glass Jar"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-2 bottom-2 bg-[#0E281B]/85 backdrop-blur-xs text-white text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-between opacity-95 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-[#D8F3DC]">Click to Zoom Prototype Label</span>
                  <span className="text-[10px] text-[#E9C46A] font-bold">🔍 View Full Size</span>
                </div>
              </div>

              {/* On-Packaging Exact Formula Breakdown */}
              <div className="mt-4 p-3 bg-white rounded-xl border border-[#E5DEC9] text-left space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#6B7280] font-bold block">
                  Official On-Pack Recipe Formulation (100%):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-1.5 bg-[#FAF7F0] rounded-lg">
                    <span className="text-[#143826] font-medium">Sorghum Flour</span>
                    <strong className="font-mono text-[#143826]">40%</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-[#FAF7F0] rounded-lg">
                    <span className="text-[#143826] font-medium">Dates Puree</span>
                    <strong className="font-mono text-[#143826]">30%</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-[#FAF7F0] rounded-lg">
                    <span className="text-[#143826] font-medium">Creamery Butter</span>
                    <strong className="font-mono text-[#143826]">25%</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-[#FAF7F0] rounded-lg">
                    <span className="text-[#143826] font-medium">Natural Honey</span>
                    <strong className="font-mono text-[#143826]">5%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FBF9F4] rounded-xl border border-[#E8E1D3]">
                <span className="text-[#6B7280] block font-mono uppercase text-[10px]">{t.productPage.servingInfo}</span>
                <span className="font-bold text-[#143826] text-sm mt-0.5 block">{product.servingSize}</span>
              </div>
              <div className="p-3 bg-[#FBF9F4] rounded-xl border border-[#E8E1D3]">
                <span className="text-[#6B7280] block font-mono uppercase text-[10px]">{t.productPage.servingsPerPack}</span>
                <span className="font-bold text-[#143826] text-sm mt-0.5 block">{product.servingsPerPack} Servings</span>
              </div>
              <div className="p-3 bg-[#FBF9F4] rounded-xl border border-[#E8E1D3]">
                <span className="text-[#6B7280] block font-mono uppercase text-[10px]">{t.productPage.netWeight}</span>
                <span className="font-bold text-[#143826] text-sm mt-0.5 block">{product.netWeight}</span>
              </div>
              <div className="p-3 bg-[#FBF9F4] rounded-xl border border-[#E8E1D3]">
                <span className="text-[#6B7280] block font-mono uppercase text-[10px]">Primary Grain</span>
                <span className="font-bold text-[#143826] text-sm mt-0.5 block">Sorghum bicolor</span>
              </div>
            </div>

            {/* Verification Metadata Box */}
            <div className="mt-4 p-3.5 bg-[#FAF7F0] rounded-xl border border-[#DFD6C2] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#143826] font-bold">
                <FileCheck2 className="w-4 h-4 text-[#40916C]" />
                <span>{t.productPage.labTestingDossier}</span>
              </div>
              <div className="flex justify-between text-[#55695C] pt-1">
                <span>{t.productPage.certificateNo}:</span>
                <span className="font-mono font-bold text-[#143826]">{product.labCertificateNo}</span>
              </div>
              <div className="flex justify-between text-[#55695C]">
                <span>{t.productPage.lastUpdated}:</span>
                <span className="font-mono text-[#143826]">{new Date(product.lastUpdated).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-[#55695C]">
                <span>Facility:</span>
                <span className="text-right text-[#143826] font-medium">{product.verificationSource}</span>
              </div>
            </div>

          </div>

          {/* Quick AI Trigger Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#143826] to-[#1F4E36] text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#E9C46A]" />
              <h3 className="font-heading font-bold text-base text-white">
                {t.productPage.launchAiForProduct}
              </h3>
            </div>
            <p className="text-xs text-[#D8F3DC]/80">
              {currentLang === 'ms' 
                ? 'Ingin tahu bagaimana tepung sorgum bertindak balas tanpa gandum? Tanya terus kepada pembantu AI kami.'
                : 'Curious how sorghum dough behaves without wheat gluten? Inquire directly with our Gemini AI assistant.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onAskAiQuestion('What makes SorghuBites different from conventional biscuits?')}
                className="text-[11px] px-3 py-1.5 bg-[#0E281B] hover:bg-[#2D5A40] text-[#D8F3DC] rounded-lg border border-[#40916C]/50 transition-colors text-left"
              >
                "What makes SorghuBites different?"
              </button>
              <button
                onClick={() => onAskAiQuestion('Why is sorghum flour used instead of wheat flour?')}
                className="text-[11px] px-3 py-1.5 bg-[#0E281B] hover:bg-[#2D5A40] text-[#D8F3DC] rounded-lg border border-[#40916C]/50 transition-colors text-left"
              >
                "Why sorghum instead of wheat?"
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Full Scientific Formulation & Regulatory Transparency */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Product Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DCce] shadow-sm space-y-4">
            <h2 className="font-heading text-2xl font-bold text-[#143826]">
              {product.shortDescription[currentLang]}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {product.fullDescription[currentLang]}
            </p>

            {/* Formulation Highlights Bullet Points */}
            <div className="pt-2">
              <h4 className="font-heading text-sm font-bold text-[#143826] uppercase tracking-wider mb-3">
                {t.productPage.quickSpecs}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.formulationHighlights[currentLang].map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#2D3748] bg-[#FBF9F4] p-2.5 rounded-xl border border-[#ECE5D8]">
                    <CheckCircle2 className="w-4 h-4 text-[#2D5A40] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CRITICAL COMPLIANCE NOTICE 1: SUGAR TRANSPARENCY */}
          <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-5 text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="font-heading font-bold text-sm tracking-wide text-amber-900">
                {t.productPage.sugarRuleTitle}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-amber-900 font-medium">
              {product.disclaimers.sugarStatement[currentLang]}
            </p>
          </div>

          {/* CRITICAL COMPLIANCE NOTICE 2: GLUTEN & WHEAT NOTICE */}
          <div className="bg-emerald-50/80 border-2 border-emerald-300/80 rounded-2xl p-5 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-700 shrink-0" />
              <h3 className="font-heading font-bold text-sm tracking-wide text-emerald-900">
                {t.productPage.glutenRuleTitle}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-emerald-900 font-medium">
              {product.disclaimers.glutenStatement[currentLang]}
            </p>
          </div>

          {/* 4 Clean Ingredients Card Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DCce] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-[#143826]">
                {t.productPage.fourIngredientsTitle}
              </h3>
              <button
                onClick={() => onNavigate('ingredients')}
                className="text-xs font-bold text-[#2D5A40] hover:text-[#143826] flex items-center gap-1 group"
              >
                <span>Deep Explorer</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {product.ingredients.map((ing) => (
                <div
                  key={ing.id}
                  onClick={() => onNavigate('ingredients')}
                  className="p-4 rounded-2xl bg-[#FBF9F4] hover:bg-[#F4EFE6] border border-[#ECE5D8] hover:border-[#D5C7AA] cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg shadow-xs border border-[#E5DEC9]">
                      {ingredientIcons[ing.id] || <Sparkles className="w-4 h-4 text-[#52B788]" />}
                    </div>
                    <h4 className="font-heading font-bold text-sm text-[#143826]">
                      {ing.name[currentLang]}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#6B7280] font-mono italic">
                    {ing.botanicalOrOrigin}
                  </p>
                  <p className="text-xs text-[#4A5568] line-clamp-2">
                    {ing.roleInRecipe[currentLang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Packaging Label Features Card */}
          <div className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-7 border border-[#DFD6C2] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#8C3A27]" />
                <h3 className="font-heading font-bold text-lg text-[#143826]">
                  Physical Jar Label Analysis (Batch SB-2026)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#143826] text-[#E9C46A]">
                Product of Malaysia
              </span>
            </div>

            <p className="text-xs text-[#55695C] leading-relaxed">
              The physical prototype packaging displays three primary nutritional innovation badges backed by the 40/30/25/5 recipe matrix:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#ECE5D8] shadow-2xs">
                <div className="font-extrabold text-[#8C3A27] text-xs mb-1">
                  1. HIGH FIBER
                </div>
                <p className="text-[11px] text-[#4A5568]">
                  Derived from whole sorghum grain pericarp (40%) and intact whole date cellular pulp (30%).
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#ECE5D8] shadow-2xs">
                <div className="font-extrabold text-[#1B4332] text-xs mb-1">
                  2. WHEAT FREE
                </div>
                <p className="text-[11px] text-[#4A5568]">
                  Formulated with 100% sorghum flour. Does not use any wheat flour in the formulation.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#ECE5D8] shadow-2xs">
                <div className="font-extrabold text-[#A66D38] text-xs mb-1">
                  3. NO ADDED SUGAR
                </div>
                <p className="text-[11px] text-[#4A5568]">
                  Zero added refined white cane sugar. Naturally sweetened with whole dates and raw honey.
                </p>
              </div>
            </div>

            {/* Scientific Nuance on Diabetic & Celiac Patient Notice */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs text-amber-950 space-y-1">
              <strong className="block font-bold text-amber-900">
                Food Science & Health Guidance Note:
              </strong>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                While the physical jar label notes suitability for diabetic and celiac disease patients, our scientific advisory highlights two important nuances: (1) Individuals with celiac disease must note that official certified gluten-free status requires ISO 17025 accredited clean-facility testing (&lt;20 ppm); (2) Individuals with diabetes must note that naturally occurring fruit sugars in dates and honey still contribute carbohydrate calories and should be integrated mindfully with medical dietary guidance.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('nutrition')}
              className="px-6 py-3 bg-[#143826] hover:bg-[#1B4332] text-[#D8F3DC] font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <BarChart3 className="w-4 h-4 text-[#52B788]" />
              <span>{t.productPage.viewFullNutrition}</span>
            </button>

            <button
              onClick={() => onNavigate('ai')}
              className="px-5 py-3 bg-white hover:bg-[#F9F6F0] text-[#143826] font-semibold rounded-xl border border-[#D5C7AA] flex items-center gap-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-[#A66D38]" />
              <span>{t.hero.askAiCta}</span>
            </button>

            <button
              onClick={() => setShowImageModal(true)}
              className="px-4 py-3 bg-[#FAF7F0] hover:bg-[#F4EFE6] text-[#143826] text-xs font-semibold rounded-xl border border-[#D5C7AA] flex items-center gap-1.5 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#40916C]" />
              <span>View Prototype Jar Photo</span>
            </button>
          </div>

        </div>

      </div>

      {/* High-Resolution Physical Prototype Lightbox Modal */}
      {showImageModal && (
        <div 
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F0] rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-[#D5C7AA] relative overflow-hidden flex flex-col items-center space-y-4 max-h-[95vh] overflow-y-auto"
          >
            <div className="w-full flex items-center justify-between border-b border-[#E3DCce] pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-[#143826]">
                  SorghuBites Physical Packaging Jar
                </h3>
                <p className="text-xs text-[#52796F] font-mono">
                  Official Prototype • School Innovation Project 2026 • Product of Malaysia
                </p>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
                aria-label="Close image modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[65vh] flex items-center justify-center bg-white rounded-2xl p-4 border border-[#E0D7C4] overflow-hidden">
              <img
                src="/assets/aistudio/photo_2026-11-10_15.45.03_ce988b6b.jpeg"
                alt="SorghuBites Physical Prototype Packaging Full Resolution"
                className="max-h-[60vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="w-full bg-white p-4 rounded-xl border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="font-mono text-[#143826]">
                <strong>Ingredients on Label:</strong> Sorghum (40%), Dates (30%), Butter (25%), Honey (5%)
              </div>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  onNavigate('qr');
                }}
                className="px-4 py-2 bg-[#143826] text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#1B4332] transition-colors"
              >
                <span>Generate QR for this Jar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
