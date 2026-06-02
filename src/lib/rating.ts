export type RatingGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface NutritionData {
  energy_kj_100g?: number;
  sugars_100g?: number;
  saturated_fat_100g?: number;
  sodium_100g?: number; // in grams, so multiply by 1000 for mg
  fiber_100g?: number;
  proteins_100g?: number;
  fruits_veg_nuts_colza_walnut_olive_oils_100g?: number; // percentage
  nova_group?: number;
}

export interface RatingResult {
  grade: RatingGrade;
  score: number;
  color: string;
  novaGroup?: number;
  isUltraProcessed: boolean;
}

const GRADE_COLORS = {
  A: '#2D9F6E',
  B: '#6ABF4B',
  C: '#F5A623',
  D: '#E8863B',
  F: '#E04848',
};

export function calculateNutriScore(data: NutritionData): RatingResult {
  let negativePoints = 0;
  let positivePoints = 0;

  // Negative points (Energy, Sugars, Sat Fat, Sodium)
  // Energy (kJ)
  const energy = data.energy_kj_100g || 0;
  negativePoints += Math.min(10, Math.floor(energy / 335));

  // Sugars (g)
  const sugars = data.sugars_100g || 0;
  negativePoints += Math.min(10, Math.floor(sugars / 4.5));

  // Saturated Fat (g)
  const satFat = data.saturated_fat_100g || 0;
  negativePoints += Math.min(10, Math.floor(satFat / 1));

  // Sodium (mg)
  const sodiumMg = (data.sodium_100g || 0) * 1000;
  negativePoints += Math.min(10, Math.floor(sodiumMg / 90));

  // Positive points (Fruits/Veg, Fiber, Protein)
  // Fruits/Veg (%)
  const fruitsVeg = data.fruits_veg_nuts_colza_walnut_olive_oils_100g || 0;
  positivePoints += Math.min(5, Math.floor(fruitsVeg / 20));

  // Fiber (g)
  const fiber = data.fiber_100g || 0;
  positivePoints += Math.min(5, Math.floor(fiber / 0.9));

  // Protein (g)
  const protein = data.proteins_100g || 0;
  positivePoints += Math.min(5, Math.floor(protein / 1.6));

  // Special rule: if negative points >= 11 and fruits/veg < 80%, 
  // protein points are not counted unless fruits/veg >= 80% (simplified)
  let score = negativePoints - positivePoints;
  if (negativePoints >= 11 && fruitsVeg < 80) {
    score = negativePoints - (positivePoints - Math.min(5, Math.floor(protein / 1.6)));
  }

  let grade: RatingGrade = 'F';
  if (score <= -1) grade = 'A';
  else if (score <= 2) grade = 'B';
  else if (score <= 10) grade = 'C';
  else if (score <= 18) grade = 'D';
  else grade = 'F';

  return {
    grade,
    score,
    color: GRADE_COLORS[grade],
    novaGroup: data.nova_group,
    isUltraProcessed: data.nova_group === 4,
  };
}
