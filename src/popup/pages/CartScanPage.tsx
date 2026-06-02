import { useState } from 'react';
import { ArrowUpDown, Sparkles, ShoppingCart, AlertTriangle } from 'lucide-react';
import type { ScannedProduct, CartSummary } from '../../shared/types';
import { ScanItem } from '../components/ScanItem';
import { RatingBadge } from '../components/RatingBadge';
import { isPoorRating } from '../../shared/ratings';

interface CartScanPageProps {
  products: ScannedProduct[];
  summary: CartSummary;
}

type SortMode = 'worst-first' | 'best-first' | 'alpha';

export function CartScanPage({ products, summary }: CartScanPageProps) {
  const [sort, setSort] = useState<SortMode>('worst-first');

  const sorted = [...products].sort((a, b) => {
    if (sort === 'worst-first') {
      const order = ['F', 'D', 'C', 'B', 'A'];
      return order.indexOf(a.rating.grade) - order.indexOf(b.rating.grade);
    }
    if (sort === 'best-first') {
      const order = ['A', 'B', 'C', 'D', 'F'];
      return order.indexOf(a.rating.grade) - order.indexOf(b.rating.grade);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      {/* Cart score header */}
      <div className="bg-white border border-nc-gray-200 rounded-nc-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-nc-green-500" />
            <span className="text-nc-sm font-semibold text-nc-gray-700">Cart Score</span>
          </div>
          <div className="flex items-center gap-2">
            <RatingBadge grade={summary.avgRating} size="sm" />
          </div>
        </div>
        <div className="flex gap-3 text-nc-xs text-nc-gray-500">
          <span className="flex items-center gap-1">
            <AlertTriangle size={12} className="text-nc-up-icon" />
            {summary.upfCount} UPF items
          </span>
          <span>{summary.totalItems} items</span>
          <span>{summary.totalCalories} cal</span>
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-nc-xs font-medium text-nc-gray-500 flex items-center gap-1">
          <ArrowUpDown size={12} />
          Sort:
        </label>
        <select
          className="text-nc-xs border border-nc-gray-200 rounded-nc-md px-2 py-1 bg-white text-nc-gray-700 font-inter outline-none focus:border-nc-green-500"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          aria-label="Sort products"
        >
          <option value="worst-first">Worst First</option>
          <option value="best-first">Best First</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>

      {/* Items */}
      {sorted.map((product) => (
        <div key={product.id} className="relative">
          <ScanItem product={product} />
          {isPoorRating(product.rating.grade) && product.alternatives && product.alternatives.length > 0 && (
            <div className="ml-14 -mt-1 mb-2 text-[10px] text-nc-green-500 font-medium">
              Swap: {product.alternatives[0].name} → +{3 - ['F', 'D', 'C', 'B', 'A'].indexOf(product.rating.grade)} tiers
            </div>
          )}
        </div>
      ))}

      {/* Premium optimize button */}
      <button className="w-full mt-3 bg-gradient-to-r from-nc-green-500 to-nc-green-600 text-white border-none rounded-nc-md py-2.5 font-semibold text-nc-sm cursor-pointer flex items-center justify-center gap-1.5 font-inter transition-opacity duration-150 hover:opacity-90">
        <Sparkles size={14} />
        Optimize My Cart (Premium)
      </button>
    </div>
  );
}