interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  label: string;
  description?: string;
}

export function ToggleSwitch({ checked, onChange, id, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-nc-gray-50 rounded-nc-md mb-1">
      <div>
        <label
          htmlFor={id}
          className="text-nc-sm font-medium text-nc-gray-700 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <div className="text-[11px] text-nc-gray-500 mt-0.5">{description}</div>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        className={`w-10 h-[22px] rounded-[11px] relative cursor-pointer transition-colors duration-200 shrink-0 border-none ${
          checked ? 'bg-nc-green-500' : 'bg-nc-gray-300'
        }`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.15)] ${
            checked ? 'translate-x-[18px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}