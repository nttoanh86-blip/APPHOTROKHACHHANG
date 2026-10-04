import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  Table,
  X,
  FileSpreadsheet,
  Printer,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { formatVND, formatNumberDots, parseNumberFromDots, calculatePaymentDate } from '../utils/formatters';
import { LoanPaymentScheduleItem } from '../types';

export const LoanScheduleCalculator: React.FC = () => {
  const { loans } = contentData;

  // Form input states (strictly text inputs, not sliders as per specification)
  const [loanAmountStr, setLoanAmountStr] = useState<string>(
    formatNumberDots(loans.defaultLoanAmount)
  );
  const [loanMonths, setLoanMonths] = useState<number>(loans.defaultLoanMonths);
  const [annualRateStr, setAnnualRateStr] = useState<string>(
    String(loans.defaultInterestRate)
  );
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-01-10');
  const [paymentCycleId, setPaymentCycleId] = useState<string>('monthly');
  const [dueDay, setDueDay] = useState<number>(loans.defaultDueDay);
  const [roundToThousand, setRoundToThousand] = useState<boolean>(true);

  // Modal view detail
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Parse numeric values
  const loanAmount = useMemo(() => {
    return parseNumberFromDots(loanAmountStr);
  }, [loanAmountStr]);

  const annualRate = useMemo(() => {
    const parsed = parseFloat(annualRateStr);
    return isNaN(parsed) ? 0 : parsed;
  }, [annualRateStr]);

  // Selected cycle configuration
  const currentCycle = useMemo(() => {
    return loans.cycles.find((c) => c.id === paymentCycleId) || loans.cycles[0];
  }, [paymentCycleId, loans.cycles]);

  // Calculate full amortization schedule
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || loanMonths <= 0 || annualRate < 0) {
      return {
        items: [] as LoanPaymentScheduleItem[],
        totalPrincipal: 0,
        totalInterest: 0,
        grandTotal: 0,
        firstPeriodPayment: 0,
        lastPeriodPayment: 0,
        totalPeriods: 0,
      };
    }

    const totalPeriods = Math.ceil(loanMonths / currentCycle.monthsStep);
    const periodicRate = (annualRate / 100) / currentCycle.divisor;

    // Base principal per period
    let basePrincipalPerPeriod = loanAmount / totalPeriods;
    if (roundToThousand) {
      basePrincipalPerPeriod = Math.round(basePrincipalPerPeriod / 1000) * 1000;
    } else {
      basePrincipalPerPeriod = Math.round(basePrincipalPerPeriod);
    }

    const items: LoanPaymentScheduleItem[] = [];
    let currentRemaining = loanAmount;
    let accumulatedInterest = 0;
    let accumulatedPrincipal = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      // Payment date: month offset = period * monthsStep
      const dateStr = calculatePaymentDate(disbursementDate, period * currentCycle.monthsStep, dueDay);

      // Interest for this period = Remaining Principal at start * periodic rate
      let interest = currentRemaining * periodicRate;
      if (roundToThousand) {
        interest = Math.round(interest / 1000) * 1000;
      } else {
        interest = Math.round(interest);
      }

      // Principal for this period (last period absorbs rounding difference)
      let principal = basePrincipalPerPeriod;
      if (period === totalPeriods) {
        principal = currentRemaining; // ensure entire loan is paid off
      }

      const totalPayment = principal + interest;
      accumulatedPrincipal += principal;
      accumulatedInterest += interest;

      currentRemaining -= principal;
      if (currentRemaining < 0) currentRemaining = 0;

      items.push({
        period,
        paymentDate: dateStr,
        remainingPrincipal: currentRemaining,
        principal,
        interest,
        totalPayment,
      });
    }

    const firstPeriodPayment = items.length > 0 ? items[0].totalPayment : 0;
    const lastPeriodPayment = items.length > 0 ? items[items.length - 1].totalPayment : 0;

    return {
      items,
      totalPrincipal: accumulatedPrincipal,
      totalInterest: accumulatedInterest,
      grandTotal: accumulatedPrincipal + accumulatedInterest,
      firstPeriodPayment,
      lastPeriodPayment,
      totalPeriods,
    };
  }, [
    loanAmount,
    loanMonths,
    annualRate,
    currentCycle,
    disbursementDate,
    dueDay,
    roundToThousand,
  ]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = raw.replace(/[^\d]/g, '');
    if (!clean) {
      setLoanAmountStr('');
      return;
    }
    setLoanAmountStr(formatNumberDots(parseInt(clean, 10)));
  };

  const handleExportCsv = () => {
    if (scheduleData.items.length === 0) return;
    const headers = 'Kỳ,Ngày trả nợ,Dư nợ gốc còn lại (VND),Gốc trả (VND),Lãi trả (VND),Tổng thanh toán (VND)\n';
    const rows = scheduleData.items
      .map(
        (it) =>
          `${it.period},${it.paymentDate},${it.remainingPrincipal},${it.principal},${it.interest},${it.totalPayment}`
      )
      .join('\n');
    const totalRow = `\nTỔNG CỘNG,,${scheduleData.totalPrincipal},${scheduleData.totalInterest},${scheduleData.grandTotal}`;
    const blob = new Blob(['\uFEFF' + headers + rows + totalRow], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Lich_tra_no_VietinBank_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#003B70] to-[#005baa] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-100 border border-white/20 mb-3">
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Kế Hoạch Tài Chính Cá Nhân & Doanh Nghiệp</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            {loans.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            {loans.subtitle}. Hỗ trợ tự động quy đổi chu kỳ trả nợ, tính giảm dần và xuất bảng biểu chi tiết.
          </p>
        </div>
      </div>

      {/* Main Grid: Form Inputs & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form (strictly numeric inputs, no sliders) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#003B70]" />
            <span>Thông tin khoản vay</span>
          </h2>

          {/* 1. Số tiền vay (dạng nhập số, không kéo thả) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Số tiền vay (VND) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={loanAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền vay (ví dụ: 500.000.000)"
                className="w-full px-4 py-3 text-base sm:text-lg font-bold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white focus:outline-hidden transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[200000000, 500000000, 1000000000, 2000000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLoanAmountStr(formatNumberDots(preset))}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  {formatVND(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Thời gian vay (tháng) & Lãi suất (%/năm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={loanMonths}
                  onChange={(e) => setLoanMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-3 text-sm sm:text-base font-bold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white focus:outline-hidden"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  Tháng ({Math.floor(loanMonths / 12)} năm)
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRateStr}
                  onChange={(e) => setAnnualRateStr(e.target.value)}
                  className="w-full px-4 py-3 text-sm sm:text-base font-bold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white focus:outline-hidden"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  %/năm
                </span>
              </div>
            </div>
          </div>

          {/* 3. Chu kỳ trả nợ & Ngày trả nợ định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chu kỳ trả nợ
              </label>
              <select
                value={paymentCycleId}
                onChange={(e) => setPaymentCycleId(e.target.value)}
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white cursor-pointer"
              >
                {loans.cycles.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ngày trả nợ định kỳ
              </label>
              <select
                value={dueDay}
                onChange={(e) => setDueDay(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white cursor-pointer"
              >
                {[5, 10, 15, 20, 25, 28].map((day) => (
                  <option key={day} value={day}>
                    Ngày {day} hàng kỳ
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Ngày giải ngân & Quy tắc làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ngày giải ngân
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#003B70] focus:bg-white cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={roundToThousand}
                  onChange={(e) => setRoundToThousand(e.target.checked)}
                  className="w-4 h-4 text-[#003B70] rounded-sm focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700 select-none">
                  Làm tròn đến 1.000 đồng (khớp thực tế quầy)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Payment Schedule Summary & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Tóm tắt nghĩa vụ trả nợ
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {scheduleData.totalPeriods} kỳ thanh toán
              </span>
            </div>

            {/* Monthly payment range highlight */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Số tiền trả kỳ đầu tiên (cao nhất):</span>
                <span className="text-base font-black font-mono text-emerald-400">
                  {formatVND(scheduleData.firstPeriodPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Số tiền trả kỳ cuối cùng (thấp nhất):</span>
                <span className="text-base font-black font-mono text-emerald-300">
                  {formatVND(scheduleData.lastPeriodPayment)}
                </span>
              </div>
            </div>

            {/* Total figures breakdown */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Tổng tiền gốc phải trả:</span>
                <strong className="font-mono text-white">
                  {formatVND(scheduleData.totalPrincipal)}
                </strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Tổng tiền lãi phải trả:</span>
                <strong className="font-mono text-amber-400">
                  {formatVND(scheduleData.totalInterest)}
                </strong>
              </div>

              <div className="flex justify-between py-2 border-t border-slate-800 text-sm sm:text-base font-bold">
                <span className="text-white">Tổng số tiền gốc + lãi:</span>
                <strong className="font-mono text-amber-300 text-base sm:text-lg">
                  {formatVND(scheduleData.grandTotal)}
                </strong>
              </div>
            </div>

            {/* "Xem chi tiết" Button required in Step 2 of PDF */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-sm shadow-lg hover:shadow-red-500/20 transition-all active:scale-[0.99]"
            >
              <Table className="w-5 h-5" />
              <span>Xem chi tiết bảng tính lịch trả nợ</span>
            </button>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              * Phương thức: Trả gốc đều mỗi kỳ, lãi tính trên dư nợ giảm dần. Số tiền thực tế có thể thay đổi nhẹ tùy vào số ngày chính xác giữa các kỳ giải ngân.
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Bảng tính lịch trả nợ với dư nợ giảm dần */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  VietinBank Amortization Schedule
                </span>
                <h3 className="text-lg sm:text-xl font-bold">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  title="Tải file Excel / CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Xuất Excel/CSV</span>
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Đóng modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick stats ribbon */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shrink-0">
              <div>
                <span className="text-slate-500 block">Số tiền vay:</span>
                <strong className="text-slate-900 font-mono text-sm">{formatVND(loanAmount)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Thời hạn:</span>
                <strong className="text-slate-900 text-sm">{loanMonths} tháng ({scheduleData.totalPeriods} kỳ)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Lãi suất năm:</span>
                <strong className="text-[#003B70] text-sm">{annualRate}% / năm</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tổng lãi giảm dần:</span>
                <strong className="text-[#ED1C24] font-mono text-sm">{formatVND(scheduleData.totalInterest)}</strong>
              </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-3 text-center">Kỳ</th>
                      <th className="py-3 px-3">Ngày trả nợ</th>
                      <th className="py-3 px-3 text-right">Dư nợ gốc còn lại</th>
                      <th className="py-3 px-3 text-right">Tiền gốc</th>
                      <th className="py-3 px-3 text-right">Tiền lãi</th>
                      <th className="py-3 px-3 text-right font-black text-[#003B70]">Tổng gốc + lãi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {/* Period 0 row: initial disbursement */}
                    <tr className="bg-slate-50/60 text-slate-500 text-xs">
                      <td className="py-2.5 px-3 text-center font-bold">0</td>
                      <td className="py-2.5 px-3">{disbursementDate} (Giải ngân)</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">{formatNumberDots(loanAmount)}</td>
                      <td className="py-2.5 px-3 text-right">-</td>
                      <td className="py-2.5 px-3 text-right">-</td>
                      <td className="py-2.5 px-3 text-right">-</td>
                    </tr>

                    {scheduleData.items.map((row) => (
                      <tr key={row.period} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-sans text-xs">
                          {row.paymentDate}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700">
                          {formatNumberDots(row.remainingPrincipal)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-900 font-semibold">
                          {formatNumberDots(row.principal)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-red-600">
                          {formatNumberDots(row.interest)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#003B70]">
                          {formatNumberDots(row.totalPayment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900 text-white font-bold text-xs sm:text-sm">
                      <td colSpan={2} className="py-3 px-4 uppercase tracking-wider font-sans">
                        TỔNG CỘNG
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">0</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400">
                        {formatNumberDots(scheduleData.totalPrincipal)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-amber-400">
                        {formatNumberDots(scheduleData.totalInterest)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-white text-base">
                        {formatNumberDots(scheduleData.grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Đơn vị tiền tệ: Việt Nam Đồng (VND).
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
