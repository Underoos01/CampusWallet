export type TransactionType = 'expense' | 'income' | 'transfer' | 'refund';

export type PaymentMethod = 'campus_card' | 'bank_upi' | 'cash';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  date: string;
  time: string;
  note?: string;
  splitWith?: string[];
  referenceId?: string;
}

export interface WalletAccount {
  id: PaymentMethod;
  name: string;
  accountNumber: string;
  balance: number;
  type: 'card' | 'upi' | 'cash';
  badgeColor: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  iconName: string;
  allocatedAmount: number;
  spentAmount: number;
  color: string;
  bgColor: string;
}

export interface SplitMember {
  id: string;
  name: string;
  avatar: string;
  amountOwed: number; // positive = they owe you, negative = you owe them
  status: 'pending' | 'settled';
}

export interface SplitGroup {
  id: string;
  title: string;
  category: string;
  totalBill: number;
  paidBy: string;
  date: string;
  members: SplitMember[];
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: string;
  color: string;
}

export interface StudentProfile {
  name: string;
  rollNumber: string;
  institution: string;
  semester: string;
  monthlyAllowance: number;
  streakDays: number;
  avatar: string;
}
