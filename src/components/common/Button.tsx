import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'h-[38px] px-3.5 text-xs rounded-[10px] gap-1.5',
    md: 'h-[46px] px-4 text-sm rounded-[12px] gap-2',
    lg: 'h-[52px] px-5 text-sm rounded-[14px] gap-2.5', // Design spec: 52px height, 14px radius, label-lg
  }[size];

  const variantStyles = {
    primary: 'bg-[#0D5C63] text-white hover:bg-[#094045] shadow-[0_2px_8px_-2px_rgba(13,92,99,0.25)]',
    secondary: 'bg-transparent border-[1.5px] border-[#0D5C63] text-[#0D5C63] hover:bg-[#0D5C63]/5',
    text: 'bg-transparent text-[#0D5C63] hover:bg-[#0D5C63]/5 p-0 h-auto',
    gold: 'bg-[#D97706] text-white hover:bg-[#b45309] shadow-[0_2px_8px_-2px_rgba(217,119,6,0.25)]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#dc2626]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap truncate">{children}</span>
    </button>
  );
};
