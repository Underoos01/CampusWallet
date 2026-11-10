import React from 'react';

export type BadgeVariant = 'income' | 'expense' | 'alert' | 'neutral' | 'gold' | 'teal';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = '',
}) => {
  // Spec: Status Chips: Height 26px, padding 0 10px, radius 9999px
  const variantStyles: Record<BadgeVariant, string> = {
    income: 'bg-[#ECFDF5] border border-[#10B981]/20 text-[#10B981]',
    expense: 'bg-[#FEF2F2] border border-[#EF4444]/20 text-[#EF4444]',
    alert: 'bg-[#FFFBEB] border border-[#D97706]/20 text-[#D97706]',
    neutral: 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]',
    gold: 'bg-[#FEF3C7] border border-[#D97706]/30 text-[#92400E]',
    teal: 'bg-[#E6F3F4] border border-[#0D5C63]/20 text-[#0D5C63]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-[26px] px-[10px] rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
