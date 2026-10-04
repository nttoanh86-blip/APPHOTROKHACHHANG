import React, { useState } from 'react';
import {
  KeyRound,
  CreditCard,
  ScanFace,
  FileSpreadsheet,
  CalendarDays,
  Youtube,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { FaqCategory } from '../types';
import { ImageWithFallback } from './common/ImageWithFallback';

interface FaqSectionProps {
  onBackToMainMenu: () => void;
  onEndConversation: () => void;
}

const topicIcons: Record<string, React.ReactNode> = {
  'forgot-password': <KeyRound className="w-6 h-6 text-amber-600" />,
  'close-card': <CreditCard className="w-6 h-6 text-red-600" />,
  'biometrics': <ScanFace className="w-6 h-6 text-blue-600" />,
  'e-tax': <FileSpreadsheet className="w-6 h-6 text-emerald-600" />,
  'booking': <CalendarDays className="w-6 h-6 text-indigo-600" />,
};

export const FaqSection: React.FC<FaqSectionProps> = ({ onBackToMainMenu, onEndConversation }) => {
  const { faq, bankInfo } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'satisfied' | 'need_help'>('idle');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const selectedCategory = faq.categories.find((c) => c.id === selectedTopicId);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleBackToTopicList = () => {
    setSelectedTopicId(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleFeedbackSatisfied = () => {
    setFeedbackStatus('satisfied');
  };

  const handleFeedbackNeedHelp = () => {
    setFeedbackStatus('need_help');
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* If no topic is selected, display list of cards with the header question */}
      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-[#003B70] to-[#005baa] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-100 mb-3 border border-white/20">
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Trợ lý số tại quầy VietinBank</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                {faq.question}
              </h1>
              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Vui lòng chạm chọn chuyên mục bạn cần hỗ trợ để xem ngay hướng dẫn chi tiết từng bước bằng hình ảnh và video trực quan.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {faq.categories.map((category, index) => {
              return (
                <div
                  key={category.id}
                  onClick={() => handleSelectTopic(category.id)}
                  className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                        {topicIcons[category.id] || <HelpCircle className="w-6 h-6 text-blue-600" />}
                      </div>
                      <span className="text-[11px] font-semibold text-[#003B70] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                        {category.badge}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#005baa] transition-colors mb-2 leading-snug">
                      {category.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {category.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#005baa] group-hover:text-blue-700">
                    <span>{category.steps.length} bước thực hiện</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Xem hướng dẫn <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom actions on question page */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-200">
            <button
              onClick={onBackToMainMenu}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Quay lại menu chính</span>
            </button>
            <button
              onClick={onEndConversation}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#ED1C24] hover:bg-red-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Kết thúc cuộc trò chuyện</span>
            </button>
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step View for selected topic */
        <div className="space-y-6">
          {/* Header navigation within topic */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToTopicList}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors shrink-0"
                title="Quay lại danh sách câu hỏi"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Hướng dẫn chi tiết
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {selectedCategory.title}
                </h1>
              </div>
            </div>

            {selectedCategory.videoUrl && (
              <a
                href={selectedCategory.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-[#ED1C24] font-semibold text-xs sm:text-sm rounded-xl border border-red-200 transition-colors shrink-0"
              >
                <Youtube className="w-4 h-4 fill-[#ED1C24] text-white" />
                <span>Xem Video YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
          </div>

          {/* Stepper bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-1">
              {selectedCategory.steps.map((step, idx) => (
                <button
                  key={step.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentStepIndex === idx
                      ? 'bg-[#003B70] text-white shadow-sm ring-2 ring-blue-300'
                      : idx < currentStepIndex
                      ? 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStepIndex === idx ? 'bg-white text-[#003B70] font-bold' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {step.step}
                  </span>
                  <span>Bước {step.step}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main step content */}
          {selectedCategory.steps[currentStepIndex] && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: Image preview with zoom modal support */}
              <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] relative group">
                <ImageWithFallback
                  src={selectedCategory.steps[currentStepIndex].imageUrl}
                  alt={selectedCategory.steps[currentStepIndex].title}
                  fallbackTitle={selectedCategory.steps[currentStepIndex].title}
                  className="max-h-[460px] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200 group-hover:scale-[1.01]"
                  containerClassName="rounded-xl overflow-hidden bg-transparent"
                />

                <button
                  onClick={() => setPreviewImage(selectedCategory.steps[currentStepIndex].imageUrl)}
                  className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-xl backdrop-blur-xs text-xs font-medium flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
                  title="Xem phóng to ảnh"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Phóng to</span>
                </button>
              </div>

              {/* Right Column: Step details & step controls */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                      Bước {currentStepIndex + 1} / {selectedCategory.steps.length}
                    </span>
                    <span className="text-xs text-slate-400">VietinBank iPay Mobile</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                    {selectedCategory.steps[currentStepIndex].title}
                  </h3>

                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    {selectedCategory.steps[currentStepIndex].description}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  {/* Step Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>

                    <button
                      onClick={() =>
                        setCurrentStepIndex((prev) =>
                          Math.min(selectedCategory.steps.length - 1, prev + 1)
                        )
                      }
                      disabled={currentStepIndex === selectedCategory.steps.length - 1}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#003B70] hover:bg-[#005baa] font-semibold text-xs sm:text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <span>Bước tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {selectedCategory.videoUrl && (
                    <a
                      href={selectedCategory.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>Xem toàn bộ Video trên YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Feedback section: "Hỏi khách hàng thực hiện ổn hay chưa?" */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
            {feedbackStatus === 'idle' && (
              <div className="text-center max-w-xl mx-auto space-y-4">
                <h4 className="text-lg sm:text-xl font-bold">
                  Anh/chị đã thực hiện ổn các bước trên hay chưa?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Đánh giá của Quý khách giúp nhân viên quầy phục vụ chu đáo và kịp thời nhất.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={handleFeedbackSatisfied}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Đã ổn, tôi làm được rồi</span>
                  </button>

                  <button
                    onClick={handleFeedbackNeedHelp}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>Chưa ổn, tôi cần hỗ trợ thêm</span>
                  </button>
                </div>
              </div>
            )}

            {/* When user clicks "Đã ổn" */}
            {feedbackStatus === 'satisfied' && (
              <div className="text-center max-w-xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-emerald-400">
                  Tuyệt vời! Cảm ơn Quý khách
                </h4>
                <p className="text-sm text-slate-300">
                  Quý khách có thể quay lại menu chính để trải nghiệm thêm các tiện ích khác hoặc kết thúc lượt trao đổi.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={onBackToMainMenu}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-sm rounded-xl text-white shadow-sm"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={onEndConversation}
                    className="px-5 py-2.5 bg-[#ED1C24] hover:bg-red-700 font-semibold text-sm rounded-xl text-white shadow-sm"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* When user clicks "Chưa ổn" */}
            {feedbackStatus === 'need_help' && (
              <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 bg-red-950/70 border border-red-500/40 rounded-xl text-slate-100 text-sm sm:text-base leading-relaxed">
                  <p className="font-semibold text-amber-300 mb-2">
                    {bankInfo.feedbackResponseUnresolved}
                  </p>
                  <p className="text-xs text-slate-300">
                    Cán bộ giao dịch viên tại quầy luôn sẵn sàng trực tiếp thao tác mẫu giúp Quý khách.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={`tel:${bankInfo.counselorSupport.phone}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-sm rounded-xl text-white shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Gọi {bankInfo.counselorSupport.name}: {bankInfo.counselorSupport.phone}</span>
                  </a>

                  <button
                    onClick={onBackToMainMenu}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 font-semibold text-sm rounded-xl text-white border border-slate-700"
                  >
                    Quay lại menu chính
                  </button>

                  <button
                    onClick={onEndConversation}
                    className="px-4 py-2.5 bg-[#ED1C24] hover:bg-red-700 font-semibold text-sm rounded-xl text-white"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* Default bottom navigation row if still idle */}
            {feedbackStatus === 'idle' && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800 text-xs text-slate-400">
                <button
                  onClick={handleBackToTopicList}
                  className="hover:text-white flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Chọn chủ đề thắc mắc khác</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onBackToMainMenu}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={onEndConversation}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={previewImage}
              alt="Ảnh phóng to"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-semibold tracking-wide backdrop-blur-md"
            >
              Đóng xem ảnh (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
