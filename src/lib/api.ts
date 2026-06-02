import { NutritionData } from './rating';

export interface ProductMetadata {
  id: string;
  name: string;
  brand?: string;
  image_url?: string;
  categories?: string[];
  nutrition: NutritionData;
  serving_size?: string;
}

export class NutriCartAPI {
  private static OFF_BASE_URL = 'https://world.openfoodfacts.org';
  private static EDAMAM_BASE_URL = 'https://api.edamam.com/api/food-database/v2';
  
  private edamamAppId: string = '';
  private edamamAppKey: string = '';

  constructor(config?: { edamamAppId?: string, edamamAppKey?: string }) {
    if (config) {
      this.edamamAppId = config.edamamAppId || '';
      this.edamamAppKey = config.edamamAppKey || '';
    }
  }

  async getProductByBarcode(barcode: string): Promise<ProductMetadata | null> {
    try {
      // Try Open Food Facts first
      const offProduct = await this.fetchOFFProduct(barcode);
      if (offProduct) return offProduct;

      // Fallback to Edamam if credentials exist
      if (this.edamamAppId && this.edamamAppKey) {
        return await this.fetchEdamamProduct(barcode);
      }
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
    }
    return null;
  }

  async searchProducts(query: string): Promise<ProductMetadata[]> {
    try {
      const response = await fetch(`${NutriCartAPI.OFF_BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=5`);
      const data = await response.json();
      
      if (data.products) {
        return data.products.map((p: any) => this.mapOFFProduct(p));
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
    return [];
  }

  private async fetchOFFProduct(barcode: string): Promise<ProductMetadata | null> {
    const response = await fetch(`${NutriCartAPI.OFF_BASE_URL}/api/v2/product/${barcode}.json`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.status !== 1 || !data.product) return null;

    return this.mapOFFProduct(data.product);
  }

  public mapOFFProduct(p: any): ProductMetadata {
    return {
      id: p._id || p.code,
      name: p.product_name || 'Unknown Product',
      brand: p.brands,
      image_url: p.image_front_url,
      categories: p.categories_hierarchy,
      serving_size: p.serving_size,
      nutrition: {
        energy_kj_100g: p.nutriments?.['energy-kj_100g'] || p.nutriments?.energy_100g * 4.184, // convert kcal to kj if needed
        sugars_100g: p.nutriments?.sugars_100g,
        saturated_fat_100g: p.nutriments?.['saturated-fat_100g'],
        sodium_100g: p.nutriments?.sodium_100g,
        fiber_100g: p.nutriments?.fiber_100g,
        proteins_100g: p.nutriments?.proteins_100g,
        fruits_veg_nuts_colza_walnut_olive_oils_100g: p.nutriments?.['fruits-vegetables-nuts-estimate-from-ingredients_100g'],
        nova_group: p.nova_group,
      }
    };
  }

  private async fetchEdamamProduct(barcode: string): Promise<ProductMetadata | null> {
    const url = `${NutriCartAPI.EDAMAM_BASE_URL}/parser?upc=${barcode}&app_id=${this.edamamAppId}&app_key=${this.edamamAppKey}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.hints || data.hints.length === 0) return null;

    const food = data.hints[0].food;
    return {
      id: food.foodId,
      name: food.label,
      brand: food.brand,
      image_url: food.image,
      categories: food.category ? [food.category] : [],
      nutrition: {
        energy_kj_100g: food.nutrients?.ENERC_KCAL * 4.184,
        proteins_100g: food.nutrients?.PROCNT,
        saturated_fat_100g: food.nutrients?.FASAT,
        sugars_100g: food.nutrients?.CHOCDF, // Edamam uses carbs as proxy or specific sugar?
        fiber_100g: food.nutrients?.FIBTG,
        sodium_100g: (food.nutrients?.NA || 0) / 1000,
      }
    };
  }
}
