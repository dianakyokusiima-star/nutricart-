import { ShoppingCart } from 'lucide-react';

export function EmptyState() {
  return (
    <div>
      <div className="text-center py-8 text-nc-gray-500">
        <div className="text-4xl mb-3 opacity-50 flex justify-center">
          <ShoppingCart size={40} className="text-nc-gray-300" />
        </div>
        <div className="text-nc-md font-semibold text-nc-gray-700 mb-1">
          Start Shopping Smarter
        </div>
        <p className="text-nc-xs text-nc-gray-500 max-w-[260px] mx-auto leading-relaxed">
          Browse any grocery website and NutriCart will automatically scan products and show their nutrition ratings right on the page.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
          <span className="text-2xl">🛍️</span>
          <span className="text-2xl">→</span>
          <span className="text-2xl">🍎</span>
        </div>
        <div className="text-[11px] text-nc-gray-300 mt-2">
          Visit a grocery site to get started
        </div>
      </div>

      {/* Supported sites */}
      <div className="bg-nc-gray-50 rounded-nc-lg p-3">
        <div className="text-[11px] font-semibold text-nc-gray-500 mb-2">
          💡 Supported Grocery Sites
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['Walmart', 'Amazon Fresh', 'Kroger', 'Instacart', 'Target', 'Whole Foods'].map((site) => (
            <span
              key={site}
              className="bg-white px-2.5 py-1 rounded-nc-full text-[11px] text-nc-gray-700 border border-nc-gray-200"
            >
              {site}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}