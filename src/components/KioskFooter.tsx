import React from 'react';
import { Phone, Building2, Clock, UserCheck } from 'lucide-react';
import contentData from '../data/contentData.json';

export const KioskFooter: React.FC = () => {
  const { bankInfo } = contentData;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-slate-800 items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-white font-bold tracking-tight">
                {bankInfo.branchName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg mb-3">
              {bankInfo.fullName}. Kiosk tương tác khách hàng thông minh hỗ trợ giải đáp thắc mắc, nghiệp vụ số và tiện ích giao dịch trực tiếp tại quầy.
            </p>

            {/* Cán bộ hỗ trợ */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
              <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300">
                Cán bộ hỗ trợ: <strong className="text-white">Phạm Thị Thùy Dương</strong>
              </span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <a
                href="tel:0969694863"
                className="text-amber-400 hover:text-amber-300 font-mono font-bold inline-flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3 text-[#ED1C24]" />
                <span>SĐT: 0969694863</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">
              Số điện thoại liên hệ & Hotline
            </h4>
            <a
              href="tel:02733730887"
              className="inline-flex items-center gap-2 text-lg font-bold text-emerald-400 hover:text-emerald-300 font-mono tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-[#ED1C24]" />
              <span>02733730887</span>
            </a>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{bankInfo.workingHours.weekdays}</span>
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>© 2026 Ngân hàng TMCP Công Thương Việt Nam (VietinBank). All rights reserved.</span>
          <span>Hệ thống Kiosk tương tác số tại quầy</span>
        </div>
      </div>
    </footer>
  );
};


