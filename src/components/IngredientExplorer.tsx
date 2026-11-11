import React from 'react';
import { 
  Wheat, 
  Sun, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  X, 
  Layers, 
  HelpCircle,
  Dna,
  ArrowRight
} from 'lucide-react';
import { Language, ProductData, IngredientInfo } from '../types/product';
import { translations } from '../utils/translations';

interface IngredientExplorerProps {
  currentLang: Language;
  product: ProductData | null;
  onAskAiAboutIngredient: (ingredientName: string) => void;
}

export const IngredientExplorer: React.FC<IngredientExplorerProps> = ({
  currentLang,
  product,
  onAskAiAboutIngredient,
}) => {
  const [selectedIngredient, setSelectedIngredient] = React.useState<IngredientInfo | null>(null);
  const t = translations[currentLang];

  if (!product) return null;

  const ingredientIcons: Record<string, React.ReactNode> = {
    'sorghum-flour': <Wheat className="w-8 h-8 text-[#B38A2E]" />,
    dates: <Sun className="w-8 h-8 text-[#D97706]" />,
    honey: <Sparkles className="w-8 h-8 text-[#EAB308]" />,
    butter: <ShieldCheck className="w-8 h-8 text-[#16A34A]" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#E3DCce] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143826] text-[#E9C46A] text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t.ingredients.badge}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#143826]">
          {t.ingredients.title}
        </h1>
        <p className="text-sm text-[#4A6B53] mt-1 max-w-3xl">
          {t.ingredients.subtitle}
        </p>

        {/* Official Physical Prototype Recipe Ratio Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F0] border border-[#DFD6C2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-xl p-1 border border-[#D5C7AA] shrink-0 overflow-hidden">
              <img
                src="/assets/aistudio/photo_2026-11-10_15.45.03_ce988b6b.jpeg"
                alt="SorghuBites Prototype Jar"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#8C3A27] block">
                Official Label Formulation (100%):
              </span>
              <div className="font-heading font-extrabold text-sm sm:text-base text-[#143826]">
                Sorghum (40%) • Dates (30%) • Butter (25%) • Honey (5%)
              </div>
              <span className="text-[11px] text-[#55695C]">
                Product of Malaysia • No Wheat Flour • No Added White Refined Sugar
              </span>
            </div>
          </div>
          <span className="shrink-0 text-xs font-mono font-bold bg-[#143826] text-[#E9C46A] px-3 py-1.5 rounded-xl self-start sm:self-auto">
            100% Clean Formulation
          </span>
        </div>

        {/* Clear Notice: Ingredient vs Finished Biscuit */}
        <div className="mt-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Food Science Note:</strong> Ingredient-level characteristics describe raw botanical and lipid components. They should not be conflated with the measured nutritional composition of the baked biscuit matrix.
          </span>
        </div>
      </div>

      {/* 4 Interactive Ingredient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.ingredients.map((ing) => (
          <div
            key={ing.id}
            onClick={() => setSelectedIngredient(ing)}
            className="group bg-white rounded-3xl p-6 sm:p-7 border border-[#E3DCce] hover:border-[#143826] shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header with Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#FBF9F4] group-hover:bg-[#EAE3D2] border border-[#E0D7C4] flex items-center justify-center transition-colors">
                    {ingredientIcons[ing.id]}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#143826] group-hover:text-[#2D5A40] transition-colors">
                      {ing.name[currentLang]}
                    </h3>
                    <p className="text-xs font-mono text-[#6B7280] italic">
                      {ing.botanicalOrOrigin}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#40916C] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Clean Food
                </span>
              </div>

              {/* Role in Recipe */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#143826] uppercase text-[10px] tracking-wider block mb-1">
                    {t.ingredients.roleInSorghubites}
                  </span>
                  <p className="text-[#4A5568] leading-relaxed">
                    {ing.roleInRecipe[currentLang]}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#143826] uppercase text-[10px] tracking-wider block mb-1">
                    {t.ingredients.nutritionalProfile}
                  </span>
                  <p className="text-[#4A5568] leading-relaxed">
                    {ing.generalNutritionalCharacteristics[currentLang]}
                  </p>
                </div>

                {/* Specific Sugar Notice for Dates & Honey */}
                {ing.sugarClarification && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                    <strong>{t.ingredients.sugarNote}:</strong> {ing.sugarClarification[currentLang]}
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer: Click prompt */}
            <div className="mt-5 pt-4 border-t border-[#F0EBE0] flex items-center justify-between text-xs">
              <span className="text-[#55695C] font-semibold group-hover:text-[#143826] transition-colors flex items-center gap-1">
                <span>View Complete Food Tech Profile</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAskAiAboutIngredient(ing.name.en);
                }}
                className="text-[11px] font-bold text-[#143826] hover:text-[#52B788] underline decoration-dotted"
              >
                Ask AI
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Science Modal Dialog */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D5C7AA] max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E3DCce] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FBF9F4] border border-[#E0D7C4] flex items-center justify-center">
                  {ingredientIcons[selectedIngredient.id]}
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-[#143826]">
                    {selectedIngredient.name[currentLang]}
                  </h3>
                  <p className="text-xs font-mono text-[#52796F]">
                    {selectedIngredient.botanicalOrOrigin}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedIngredient(null)}
                className="p-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE3D2] text-[#143826] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              
              <div>
                <h4 className="font-bold text-[#143826] uppercase text-[11px] tracking-wider mb-1">
                  {t.ingredients.roleInSorghubites}
                </h4>
                <p className="text-[#4A5568] text-sm leading-relaxed bg-[#FBF9F4] p-3.5 rounded-xl border border-[#ECE5D8]">
                  {selectedIngredient.roleInRecipe[currentLang]}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#143826] uppercase text-[11px] tracking-wider mb-1">
                  {t.ingredients.foodTechInsight}
                </h4>
                <p className="text-[#4A5568] text-sm leading-relaxed bg-[#FBF9F4] p-3.5 rounded-xl border border-[#ECE5D8]">
                  {selectedIngredient.scientificDetails[currentLang]}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#143826] uppercase text-[11px] tracking-wider mb-1">
                  {t.ingredients.nutritionalProfile}
                </h4>
                <p className="text-[#4A5568] text-sm leading-relaxed bg-[#FBF9F4] p-3.5 rounded-xl border border-[#ECE5D8]">
                  {selectedIngredient.generalNutritionalCharacteristics[currentLang]}
                </p>
              </div>

              {selectedIngredient.sugarClarification && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>{t.ingredients.sugarNote}</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {selectedIngredient.sugarClarification[currentLang]}
                  </p>
                </div>
              )}

              {/* Key Benefits List */}
              <div>
                <h4 className="font-bold text-[#143826] uppercase text-[11px] tracking-wider mb-2">
                  {t.ingredients.benefits}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIngredient.keyBenefits[currentLang].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#ECE5D8]">
                      <CheckCircle2 className="w-4 h-4 text-[#2D5A40] shrink-0" />
                      <span className="text-xs text-[#2D3748] font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E3DCce] flex items-center justify-between">
              <button
                onClick={() => {
                  const name = selectedIngredient.name.en;
                  setSelectedIngredient(null);
                  onAskAiAboutIngredient(name);
                }}
                className="px-5 py-2.5 bg-[#143826] hover:bg-[#1F4E36] text-[#D8F3DC] text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
              >
                <span>Ask AI About {selectedIngredient.name[currentLang]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedIngredient(null)}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
