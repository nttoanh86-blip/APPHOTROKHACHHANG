import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  TrendingUp,
  Coins,
  Video,
  ExternalLink,
  AlertTriangle,
  Info,
  Calendar,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { formatVND, formatNumberDots, parseNumberFromDots } from '../utils/formatters';

export const SavingsCalculator: React.FC = () => {
  const { savings } = contentData;

  // Form states
  const [depositAmountStr, setDepositAmountStr] = useState<string>(
    formatNumberDots(savings.defaultAmount)
  );
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(12);
  const [customInterestRate, setCustomInterestRate] = useState<string>('5.2');
  const [errorAmount, setErrorAmount] = useState<string | null>(null);
  const [errorTerm, setErrorTerm] = useState<string | null>(null);
  const [errorRate, setErrorRate] = useState<string | null>(null);

  // Parse numerical amount
  const depositAmount = useMemo(() => {
    return parseNumberFromDots(depositAmountStr);
  }, [depositAmountStr]);

  const interestRate = useMemo(() => {
    const parsed = parseFloat(customInterestRate);
    return isNaN(parsed) ? 0 : parsed;
  }, [customInterestRate]);

  // Handle Amount change with strict validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleanDigits = raw.replace(/[^\d]/g, '');
    if (!cleanDigits) {
      setDepositAmountStr('');
      setErrorAmount('Vui lòng nhập số tiền gửi hợp lệ.');
      return;
    }

    const num = parseInt(cleanDigits, 10);
    setDepositAmountStr(formatNumberDots(num));

    if (num <= 0) {
      setErrorAmount('Vui lòng nhập số tiền gửi hợp lệ.');
    } else if (num < savings.minAmount) {
      setErrorAmount(`Số tiền gửi tối thiểu là ${formatVND(savings.minAmount)}.`);
    } else {
      setErrorAmount(null);
    }
  };

  const handleSelectPreset = (val: number) => {
    setDepositAmountStr(formatNumberDots(val));
    setErrorAmount(null);
  };

  // Handle Term change & sync rate
  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const months = parseInt(e.target.value, 10);
    setSelectedTermMonths(months);

    const termItem = savings.terms.find((t) => t.months === months);
    if (termItem) {
      setCustomInterestRate(termItem.rate.toFixed(1));
      setErrorTerm(null);
    } else {
      setErrorTerm('Vui lòng chọn kỳ hạn gửi.');
    }
  };

  // Handle Interest Rate change
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInterestRate(val);
    const parsed = parseFloat(val);
    if (val === '' || isNaN(parsed) || parsed < 0) {
      setErrorRate('Vui lòng nhập lãi suất hợp lệ.');
    } else if (parsed > 15) {
      setErrorRate('Lãi suất không được vượt quá 15%/năm.');
    } else {
      setErrorRate(null);
    }
  };

  // Calculate Interest (Tiền gửi thông thường trả lãi sau)
  // Formula: Lãi = Số tiền gửi * (Lãi suất / 100) * (Số tháng / 12)
  const calculationResult = useMemo(() => {
    if (depositAmount <= 0 || !selectedTermMonths || interestRate <= 0) {
      return {
        interest: 0,
        total: depositAmount,
        isValid: false,
      };
    }

    const calculatedInterest = Math.round(
      depositAmount * (interestRate / 100) * (selectedTermMonths / 12)
    );
    const totalAmount = depositAmount + calculatedInterest;

    return {
      interest: calculatedInterest,
      total: totalAmount,
      isValid: true,
    };
  }, [depositAmount, selectedTermMonths, interestRate]);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#005baa] to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-100 border border-white/20 mb-3">
            <PiggyBank className="w-3.5 h-3.5 text-amber-300" />
            <span>Tiết Kiệm Thông Thường Trả Lãi Sau</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            {savings.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            {savings.subtitle}. Nhập số tiền gửi và lựa chọn kỳ hạn để tra cứu ngay số tiền lãi dự tính chính xác nhất.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#003B70]" />
            <span>Thông tin tiền gửi tiết kiệm</span>
          </h2>

          {/* Input 1: Số tiền gửi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Số tiền gửi (VND) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={depositAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (ví dụ: 100.000.000)"
                className={`w-full px-4 py-3.5 text-base sm:text-lg font-bold rounded-2xl border transition-colors focus:outline-hidden ${
                  errorAmount
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                    : 'border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {errorAmount && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errorAmount}</span>
              </p>
            )}

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {savings.presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleSelectPreset(preset.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    depositAmount === preset.value
                      ? 'bg-[#003B70] text-white border-[#003B70] shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kỳ hạn gửi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedTermMonths}
                onChange={handleTermChange}
                className="w-full px-4 py-3.5 text-sm sm:text-base font-medium rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white transition-colors appearance-none cursor-pointer"
              >
                {savings.terms.map((term) => (
                  <option key={term.months} value={term.months}>
                    {term.label} (Lãi suất chuẩn: {term.rate}%/năm)
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            {errorTerm && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errorTerm}</span>
              </p>
            )}
          </div>

          {/* Input 3: Lãi suất */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Có thể chỉnh theo thỏa thuận</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="15"
                value={customInterestRate}
                onChange={handleRateChange}
                className={`w-full px-4 py-3.5 text-base font-bold rounded-2xl border transition-colors focus:outline-hidden ${
                  errorRate
                    ? 'border-red-400 bg-red-50/50'
                    : 'border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
            {errorRate && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errorRate}</span>
              </p>
            )}
          </div>

          {/* Video Guide Link directly from PDF */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Video hướng dẫn gửi tiết kiệm VietinBank
                </h4>
                <p className="text-[11px] text-slate-600">
                  Mẹo gửi tiết kiệm online cộng lãi suất cao
                </p>
              </div>
            </div>
            <a
              href={savings.tiktokVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-[#003B70] text-xs font-bold rounded-xl border border-blue-200 transition-colors shrink-0 shadow-xs"
            >
              <span>Xem Video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Card: Calculation Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Kết quả ước tính
              </span>
              <span className="text-xs text-slate-400">Lãi trả cuối kỳ</span>
            </div>

            {/* Interest amount highlight */}
            <div>
              <span className="text-xs text-slate-400 block mb-1">
                Tiền lãi dự tính nhận được:
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                {formatVND(calculationResult.interest)}
              </div>
            </div>

            {/* Breakdown summary */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs sm:text-sm">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Số tiền gốc ban đầu:</span>
                <span className="font-mono font-bold text-white">
                  {formatVND(depositAmount)}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Kỳ hạn gửi:</span>
                <span className="font-bold text-white">
                  {selectedTermMonths} tháng
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Lãi suất áp dụng:</span>
                <span className="font-bold text-amber-300">
                  {interestRate}% / năm
                </span>
              </div>

              <div className="flex justify-between py-2 border-t border-slate-800 text-sm sm:text-base font-bold">
                <span className="text-white">Tổng tiền khi đáo hạn:</span>
                <span className="font-mono text-amber-400">
                  {formatVND(calculationResult.total)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Công thức: Tiền lãi = Số tiền gửi × (Lãi suất/100) × (Số tháng/12). Kết quả mang tính chất tham khảo, số liệu chính xác căn cứ theo hợp đồng tiền gửi tại quầy.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
