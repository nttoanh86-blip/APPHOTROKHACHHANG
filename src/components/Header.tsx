import React from 'react';
import { Phone, Clock, MessageSquareX, RotateCcw } from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeaderProps {
  onEndConversation: () => void;
  onResetToHome: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onEndConversation, onResetToHome, activeTab }) => {
  const { bankInfo } = contentData;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Zone 1: Logo & Branch Name */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onResetToHome}>
            <img
              src={bankInfo.logoUrl}
              alt="VietinBank"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {bankInfo.branchName}
              </span>
            </div>
          </div>

          {/* Zone 2: Quick Info / Working time badge */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2 bg-blue-50/80 text-blue-900 px-3 py-1.5 rounded-lg border border-blue-100">
              <Clock className="w-3.5 h-3.5 text-[#003B70]" />
              <span className="font-medium">Giờ GD: 07:30 - 11:30 | 13:30 - 16:30 (T2-T6)</span>
            </div>
            
            <a
              href={`tel:${bankInfo.hotline.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 hover:text-[#003B70] font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#ED1C24]" />
              <span>Hotline: <strong className="text-slate-800">{bankInfo.hotline}</strong></span>
            </a>
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeTab !== 'faq' && (
              <button
                onClick={onResetToHome}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors active:scale-95"
                title="Quay về menu chính"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Menu chính</span>
              </button>
            )}

            <button
              onClick={onEndConversation}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#ED1C24] hover:bg-red-700 rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
            >
              <MessageSquareX className="w-4 h-4" />
              <span>Kết thúc lượt</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
