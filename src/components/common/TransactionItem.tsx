import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCcw, 
  BookOpen, 
  Utensils, 
  Coffee, 
  TrainTrack, 
  Home, 
  CreditCard,
  GraduationCap,
  Award,
  Wallet
} from 'lucide-react';
import { Transaction } from '../../types/finance';
import { formatRupee } from '../../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onClick,
}) => {
  const isIncome = transaction.type === 'income';
  const isRefund = transaction.type === 'refund';
  const isTransfer = transaction.type === 'transfer';

  // Semantic icon and colors
  const getCategoryIcon = () => {
    const title = transaction.title.toLowerCase();
    const cat = transaction.category.toLowerCase();
    
    if (isIncome || cat.includes('award') || cat.includes('prize')) return <Award className="w-5 h-5 text-[#10B981]" />;
    if (isRefund) return <RefreshCcw className="w-5 h-5 text-[#8B5CF6]" />;
    if (cat.includes('canteen') || title.includes('maggie') || title.includes('nescafe')) return <Utensils className="w-5 h-5 text-[#0D5C63]" />;
    if (cat.includes('book') || cat.includes('xerox')) return <BookOpen className="w-5 h-5 text-[#0D5C63]" />;
    if (cat.includes('metro') || title.includes('dmrc')) return <TrainTrack className="w-5 h-5 text-[#D97706]" />;
    if (cat.includes('hostel')) return <Home className="w-5 h-5 text-[#0D5C63]" />;
    if (cat.includes('cafe') || cat.includes('pizza') || cat.includes('hangout')) return <Coffee className="w-5 h-5 text-[#EF4444]" />;
    if (transaction.paymentMethod === 'campus_card') return <CreditCard className="w-5 h-5 text-[#0D5C63]" />;
    return <Wallet className="w-5 h-5 text-[#64748B]" />;
  };

  const getContainerBg = () => {
    if (isIncome) return 'bg-[#ECFDF5] border border-[#10B981]/15';
    if (isRefund) return 'bg-[#F5F3FF] border border-[#8B5CF6]/15';
    if (transaction.category.toLowerCase().includes('metro')) return 'bg-[#FFFBEB] border border-[#D97706]/15';
    if (transaction.type === 'expense') return 'bg-[#FEF2F2] border border-[#EF4444]/15';
    return 'bg-[#F1F5F9] border border-[#E2E8F0]';
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      className="flex items-center justify-between h-[64px] px-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer select-none border-b border-[#E2E8F0]/70 last:border-b-0"
    >
      {/* Leading 40x40px 12px radius icon */}
      <div className="flex items-center gap-3.5 min-w-0 pr-3">
        <div className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center shrink-0 ${getContainerBg()}`}>
          {getCategoryIcon()}
        </div>

        {/* Center: Title over date/category */}
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#0F172A] truncate leading-tight">
            {transaction.title}
          </p>
          <p className="text-[12px] text-[#64748B] truncate mt-0.5 font-normal">
            {transaction.category} · {transaction.time}
          </p>
        </div>
      </div>

      {/* Trailing: Tabular Rupee amount */}
      <div className="text-right shrink-0">
        <p
          className={`text-[15px] font-bold tabular-nums tracking-tight ${
            isIncome || isRefund
              ? 'text-[#10B981]'
              : 'text-[#0F172A]'
          }`}
        >
          {isIncome || isRefund ? '+' : '-'}
          {formatRupee(transaction.amount)}
        </p>
        <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider block">
          {transaction.paymentMethod === 'campus_card' ? 'Campus Card' : transaction.paymentMethod === 'bank_upi' ? 'UPI' : 'Cash'}
        </span>
      </div>
    </div>
  );
};
