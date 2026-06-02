import type { NutritionInfo } from '../../shared/types';

interface NutritionBreakdownProps {
  nutrition: NutritionInfo;
}

export function NutritionBreakdown({ nutrition }: NutritionBreakdownProps) {
  const items: { label: string; value: string; good?: boolean; bad?: boolean }[] = [
    { label: 'Calories', value: `${nutrition.calories} per serving` },
    { label: 'Sugar', value: `${nutrition.sugar}g`, bad: nutrition.sugar > 10 },
    { label: 'Fiber', value: `${nutrition.fiber}g`, good: nutrition.fiber >= 3 },
    { label: 'Protein', value: `${nutrition.protein}g`, good: nutrition.protein >= 10 },
    { label: 'Sodium', value: `${nutrition.sodium}mg`, bad: nutrition.sodium > 200 },
    ...(nutrition.saturatedFat !== undefined
      ? [{ label: 'Sat. Fat', value: `${nutrition.saturatedFat}g`, bad: (nutrition.saturatedFat || 0) > 5 }]
      : []),
  ];

  return (
    <div className="px-4 py-3 border-b border-nc-gray-200">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex justify-between py-1.5 text-nc-xs"
        >
          <span className="text-nc-gray-500">{item.label}</span>
          <span
            className={`font-semibold ${
              item.good ? 'text-nc-green-500' : item.bad ? 'text-[#E04848]' : 'text-nc-gray-700'
            }`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}