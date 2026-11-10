/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, 
  LayoutGrid, 
  Plus, 
  QrCode, 
  Sparkles, 
  GraduationCap,
  ShieldCheck,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_WALLETS, 
  INITIAL_BUDGET_CATEGORIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SPLIT_GROUPS, 
  INITIAL_SAVINGS_GOALS 
} from './data/mockData';
import { Transaction, WalletAccount, BudgetCategory, SplitGroup, SavingsGoal } from './types/finance';
import { MobileFrame } from './components/MobileFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { SplitScreen } from './components/screens/SplitScreen';
import { SavingsScreen } from './components/screens/SavingsScreen';
import { PassbookScreen } from './components/screens/PassbookScreen';
import { ScreensOverview } from './components/ScreensOverview';
import { AddTransactionSheet } from './components/modals/AddTransactionSheet';
import { ScanQRPayModal } from './components/modals/ScanQRPayModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { Button } from './components/common/Button';
import { formatRupee } from './utils/formatters';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'device' | 'showcase'>('device');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Application Data States
  const [student, setStudent] = useState(INITIAL_STUDENT_PROFILE);
  const [wallets, setWallets] = useState<WalletAccount[]>(INITIAL_WALLETS);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(INITIAL_BUDGET_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [splitGroups, setSplitGroups] = useState<SplitGroup[]>(INITIAL_SPLIT_GROUPS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);

  // Modals
  const [isAddTxnOpen, setIsAddTxnOpen] = useState(false);
  const [isScanPayOpen, setIsScanPayOpen] = useState(false);
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<Transaction | null>(null);

  // Handlers
  const handleAddTransaction = (newTxnData: Omit<Transaction, 'id'>) => {
    const newTxn: Transaction = {
      ...newTxnData,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Update wallet balances accordingly
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === newTxn.paymentMethod) {
          const delta = newTxn.type === 'expense' ? -newTxn.amount : newTxn.amount;
          return { ...w, balance: Math.max(w.balance + delta, 0) };
        }
        return w;
      })
    );

    // Update category spent amount if expense
    if (newTxn.type === 'expense') {
      setBudgetCategories((prev) =>
        prev.map((cat) => {
          if (cat.name === newTxn.category || cat.name.includes(newTxn.category.split(' ')[0])) {
            return { ...cat, spentAmount: cat.spentAmount + newTxn.amount };
          }
          return cat;
        })
      );
    }
  };

  const handleQuickPay = (
    title: string,
    amount: number,
    category: string,
    paymentMethod: 'campus_card' | 'bank_upi'
  ) => {
    const now = new Date();
    handleAddTransaction({
      title,
      amount,
      category,
      type: 'expense',
      paymentMethod,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      referenceId: `UPI/${paymentMethod.toUpperCase()}/${Math.floor(100000 + Math.random() * 900000)}`,
      note: 'Instant Tap-to-Pay authorized at campus counter',
    });
  };

  const handleSettleMember = (groupId: string, memberId: string) => {
    setSplitGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          members: group.members.map((m) =>
            m.id === memberId ? { ...m, status: 'settled' } : m
          ),
        };
      })
    );
  };

  const handleAddNewSplit = (newGroup: Omit<SplitGroup, 'id'>) => {
    const created: SplitGroup = {
      ...newGroup,
      id: `SPLIT-${Date.now()}`,
    };
    setSplitGroups((prev) => [created, ...prev]);
  };

  const handleAddDepositToGoal = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) } : g
      )
    );

    // Deduct from bank upi wallet
    setWallets((prev) =>
      prev.map((w) =>
        w.id === 'bank_upi' ? { ...w, balance: Math.max(w.balance - amount, 0) } : w
      )
    );
  };

  const handleAddNewGoal = (newGoal: Omit<SavingsGoal, 'id'>) => {
    const created: SavingsGoal = {
      ...newGoal,
      id: `GOAL-${Date.now()}`,
    };
    setGoals((prev) => [...prev, created]);
  };

  // Render active screen inside mobile frame
  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            student={student}
            wallets={wallets}
            transactions={transactions}
            budgetCategories={budgetCategories}
            onOpenAddTransaction={() => setIsAddTxnOpen(true)}
            onOpenScanPay={() => setIsScanPayOpen(true)}
            onSelectTransaction={(txn) => setSelectedReceiptTxn(txn)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'budget':
        return (
          <BudgetScreen
            student={student}
            wallets={wallets}
            budgetCategories={budgetCategories}
            onUpdateWallets={setWallets}
            onUpdateCategories={setBudgetCategories}
          />
        );
      case 'split':
        return (
          <SplitScreen
            student={student}
            splitGroups={splitGroups}
            onSettleMember={handleSettleMember}
            onAddNewSplit={handleAddNewSplit}
          />
        );
      case 'savings':
        return (
          <SavingsScreen
            student={student}
            goals={goals}
            onAddDeposit={handleAddDepositToGoal}
            onAddNewGoal={handleAddNewGoal}
          />
        );
      case 'passbook':
        return (
          <PassbookScreen
            transactions={transactions}
            onSelectTransaction={(txn) => setSelectedReceiptTxn(txn)}
            onOpenAddTransaction={() => setIsAddTxnOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Bar Contract (Section 2): 3 zones, gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-[10px] bg-[#0D5C63] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ₹
            </div>
            <a href="/" className="text-[17px] font-bold tracking-tight text-[#0D5C63]">
              Teal & Gold Student Fintech
            </a>
          </div>

          {/* Zone 2: Navigation Links / View Toggle */}
          <nav className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-[12px] border border-[#E2E8F0]">
            <button
              onClick={() => setViewMode('device')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-[8px] transition-all cursor-pointer ${
                viewMode === 'device'
                  ? 'bg-white text-[#0D5C63] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Device (390x844)</span>
            </button>
            <button
              onClick={() => setViewMode('showcase')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-[8px] transition-all cursor-pointer ${
                viewMode === 'showcase'
                  ? 'bg-white text-[#0D5C63] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All 5 Screens Showcase</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddTxnOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Record Spend
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-6">
        {viewMode === 'device' ? (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 max-w-6xl mx-auto px-4 py-2">
            {/* Left Side: Desktop Companion Information Bar */}
            <div className="hidden lg:block w-72 space-y-4 pt-4">
              <div className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D5C63]">
                  Student Identity
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-1">{student.name}</h3>
                <p className="text-xs text-[#64748B]">{student.institution}</p>
                <div className="mt-3 pt-3 border-t border-[#E2E8F0] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Roll No:</span>
                    <span className="font-mono font-semibold">{student.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Semester:</span>
                    <span className="font-semibold">{student.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Allowance:</span>
                    <span className="font-bold text-[#0D5C63] tabular-nums">{formatRupee(student.monthlyAllowance)}</span>
                  </div>
                </div>
              </div>

              {/* Screen Navigator Shortcuts */}
              <div className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Screen Switcher
                </span>
                <div className="space-y-1">
                  {[
                    { id: 'home', label: '1. Hero Wallet & Balance' },
                    { id: 'budget', label: '2. Wallet Setup & Envelopes' },
                    { id: 'split', label: '3. Peer Expense Split' },
                    { id: 'savings', label: '4. Gold Streaks & Goals' },
                    { id: 'passbook', label: '5. Academic Passbook' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveTab(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-[10px] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === s.id
                          ? 'bg-[#0D5C63] text-white shadow-sm'
                          : 'text-[#475569] hover:bg-slate-100'
                      }`}
                    >
                      <span>{s.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Design System Spec Badges */}
              <div className="p-4 bg-gradient-to-br from-[#0D5C63]/5 to-[#D97706]/5 rounded-[20px] border border-[#E2E8F0] text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#0D5C63] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Design Tokens Verified</span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Strictly styled with Deep Academic Teal (<code className="text-[#0D5C63]">#0D5C63</code>), Warm Burnished Gold (<code className="text-[#D97706]">#D97706</code>), 20px card radii, and tabular Indian Rupee formatting.
                </p>
              </div>
            </div>

            {/* Center: The Phone Mockup Frame */}
            <div className="shrink-0">
              <MobileFrame
                activeTab={activeTab}
                onTabChange={setActiveTab}
                student={student}
              >
                {renderCurrentScreen()}
              </MobileFrame>
            </div>

            {/* Right Side: Quick Action Launchpad */}
            <div className="hidden lg:block w-72 space-y-4 pt-4">
              <div className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D5C63]">
                  Interactive Simulation
                </span>
                <p className="text-xs text-[#64748B]">
                  Test student actions directly on the mobile screen:
                </p>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setIsScanPayOpen(true)}
                  icon={<QrCode className="w-4 h-4" />}
                >
                  Scan QR / RFID Tap
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setIsAddTxnOpen(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Custom Expense
                </Button>

                <Button
                  variant="gold"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setActiveTab('savings');
                    setStudent((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
                  }}
                >
                  +1 Day Streak Bonus
                </Button>
              </div>

              {/* Academic Passbook Preview Card */}
              <div className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Active Wallet Accounts
                </span>
                <div className="space-y-2 mt-2">
                  {wallets.map((w) => (
                    <div key={w.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{w.name}</p>
                        <span className="text-[10px] text-[#64748B] font-mono">{w.accountNumber}</span>
                      </div>
                      <span className="font-bold text-[#0D5C63] tabular-nums">{formatRupee(w.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Showcase Grid Mode: All 5 Screens */
          <ScreensOverview
            student={student}
            wallets={wallets}
            transactions={transactions}
            budgetCategories={budgetCategories}
            splitGroups={splitGroups}
            goals={goals}
            onOpenAddTransaction={() => setIsAddTxnOpen(true)}
            onOpenScanPay={() => setIsScanPayOpen(true)}
            onSelectTransaction={(txn) => setSelectedReceiptTxn(txn)}
            onSelectScreenTab={(tab) => {
              setActiveTab(tab);
              setViewMode('device');
            }}
            onUpdateWallets={setWallets}
            onUpdateCategories={setBudgetCategories}
            onSettleMember={handleSettleMember}
            onAddNewSplit={handleAddNewSplit}
            onAddDeposit={handleAddDepositToGoal}
            onAddNewGoal={handleAddNewGoal}
          />
        )}
      </main>

      {/* Modals & Draw Sheets */}
      <AddTransactionSheet
        isOpen={isAddTxnOpen}
        onClose={() => setIsAddTxnOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <ScanQRPayModal
        isOpen={isScanPayOpen}
        onClose={() => setIsScanPayOpen(false)}
        onQuickPay={handleQuickPay}
        campusCardBalance={wallets.find((w) => w.id === 'campus_card')?.balance || 0}
      />

      <ReceiptModal
        isOpen={!!selectedReceiptTxn}
        onClose={() => setSelectedReceiptTxn(null)}
        transaction={selectedReceiptTxn}
        student={student}
      />
    </div>
  );
}
