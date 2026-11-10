import React from 'react';
import { Smartphone, LayoutGrid, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { StudentProfile, WalletAccount, Transaction, BudgetCategory, SplitGroup, SavingsGoal } from '../types/finance';
import { HomeScreen } from './screens/HomeScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { SplitScreen } from './screens/SplitScreen';
import { SavingsScreen } from './screens/SavingsScreen';
import { PassbookScreen } from './screens/PassbookScreen';

interface ScreensOverviewProps {
  student: StudentProfile;
  wallets: WalletAccount[];
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  splitGroups: SplitGroup[];
  goals: SavingsGoal[];
  onOpenAddTransaction: () => void;
  onOpenScanPay: () => void;
  onSelectTransaction: (txn: Transaction) => void;
  onSelectScreenTab: (tabId: string) => void;
  onUpdateWallets: (wallets: WalletAccount[]) => void;
  onUpdateCategories: (cats: BudgetCategory[]) => void;
  onSettleMember: (groupId: string, memberId: string) => void;
  onAddNewSplit: (group: Omit<SplitGroup, 'id'>) => void;
  onAddDeposit: (goalId: string, amount: number) => void;
  onAddNewGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
}

export const ScreensOverview: React.FC<ScreensOverviewProps> = ({
  student,
  wallets,
  transactions,
  budgetCategories,
  splitGroups,
  goals,
  onOpenAddTransaction,
  onOpenScanPay,
  onSelectTransaction,
  onSelectScreenTab,
  onUpdateWallets,
  onUpdateCategories,
  onSettleMember,
  onAddNewSplit,
  onAddDeposit,
  onAddNewGoal,
}) => {
  const screens = [
    {
      id: 'home',
      name: 'Screen 1: Hero Wallet & Ledger',
      description: 'Teal gradient balance hero, quick UPI actions, pocket breakdown & 64px transaction rows',
      component: (
        <HomeScreen
          student={student}
          wallets={wallets}
          transactions={transactions}
          budgetCategories={budgetCategories}
          onOpenAddTransaction={onOpenAddTransaction}
          onOpenScanPay={onOpenScanPay}
          onSelectTransaction={onSelectTransaction}
          onNavigateTab={onSelectScreenTab}
        />
      ),
    },
    {
      id: 'budget',
      name: 'Screen 2: Wallet Setup & Envelopes',
      description: 'Balance allocation card, dual-action micro-inputs & 8px linear budget health bars',
      component: (
        <BudgetScreen
          student={student}
          wallets={wallets}
          budgetCategories={budgetCategories}
          onUpdateWallets={onUpdateWallets}
          onUpdateCategories={onUpdateCategories}
        />
      ),
    },
    {
      id: 'split',
      name: 'Screen 3: Peer Expense Split',
      description: 'Roommate & campus team ledger, net peer balance cards, and instant UPI settlement',
      component: (
        <SplitScreen
          student={student}
          splitGroups={splitGroups}
          onSettleMember={onSettleMember}
          onAddNewSplit={onAddNewSplit}
        />
      ),
    },
    {
      id: 'savings',
      name: 'Screen 4: Gold Streaks & Goals',
      description: 'Burnished gold (#D97706) 14-day streak hero, milestone rewards & locked student goals',
      component: (
        <SavingsScreen
          student={student}
          goals={goals}
          onAddDeposit={onAddDeposit}
          onAddNewGoal={onAddNewGoal}
        />
      ),
    },
    {
      id: 'passbook',
      name: 'Screen 5: Academic Passbook',
      description: 'Searchable ledger with Indian Rupee tabular formatting, filters, and CSV export',
      component: (
        <PassbookScreen
          transactions={transactions}
          onSelectTransaction={onSelectTransaction}
          onOpenAddTransaction={onOpenAddTransaction}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Design System Header */}
      <div className="mb-8 bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-card-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F3F4] text-[#0D5C63] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Teal & Gold Student Fintech Design System
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
            5 Complete Campus Financial Screens
          </h2>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Designed for 390x844pt mobile viewports with Plus Jakarta Sans typography, strict Indian Rupee tabular numerals, 20px card radii, and Material 3 structural foundations.
          </p>
        </div>

        {/* Quick specs pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            Primary: <strong className="text-[#0D5C63]">#0D5C63</strong>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 font-semibold border border-amber-200">
            Streak Gold: <strong className="text-[#D97706]">#D97706</strong>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200">
            Growth: <strong className="text-[#10B981]">#10B981</strong>
          </span>
        </div>
      </div>

      {/* Side-by-side screens showcase grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="flex flex-col bg-white rounded-[32px] border border-[#E2E8F0] p-4 shadow-card-subtle hover:shadow-card-raised transition-shadow"
          >
            {/* Screen Banner */}
            <div className="mb-3 px-2 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#0D5C63] uppercase tracking-wider">
                  Mobile Screen View
                </span>
                <h3 className="text-base font-bold text-[#0F172A] leading-tight mt-0.5">
                  {screen.name}
                </h3>
                <p className="text-[12px] text-[#64748B] mt-0.5 line-clamp-1">
                  {screen.description}
                </p>
              </div>
              <button
                onClick={() => onSelectScreenTab(screen.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#0D5C63]/10 text-[#0D5C63] hover:bg-[#0D5C63] hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
              >
                Focus In Device
              </button>
            </div>

            {/* Mobile Device Mockup Container */}
            <div className="flex-1 bg-[#F8FAFC] rounded-[24px] border border-[#CBD5E1] p-3 max-h-[680px] overflow-y-auto scrollbar-none shadow-inner">
              {screen.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
