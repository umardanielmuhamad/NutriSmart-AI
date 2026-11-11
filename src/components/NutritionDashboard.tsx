import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Calendar, 
  FileText, 
  Flame, 
  Dna, 
  Wheat, 
  Droplet, 
  Sparkles, 
  Apple, 
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { Language, ProductData, VerificationStatus } from '../types/product';
import { translations } from '../utils/translations';

interface NutritionDashboardProps {
  currentLang: Language;
  product: ProductData | null;
  onNavigate: (tab: string) => void;
  onToggleVerification?: () => void;
}

export const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  currentLang,
  product,
  onNavigate,
  onToggleVerification,
}) => {
  const [selectedServingMultiplier, setSelectedServingMultiplier] = React.useState<number>(1);
  const t = translations[currentLang];

  if (!product) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2D5A40] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#55695C]">Loading Nutrition Intelligence...</p>
      </div>
    );
  }

  const isVerified = product.verificationStatus === 'VERIFIED';

  const metricIcons: Record<string, React.ReactNode> = {
    calories: <Flame className="w-5 h-5 text-amber-500" />,
    protein: <Dna className="w-5 h-5 text-emerald-600" />,
    carbohydrates: <Wheat className="w-5 h-5 text-yellow-600" />,
    totalFat: <Droplet className="w-5 h-5 text-orange-500" />,
    dietaryFibre: <Apple className="w-5 h-5 text-teal-600" />,
    totalSugar: <Sparkles className="w-5 h-5 text-rose-500" />,
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            VERIFIED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            PENDING
          </span>
        );
      case 'GENERAL_INFORMATION':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <HelpCircle className="w-3 h-3 text-blue-600" />
            GENERAL INFO
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-[#E3DCce] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143826] text-[#E9C46A] text-xs font-semibold mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>{t.nutrition.badge}</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#143826]">
              {t.nutrition.title}
            </h1>
            <p className="text-sm text-[#4A6B53] mt-1 max-w-3xl">
              {t.nutrition.subtitle}
            </p>
          </div>

          {/* Quick Serving Size Switcher */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#DCD3C0] shadow-xs">
            <span className="text-xs font-semibold text-[#55695C] px-2 hidden sm:inline">
              Serving:
            </span>
            <button
              onClick={() => setSelectedServingMultiplier(1)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedServingMultiplier === 1
                  ? 'bg-[#143826] text-white shadow-sm'
                  : 'text-[#55695C] hover:bg-[#F4EFE6]'
              }`}
            >
              1 Serving (30g / 2 biscuits)
            </button>
            <button
              onClick={() => setSelectedServingMultiplier(4)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedServingMultiplier === 4
                  ? 'bg-[#143826] text-white shadow-sm'
                  : 'text-[#55695C] hover:bg-[#F4EFE6]'
              }`}
            >
              Full Pack (120g / 8 biscuits)
            </button>
          </div>
        </div>

        {/* Status Legend Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs bg-[#FAF7F0] p-3 rounded-2xl border border-[#DFD6C2]">
          <span className="font-bold text-[#143826] uppercase text-[11px] tracking-wider">
            Verification Protocol:
          </span>
          <div className="flex items-center gap-1.5 text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold">{t.nutrition.statusLegend.verified}</span>
          </div>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-1.5 text-amber-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">{t.nutrition.statusLegend.pending}</span>
          </div>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-1.5 text-blue-800">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-semibold">{t.nutrition.statusLegend.general}</span>
          </div>
        </div>
      </div>

      {/* Main Verification Status Callout */}
      {!isVerified ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-amber-900">
                Official Nutritional Analysis Status: PENDING LABORATORY VERIFICATION
              </h3>
              <p className="text-xs text-amber-800 mt-1 max-w-3xl leading-relaxed">
                {t.nutrition.pendingNotice}
              </p>
              <div className="flex flex-wrap gap-4 text-[11px] text-amber-900/80 font-mono mt-2">
                <span>Protocol: {product.labCertificateNo}</span>
                <span>Testing Lab: {product.verificationSource}</span>
                <span>Target: Moisture, Ash, Protein, Soxhlet Fat, AOAC 991.43 Fibre</span>
              </div>
            </div>
          </div>

          {onToggleVerification && (
            <button
              onClick={onToggleVerification}
              className="shrink-0 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Simulate Lab Verification (Judge Demo)
            </button>
          )}
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-emerald-900">
                Official Nutritional Analysis: VERIFIED & ACCREDITED
              </h3>
              <p className="text-xs text-emerald-800 mt-1 max-w-3xl leading-relaxed">
                Nutritional values below are backed by accredited ISO/IEC 17025 laboratory proximate analysis and AOAC gravimetric standards.
              </p>
              <div className="flex flex-wrap gap-4 text-[11px] text-emerald-900/80 font-mono mt-2">
                <span>Certificate No: {product.labCertificateNo}</span>
                <span>Issued Date: {product.verificationDate}</span>
                <span>Source: {product.verificationSource}</span>
              </div>
            </div>
          </div>

          {onToggleVerification && (
            <button
              onClick={onToggleVerification}
              className="shrink-0 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Reset to PENDING (Judge Demo)
            </button>
          )}
        </div>
      )}

      {/* 6 Core Nutrition Metrics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-[#143826]">
            Nutritional Values ({selectedServingMultiplier === 1 ? 'Per 30g Serving' : 'Per 120g Package'})
          </h2>
          <span className="text-xs font-mono text-[#55695C]">
            *Percent Daily Values are based on a 2,000 calorie diet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {product.nutritionMetrics.map((metric) => {
            const hasVerifiedValue = metric.value !== null && isVerified;
            const displayValue = hasVerifiedValue 
              ? (metric.value! * selectedServingMultiplier).toFixed(metric.key === 'calories' ? 0 : 1)
              : null;
            const displayDv = metric.dailyValuePercentage && hasVerifiedValue
              ? metric.dailyValuePercentage * selectedServingMultiplier
              : null;

            return (
              <div
                key={metric.key}
                className="bg-white rounded-2xl p-5 border border-[#E3DCce] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#FBF9F4] border border-[#EAE3D2]">
                        {metricIcons[metric.key]}
                      </div>
                      <span className="font-heading font-bold text-base text-[#143826]">
                        {metric.label[currentLang]}
                      </span>
                    </div>
                    {getStatusBadge(isVerified ? 'VERIFIED' : 'PENDING')}
                  </div>

                  {/* Primary Metric Value */}
                  <div className="my-3">
                    {hasVerifiedValue ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-4xl font-extrabold text-[#143826] tracking-tight">
                          {displayValue}
                        </span>
                        <span className="text-base font-semibold text-[#55695C]">
                          {metric.unit}
                        </span>
                        {displayDv && (
                          <span className="ml-auto text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {displayDv}% DV
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1 py-1">
                        <div className="inline-block px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 text-xs font-bold font-mono">
                          Not Yet Verified
                        </div>
                        <div className="text-xs text-[#55695C] font-medium pt-1">
                          General Reference: <span className="font-mono text-[#143826] font-bold">{metric.referenceEstimate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footnote / Scientific Note */}
                <div className="pt-3 border-t border-[#F0EBE0] text-xs text-[#6B7280]">
                  <p className="line-clamp-2">
                    {metric.notes[currentLang]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Macronutrient Distribution Visualization */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DCce] shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono uppercase text-[#52796F] font-bold">
              Energy Composition
            </span>
            <h3 className="font-heading text-xl font-bold text-[#143826] mt-0.5">
              {t.nutrition.macroBreakdown}
            </h3>
            <p className="text-xs text-[#55695C] mt-1">
              {isVerified 
                ? 'Based on certified proximate carbohydrate, protein, and lipid analyses.'
                : 'Projected macronutrient ratio based on recipe formulation.'}
            </p>
          </div>

          {/* Visual Stacked Bar Chart */}
          <div className="space-y-3">
            <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner bg-stone-100">
              <div 
                style={{ width: '58%' }} 
                className="bg-[#C99A3E] h-full" 
                title="Carbohydrates ~58%" 
              />
              <div 
                style={{ width: '34%' }} 
                className="bg-[#E76F51] h-full" 
                title="Lipids / Fat ~34%" 
              />
              <div 
                style={{ width: '8%' }} 
                className="bg-[#2A9D8F] h-full" 
                title="Protein ~8%" 
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#C99A3E] shrink-0" />
                <div>
                  <span className="font-bold text-[#143826] block">Carbs (58%)</span>
                  <span className="text-[10px] text-[#55695C]">Sorghum & Dates</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#E76F51] shrink-0" />
                <div>
                  <span className="font-bold text-[#143826] block">Lipids (34%)</span>
                  <span className="text-[10px] text-[#55695C]">Dairy Butter</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#2A9D8F] shrink-0" />
                <div>
                  <span className="font-bold text-[#143826] block">Protein (8%)</span>
                  <span className="text-[10px] text-[#55695C]">Sorghum & Dairy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grain Quality Insight */}
          <div className="p-4 rounded-xl bg-[#FBF9F4] border border-[#E9E2D4] text-xs text-[#4A5568] space-y-1">
            <span className="font-bold text-[#143826] block">
              Why Sorghum Grain Carbohydrates Differ:
            </span>
            <p>
              Unlike highly refined white wheat flour which spikes glycemic response quickly, whole-grain sorghum starch contains resistant starch fractions and polyphenols that promote gradual carbohydrate release.
            </p>
          </div>
        </div>

        {/* Comparative Innovation Benchmarking */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DCce] shadow-sm space-y-5">
          <div>
            <span className="text-xs font-mono uppercase text-[#52796F] font-bold">
              Food Tech Innovation Impact
            </span>
            <h3 className="font-heading text-xl font-bold text-[#143826] mt-0.5">
              {t.nutrition.comparisonTitle}
            </h3>
            <p className="text-xs text-[#55695C] mt-1">
              {t.nutrition.comparisonSub}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Added White Cane Sugar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#143826]">Added Refined White Sugar</span>
                <span className="font-mono text-emerald-700 font-bold">0g (SorghuBites) vs ~10g (Conventional)</span>
              </div>
              <div className="h-3 w-full bg-[#F4EFE6] rounded-full overflow-hidden flex">
                <div style={{ width: '0%' }} className="bg-emerald-600 h-full" />
                <div style={{ width: '100%' }} className="bg-rose-400/80 h-full" />
              </div>
              <span className="text-[10px] text-[#6B7280]">Conventional biscuits add 25-35% refined sucrose</span>
            </div>

            {/* Whole Grain Dietary Fibre */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#143826]">Natural Dietary Fibre</span>
                <span className="font-mono text-emerald-700 font-bold">~2.7g (SorghuBites) vs ~0.6g (Refined Wheat)</span>
              </div>
              <div className="h-3 w-full bg-[#F4EFE6] rounded-full overflow-hidden flex">
                <div style={{ width: '85%' }} className="bg-teal-600 h-full" />
                <div style={{ width: '15%' }} className="bg-stone-300 h-full" />
              </div>
              <span className="text-[10px] text-[#6B7280]">Over 4× higher fibre delivered by intact sorghum bran & date pulp</span>
            </div>

            {/* Grain Base */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#143826]">Flour Formulation</span>
                <span className="font-mono text-[#143826] font-bold">100% Sorghum vs 100% Refined Wheat</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#DFD6C2] text-xs text-[#55695C]">
                Sorghum is a drought-resilient grain requiring roughly 1/3 less irrigation than maize or wheat, pairing environmental sustainability with nutrient density.
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Disclaimers & Compliance Banner */}
      <div className="p-6 rounded-3xl bg-[#143826] text-white space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#E9C46A]" />
          <h4 className="font-heading font-bold text-base text-white">
            Regulatory & Lab Compliance Standards
          </h4>
        </div>
        <p className="text-xs text-[#D8F3DC]/90 leading-relaxed">
          {product.disclaimers.labNotice[currentLang]}
        </p>
        <p className="text-xs text-[#D8F3DC]/80 leading-relaxed">
          {product.disclaimers.sugarStatement[currentLang]}
        </p>
      </div>

    </div>
  );
};
