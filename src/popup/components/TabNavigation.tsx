import { LayoutDashboard, ShoppingCart, Target, User } from 'lucide-react';

export type TabId = 'dashboard' | 'cart-scan' | 'goals' | 'profile';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'cart-scan', label: 'Cart Scan', icon: <ShoppingCart size={16} /> },
  { id: 'goals', label: 'Goals', icon: <Target size={16} /> },
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav
      className="flex border-b border-nc-gray-200 px-1 bg-white"
      role="tablist"
      aria-label="Main navigation"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`flex-1 py-2.5 px-1 text-center text-nc-xs font-medium cursor-pointer border-none bg-transparent font-inter relative transition-colors duration-150 ${
            activeTab === tab.id
              ? 'text-nc-green-500'
              : 'text-nc-gray-500 hover:text-nc-gray-700'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="block mb-0.5 flex items-center justify-center">
            {tab.icon}
          </span>
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-nc-green-500 rounded-t-sm" />
          )}
        </button>
      ))}
    </nav>
  );
}