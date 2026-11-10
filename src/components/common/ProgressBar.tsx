import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  autoAlert?: boolean; // if true, turn red when > 90%
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  autoAlert = true,
  height = 8,
  className = '',
}) => {
  const clamped = Math.min(Math.max(progress, 0), 100);
  const isOverBudget = autoAlert && clamped >= 90;
  
  const barColor = color ? color : isOverBudget ? '#EF4444' : '#0D5C63';

  return (
    <div
      className={`w-full bg-[#E2E8F0] overflow-hidden rounded-[4px] ${className}`}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-[4px] transition-all duration-300 ease-out"
        style={{
          width: `${clamped}%`,
          backgroundColor: barColor,
        }}
      />
    </div>
  );
};

interface CarouselIndicatorProps {
  total: number;
  active: number;
  onChange?: (index: number) => void;
  className?: string;
}

export const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({
  total,
  active,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === active;
        return (
          <button
            key={index}
            onClick={() => onChange?.(index)}
            className={`transition-all duration-300 cursor-pointer ${
              isActive
                ? 'w-[24px] h-[6px] rounded-[3px] bg-[#0D5C63]'
                : 'w-[6px] h-[6px] rounded-[3px] bg-[#CBD5E1] hover:bg-[#94A3B8]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        );
      })}
    </div>
  );
};
