import { useState, useEffect, useCallback } from 'react';
import { PopupHeader } from './components/PopupHeader';
import { ScanBar } from './components/ScanBar';
import { TabNavigation, type TabId } from './components/TabNavigation';
import { DashboardPage } from './pages/DashboardPage';
import { CartScanPage } from './pages/CartScanPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';
import { EmptyState } from './pages/EmptyState';
import type { ScannedProduct, UserPreferences, CartSummary } from '../shared/types';
import { DEFAULT_PREFERENCES } from '../shared/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load data from chrome storage
  useEffect(() => {
    async function loadData() {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          const result = await chrome.storage.local.get(['preferences', 'scannedProducts']);
          if (result.preferences) setPreferences(result.preferences);
          if (result.scannedProducts) setScannedProducts(result.scannedProducts);
        }
      } catch {
        // Running outside extension context — use defaults
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save preferences when changed
  const updatePreferences = useCallback(async (updated: UserPreferences) => {
    setPreferences(updated);
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ preferences: updated });
      }
    } catch {
      // Storage not available
    }
  }, []);

  // Cart summary derived from scanned products
  const cartSummary: CartSummary | null = scannedProducts.length > 0
    ? {
        totalItems: scannedProducts.length,
        avgRating: 'B',
        flaggedCount: scannedProducts.filter(p => p.isUltraProcessed).length,
        upfCount: scannedProducts.filter(p => p.isUltraProcessed).length,
        totalSugar: scannedProducts.reduce((sum, p) => sum + p.nutrition.sugar, 0),
        totalCalories: scannedProducts.reduce((sum, p) => sum + p.nutrition.calories, 0),
      }
    : null;

  if (loading) {
    return (
      <div className="w-[380px] min-h-[400px] bg-nc-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-nc-gray-500 text-nc-sm">Loading NutriCart…</div>
      </div>
    );
  }

  const hasProducts = scannedProducts.length > 0;

  return (
    <div className="popup-container min-h-[400px]">
      <PopupHeader
        showBack={showSettings}
        onBack={() => setShowSettings(false)}
        onSettingsClick={() => setShowSettings(true)}
      />

      {!showSettings && <ScanBar />}

      {!showSettings && (
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      <div className="p-4 max-h-[420px] overflow-y-auto">
        {showSettings ? (
          <SettingsPage
            preferences={preferences}
            onPreferencesChange={updatePreferences}
          />
        ) : !hasProducts ? (
          <EmptyState />
        ) : activeTab === 'dashboard' ? (
          <DashboardPage
            products={scannedProducts}
            summary={cartSummary!}
          />
        ) : activeTab === 'cart-scan' ? (
          <CartScanPage
            products={scannedProducts}
            summary={cartSummary!}
          />
        ) : activeTab === 'goals' ? (
          <GoalsPage
            products={scannedProducts}
            isPremium={preferences.isPremium}
            onUpgrade={() => updatePreferences({ ...preferences, isPremium: true })}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}