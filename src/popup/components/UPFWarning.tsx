import { AlertTriangle } from 'lucide-react';

interface UPFWarningProps {
  novaGroup?: number;
}

export function UPFWarning({ novaGroup }: UPFWarningProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-nc-up-bg border-b border-nc-up-border">
      <AlertTriangle size={16} className="text-nc-up-icon shrink-0" />
      <span className="flex-1 text-nc-xs font-semibold text-nc-up-text">
        Ultra-Processed Food Detected
      </span>
      {novaGroup && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-nc-full bg-nc-up-icon text-white">
          NOVA {novaGroup}
        </span>
      )}
    </div>
  );
}