import { Sparkles, Target, BarChart3, Bot, Star, Apple, TrendingUp } from 'lucide-react';
import type { ScannedProduct } from '../../shared/types';
import { PremiumCard } from '../components/PremiumCard';

interface GoalsPageProps {
  products: ScannedProduct[];
  isPremium: boolean;
  onUpgrade: () => void;
}

export function GoalsPage({ products, isPremium, onUpgrade }: GoalsPageProps) {
  // Calculate stats for the goals view
  const totalSugar = products.reduce((sum, p) => sum + p.nutrition.sugar, 0);
  const totalFiber = products.reduce((sum, p) => sum + p.nutrition.fiber, 0);
  const goodItems = products.filter((p) => p.rating.grade === 'A' || p.rating.grade === 'B').length;
  const streakDays = 3; // would come from storage

  return (
    <div>
      {/* Weekly Score */}
      <div className="bg-white border border-nc-gray-200 rounded-nc-lg p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-nc-sm font-semibold text-nc-gray-700">This Week's Nutrition Score</h3>
          {isPremium && <Star size={14} className="text-nc-rating-average fill-[#F5A623]" />}
        </div>

        {/* Mini chart bars */}
        <div className="flex items-end gap-1.5 h-20 mb-2">
          {[
            { day: 'M', value: 65 },
            { day: 'T', value: 72 },
            { day: 'W', value: 58 },
            { day: 'T', value: 80 },
            { day: 'F', value: 75 },
            { day: 'S', value: 68 },
            { day: 'S', value: 71 },
          ].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm bg-nc-green-500/60 transition-all"
                style={{ height: `${d.value}%` }}
              />
              <span className="text-[10px] text-nc-gray-500">{d.day}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-nc-xs text-nc-gray-500">
          <span>Current: <strong className="text-nc-gray-700">B-</strong></span>
          <span>Goal: <strong className="text-nc-green-500">B+</strong></span>
        </div>
      </div>

      {/* Daily Sugar Target */}
      <div className="bg-white border border-nc-gray-200 rounded-nc-lg p-4 mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Apple size={14} className="text-nc-rating-average" />
          <span className="text-nc-sm font-semibold text-nc-gray-700">Daily Sugar Target</span>
        </div>
        <div className="h-2 rounded-sm bg-nc-gray-200 overflow-hidden">
          <div
            className="h-full rounded-sm bg-gradient-to-r from-nc-rating-excellent via-nc-rating-average to-nc-rating-bad transition-all"
            style={{ width: `${Math.min((totalSugar / 36) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-nc-xs mt-1">
          <span className="text-nc-gray-700 font-medium">{totalSugar}g</span>
          <span className="text-nc-gray-500">/ 36g goal</span>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-nc-gray-200 rounded-nc-lg p-4 mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp size={14} className="text-nc-green-500" />
          <span className="text-nc-sm font-semibold text-nc-gray-700">Achievements</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-nc-green-50 rounded-nc-md p-2.5 text-center">
            <div className="text-lg">⭐</div>
            <div className="text-[11px] font-semibold text-nc-green-700">{streakDays}-Day Streak</div>
            <div className="text-[10px] text-nc-green-500">Keep it up!</div>
          </div>
          <div className="flex-1 bg-nc-green-50 rounded-nc-md p-2.5 text-center">
            <div className="text-lg">🍎</div>
            <div className="text-[11px] font-semibold text-nc-green-700">{goodItems} Smart Swaps</div>
            <div className="text-[10px] text-nc-green-500">Great choices!</div>
          </div>
        </div>
      </div>

      {isPremium ? (
        /* AI Suggestion (Premium) */
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-nc-lg p-4 text-white">
          <div className="flex items-center gap-1.5 mb-2">
            <Bot size={14} className="text-nc-green-500" />
            <span className="text-nc-sm font-semibold">AI Suggestion</span>
          </div>
          <p className="text-nc-xs text-white/70">
            "Try swapping soda for sparkling water to cut 22g of sugar tomorrow! 
            You're only {36 - totalSugar > 0 ? `${36 - totalSugar}g away` : 'over budget'} from your daily sugar goal."
          </p>
        </div>
      ) : (
        <PremiumCard onUpgrade={onUpgrade} />
      )}
    </div>
  );
}