// ──────────────────────────────────────────────
// NutriCart Shared Types
// ──────────────────────────────────────────────

/** Nutrition rating letter grade (A-F) */
export type RatingGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/** NOVA food processing classification */
export type NovaGroup = 1 | 2 | 3 | 4;

/** Supported dietary preference filters */
export type DietPreference =
  | 'balanced'
  | 'low-sugar'
  | 'high-protein'
  | 'low-carb'
  | 'vegan'
  | 'keto'
  | 'mediterranean'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free';

/** A scanned product with nutritional info */
export interface ScannedProduct {
  id: string;
  name: string;
  brand: string;
  price?: string;
  size?: string;
  imageUrl?: string;
  emoji?: string;

  /** Nutrition rating */
  rating: NutritionRating;

  /** NOVA group (ultra-processing classification) */
  novaGroup?: NovaGroup;
  isUltraProcessed: boolean;

  /** Nutrition facts per serving */
  nutrition: NutritionInfo;

  /** Healthier alternative suggestions */
  alternatives?: AlternativeProduct[];

  /** Source grocery site */
  source: string;
  timestamp: number;
}

/** Letter+score rating */
export interface NutritionRating {
  grade: RatingGrade;
  score: number; // 0-100
  label: string;
}

/** Nutrition facts breakdown */
export interface NutritionInfo {
  calories: number;
  sugar: number; // grams
  fiber: number; // grams
  protein: number; // grams
  sodium: number; // mg
  saturatedFat?: number;
  servingSize?: string;
}

/** Suggested healthier alternative */
export interface AlternativeProduct {
  name: string;
  brand: string;
  rating: NutritionRating;
  imageUrl?: string;
  emoji?: string;
  reason: string;
  url?: string;
}

/** User preferences stored in chrome.storage */
export interface UserPreferences {
  dietPreferences: DietPreference[];
  showRatingsOnPages: boolean;
  flagUltraProcessed: boolean;
  suggestAlternatives: boolean;
  compactView: boolean;
  alertOnPoorItems: boolean;
  isPremium: boolean;
}

/** Cart scan summary */
export interface CartSummary {
  totalItems: number;
  avgRating: RatingGrade;
  flaggedCount: number;
  upfCount: number;
  totalSugar: number;
  totalCalories: number;
}

/** Messages sent between extension contexts */
export type ExtensionMessage =
  | { type: 'PRODUCT_DETECTED'; payload: { productName: string; brand?: string; url: string } }
  | { type: 'PRODUCT_RATING'; payload: ScannedProduct }
  | { type: 'SCAN_PAGE_REQUEST' }
  | { type: 'SCAN_PAGE_RESULT'; payload: ScannedProduct[] }
  | { type: 'GET_PREFERENCES' }
  | { type: 'PREFERENCES_UPDATED'; payload: UserPreferences }
  | { type: 'GET_CART_SUMMARY' }
  | { type: 'CART_SUMMARY_RESULT'; payload: CartSummary };

/** Default user preferences */
export const DEFAULT_PREFERENCES: UserPreferences = {
  dietPreferences: ['balanced'],
  showRatingsOnPages: true,
  flagUltraProcessed: true,
  suggestAlternatives: true,
  compactView: false,
  alertOnPoorItems: true,
  isPremium: false,
};