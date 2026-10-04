export interface BankInfo {
  name: string;
  fullName: string;
  branchName: string;
  slogan: string;
  logoUrl: string;
  hotline: string;
  counselorSupport: {
    name: string;
    role: string;
    phone: string;
  };
  businessCounselor: {
    name: string;
    role: string;
    phone: string;
  };
  feedbackResponseUnresolved: string;
  farewellMessage: string;
  productInterestMessage: string;
  workingHours: {
    weekdays: string;
    weekend: string;
  };
}

export interface FaqStep {
  step: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  badge: string;
  summary: string;
  videoUrl?: string;
  steps: FaqStep[];
}

export interface SavingsTerm {
  months: number;
  label: string;
  rate: number;
}

export interface SavingsPreset {
  label: string;
  value: number;
}

export interface LoanCycle {
  id: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  label: string;
  divisor: number;
  monthsStep: number;
}

export interface LoanPaymentScheduleItem {
  period: number;
  paymentDate: string;
  remainingPrincipal: number;
  principal: number;
  interest: number;
  totalPayment: number;
}

export interface ProductItem {
  id: string;
  groupId: string;
  categoryLabel: string;
  title: string;
  highlight: string;
  description: string;
  imageUrl: string;
  isHot?: boolean;
}

export interface BranchItem {
  id: string;
  stt: number;
  branch: string;
  office: string;
  address: string;
  imageUrl: string;
  googleMapsUrl: string;
  phone: string;
  isHeadquarter?: boolean;
}

export interface FlappyVoucherData {
  score: number;
  voucherCode: string;
  reward: string;
  timestamp: string;
}

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: FlappyVoucherData) => void;
    onFlappyVoucherLose?: (data: { score: number; timestamp: string }) => void;
  }
}
