import type { AlternativeProduct } from '../../shared/types';
import { RatingBadge } from './RatingBadge';
import { Leaf, ArrowRight } from 'lucide-react';

interface AlternativesSectionProps {
  alternatives: AlternativeProduct[];
}

export function AlternativesSection({ alternatives }: AlternativesSectionProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Leaf size={14} className="text-nc-green-500" />
        <span className="text-nc-xs font-semibold text-nc-gray-700">
          Healthier Alternatives
        </span>
      </div>
      {alternatives.map((alt, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2.5 p-2 rounded-nc-md cursor-pointer transition-colors duration-150 hover:bg-nc-gray-50"
          tabIndex={0}
          role="button"
          aria-label={`Alternative: ${alt.name} — rating ${alt.rating.grade}`}
        >
          <div className="w-8 h-8 rounded-nc-sm bg-nc-gray-100 shrink-0 flex items-center justify-center text-base">
            {alt.emoji || '🥗'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-nc-xs font-medium text-nc-gray-900 truncate">
              {alt.name}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-nc-gray-500">
              <span className="truncate">{alt.reason}</span>
            </div>
          </div>
          <RatingBadge grade={alt.rating.grade} size="sm" />
        </div>
      ))}
    </div>
  );
}