import React, { useState } from 'react';
import { X, Check, CreditCard, Smartphone, Banknote, Plus, Split } from 'lucide-react';
import { Transaction, PaymentMethod, TransactionType } from '../../types/finance';
import { Button } from '../common/Button';

interface AddTransactionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (txn: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionSheet: React.FC<AddTransactionSheetProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Canteen & Mess Extras');
  const [type, setType] = useState<TransactionType>('expense');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('campus_card');
  const [note, setNote] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitWithInput, setSplitWithInput] = useState('');

  if (!isOpen) return null;

  const categories = [
    'Canteen & Mess Extras',
    'Books, Xerox & Labs',
    'Hostel, Laundry & WiFi',
    'Delhi Metro & Autos',
    'Weekend Movies & Cafes',
    'Campus Emergency Reserve',
    'Stipend & Allowance',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountStr);
    if (isNaN(numAmount) || numAmount <= 0 || !title.trim()) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const splitMembers = isSplitting && splitWithInput.trim()
      ? splitWithInput.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    onAddTransaction({
      title: title.trim(),
      amount: numAmount,
      category,
      type,
      paymentMethod,
      date: dateStr,
      time: timeStr,
      note: note.trim() || undefined,
      splitWith: splitMembers,
      referenceId: `TXN/CAMPUS/${Math.floor(100000 + Math.random() * 900000)}`,
    });

    // Reset and close
    setAmountStr('');
    setTitle('');
    setNote('');
    setIsSplitting(false);
    setSplitWithInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div 
        className="w-full max-w-[430px] bg-white rounded-t-[28px] max-h-[90vh] overflow-y-auto shadow-card-sheet flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle affordance */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-[#CBD5E1] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight">Record Campus Entry</h3>
            <p className="text-[12px] text-[#64748B]">Update your student ledger in seconds</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Transaction Type Segmented Toggle */}
          <div className="flex p-1 bg-[#F1F5F9] rounded-[14px]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-xs font-semibold rounded-[10px] transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-white text-[#EF4444] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Expense / Spend
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-xs font-semibold rounded-[10px] transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white text-[#10B981] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Income / Allowance
            </button>
          </div>

          {/* Amount input with pinned Indian Rupee prefix */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
              Transaction Amount
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[22px] font-medium text-[#475569] pointer-events-none tabular-nums">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                autoFocus
                className="w-full h-[54px] pl-10 pr-4 rounded-[12px] bg-white border border-[#CBD5E1] text-[24px] font-extrabold text-[#0F172A] tabular-nums focus:outline-none focus:border-[2px] focus:border-[#0D5C63] focus:ring-3 focus:ring-[#0D5C63]/12 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
              Expense Title / Merchant
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Canteen Lunch, Metro Recharge, Stationery"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[46px] px-3.5 rounded-[12px] bg-white border border-[#CBD5E1] text-[14px] text-[#0F172A] focus:outline-none focus:border-[2px] focus:border-[#0D5C63] focus:ring-2 focus:ring-[#0D5C63]/10"
            />
          </div>

          {/* Payment Account Selector */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
              Paid From / Credited To
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('campus_card')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-[12px] border text-xs font-semibold cursor-pointer transition-all ${
                  paymentMethod === 'campus_card'
                    ? 'border-[#0D5C63] bg-[#0D5C63]/5 text-[#0D5C63] ring-1 ring-[#0D5C63]'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span>Campus Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_upi')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-[12px] border text-xs font-semibold cursor-pointer transition-all ${
                  paymentMethod === 'bank_upi'
                    ? 'border-[#0D5C63] bg-[#0D5C63]/5 text-[#0D5C63] ring-1 ring-[#0D5C63]'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span>Bank UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-[12px] border text-xs font-semibold cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#0D5C63] bg-[#0D5C63]/5 text-[#0D5C63] ring-1 ring-[#0D5C63]'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1" />
                <span>Cash Pocket</span>
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-[#0D5C63] text-white shadow-sm'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Split Bill Toggle */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-[#D97706]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">Split this expense with roommates</span>
              </div>
              <input
                type="checkbox"
                id="splitToggle"
                checked={isSplitting}
                onChange={(e) => setIsSplitting(e.target.checked)}
                className="w-4 h-4 text-[#0D5C63] rounded border-gray-300 focus:ring-[#0D5C63] cursor-pointer"
              />
            </div>
            {isSplitting && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Names separated by comma (e.g. Rohan, Kunal, Dev)"
                  value={splitWithInput}
                  onChange={(e) => setSplitWithInput(e.target.value)}
                  className="w-full h-[40px] px-3 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[13px] text-[#0F172A] focus:outline-none focus:border-[#0D5C63]"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  Bill will be split evenly across you and listed members.
                </p>
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1">
              Ledger Note / Reference (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Mid-term lab xerox copy receipt"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-[40px] px-3.5 rounded-[10px] bg-white border border-[#CBD5E1] text-[13px] text-[#0F172A] focus:outline-none focus:border-[#0D5C63]"
            />
          </div>

          {/* Action CTAs */}
          <div className="pt-2 pb-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={<Check className="w-5 h-5" />}
            >
              Confirm & Save Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
