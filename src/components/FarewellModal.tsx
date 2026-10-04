import React from 'react';
import { Heart, RotateCcw, Check, Sparkles, PhoneCall } from 'lucide-react';
import contentData from '../data/contentData.json';

interface FarewellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const FarewellModal: React.FC<FarewellModalProps> = ({ isOpen, onClose, onRestart }) => {
  if (!isOpen) return null;

  const { bankInfo } = contentData;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-slate-200 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#003B70] via-[#ED1C24] to-[#005baa]" />

        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center mx-auto mb-5 ring-8 ring-red-50/50 animate-pulse">
          <Heart className="w-9 h-9 fill-[#ED1C24]" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 leading-snug">
          VietinBank Trân Trọng Cảm Ơn
        </h3>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
          <p className="text-sm sm:text-base font-semibold text-[#003B70] leading-relaxed">
            "{bankInfo.farewellMessage}"
          </p>
        </div>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Kính mời Quý khách quan sát màn hình gọi số tại quầy hoặc lắng nghe thông báo của Giao dịch viên. Chúc Quý khách có một ngày giao dịch thành công và tràn đầy niềm vui!
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onRestart();
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#003B70] hover:bg-[#005baa] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bắt đầu lượt phục vụ mới</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Đóng thông báo
          </button>
        </div>
      </div>
    </div>
  );
};
