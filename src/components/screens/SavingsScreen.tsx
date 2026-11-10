import React, { useState } from 'react';
import { Flame, Plus, Palmtree, Tablet, GraduationCap, Award, TrendingUp, Sparkles, Check } from 'lucide-react';
import { SavingsGoal, StudentProfile } from '../../types/finance';
import { formatRupee, getPercentage, formatDate } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface SavingsScreenProps {
  student: StudentProfile;
  goals: SavingsGoal[];
  onAddDeposit: (goalId: string, amount: number) => void;
  onAddNewGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
}

export const SavingsScreen: React.FC<SavingsScreenProps> = ({
  student,
  goals,
  onAddDeposit,
  onAddNewGoal,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [category, setCategory] = useState('Travel & Vacations');

  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoal | null>(null);
  const [depositAmountStr, setDepositAmountStr] = useState('500');

  const totalSavedAcrossGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTargetAcrossGoals = goals.reduce((acc, g) => acc + g.targetAmount, 0);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmountStr);
    if (isNaN(target) || target <= 0 || !title.trim()) return;

    onAddNewGoal({
      title: title.trim(),
      targetAmount: target,
      currentAmount: 0,
      deadline,
      category,
      icon: 'Palmtree',
      color: '#D97706',
    });

    setIsCreating(false);
    setTitle('');
    setTargetAmountStr('');
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;
    const amt = parseFloat(depositAmountStr);
    if (isNaN(amt) || amt <= 0) return;

    onAddDeposit(depositModalGoal.id, amt);
    setDepositModalGoal(null);
  };

  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palmtree': return <Palmtree className="w-5 h-5 text-[#D97706]" />;
      case 'Tablet': return <Tablet className="w-5 h-5 text-[#0D5C63]" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#10B981]" />;
      default: return <Award className="w-5 h-5 text-[#D97706]" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            Student Goals & Streaks
          </h2>
          <p className="text-[12px] text-[#64748B]">
            Disciplined campus savings powered by burnished gold rewards
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Goal
        </Button>
      </div>

      {/* Burnished Gold Streak Hero Banner */}
      <div className="rounded-[20px] p-4 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border border-[#D97706]/30 shadow-card-subtle relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-[#D97706] text-white flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(217,119,6,0.3)]">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#92400E]">
                  Campus Discipline Streak
                </span>
                <Badge variant="gold">Level 3</Badge>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#78350F] tabular-nums leading-tight">
                {student.streakDays} Days Under Budget
              </h3>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-[#92400E] mt-2 relative z-10">
          You have maintained your daily campus living limit for 14 consecutive days. Next reward milestone at 21 days unlocks 5% Canteen cashback!
        </p>

        {/* 7-day visual week check tracker */}
        <div className="grid grid-cols-7 gap-1.5 mt-3 pt-2.5 border-t border-[#D97706]/20 relative z-10">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="text-center">
              <span className="text-[9px] text-[#92400E]/70 font-semibold uppercase">{day}</span>
              <div className={`w-full h-7 rounded-[8px] flex items-center justify-center mt-0.5 text-xs font-bold ${
                idx < 6 ? 'bg-[#D97706] text-white' : 'bg-white/80 border border-[#D97706]/40 text-[#92400E]'
              }`}>
                {idx < 6 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : 'Today'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregate Savings Progress */}
      <div className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] font-semibold text-[#64748B]">Total Locked in Goals</span>
          <span className="text-[14px] font-bold text-[#0D5C63] tabular-nums">
            {formatRupee(totalSavedAcrossGoals)} of {formatRupee(totalTargetAcrossGoals)}
          </span>
        </div>
        <ProgressBar
          progress={getPercentage(totalSavedAcrossGoals, totalTargetAcrossGoals)}
          color="#0D5C63"
          height={8}
        />
        <div className="flex items-center justify-between mt-2 text-[11px] text-[#64748B]">
          <span>{goals.length} Active Targets</span>
          <span>Overall: <strong>{getPercentage(totalSavedAcrossGoals, totalTargetAcrossGoals)}% Achieved</strong></span>
        </div>
      </div>

      {/* Create New Goal Form */}
      {isCreating && (
        <form onSubmit={handleCreateGoal} className="p-4 bg-white rounded-[20px] border border-[#D97706]/40 shadow-card-raised space-y-3">
          <h3 className="text-[14px] font-bold text-[#0F172A]">Set New Student Goal</h3>

          <div>
            <label className="block text-[11px] font-semibold text-[#475569] mb-1">Goal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. M3 MacBook Fund, Semester Goa Trip, GRE Test"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[13px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">Target Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="25000"
                value={targetAmountStr}
                onChange={(e) => setTargetAmountStr(e.target.value)}
                className="w-full h-10 px-3 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[13px] font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">Target Date</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-10 px-2 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[12px]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" size="md" fullWidth onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="md" fullWidth>
              Save Target
            </Button>
          </div>
        </form>
      )}

      {/* Active Goals List */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const pct = getPercentage(goal.currentAmount, goal.targetAmount);

          return (
            <div
              key={goal.id}
              className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center border"
                    style={{ backgroundColor: `${goal.color}15`, borderColor: `${goal.color}30` }}
                  >
                    {getGoalIcon(goal.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                      {goal.category}
                    </span>
                    <h4 className="text-[14px] font-bold text-[#0F172A] leading-tight">
                      {goal.title}
                    </h4>
                    <span className="text-[11px] text-[#64748B]">
                      Deadline: {formatDate(goal.deadline)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDepositModalGoal(goal)}
                >
                  + Add
                </Button>
              </div>

              {/* Progress and numbers */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-bold text-[#0F172A] tabular-nums">
                    {formatRupee(goal.currentAmount)}
                  </span>
                  <span className="text-[#64748B] tabular-nums">
                    Target: {formatRupee(goal.targetAmount)}
                  </span>
                </div>
                <ProgressBar progress={pct} color={goal.color} height={8} />
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#64748B]">
                  <span>{pct}% funded</span>
                  <span className="text-[#10B981] font-semibold">
                    {formatRupee(goal.targetAmount - goal.currentAmount)} to go
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Deposit Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <form 
            onSubmit={handleDepositSubmit}
            className="w-full max-w-[320px] bg-white rounded-[20px] p-5 shadow-card-sheet border border-[#E2E8F0] space-y-3"
          >
            <h3 className="text-[15px] font-bold text-[#0F172A]">
              Deposit to {depositModalGoal.title}
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Transfer surplus allowance into this locked goal.
            </p>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-base font-bold text-[#475569]">₹</span>
              <input
                type="number"
                step="50"
                min="50"
                required
                value={depositAmountStr}
                onChange={(e) => setDepositAmountStr(e.target.value)}
                className="w-full h-11 pl-8 pr-3 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[16px] font-bold tabular-nums"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[200, 500, 1000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setDepositAmountStr(String(amt))}
                  className="py-1 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] cursor-pointer"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="secondary" size="sm" fullWidth onClick={() => setDepositModalGoal(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" fullWidth>
                Confirm Deposit
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
