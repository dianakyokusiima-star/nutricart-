import type { ScannedProduct } from '../../shared/types';
import { RatingBadge } from './RatingBadge';
import { isPoorRating } from '../../shared/ratings';

interface ScanItemProps {
  product: ScannedProduct;
  onClick?: () => void;
}

export function ScanItem({ product, onClick }: ScanItemProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 bg-nc-gray-50 rounded-nc-lg mb-2 cursor-pointer transition-all duration-150 hover:bg-white hover:border-nc-gray-200 border border-transparent"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      aria-label={`${product.name} by ${product.brand} — rating ${product.rating.grade}`}
    >
      {/* Product image/emoji */}
      <div className="w-11 h-11 rounded-nc-md bg-nc-gray-200 shrink-0 flex items-center justify-center text-xl text-nc-gray-500">
        {product.emoji || '📦'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-nc-sm font-medium text-nc-gray-900 truncate">
          {product.name}
        </div>
        <div className="text-[11px] text-nc-gray-500 mt-0.5">{product.brand}</div>
        <div className="flex items-center gap-1.5 mt-1">
          {product.isUltraProcessed ? (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-nc-sm bg-nc-up-bg text-nc-up-text">
              ⚠ UPF
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-nc-sm bg-[#ECFDF5] text-[#065F46]">
              ✓ Clean
            </span>
          )}
          <span className="text-[10px] text-nc-gray-300">|</span>
          <span className="text-[10px] text-nc-gray-500">
            {product.nutrition.calories} cal
          </span>
          {isPoorRating(product.rating.grade) && product.alternatives && product.alternatives.length > 0 && (
            <>
              <span className="text-[10px] text-nc-gray-300">|</span>
              <span className="text-[10px] text-nc-green-500 font-medium">
                {product.alternatives.length} swaps
              </span>
            </>
          )}
        </div>
      </div>

      {/* Rating badge */}
      <RatingBadge grade={product.rating.grade} size="sm" />
    </div>
  );
}