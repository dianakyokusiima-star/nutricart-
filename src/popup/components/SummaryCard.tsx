import type { CartSummary } from '../../shared/types';
import { getRatingColor, getRatingLabel } from '../../shared/ratings';

interface SummaryCardProps {
  summary: CartSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="bg-nc-green-50 rounded-nc-lg p-4 mb-4">
      <div className="text-nc-xs font-semibold text-nc-green-700 uppercase tracking-[0.03em] mb-2">
        Today's Cart Summary
      </div>
      <div className="flex gap-3">
        <SummaryStat
          value={summary.totalItems.toString()}
          label="Items Scanned"
        />
        <SummaryStat
          value={summary.avgRating}
          label="Avg Rating"
          color={getRatingColor(summary.avgRating)}
        />
        <SummaryStat
          value={summary.flaggedCount.toString()}
          label="Flagged Items"
          color={summary.flaggedCount > 0 ? '#E04848' : undefined}
        />
      </div>
    </div>
  );
}

function SummaryStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="flex-1 text-center">
      <div
        className="text-[22px] font-bold text-nc-gray-900"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
      <div className="text-nc-xs text-nc-gray-500 mt-0.5">{label}</div>
    </div>
  );
}