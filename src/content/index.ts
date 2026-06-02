/**
 * NutriCart Content Script
 *
 * Detects products on grocery sites and injects overlay UI.
 * Uses Shadow DOM to isolate extension styles from page CSS.
 *
 * Targeted sites:
 * - Instacart (instacart.com)
 * - Amazon Fresh / Whole Foods (amazon.com)
 * - Walmart (walmart.com)
 */

import type { ScannedProduct, ExtensionMessage } from '../shared/types';

// ── Product Detection ──

interface DetectedProduct {
  name: string;
  brand?: string;
  price?: string;
  element: Element;
}

/**
 * Attempt to detect products on the current grocery page.
 * Returns an array of detected products with DOM references.
 */
function detectProducts(): DetectedProduct[] {
  const hostname = window.location.hostname;
  const products: DetectedProduct[] = [];

  try {
    if (hostname.includes('instacart.com')) {
      // Instacart: product cards
      document.querySelectorAll('[data-testid="product"]').forEach((el) => {
        const nameEl = el.querySelector('[data-testid="product-name"]');
        const priceEl = el.querySelector('[data-testid="product-price"]');
        if (nameEl?.textContent) {
          products.push({
            name: nameEl.textContent.trim(),
            price: priceEl?.textContent?.trim(),
            element: el,
          });
        }
      });
    } else if (hostname.includes('amazon.com')) {
      // Amazon: product titles in grid/list view
      document.querySelectorAll('[data-component-type="s-search-result"]').forEach((el) => {
        const nameEl = el.querySelector('h2 a span');
        const priceEl = el.querySelector('.a-price');
        if (nameEl?.textContent) {
          products.push({
            name: nameEl.textContent.trim(),
            price: priceEl?.textContent?.trim(),
            element: el,
          });
        }
      });
    } else if (hostname.includes('walmart.com')) {
      // Walmart: product tiles
      document.querySelectorAll('[data-item-id]').forEach((el) => {
        const nameEl = el.querySelector('span[data-automation-id="product-name"]');
        if (nameEl?.textContent) {
          products.push({
            name: nameEl.textContent.trim(),
            element: el,
          });
        }
      });
    }
  } catch {
    // Silently fail — may not be on a supported page
  }

  return products;
}

// ── Shadow DOM Injection ──

/**
 * Injects a NutriCart overlay card into the page using Shadow DOM.
 * This prevents page CSS from affecting our styles.
 */
function injectOverlayCard(product: DetectedProduct, rating: ScannedProduct) {
  // Remove existing overlay if any
  const existing = product.element.querySelector('.nutricart-overlay');
  existing?.remove();

  const overlayHost = document.createElement('div');
  overlayHost.className = 'nutricart-overlay';
  overlayHost.style.cssText = `
    margin-top: 8px;
    position: relative;
    z-index: 9999;
  `;

  const shadow = overlayHost.attachShadow({ mode: 'closed' });

  // Inject styles
  const style = document.createElement('style');
  style.textContent = getOverlayStyles();
  shadow.appendChild(style);

  // Inject HTML
  const card = document.createElement('div');
  card.className = 'nc-overlay-card';
  card.innerHTML = getOverlayHTML(rating);
  shadow.appendChild(card);

  product.element.appendChild(overlayHost);
}

function getOverlayStyles(): string {
  return `
    :host {
      --nc-green-500: #2D9F6E;
      --nc-rating-excellent: #2D9F6E;
      --nc-rating-good: #6ABF4B;
      --nc-rating-average: #F5A623;
      --nc-rating-poor: #E8863B;
      --nc-rating-bad: #E04848;
      --nc-up-bg: #FFF3E0;
      --nc-up-border: #FFB74D;
      --nc-up-text: #E65100;
      --nc-up-icon: #F57C00;
      --nc-white: #FFFFFF;
      --nc-gray-50: #F9FAFB;
      --nc-gray-100: #F3F4F6;
      --nc-gray-200: #E5E7EB;
      --nc-gray-300: #D1D5DB;
      --nc-gray-500: #6B7280;
      --nc-gray-700: #374151;
      --nc-gray-900: #111827;
      --nc-shadow-overlay: 0 8px 32px rgba(0,0,0,0.16);
    }

    .nc-overlay-card {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--nc-white);
      border-radius: 8px;
      box-shadow: var(--nc-shadow-overlay);
      border: 1px solid var(--nc-gray-200);
      overflow: hidden;
      max-width: 300px;
      font-size: 12px;
      line-height: 1.4;
    }

    .nc-rating-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
    }

    .nc-badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      color: white;
      flex-shrink: 0;
      border: 2px solid white;
    }

    .nc-info {
      flex: 1;
      min-width: 0;
    }

    .nc-info-label {
      font-weight: 600;
      color: var(--nc-gray-900);
      font-size: 12px;
    }

    .nc-info-sub {
      color: var(--nc-gray-500);
      font-size: 11px;
      margin-top: 1px;
    }

    .nc-bar {
      height: 4px;
      border-radius: 2px;
      background: var(--nc-gray-200);
      margin-top: 4px;
      overflow: hidden;
    }

    .nc-bar-fill {
      height: 100%;
      border-radius: 2px;
      background: linear-gradient(90deg, #E04848 0%, #F5A623 50%, #2D9F6E 100%);
    }

    .nc-upf-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--nc-up-bg);
      border-top: 1px solid var(--nc-up-border);
      font-size: 11px;
      font-weight: 600;
      color: var(--nc-up-text);
    }

    .nc-upf-icon {
      color: var(--nc-up-icon);
      font-size: 14px;
    }

    .nc-nutrition {
      padding: 8px 12px;
      border-top: 1px solid var(--nc-gray-200);
    }

    .nc-nutrition-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 11px;
    }

    .nc-nutrition-label {
      color: var(--nc-gray-500);
    }

    .nc-nutrition-value {
      font-weight: 600;
      color: var(--nc-gray-700);
    }

    .nc-nutrition-value.bad {
      color: var(--nc-rating-bad);
    }

    .nc-alt-section {
      padding: 8px 12px;
      border-top: 1px solid var(--nc-gray-200);
    }

    .nc-alt-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--nc-gray-700);
      margin-bottom: 6px;
    }

    .nc-alt-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
    }

    .nc-alt-name {
      flex: 1;
      font-size: 11px;
      font-weight: 500;
      color: var(--nc-gray-900);
    }

    .nc-alt-reason {
      font-size: 10px;
      color: var(--nc-gray-500);
    }

    .nc-alt-badge {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 10px;
      color: white;
      flex-shrink: 0;
    }
  `;
}

function getOverlayHTML(rating: ScannedProduct): string {
  const gradeColors: Record<string, string> = {
    A: '#2D9F6E', B: '#6ABF4B', C: '#F5A623', D: '#E8863B', F: '#E04848',
  };

  const badgeColor = gradeColors[rating.rating.grade] || '#6B7280';

  let html = `
    <div class="nc-rating-row">
      <div class="nc-badge" style="background:${badgeColor}">${rating.rating.grade}</div>
      <div class="nc-info">
        <div class="nc-info-label">${rating.rating.label}</div>
        <div class="nc-info-sub">NutriScore: ${rating.rating.score}/100</div>
        <div class="nc-bar">
          <div class="nc-bar-fill" style="width:${rating.rating.score}%"></div>
        </div>
      </div>
    </div>
  `;

  if (rating.isUltraProcessed) {
    html += `
      <div class="nc-upf-row">
        <span class="nc-upf-icon">⚠</span>
        Ultra-Processed Food Detected
        ${rating.novaGroup ? `<span style="margin-left:auto;background:var(--nc-up-icon);color:white;padding:1px 6px;border-radius:999px;font-size:9px;font-weight:700;">NOVA ${rating.novaGroup}</span>` : ''}
      </div>
    `;
  }

  // Nutrition (simplified)
  const { nutrition } = rating;
  html += `
    <div class="nc-nutrition">
      <div class="nc-nutrition-row">
        <span class="nc-nutrition-label">Calories</span>
        <span class="nc-nutrition-value">${nutrition.calories}</span>
      </div>
      <div class="nc-nutrition-row">
        <span class="nc-nutrition-label">Sugar</span>
        <span class="nc-nutrition-value ${nutrition.sugar > 10 ? 'bad' : ''}">${nutrition.sugar}g</span>
      </div>
      <div class="nc-nutrition-row">
        <span class="nc-nutrition-label">Protein</span>
        <span class="nc-nutrition-value">${nutrition.protein}g</span>
      </div>
    </div>
  `;

  // Alternatives
  if (rating.alternatives && rating.alternatives.length > 0) {
    html += `<div class="nc-alt-section"><div class="nc-alt-title">🌱 Healthier Alternatives</div>`;
    for (const alt of rating.alternatives) {
      const altColor = gradeColors[alt.rating.grade] || '#6B7280';
      html += `
        <div class="nc-alt-item">
          <div style="flex:1;min-width:0;">
            <div class="nc-alt-name">${alt.name}</div>
            <div class="nc-alt-reason">${alt.reason}</div>
          </div>
          <div class="nc-alt-badge" style="background:${altColor}">${alt.rating.grade}</div>
        </div>
      `;
    }
    html += `</div>`;
  }

  return html;
}

// ── Main Execution ──

async function scanCurrentPage() {
  const products = detectProducts();

  for (const product of products) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'PRODUCT_DETECTED',
        payload: {
          productName: product.name,
          brand: product.brand,
          url: window.location.href,
        },
      });

      if (response?.type === 'PRODUCT_RATING') {
        injectOverlayCard(product, response.payload);
      }
    } catch {
      // Extension context might not be available (e.g., dev page)
    }
  }
}

// ── Observe DOM Changes ──

// Initial scan
scanCurrentPage();

// Watch for dynamic content (infinite scroll, SPA navigation)
const observer = new MutationObserver(() => {
  scanCurrentPage();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  throttleMs: 500,
});

console.log('🍏 NutriCart content script initialized');