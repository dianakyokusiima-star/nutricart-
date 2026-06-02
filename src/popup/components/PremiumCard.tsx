import { Sparkles, Target, BarChart3, Bot } from 'lucide-react';

interface PremiumCardProps {
  onUpgrade?: () => void;
}

export function PremiumCard({ onUpgrade }: PremiumCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-nc-lg p-4 text-center mt-4">
      <div className="text-nc-md font-bold text-white flex items-center justify-center gap-1.5">
        <Sparkles size={16} />
        Unlock NutriCart Premium
      </div>
      <div className="text-nc-xs text-white/70 mt-1">
        Personalized nutrition goals, AI meal planning, and detailed reports
      </div>
      <div className="flex gap-2 justify-center mt-2">
        <span className="text-[10px] text-white/60 flex items-center gap-1">
          <Target size={10} /> Smart Goals
        </span>
        <span className="text-[10px] text-white/60 flex items-center gap-1">
          <BarChart3 size={10} /> Weekly Reports
        </span>
        <span className="text-[10px] text-white/60 flex items-center gap-1">
          <Bot size={10} /> AI Meal Plan
        </span>
      </div>
      <button
        className="mt-3 bg-nc-green-500 text-white border-none rounded-nc-md px-6 py-2 font-semibold text-nc-sm cursor-pointer font-inter transition-colors duration-150 hover:bg-nc-green-600"
        onClick={onUpgrade}
      >
        Upgrade — $4.99/mo
      </button>
    </div>
  );
}