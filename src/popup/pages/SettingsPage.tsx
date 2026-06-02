import { useState } from 'react';
import type { UserPreferences, DietPreference } from '../../shared/types';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { DietChip } from '../components/DietChip';
import { PremiumCard } from '../components/PremiumCard';

interface SettingsPageProps {
  preferences: UserPreferences;
  onPreferencesChange: (prefs: UserPreferences) => void;
}

const mainDietOptions: { label: string; value: DietPreference }[] = [
  { label: 'Balanced', value: 'balanced' },
  { label: 'Low-Sugar', value: 'low-sugar' },
  { label: 'High-Protein', value: 'high-protein' },
  { label: 'Low-Carb', value: 'low-carb' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Keto', value: 'keto' },
  { label: 'Mediterranean', value: 'mediterranean' },
];

const allergyOptions: { label: string; value: DietPreference }[] = [
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
  { label: 'Nut-Free', value: 'nut-free' },
];

export function SettingsPage({ preferences, onPreferencesChange }: SettingsPageProps) {
  const toggleDiet = (value: DietPreference) => {
    const current = preferences.dietPreferences;
    const updated = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    onPreferencesChange({ ...preferences, dietPreferences: updated });
  };

  return (
    <div>
      {/* Diet Preferences */}
      <div className="mb-5">
        <SectionTitle title="Diet Preferences" />
        <div className="flex gap-1.5 flex-wrap">
          {mainDietOptions.map((opt) => (
            <DietChip
              key={opt.value}
              label={opt.label}
              value={opt.value}
              selected={preferences.dietPreferences.includes(opt.value)}
              onClick={toggleDiet}
            />
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap mt-3">
          {allergyOptions.map((opt) => (
            <DietChip
              key={opt.value}
              label={opt.label}
              value={opt.value}
              selected={preferences.dietPreferences.includes(opt.value)}
              onClick={toggleDiet}
            />
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="mb-5">
        <SectionTitle title="Display Options" />
        <ToggleSwitch
          id="show-ratings"
          label="Show ratings on product pages"
          description="Display overlay card automatically when viewing products"
          checked={preferences.showRatingsOnPages}
          onChange={(v) => onPreferencesChange({ ...preferences, showRatingsOnPages: v })}
        />
        <ToggleSwitch
          id="flag-upf"
          label="Flag ultra-processed foods"
          description="Highlight items classified as NOVA 4"
          checked={preferences.flagUltraProcessed}
          onChange={(v) => onPreferencesChange({ ...preferences, flagUltraProcessed: v })}
        />
        <ToggleSwitch
          id="suggest-alts"
          label="Suggest alternatives automatically"
          description="Show healthier swaps for low-rated items"
          checked={preferences.suggestAlternatives}
          onChange={(v) => onPreferencesChange({ ...preferences, suggestAlternatives: v })}
        />
        <ToggleSwitch
          id="compact-view"
          label="Compact view"
          description="Show smaller overlay cards with less detail"
          checked={preferences.compactView}
          onChange={(v) => onPreferencesChange({ ...preferences, compactView: v })}
        />
      </div>

      {/* Notifications */}
      <div className="mb-5">
        <SectionTitle title="Notifications" />
        <ToggleSwitch
          id="alert-poor"
          label="Alert on poor-rated items"
          description="Show a badge when a D or F item is detected"
          checked={preferences.alertOnPoorItems}
          onChange={(v) => onPreferencesChange({ ...preferences, alertOnPoorItems: v })}
        />
      </div>

      {/* Premium */}
      {!preferences.isPremium && (
        <PremiumCard onUpgrade={() => onPreferencesChange({ ...preferences, isPremium: true })} />
      )}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="text-[11px] font-semibold text-nc-gray-500 uppercase tracking-[0.05em] mb-2 px-1">
      {title}
    </div>
  );
}