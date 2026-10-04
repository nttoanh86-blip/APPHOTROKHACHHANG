import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  faq: <HelpCircle className="w-5 h-5" />,
  'download-app': <Smartphone className="w-5 h-5" />,
  games: <Gamepad2 className="w-5 h-5" />,
  savings: <PiggyBank className="w-5 h-5" />,
  loans: <Calculator className="w-5 h-5" />,
  products: <Sparkles className="w-5 h-5" />,
  branches: <MapPin className="w-5 h-5" />,
};

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const { menuTabs } = contentData;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none" aria-label="Main Features">
          {menuTabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-[#005baa] to-[#003B70] text-white shadow-md ring-1 ring-blue-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-blue-300'}`}>
                  {iconMap[tab.id]}
                </span>
                
                <span className="font-semibold">{tab.label}</span>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
