export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'GENERAL_INFORMATION';

export type Language = 'en' | 'ms';

export interface IngredientInfo {
  id: string;
  name: {
    en: string;
    ms: string;
  };
  botanicalOrOrigin: string;
  roleInRecipe: {
    en: string;
    ms: string;
  };
  generalNutritionalCharacteristics: {
    en: string;
    ms: string;
  };
  sugarClarification?: {
    en: string;
    ms: string;
  };
  scientificDetails: {
    en: string;
    ms: string;
  };
  keyBenefits: {
    en: string[];
    ms: string[];
  };
  iconName: string;
}

export interface NutritionMetric {
  key: 'calories' | 'protein' | 'carbohydrates' | 'totalFat' | 'dietaryFibre' | 'totalSugar';
  label: {
    en: string;
    ms: string;
  };
  unit: string;
  value: number | null; // null if not yet verified
  referenceEstimate?: string; // Clearly labeled as estimated general range
  status: VerificationStatus;
  dailyValuePercentage?: number | null;
  notes: {
    en: string;
    ms: string;
  };
}

export interface ProductData {
  id: string;
  name: string;
  tagline: {
    en: string;
    ms: string;
  };
  category: {
    en: string;
    ms: string;
  };
  shortDescription: {
    en: string;
    ms: string;
  };
  fullDescription: {
    en: string;
    ms: string;
  };
  servingSize: string;
  servingsPerPack: number;
  netWeight: string;
  origin?: string;
  imageUrl?: string;
  formulationPercentages?: {
    sorghum: number;
    dates: number;
    butter: number;
    honey: number;
  };
  verificationStatus: VerificationStatus;
  verificationSource: string;
  verificationDate: string;
  labCertificateNo: string;
  formulationHighlights: {
    en: string[];
    ms: string[];
  };
  ingredients: IngredientInfo[];
  nutritionMetrics: NutritionMetric[];
  disclaimers: {
    sugarStatement: {
      en: string;
      ms: string;
    };
    glutenStatement: {
      en: string;
      ms: string;
    };
    labNotice: {
      en: string;
      ms: string;
    };
  };
  qrDestinationPath: string;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: Language;
  groundingStatus?: 'GROUNDED_SORGHUBITES' | 'GENERAL_EDUCATION' | 'PENDING_NOTICE';
}
