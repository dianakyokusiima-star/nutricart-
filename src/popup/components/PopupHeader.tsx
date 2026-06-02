import { Settings, History } from 'lucide-react';

interface PopupHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onSettingsClick?: () => void;
}

export function PopupHeader({ showBack, onBack, onSettingsClick }: PopupHeaderProps) {
  return (
    <header className="popup-header-gradient px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-white rounded-nc-lg flex items-center justify-center font-extrabold text-[14px] text-nc-green-500 select-none">
          N
        </div>
        <span className="text-white font-bold text-nc-lg tracking-nc-heading">
          {showBack ? 'Settings' : 'NutriCart'}
        </span>
      </div>
      <div className="flex gap-1.5">
        {showBack && onBack && (
          <button
            className="header-icon-btn"
            onClick={onBack}
            aria-label="Back to dashboard"
            title="Back"
          >
            ←
          </button>
        )}
        {!showBack && (
          <>
            <button
              className="header-icon-btn"
              onClick={onSettingsClick}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              className="header-icon-btn"
              aria-label="History"
              title="History"
            >
              <History size={16} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}