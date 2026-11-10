import React, { useState } from 'react';
import { Search, Filter, Download, ArrowDownUp, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../../types/finance';
import { formatRupee, formatDate } from '../../utils/formatters';
import { TransactionItem } from '../common/TransactionItem';
import { Button } from '../common/Button';

interface PassbookScreenProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  onOpenAddTransaction: () => void;
}

export const PassbookScreen: React.FC<PassbookScreenProps> = ({
  transactions,
  onSelectTransaction,
  onOpenAddTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'expense' | 'income' | 'campus_card' | 'bank_upi'>('all');
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Filter transactions
  const filtered = transactions.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.referenceId && t.referenceId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'expense') return t.type === 'expense';
    if (selectedFilter === 'income') return t.type === 'income' || t.type === 'refund';
    if (selectedFilter === 'campus_card') return t.paymentMethod === 'campus_card';
    if (selectedFilter === 'bank_upi') return t.paymentMethod === 'bank_upi';

    return true;
  });

  const totalInflow = filtered.filter(t => t.type === 'income' || t.type === 'refund').reduce((a, b) => a + b.amount, 0);
  const totalOutflow = filtered.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  const handleExportCSV = () => {
    const headers = 'ID,Date,Time,Title,Category,Type,PaymentMethod,Amount,Reference\n';
    const rows = filtered.map(t => 
      `"${t.id}","${t.date}","${t.time}","${t.title}","${t.category}","${t.type}","${t.paymentMethod}",${t.amount},"${t.referenceId || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Campus_Passbook_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 2500);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title & Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            Academic Passbook
          </h2>
          <p className="text-[12px] text-[#64748B]">
            Official ledger verified by Campus RFID & UPI gateways
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          icon={<Download className="w-3.5 h-3.5" />}
        >
          Export CSV
        </Button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-[#ECFDF5] border border-[#10B981]/30 rounded-[12px] flex items-center gap-2 text-xs text-[#065F46] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>Passbook CSV exported successfully to your downloads!</span>
        </div>
      )}

      {/* Ledger Stats Bar */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-white rounded-[16px] border border-[#E2E8F0] shadow-card-subtle">
          <span className="text-[11px] font-semibold text-[#64748B]">Total Period Debits</span>
          <p className="text-[18px] font-bold text-[#0F172A] tabular-nums mt-0.5">
            -{formatRupee(totalOutflow)}
          </p>
        </div>

        <div className="p-3 bg-white rounded-[16px] border border-[#E2E8F0] shadow-card-subtle">
          <span className="text-[11px] font-semibold text-[#64748B]">Total Period Credits</span>
          <p className="text-[18px] font-bold text-[#10B981] tabular-nums mt-0.5">
            +{formatRupee(totalInflow)}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by merchant, xerox, mess, UPI ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-[12px] bg-white border border-[#CBD5E1] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0D5C63] focus:ring-2 focus:ring-[#0D5C63]/10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Entries' },
          { id: 'expense', label: 'Expenses' },
          { id: 'income', label: 'Allowance/Prizes' },
          { id: 'campus_card', label: 'Campus Card' },
          { id: 'bank_upi', label: 'Bank UPI' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[#0D5C63] text-white shadow-sm'
                : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle overflow-hidden">
        <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
          <span>Ledger Record ({filtered.length})</span>
          <span>Tabular Amount</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-[#0F172A]">No records matching search</p>
            <p className="text-xs text-[#64748B] mt-1">Try clearing your filters or search keywords</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]/70">
            {filtered.map((txn) => (
              <TransactionItem
                key={txn.id}
                transaction={txn}
                onClick={() => onSelectTransaction(txn)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
