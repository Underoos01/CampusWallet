import React, { useState } from 'react';
import { 
  Utensils, 
  BookOpen, 
  Home, 
  TrainTrack, 
  Coffee, 
  ShieldAlert, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Sliders,
  Check,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { BudgetCategory, WalletAccount, StudentProfile } from '../../types/finance';
import { formatRupee, getPercentage } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface BudgetScreenProps {
  student: StudentProfile;
  wallets: WalletAccount[];
  budgetCategories: BudgetCategory[];
  onUpdateWallets: (updated: WalletAccount[]) => void;
  onUpdateCategories: (updated: BudgetCategory[]) => void;
}

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  student,
  wallets,
  budgetCategories,
  onUpdateWallets,
  onUpdateCategories,
}) => {
  const [editingWallets, setEditingWallets] = useState(false);
  const [tempWallets, setTempWallets] = useState<WalletAccount[]>(wallets);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="w-5 h-5 text-[#0D5C63]" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-[#0D5C63]" />;
      case 'Home': return <Home className="w-5 h-5 text-[#0D5C63]" />;
      case 'TrainTrack': return <TrainTrack className="w-5 h-5 text-[#D97706]" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-[#EF4444]" />;
      default: return <ShieldAlert className="w-5 h-5 text-[#0D5C63]" />;
    }
  };

  const handleWalletBalanceChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    setTempWallets(prev => prev.map(w => w.id === id ? { ...w, balance: num } : w));
  };

  const handleSaveWallets = () => {
    onUpdateWallets(tempWallets);
    setEditingWallets(false);
  };

  const handleAdjustCategory = (id: string, newAllocation: number) => {
    onUpdateCategories(
      budgetCategories.map(c => c.id === id ? { ...c, allocatedAmount: Math.max(newAllocation, 500) } : c)
    );
  };

  const totalAllocated = budgetCategories.reduce((acc, c) => acc + c.allocatedAmount, 0);
  const totalSpent = budgetCategories.reduce((acc, c) => acc + c.spentAmount, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
          Wallet Setup & Allocations
        </h2>
        <p className="text-[12px] text-[#64748B]">
          Calibrate monthly allowance across campus living envelopes
        </p>
      </div>

      {/* Wallet Setup / Balance Allocation Card (Spec: Outer stroke 1.5px solid #E2E8F0, padding 16px) */}
      <div className="rounded-[20px] p-4 bg-white border-[1.5px] border-[#E2E8F0] shadow-card-subtle">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-[14px] font-bold text-[#0F172A]">Opening Balance Allocation</h3>
            <p className="text-[11px] text-[#64748B]">Active campus financial channels</p>
          </div>
          {editingWallets ? (
            <Button variant="primary" size="sm" onClick={handleSaveWallets} icon={<Check className="w-3.5 h-3.5" />}>
              Save
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setEditingWallets(true)}>
              Edit Balances
            </Button>
          )}
        </div>

        {/* Dual-action micro-inputs for opening balances, category icon badges, currency input labels */}
        <div className="space-y-2.5">
          {tempWallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0D5C63] shadow-sm">
                  {wallet.type === 'card' && <CreditCard className="w-4 h-4" />}
                  {wallet.type === 'upi' && <Smartphone className="w-4 h-4" />}
                  {wallet.type === 'cash' && <Banknote className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">{wallet.name}</p>
                  <p className="text-[11px] text-[#64748B] font-mono">{wallet.accountNumber}</p>
                </div>
              </div>

              {editingWallets ? (
                <div className="flex items-center gap-1 w-32">
                  <span className="text-xs font-semibold text-[#64748B]">₹</span>
                  <input
                    type="number"
                    value={wallet.balance}
                    onChange={(e) => handleWalletBalanceChange(wallet.id, e.target.value)}
                    className="w-full h-8 px-2 rounded-[8px] bg-white border border-[#CBD5E1] text-[13px] font-bold tabular-nums text-right focus:outline-none focus:border-[#0D5C63]"
                  />
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-[14px] font-bold text-[#0F172A] tabular-nums">
                    {formatRupee(wallet.balance)}
                  </span>
                  <span className="block text-[10px] text-[#10B981] font-semibold">Active Ready</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Allowance Summary Deck */}
      <div className="p-4 bg-gradient-to-r from-[#0D5C63] to-[#0d5c63]/90 text-white rounded-[20px] shadow-card-subtle flex items-center justify-between">
        <div>
          <span className="text-[11px] text-white/80 uppercase font-semibold">Monthly Student Budget</span>
          <p className="text-[22px] font-extrabold tabular-nums tracking-tight">
            {formatRupee(totalAllocated)}
          </p>
          <p className="text-[11px] text-[#4EDEA3]">
            {formatRupee(totalSpent)} spent · {formatRupee(totalAllocated - totalSpent)} unallocated
          </p>
        </div>
        <div className="text-right bg-white/10 px-3.5 py-2 rounded-[14px]">
          <span className="text-[11px] text-white/70 block">Burn Rate</span>
          <span className="text-[16px] font-black tabular-nums">
            {getPercentage(totalSpent, totalAllocated)}%
          </span>
        </div>
      </div>

      {/* Category Envelopes with Linear Budget Bars */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[14px] font-bold text-[#0F172A]">Spending Categories</h3>
          <span className="text-[11px] text-[#64748B]">Tap +/- to recalibrate</span>
        </div>

        {budgetCategories.map((cat) => {
          const pct = getPercentage(cat.spentAmount, cat.allocatedAmount);
          const isWarning = pct >= 90;

          return (
            <div
              key={cat.id}
              className="p-4 bg-white rounded-[18px] border border-[#E2E8F0] shadow-card-subtle"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center border"
                    style={{ backgroundColor: cat.bgColor, borderColor: `${cat.color}20` }}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#0F172A] leading-tight">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] text-[#64748B]">
                      Spent: <strong className="tabular-nums font-semibold text-[#0F172A]">{formatRupee(cat.spentAmount)}</strong> of {formatRupee(cat.allocatedAmount)}
                    </span>
                  </div>
                </div>

                {isWarning ? (
                  <Badge variant="alert" icon={<AlertTriangle className="w-3 h-3" />}>
                    {pct}% Over
                  </Badge>
                ) : (
                  <span className="text-[12px] font-bold text-[#0D5C63] tabular-nums">
                    {pct}%
                  </span>
                )}
              </div>

              {/* Linear Budget Bar (Spec: 8px height, #E2E8F0 track, #0D5C63 fill or #EF4444 if >90%) */}
              <div className="my-2">
                <ProgressBar progress={pct} autoAlert={true} height={8} />
              </div>

              {/* Micro Allocation Calibration Controls */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#64748B]">
                <span>Safe to spend: <strong className="text-[#10B981] tabular-nums">{formatRupee(Math.max(cat.allocatedAmount - cat.spentAmount, 0))}</strong></span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjustCategory(cat.id, cat.allocatedAmount - 500)}
                    className="w-6 h-6 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold flex items-center justify-center cursor-pointer active:scale-95"
                    title="Decrease allocation by ₹500"
                  >
                    -
                  </button>
                  <span className="font-mono font-semibold text-[11px] text-[#0F172A] tabular-nums min-w-[50px] text-center">
                    {formatRupee(cat.allocatedAmount, false)}
                  </span>
                  <button
                    onClick={() => handleAdjustCategory(cat.id, cat.allocatedAmount + 500)}
                    className="w-6 h-6 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold flex items-center justify-center cursor-pointer active:scale-95"
                    title="Increase allocation by ₹500"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
