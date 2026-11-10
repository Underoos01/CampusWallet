import React from 'react';
import { 
  ArrowUpRight, 
  Plus, 
  Split, 
  QrCode, 
  Flame, 
  ChevronRight, 
  CreditCard, 
  Smartphone, 
  Banknote,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { StudentProfile, WalletAccount, Transaction, BudgetCategory } from '../../types/finance';
import { formatRupee, getPercentage } from '../../utils/formatters';
import { TransactionItem } from '../common/TransactionItem';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';

interface HomeScreenProps {
  student: StudentProfile;
  wallets: WalletAccount[];
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  onOpenAddTransaction: () => void;
  onOpenScanPay: () => void;
  onSelectTransaction: (txn: Transaction) => void;
  onNavigateTab: (tabId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  student,
  wallets,
  transactions,
  budgetCategories,
  onOpenAddTransaction,
  onOpenScanPay,
  onSelectTransaction,
  onNavigateTab,
}) => {
  // Total liquid balance across all student pockets
  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  // Overall monthly budget spent vs allowance
  const totalAllocated = budgetCategories.reduce((acc, c) => acc + c.allocatedAmount, 0);
  const totalSpent = budgetCategories.reduce((acc, c) => acc + c.spentAmount, 0);
  const budgetSpentPct = getPercentage(totalSpent, totalAllocated);

  return (
    <div className="space-y-4 pb-20">
      {/* Student Academic Top Greeting & Streak Pill */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold text-[#64748B] tracking-wide uppercase">
            {student.semester}
          </span>
          <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Hi, {student.name.split(' ')[0]} 👋
          </h2>
        </div>

        {/* Burnished Gold Streak Counter */}
        <div 
          onClick={() => onNavigateTab('savings')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#D97706]/30 shadow-sm cursor-pointer hover:bg-amber-100/60 transition-colors"
        >
          <Flame className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
          <span className="text-[12px] font-bold text-[#92400E] tabular-nums">
            {student.streakDays}d Streak
          </span>
        </div>
      </div>

      {/* Hero Wallet Card: 20px radius, 20px padding, deep academic teal subtle gradient */}
      <div className="rounded-[20px] p-5 bg-gradient-to-br from-[#0D5C63] via-[#0b4e54] to-[#083B40] text-white shadow-card-raised relative overflow-hidden">
        {/* Subtle decorative background motif */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-[#4EDEA3]/10 rounded-full blur-xl pointer-events-none" />

        {/* Card header */}
        <div className="flex items-center justify-between text-white/80 text-[12px] relative z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#4EDEA3]" />
            <span className="font-medium tracking-wide">Campus Liquid Balance</span>
          </div>
          <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/90">
            {student.rollNumber}
          </span>
        </div>

        {/* Hero Rupee Currency Figure */}
        <div className="mt-3 relative z-10">
          <p className="text-[32px] font-extrabold tracking-tight tabular-nums text-white leading-tight">
            {formatRupee(totalBalance)}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[12px] text-white/80">
            <span>Allowance Left:</span>
            <span className="font-bold text-[#4EDEA3] tabular-nums">
              {formatRupee(student.monthlyAllowance - totalSpent)}
            </span>
            <span className="text-white/40">·</span>
            <span>{30 - new Date().getDate()} days to month-end</span>
          </div>
        </div>

        {/* Quick Action Tiles */}
        <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/15 relative z-10">
          <button
            onClick={onOpenScanPay}
            className="flex flex-col items-center gap-1.5 p-2 rounded-[14px] bg-white/10 hover:bg-white/20 transition-all cursor-pointer active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-white text-[#0D5C63] flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-white/90">Scan UPI</span>
          </button>

          <button
            onClick={onOpenAddTransaction}
            className="flex flex-col items-center gap-1.5 p-2 rounded-[14px] bg-white/10 hover:bg-white/20 transition-all cursor-pointer active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-[#4EDEA3] text-[#002113] flex items-center justify-center shadow-sm">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-semibold text-white/90">Add Spend</span>
          </button>

          <button
            onClick={() => onNavigateTab('split')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-[14px] bg-white/10 hover:bg-white/20 transition-all cursor-pointer active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-sm">
              <Split className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-white/90">Split Bill</span>
          </button>

          <button
            onClick={() => onNavigateTab('budget')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-[14px] bg-white/10 hover:bg-white/20 transition-all cursor-pointer active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center shadow-sm">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-white/90">Budgets</span>
          </button>
        </div>
      </div>

      {/* Student Wallet Breakdown / Pocket Balances */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-bold text-[#0F172A] tracking-tight">Active Student Pockets</h3>
          <button 
            onClick={() => onNavigateTab('budget')}
            className="text-[12px] font-semibold text-[#0D5C63] hover:underline"
          >
            Manage
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-3 bg-white rounded-[16px] border border-[#E2E8F0] shadow-card-subtle flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-[8px] bg-slate-100 flex items-center justify-center text-[#0D5C63]">
                  {wallet.type === 'card' && <CreditCard className="w-4 h-4" />}
                  {wallet.type === 'upi' && <Smartphone className="w-4 h-4" />}
                  {wallet.type === 'cash' && <Banknote className="w-4 h-4" />}
                </div>
                <span className="text-[9px] font-mono text-[#94A3B8]">{wallet.accountNumber}</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748B] truncate leading-tight">
                  {wallet.name}
                </p>
                <p className="text-[14px] font-bold text-[#0F172A] tabular-nums mt-0.5">
                  {formatRupee(wallet.balance, false)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Budget Health Bar: Linear Budget Bar */}
      <div className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-[#0F172A]">Monthly Budget Health</span>
            {budgetSpentPct >= 90 ? (
              <Badge variant="alert">Alert: {budgetSpentPct}% Used</Badge>
            ) : (
              <Badge variant="income">{budgetSpentPct}% Used</Badge>
            )}
          </div>
          <span className="text-[12px] font-semibold text-[#475569] tabular-nums">
            {formatRupee(totalSpent)} / {formatRupee(totalAllocated)}
          </span>
        </div>

        {/* Spec linear budget bar */}
        <ProgressBar progress={budgetSpentPct} autoAlert={true} height={8} />

        <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#64748B]">
          <span>Remaining: <strong className="text-[#0D5C63] tabular-nums">{formatRupee(totalAllocated - totalSpent)}</strong></span>
          <button 
            onClick={() => onNavigateTab('budget')} 
            className="text-[#0D5C63] font-semibold hover:underline inline-flex items-center gap-0.5"
          >
            Review 6 Allocations <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Transactions Ledger Section */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-2 border-b border-[#E2E8F0]/70">
          <div>
            <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight">Recent Ledger Activity</h3>
            <p className="text-[11px] text-[#64748B]">Updated real-time from campus RFID & UPI</p>
          </div>
          <button
            onClick={() => onNavigateTab('passbook')}
            className="text-[12px] font-semibold text-[#0D5C63] hover:underline"
          >
            View All
          </button>
        </div>

        {/* Transaction list */}
        <div className="divide-y divide-[#E2E8F0]/70">
          {transactions.slice(0, 5).map((txn) => (
            <TransactionItem
              key={txn.id}
              transaction={txn}
              onClick={() => onSelectTransaction(txn)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
