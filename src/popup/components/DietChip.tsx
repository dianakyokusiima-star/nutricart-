import type { DietPreference } from '../../shared/types';

interface DietChipProps {
  label: string;
  value: DietPreference;
  selected: boolean;
  onClick: (value: DietPreference) => void;
}

export function DietChip({ label, value, selected, onClick }: DietChipProps) {
  return (
    <button
      className={`px-3.5 py-1.5 rounded-nc-full border text-nc-xs font-medium cursor-pointer transition-all duration-150 font-inter ${
        selected
          ? 'bg-nc-green-50 border-nc-green-500 text-nc-green-700'
          : 'bg-white border-nc-gray-200 text-nc-gray-500 hover:border-nc-gray-300'
      }`}
      onClick={() => onClick(value)}
      aria-pressed={selected}
      aria-label={`${label} diet preference${selected ? ' (active)' : ''}`}
    >
      {label}
    </button>
  );
}