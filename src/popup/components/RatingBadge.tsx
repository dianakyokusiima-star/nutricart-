import type { RatingGrade } from '../../shared/types';
import { getRatingColor, getRatingLabel } from '../../shared/ratings';

interface RatingBadgeProps {
  grade: RatingGrade;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RatingBadge({ grade, size = 'md', showLabel = false }: RatingBadgeProps) {
  const color = getRatingColor(grade);
  const label = getRatingLabel(grade);

  const sizeMap = {
    sm: { width: 26, height: 26, fontSize: 11 },
    md: { width: 32, height: 32, fontSize: 13 },
    lg: { width: 56, height: 56, fontSize: 22 },
  };

  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-full flex items-center justify-center font-extrabold text-white shrink-0"
        style={{
          width: s.width,
          height: s.height,
          fontSize: s.fontSize,
          backgroundColor: color,
        }}
        aria-label={`Nutrition rating: ${grade} — ${label}`}
        role="img"
      >
        {grade}
      </div>
      {showLabel && (
        <span className="text-nc-xs text-nc-gray-500">{label}</span>
      )}
    </div>
  );
}

interface RatingHeroProps {
  grade: RatingGrade;
  score: number;
  label: string;
  sublabel?: string;
}

export function RatingHero({ grade, score, label, sublabel }: RatingHeroProps) {
  const color = getRatingColor(grade);

  return (
    <div className="flex items-center gap-4 p-4 border-b border-nc-gray-200">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-[22px] text-white shrink-0"
        style={{ backgroundColor: color }}
        aria-label={`Nutrition rating: ${grade}`}
      >
        {grade}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-nc-md font-semibold text-nc-gray-900">{label}</div>
        {sublabel && (
          <div className="text-nc-xs text-nc-gray-500 mt-0.5">{sublabel}</div>
        )}
        <div
          className="h-1.5 rounded-sm bg-nc-gray-200 mt-1.5 overflow-hidden"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Nutrition score: ${score} out of 100`}
        >
          <div
            className="h-full rounded-sm transition-all duration-300"
            style={{
              width: `${score}%`,
              background: 'linear-gradient(90deg, #E04848 0%, #F5A623 50%, #2D9F6E 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}