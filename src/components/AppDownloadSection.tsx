import React from 'react';
import { Apple, Play, QrCode, ShieldCheck, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import contentData from '../data/contentData.json';

export const AppDownloadSection: React.FC = () => {
  const { appDownload } = contentData;

  const iosQr = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    appDownload.ios.url
  )}`;
  const androidQr = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    appDownload.android.url
  )}`;

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#003B70] via-[#005baa] to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-blue-100 border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trải Nghiệm Ngân Hàng Số Toàn Năng</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
            {appDownload.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
            {appDownload.subtitle}
          </p>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-4">
              <Apple className="w-4 h-4" />
              <span>Dành cho iPhone / iPad</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              VietinBank iPay Mobile trên iOS
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Mở Camera iPhone để quét mã QR tải trực tiếp từ Apple App Store
            </p>

            <div className="relative p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner group">
              <img
                src={iosQr}
                alt="QR Code tải VietinBank iPay iOS"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl bg-white p-2"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 rounded-2xl transition-opacity">
                <span className="text-xs font-bold text-[#003B70] flex items-center gap-1">
                  <QrCode className="w-4 h-4" />
                  Quét bằng Camera điện thoại
                </span>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-100">
            <a
              href={appDownload.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-black hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <Apple className="w-5 h-5" />
              <span>{appDownload.ios.badgeText}</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </a>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-4">
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Dành cho máy Android</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              VietinBank iPay Mobile trên Android
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Samsung, Oppo, Xiaomi, vivo... quét mã để tải từ Google Play
            </p>

            <div className="relative p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner group">
              <img
                src={androidQr}
                alt="QR Code tải VietinBank iPay Android"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl bg-white p-2"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 rounded-2xl transition-opacity">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <QrCode className="w-4 h-4" />
                  Quét bằng Camera điện thoại
                </span>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-100">
            <a
              href={appDownload.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#003B70] hover:bg-[#005baa] text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{appDownload.android.badgeText}</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Đặc quyền khi cài đặt ứng dụng
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Vì sao khách hàng chọn sử dụng VietinBank iPay?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appDownload.highlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003B70] flex items-center justify-center font-bold text-sm mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Hoàn toàn miễn phí</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
