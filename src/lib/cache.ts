export interface CacheItem<T> {
  value: T;
  expiry: number;
  lastAccessed: number;
}

export class NutriCartCache {
  private static DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private static MAX_ITEMS = 500;

  async get<T>(key: string): Promise<T | null> {
    const storageKey = `cache_${key}`;
    const data = await chrome.storage.local.get(storageKey);
    const item = data[storageKey] as CacheItem<T>;

    if (!item) return null;

    if (Date.now() > item.expiry) {
      await chrome.storage.local.remove(storageKey);
      return null;
    }

    // Update last accessed for LRU
    item.lastAccessed = Date.now();
    await chrome.storage.local.set({ [storageKey]: item });

    return item.value;
  }

  async set<T>(key: string, value: T, ttl = NutriCartCache.DEFAULT_TTL): Promise<void> {
    const storageKey = `cache_${key}`;
    const item: CacheItem<T> = {
      value,
      expiry: Date.now() + ttl,
      lastAccessed: Date.now(),
    };

    await chrome.storage.local.set({ [storageKey]: item });
    
    // Check for eviction
    await this.evictIfFull();
  }

  private async evictIfFull(): Promise<void> {
    const allData = await chrome.storage.local.get(null);
    const cacheKeys = Object.keys(allData).filter(k => k.startsWith('cache_'));

    if (cacheKeys.length <= NutriCartCache.MAX_ITEMS) return;

    // Sort by last accessed and remove oldest
    const sortedKeys = cacheKeys.sort((a, b) => {
      return (allData[a] as CacheItem<any>).lastAccessed - (allData[b] as CacheItem<any>).lastAccessed;
    });

    const keysToRemove = sortedKeys.slice(0, cacheKeys.length - NutriCartCache.MAX_ITEMS);
    await chrome.storage.local.remove(keysToRemove);
  }
}
