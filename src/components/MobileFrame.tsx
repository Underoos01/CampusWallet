import React from 'react';
import { 
  Home, 
  SlidersHorizontal, 
  Split, 
  Flame, 
  BookOpen, 
  Wifi, 
  Battery, 
  Bell,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile } from '../types/finance';

interface MobileFrameProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  student: StudentProfile;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  activeTab,
  onTabChange,
  student,
  children,
}) => {
  const tabs = [
    { id: 'home', label: 'Wallet', icon: Home },
    { id: 'budget', label: 'Budgets', icon: SlidersHorizontal },
    { id: 'split', label: 'Split', icon: Split },
    { id: 'savings', label: 'Goals', icon: Flame },
    { id: 'passbook', label: 'Passbook', icon: BookOpen },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[390px] min-h-[844px] bg-[#F8FAFC] border-[8px] border-slate-900 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col font-sans select-none">
      {/* Dynamic Island / Speaker Notch & Status Bar */}
      <div className="bg-[#F8FAFC] pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-[#0F172A] shrink-0 z-30 select-none">
        <span className="tabular-nums font-bold">9:41</span>
        
        {/* Dynamic pill island */}
        <div className="w-[110px] h-[24px] bg-black rounded-full flex items-center justify-between px-3 text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C63]" />
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>

        <div className="flex items-center gap-1.5 text-slate-700">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono">5G</span>
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Campus Top App Bar (52px to 56px sticky header) */}
      <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-[#E2E8F0]/70">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#0D5C63] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            IIT
          </div>
          <div className="min-w-0">
            <h1 className="text-[13px] font-bold text-[#0F172A] truncate leading-tight">
              IIT Delhi CampusPay
            </h1>
            <p className="text-[10px] text-[#0D5C63] font-semibold truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#10B981]" />
              Verified Student Account
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#475569] hover:bg-slate-50 cursor-pointer"
            onClick={() => alert(`Campus Notifications:\n• Mess rebate of ₹650 credited.\n• Canteen discounts active.\n• 14-day streak active!`)}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <img
            src={student.avatar}
            alt={student.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-[#0D5C63] shrink-0"
          />
        </div>
      </div>

      {/* Main Scrollable Canvas (with 16px persistent outer edge cushion) */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 scrollbar-none">
        {children}
      </div>

      {/* Fixed Bottom Navigation Tab Bar (Spec: 5 tabs, fixed bottom, 22px icon, 10px-11px caption) */}
      <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-2 pt-2 pb-5 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-[12px] transition-all cursor-pointer ${
                isActive
                  ? 'text-[#0D5C63]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0D5C63] rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 ${
                  isActive ? 'font-bold text-[#0D5C63]' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Home Gesture Indicator Bar */}
      <div className="bg-white py-1.5 flex justify-center shrink-0">
        <div className="w-32 h-1 bg-slate-300 rounded-full" />
      </div>
    </div>
  );
};
