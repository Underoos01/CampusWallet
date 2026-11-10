import React, { useState } from 'react';
import { Split, Plus, Check, Clock, Users, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { SplitGroup, StudentProfile } from '../../types/finance';
import { formatRupee, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface SplitScreenProps {
  student: StudentProfile;
  splitGroups: SplitGroup[];
  onSettleMember: (groupId: string, memberId: string) => void;
  onAddNewSplit: (group: Omit<SplitGroup, 'id'>) => void;
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  student,
  splitGroups,
  onSettleMember,
  onAddNewSplit,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hostel Provisions');
  const [totalBillStr, setTotalBillStr] = useState('');
  const [friendsStr, setFriendsStr] = useState('');

  // Calculate net balance: total owed to you vs you owe others
  let totalYouAreOwed = 0;
  let totalYouOwe = 0;

  splitGroups.forEach(group => {
    group.members.forEach(member => {
      if (member.name.includes('You')) {
        if (member.amountOwed < 0 && member.status === 'pending') {
          totalYouOwe += Math.abs(member.amountOwed);
        }
      } else {
        if (member.amountOwed > 0 && member.status === 'pending') {
          totalYouAreOwed += member.amountOwed;
        }
      }
    });
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bill = parseFloat(totalBillStr);
    if (isNaN(bill) || bill <= 0 || !title.trim()) return;

    const friends = friendsStr.split(',').map(s => s.trim()).filter(Boolean);
    const totalMembers = friends.length + 1; // friends + You
    const perPerson = bill / totalMembers;

    const newGroup: Omit<SplitGroup, 'id'> = {
      title: title.trim(),
      category,
      totalBill: bill,
      paidBy: 'You',
      date: new Date().toISOString().split('T')[0],
      members: [
        {
          id: 'M-0',
          name: `You (${student.name.split(' ')[0]})`,
          avatar: student.avatar,
          amountOwed: perPerson,
          status: 'settled',
        },
        ...friends.map((f, i) => ({
          id: `M-${Date.now()}-${i}`,
          name: f,
          avatar: `https://images.unsplash.com/photo-${1534528741775 + i}?w=100&auto=format&fit=crop&q=80`,
          amountOwed: perPerson,
          status: 'pending' as const,
        })),
      ],
    };

    onAddNewSplit(newGroup);
    setIsCreating(false);
    setTitle('');
    setTotalBillStr('');
    setFriendsStr('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            Campus Peer Split
          </h2>
          <p className="text-[12px] text-[#64748B]">
            Automated hostel & study group expense reconciliation
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Split
        </Button>
      </div>

      {/* Net Peer Position Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-[#ECFDF5] border border-[#10B981]/20 rounded-[18px]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#065F46] uppercase">
            <ArrowDownLeft className="w-4 h-4 text-[#10B981]" />
            <span>You are owed</span>
          </div>
          <p className="text-[20px] font-black text-[#047857] tabular-nums mt-1">
            {formatRupee(totalYouAreOwed)}
          </p>
          <span className="text-[10px] text-[#065F46]/80">Across roommate tabs</span>
        </div>

        <div className="p-3.5 bg-[#FEF2F2] border border-[#EF4444]/20 rounded-[18px]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#991B1B] uppercase">
            <ArrowUpRight className="w-4 h-4 text-[#EF4444]" />
            <span>You owe others</span>
          </div>
          <p className="text-[20px] font-black text-[#B91C1C] tabular-nums mt-1">
            {formatRupee(totalYouOwe)}
          </p>
          <span className="text-[10px] text-[#991B1B]/80">Pending settlement</span>
        </div>
      </div>

      {/* New Split Form Drawer */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-4 bg-white rounded-[20px] border border-[#0D5C63]/30 shadow-card-raised space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0F172A]">Create Campus Bill Split</h3>
            <span className="text-[11px] text-[#0D5C63] font-semibold">Equal Split</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#475569] mb-1">Bill Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Domino's Pizza, Canteen Feast, Room WiFi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[13px] text-[#0F172A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">Total Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="1200.00"
                value={totalBillStr}
                onChange={(e) => setTotalBillStr(e.target.value)}
                className="w-full h-10 px-3 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[14px] font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-2 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[12px] text-[#0F172A]"
              >
                <option value="Hostel Provisions">Hostel Provisions</option>
                <option value="Food & Hangouts">Food & Hangouts</option>
                <option value="Lab & Hardware">Lab & Hardware</option>
                <option value="Travel & Commute">Travel & Commute</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#475569] mb-1">
              Split with Friends (Comma separated names)
            </label>
            <input
              type="text"
              required
              placeholder="Rohan Verma, Kunal Sen, Priya Nair"
              value={friendsStr}
              onChange={(e) => setFriendsStr(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-slate-50 border border-[#CBD5E1] text-[13px]"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" size="md" fullWidth onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth>
              Split Equally
            </Button>
          </div>
        </form>
      )}

      {/* Active Split Groups */}
      <div className="space-y-3">
        {splitGroups.map((group) => (
          <div
            key={group.id}
            className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] shadow-card-subtle"
          >
            {/* Group Header */}
            <div className="flex items-start justify-between pb-2.5 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                  {group.category} · {formatDate(group.date)}
                </span>
                <h3 className="text-[14px] font-bold text-[#0F172A] leading-snug">
                  {group.title}
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Paid by <strong className="text-[#0D5C63]">{group.paidBy}</strong> · Total: <span className="tabular-nums font-bold text-[#0F172A]">{formatRupee(group.totalBill)}</span>
                </p>
              </div>
              <Badge variant="teal">
                <Users className="w-3 h-3" />
                {group.members.length} Members
              </Badge>
            </div>

            {/* Members & Settlement List */}
            <div className="mt-3 space-y-2">
              {group.members.map((member) => {
                const isYou = member.name.includes('You');
                const isPending = member.status === 'pending';

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0D5C63]/10 text-[#0D5C63] font-bold text-xs flex items-center justify-center border border-[#0D5C63]/20">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#0F172A] leading-tight">
                          {member.name}
                        </p>
                        <span className="text-[10px] text-[#64748B]">
                          Share: <strong className="tabular-nums text-[#0F172A]">{formatRupee(Math.abs(member.amountOwed))}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.status === 'settled' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#10B981]/20">
                          <Check className="w-3 h-3" /> Settled
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-[#D97706] tabular-nums">
                            {formatRupee(Math.abs(member.amountOwed))}
                          </span>
                          <button
                            onClick={() => onSettleMember(group.id, member.id)}
                            className="h-7 px-2.5 rounded-[8px] bg-[#0D5C63] hover:bg-[#094045] text-white text-[11px] font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
                          >
                            {isYou ? 'Pay via UPI' : 'Mark Settled'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
