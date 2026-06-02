import { ProductMetadata, NutriCartAPI } from './api';
import { calculateNutriScore, RatingResult } from './rating';

export interface AlternativeProduct extends ProductMetadata {
  rating: RatingResult;
  difference: string;
}

export class AlternativesEngine {
  private api: NutriCartAPI;

  constructor(api: NutriCartAPI) {
    this.api = api;
  }

  async findAlternatives(product: ProductMetadata): Promise<AlternativeProduct[]> {
    if (!product.categories || product.categories.length === 0) {
      return [];
    }

    // Use the most specific category
    const category = product.categories[product.categories.length - 1];
    
    try {
      // Search for products in the same category
      // Open Food Facts supports category search
      const response = await fetch(
        `https://world.openfoodfacts.org/category/${encodeURIComponent(category)}.json?page_size=20`
      );
      const data = await response.json();
      
      if (!data.products) return [];

      const currentRating = calculateNutriScore(product.nutrition);
      
      const alternatives: AlternativeProduct[] = data.products
        .map((p: any) => {
          const mapped = (this.api as any).mapOFFProduct(p); // Accessing private for simplicity in this draft
          const rating = calculateNutriScore(mapped.nutrition);
          return {
            ...mapped,
            rating,
            difference: this.calculateDifference(product, mapped)
          };
        })
        .filter((alt: AlternativeProduct) => {
          // Must be better than current product
          // Grade is A=0, B=1, ... F=4 (mapped from Nutri-Score A-E)
          const gradeMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 };
          return gradeMap[alt.rating.grade] < gradeMap[currentRating.grade];
        })
        .sort((a: AlternativeProduct, b: AlternativeProduct) => {
          const gradeMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 };
          if (gradeMap[a.rating.grade] !== gradeMap[b.rating.grade]) {
            return gradeMap[a.rating.grade] - gradeMap[b.rating.grade];
          }
          return (a.rating.novaGroup || 5) - (b.rating.novaGroup || 5);
        })
        .slice(0, 3);

      return alternatives;
    } catch (error) {
      console.error('Error finding alternatives:', error);
      return [];
    }
  }

  private calculateDifference(original: ProductMetadata, alt: ProductMetadata): string {
    const s1 = original.nutrition.sugars_100g || 0;
    const s2 = alt.nutrition.sugars_100g || 0;
    
    if (s2 < s1) {
      const diff = s1 - s2;
      const percent = Math.round((diff / s1) * 100);
      if (percent > 10) return `${percent}% less sugar`;
    }

    const f1 = original.nutrition.fiber_100g || 0;
    const f2 = alt.nutrition.fiber_100g || 0;
    if (f2 > f1) {
      const diff = f2 - f1;
      return `Higher in fiber`;
    }

    return 'Better overall rating';
  }
}
