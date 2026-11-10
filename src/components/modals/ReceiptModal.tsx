import React from 'react';
import { X, CheckCircle, Share2, Download, Building, CreditCard, ShieldCheck } from 'lucide-react';
import { Transaction, StudentProfile } from '../../types/finance';
import { formatRupee, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  student: StudentProfile;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  student,
}) => {
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-[360px] bg-white rounded-[24px] shadow-card-sheet overflow-hidden border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Passbook Top Banner */}
        <div className="bg-[#0D5C63] text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
            <CheckCircle className="w-7 h-7 text-[#4EDEA3]" />
          </div>
          <p className="text-[12px] font-medium text-white/80 uppercase tracking-widest">
            Campus Voucher Verified
          </p>
          <h4 className="text-[28px] font-black tabular-nums tracking-tight mt-1 text-white">
            {formatRupee(transaction.amount)}
          </h4>
          <p className="text-[12px] text-white/80 mt-0.5">
            {isIncome ? 'Credited to account' : 'Debited from account'}
          </p>
        </div>

        {/* Academic Receipt Body */}
        <div className="p-5 space-y-3.5 bg-[#FAFBFD]">
          {/* Institution & Student Info */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <p className="text-[11px] text-[#64748B] uppercase font-semibold">Student Account</p>
              <p className="text-[13px] font-bold text-[#0F172A]">{student.name}</p>
              <p className="text-[11px] text-[#64748B]">Roll No: {student.rollNumber}</p>
            </div>
            <div className="text-right">
              <Badge variant={isIncome ? 'income' : 'expense'}>
                {transaction.category}
              </Badge>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]/50">
              <span className="text-[#64748B]">Merchant / Source</span>
              <span className="font-semibold text-[#0F172A] text-right max-w-[180px] truncate">{transaction.title}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#E2E8F0]/50">
              <span className="text-[#64748B]">Date & Timestamp</span>
              <span className="font-semibold text-[#0F172A] tabular-nums">{formatDate(transaction.date)} · {transaction.time}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#E2E8F0]/50">
              <span className="text-[#64748B]">Channel</span>
              <span className="font-semibold text-[#0F172A] uppercase">
                {transaction.paymentMethod === 'campus_card' ? 'Campus RFID Card' : transaction.paymentMethod === 'bank_upi' ? 'Student UPI' : 'Cash in Hand'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#E2E8F0]/50">
              <span className="text-[#64748B]">Reference ID</span>
              <span className="font-mono text-[11px] text-[#0D5C63] font-semibold">{transaction.referenceId || 'N/A'}</span>
            </div>

            {transaction.note && (
              <div className="pt-1">
                <span className="text-[#64748B] block text-[11px]">Note:</span>
                <p className="text-[#0F172A] italic text-[12px] bg-white p-2 rounded-[8px] border border-[#E2E8F0] mt-0.5">
                  "{transaction.note}"
                </p>
              </div>
            )}
          </div>

          {/* Security stamp */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#0D5C63] bg-[#0D5C63]/5 p-2 rounded-[10px]">
            <ShieldCheck className="w-4 h-4 text-[#0D5C63] shrink-0" />
            <span>Cryptographically sealed under Campus Ledger Protocol</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                navigator.clipboard?.writeText?.(`Transaction ${transaction.referenceId}: ${formatRupee(transaction.amount)} at ${transaction.title}`);
                alert('Receipt reference copied to clipboard!');
              }}
              icon={<Share2 className="w-4 h-4" />}
            >
              Share Slip
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
