import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Gift,
  PhoneCall,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ImageWithFallback } from './common/ImageWithFallback';
import { ProductItem } from '../types';

export const FeaturedProductsSection: React.FC = () => {
  const { products, bankInfo } = contentData;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [interestedProduct, setInterestedProduct] = useState<ProductItem | null>(null);

  // Filtered list
  const filteredItems = products.items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.groupId === selectedCategory;
  });

  const currentCarouselItem = filteredItems[carouselIndex] || filteredItems[0];

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCarouselIndex(0);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#003B70] to-[#005baa] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-100 border border-white/20 mb-3">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Ưu Đãi Độc Quyền Tại Chi Nhánh</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            {products.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            {products.subtitle}
          </p>
        </div>
      </div>

      {/* Filter Chips & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Chips: Tất cả | Cá nhân | Hộ kinh doanh | Doanh nghiệp | Ưu đãi */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {products.categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#003B70] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto border border-slate-200">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'carousel'
                ? 'bg-white text-[#003B70] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dạng Carousel</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-[#003B70] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dạng Lưới</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Carousel View (Recommended by PDF) */}
      {viewMode === 'carousel' && currentCarouselItem && (
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-white rounded-3xl border border-red-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 relative">
            {/* Poster Image Area */}
            <div className="md:col-span-7 bg-slate-950 p-4 sm:p-8 flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
              <ImageWithFallback
                src={currentCarouselItem.imageUrl}
                alt={currentCarouselItem.title}
                fallbackTitle={currentCarouselItem.title}
                className="max-h-[460px] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
                containerClassName="rounded-2xl overflow-hidden bg-transparent"
              />
            </div>

            {/* Poster Details Area */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 bg-red-50 text-[#ED1C24] text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-100">
                    <Star className="w-3 h-3 fill-[#ED1C24]" />
                    Nổi bật
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {currentCarouselItem.categoryLabel}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-snug">
                  {currentCarouselItem.title}
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-[#005baa] mb-4">
                  {currentCarouselItem.highlight}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentCarouselItem.description}
                </p>
              </div>

              {/* Action Button: "Tôi quan tâm" */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <button
                  onClick={() => setInterestedProduct(currentCarouselItem)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.99]"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Tôi quan tâm</span>
                </button>

                {/* Carousel Navigation Arrows */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Trước</span>
                  </button>

                  <div className="flex gap-1.5">
                    {filteredItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          carouselIndex === idx ? 'w-6 bg-[#003B70]' : 'w-2 bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Tiếp</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-red-200/70 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="bg-slate-950 p-4 flex items-center justify-center min-h-[220px]">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.title}
                    fallbackTitle={item.title}
                    className="max-h-[220px] w-auto max-w-full object-contain rounded-xl"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 bg-red-50 text-[#ED1C24] text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                      <Star className="w-3 h-3 fill-[#ED1C24]" />
                      Nổi bật
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-[#005baa] mb-2">
                    {item.highlight}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setInterestedProduct(item)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Khi khách bấm "Tôi quan tâm" (as specified in PDF) */}
      {interestedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setInterestedProduct(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInterestedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#003B70] flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-50/50">
              <CheckCircle2 className="w-8 h-8 text-[#005baa]" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {interestedProduct.title}
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 text-left space-y-2">
              <p>
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <div className="pt-2 border-t border-slate-200/80 font-semibold text-slate-900">
                Hoặc liên hệ Chuyên viên tư vấn: <br />
                <span className="text-[#003B70] font-bold">Lê Hoàng Hiệp - 0907800525</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="tel:0907800525"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Chuyên viên tư vấn 0907800525</span>
              </a>

              <button
                onClick={() => setInterestedProduct(null)}
                className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
