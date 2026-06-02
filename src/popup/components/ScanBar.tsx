import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface ScanBarProps {
  onScan?: (query: string) => void;
}

export function ScanBar({ onScan }: ScanBarProps) {
  const [query, setQuery] = useState('');

  const handleScan = () => {
    if (query.trim() && onScan) {
      onScan(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan();
  };

  return (
    <div className="px-4 py-3 border-b border-nc-gray-200 bg-nc-gray-50">
      <div className="scan-input-wrapper">
        <Search size={14} className="text-nc-gray-500 shrink-0" />
        <input
          className="flex-1 border-none outline-none font-inter text-nc-base text-nc-gray-700 placeholder:text-nc-gray-300 bg-transparent"
          type="text"
          placeholder="Search a product or scan this page…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
        />
        <button
          className="bg-nc-green-500 text-white border-none rounded-nc-md px-3.5 py-1.5 font-inter text-nc-xs font-semibold cursor-pointer transition-colors duration-150 hover:bg-nc-green-600 flex items-center gap-1"
          onClick={handleScan}
          aria-label="Scan"
        >
          Scan
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}