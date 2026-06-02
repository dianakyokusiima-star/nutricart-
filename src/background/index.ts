/**
 * NutriCart Background Service Worker
 *
 * Orchestrates the extension:
 * - Listens for messages from content scripts
 * - Manages caching in chrome.storage.local
 * - Handles API requests to nutrition services
 * - Manages authentication and premium subscriptions
 */

import type { ExtensionMessage, ScannedProduct } from '../shared/types';
import { DEFAULT_PREFERENCES } from '../shared/types';

// ── Storage Helpers ──

async function getPreferences() {
  try {
    const result = await chrome.storage.local.get('preferences');
    return result.preferences || DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

async function getScannedProducts(): Promise<ScannedProduct[]> {
  try {
    const result = await chrome.storage.local.get('scannedProducts');
    return result.scannedProducts || [];
  } catch {
    return [];
  }
}

async function addScannedProduct(product: ScannedProduct) {
  const products = await getScannedProducts();
  // Avoid duplicates by ID
  const filtered = products.filter((p) => p.id !== product.id);
  filtered.unshift(product);
  // Keep last 50 products
  const trimmed = filtered.slice(0, 50);
  await chrome.storage.local.set({ scannedProducts: trimmed });
  return trimmed;
}

// ── Rating Engine ──

function calculateRating(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'F'; label: string } {
  if (score >= 80) return { grade: 'A', label: 'Excellent choice' };
  if (score >= 60) return { grade: 'B', label: 'Good choice' };
  if (score >= 40) return { grade: 'C', label: 'Average / okay' };
  if (score >= 20) return { grade: 'D', label: 'Poor choice' };
  return { grade: 'F', label: 'Avoid' };
}

// ── Message Handler ──

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    switch (message.type) {
      case 'PRODUCT_DETECTED': {
        // Process and respond with rating
        const mockScore = Math.floor(Math.random() * 100);
        const { grade, label } = calculateRating(mockScore);

        const product: ScannedProduct = {
          id: `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: message.payload.productName,
          brand: message.payload.brand || 'Unknown Brand',
          rating: { grade, score: mockScore, label },
          isUltraProcessed: mockScore < 30,
          nutrition: {
            calories: Math.floor(Math.random() * 400) + 50,
            sugar: Math.floor(Math.random() * 30),
            fiber: Math.floor(Math.random() * 8),
            protein: Math.floor(Math.random() * 20),
            sodium: Math.floor(Math.random() * 500) + 50,
          },
          source: new URL(message.payload.url).hostname,
          timestamp: Date.now(),
        };

        if (product.isUltraProcessed) {
          product.novaGroup = 4;
          product.alternatives = [
            {
              name: 'Whole Food Alternative',
              brand: 'Nature\'s Best',
              rating: { grade: 'A', score: 90, label: 'Excellent choice' },
              emoji: '🥗',
              reason: 'No added sugars · Whole ingredients',
            },
          ];
        }

        addScannedProduct(product).then(() => {
          sendResponse({ type: 'PRODUCT_RATING', payload: product });
        });

        return true; // Keep channel open for async response
      }

      case 'GET_PREFERENCES': {
        getPreferences().then(sendResponse);
        return true;
      }

      case 'GET_CART_SUMMARY': {
        getScannedProducts().then((products) => {
          if (products.length === 0) {
            sendResponse({
              type: 'CART_SUMMARY_RESULT',
              payload: { totalItems: 0, avgRating: 'C' as const, flaggedCount: 0, upfCount: 0, totalSugar: 0, totalCalories: 0 },
            });
            return;
          }

          const totalItems = products.length;
          const upfCount = products.filter((p) => p.isUltraProcessed).length;
          const totalSugar = products.reduce((sum, p) => sum + p.nutrition.sugar, 0);
          const totalCalories = products.reduce((sum, p) => sum + p.nutrition.calories, 0);

          // Calculate average grade
          const grades = products.map((p) => p.rating.grade);
          const gradeScores = grades.map((g) => ({ A: 5, B: 4, C: 3, D: 2, F: 1 })[g]);
          const avg = gradeScores.reduce((a, b) => a + b, 0) / gradeScores.length;
          const avgGrade = avg >= 4.5 ? 'A' : avg >= 3.5 ? 'B' : avg >= 2.5 ? 'C' : avg >= 1.5 ? 'D' : 'F';

          sendResponse({
            type: 'CART_SUMMARY_RESULT',
            payload: {
              totalItems,
              avgRating: avgGrade as 'A' | 'B' | 'C' | 'D' | 'F',
              flaggedCount: upfCount,
              upfCount,
              totalSugar,
              totalCalories,
            },
          });
        });
        return true;
      }

      case 'PREFERENCES_UPDATED': {
        chrome.storage.local.set({ preferences: message.payload });
        sendResponse({ success: true });
        return true;
      }

      default:
        sendResponse({ error: 'Unknown message type' });
        return true;
    }
  }
);

// ── Initialization ──

console.log('🍏 NutriCart background service worker initialized');

// Set default preferences on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('preferences').then((result) => {
    if (!result.preferences) {
      chrome.storage.local.set({ preferences: DEFAULT_PREFERENCES });
    }
  });
});