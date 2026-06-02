import { NutriCartAPI, ProductMetadata } from './lib/api';
import { NutriCartCache } from './lib/cache';
import { calculateNutriScore, RatingResult } from './lib/rating';
import { AlternativesEngine } from './lib/alternatives';

const api = new NutriCartAPI();
const cache = new NutriCartCache();
const alternativesEngine = new AlternativesEngine(api);

interface ScanResponse {
  product: ProductMetadata;
  rating: RatingResult;
  alternatives: any[];
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'get-product-data') {
    handleGetProductData(message.payload).then(sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'scan-product') {
    handleScanProduct(message.payload).then(sendResponse);
    return true;
  }
});

async function handleGetProductData(payload: { barcode: string }): Promise<ScanResponse | { error: string }> {
  const { barcode } = payload;
  
  // Check cache
  const cached = await cache.get<ScanResponse>(barcode);
  if (cached) return cached;

  // Fetch from API
  const product = await api.getProductByBarcode(barcode);
  if (!product) return { error: 'Product not found' };

  const rating = calculateNutriScore(product.nutrition);
  const alternatives = await alternativesEngine.findAlternatives(product);

  const response: ScanResponse = {
    product,
    rating,
    alternatives
  };

  // Cache result
  await cache.set(barcode, response);

  return response;
}

async function handleScanProduct(payload: { name: string, brand?: string }): Promise<ScanResponse | { error: string }> {
  const { name, brand } = payload;
  const query = brand ? `${brand} ${name}` : name;
  const cacheKey = `search_${query.toLowerCase().replace(/\s+/g, '_')}`;

  // Check cache
  const cached = await cache.get<ScanResponse>(cacheKey);
  if (cached) return cached;

  // Search API
  const results = await api.searchProducts(query);
  if (results.length === 0) return { error: 'Product not found' };

  // Take the best match (first result)
  const product = results[0];
  const rating = calculateNutriScore(product.nutrition);
  const alternatives = await alternativesEngine.findAlternatives(product);

  const response: ScanResponse = {
    product,
    rating,
    alternatives
  };

  // Cache result
  await cache.set(cacheKey, response);

  return response;
}
