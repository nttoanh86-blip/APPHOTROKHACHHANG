import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation as NavigationIcon,
  ExternalLink,
  Search,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ImageWithFallback } from './common/ImageWithFallback';
import { BranchItem } from '../types';

export const BranchNetworkSection: React.FC = () => {
  const { branches, bankInfo } = contentData;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<BranchItem>(branches.list[0]);

  const filteredList = branches.list.filter(
    (b) =>
      b.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#005baa] to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-100 border border-white/20 mb-3">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Mạng Lưới Phục Vụ Địa Bàn Tây Tiền Giang</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            {branches.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            {branches.subtitle}. Hệ thống Hội sở và Phòng Giao Dịch hiện đại, tiện nghi, sẵn sàng phục vụ Quý khách hàng.
          </p>
        </div>
      </div>

      {/* Transaction Working Hours Ribbon as specifically outlined in PDF */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Thời gian giao dịch tại quầy:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              {branches.officeHours.weekdays}
            </p>
            <p className="text-xs text-red-600 font-semibold">
              {branches.officeHours.weekend}
            </p>
          </div>
        </div>

        <a
          href={`tel:${bankInfo.hotline.replace(/\s+/g, '')}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Hotline tổng đài: {bankInfo.hotline}</span>
        </a>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên phòng giao dịch, địa chỉ..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm focus:border-[#003B70] focus:outline-hidden transition-colors shadow-xs"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((branch) => {
          return (
            <div
              key={branch.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Branch Photo */}
                <div className="relative bg-slate-950 h-52 sm:h-56 overflow-hidden group">
                  <ImageWithFallback
                    src={branch.imageUrl}
                    alt={branch.office}
                    fallbackTitle={branch.office}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    containerClassName="w-full h-full"
                  />
                  {branch.isHeadquarter && (
                    <span className="absolute top-3 left-3 bg-[#003B70] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      Hội sở Chi nhánh
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    #{branch.stt}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {branch.office}
                    </h3>
                    <span className="text-xs font-semibold text-blue-700">
                      {branch.branch}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <MapPin className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 space-y-2 border-t border-slate-100 mt-2">
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#003B70] hover:bg-[#005baa] text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  <NavigationIcon className="w-4 h-4" />
                  <span>Chỉ đường trên Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ED1C24]" />
                  <span>Gọi PGD: {branch.phone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
