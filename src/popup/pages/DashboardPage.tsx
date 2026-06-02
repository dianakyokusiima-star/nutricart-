import { ChevronRight } from 'lucide-react';
import type { ScannedProduct, CartSummary } from '../../shared/types';
import { SummaryCard } from '../components/SummaryCard';
import { ScanItem } from '../components/ScanItem';

interface DashboardPageProps {
  products: ScannedProduct[];
  summary: CartSummary;
}

export function DashboardPage({ products, summary }: DashboardPageProps) {
  const recentScans = products.slice(0, 5);

  return (
    <div>
      <SummaryCard summary={summary} />

      {/* Recent Scans header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-nc-sm font-semibold text-nc-gray-700">Recent Scans</h2>
        <button className="text-nc-xs text-nc-green-500 font-medium cursor-pointer bg-transparent border-none hover:underline">
          View all →
        </button>
      </div>

      {/* Quick stats */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-white border border-nc-gray-200 rounded-nc-lg p-3 text-center">
          <div className="text-[11px] font-semibold text-nc-gray-500 uppercase tracking-[0.03em]">
            Total Sugar
          </div>
          <div className="text-nc-md font-bold text-nc-gray-900 mt-1">
            {summary.totalSugar}g
          </div>
        </div>
        <div className="flex-1 bg-white border border-nc-gray-200 rounded-nc-lg p-3 text-center">
          <div className="text-[11px] font-semibold text-nc-gray-500 uppercase tracking-[0.03em]">
            Total Calories
          </div>
          <div className="text-nc-md font-bold text-nc-gray-900 mt-1">
            {summary.totalCalories}
          </div>
        </div>
        <div className="flex-1 bg-white border border-nc-gray-200 rounded-nc-lg p-3 text-center">
          <div className="text-[11px] font-semibold text-nc-gray-500 uppercase tracking-[0.03em]">
            UPF Items
          </div>
          <div className="text-nc-md font-bold text-nc-up-text mt-1">
            {summary.upfCount}
          </div>
        </div>
      </div>

      {/* Scan items */}
      {recentScans.map((product) => (
        <ScanItem key={product.id} product={product} />
      ))}
    </div>
  );
}