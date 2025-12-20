import React from 'react';

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  subLabel: string;
  icon: string;
  colorClass: string; // Tailwind text color class like "text-emerald-500"
  strokeColor: string; // Hex or explicit color for stroke
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  label,
  subLabel,
  icon,
  colorClass,
  strokeColor,
}) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isOver = value > max;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group h-32">
       {/* Background Glow */}
       <div className={`absolute -right-4 -top-4 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl ${colorClass}`} />

       <div className="flex flex-col z-10">
          <div className="flex items-center gap-1.5 mb-1">
             <span className="text-xl">{icon}</span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
             <span className={`text-2xl font-black ${isOver ? 'text-red-500' : 'text-slate-800'}`}>
                {Math.round(value)}
             </span>
             <span className="text-xs text-slate-400">/ {max}</span>
          </div>
          <span className={`text-xs font-medium mt-1 ${colorClass} opacity-80`}>{subLabel}</span>
       </div>

       <div className="relative flex items-center justify-center">
          {/* SVG Ring */}
          <svg className="transform -rotate-90 w-24 h-24 drop-shadow-sm">
            {/* Track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100"
            />
            {/* Indicator */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={isOver ? '#ef4444' : strokeColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className={`text-sm font-bold ${isOver ? 'text-red-500' : 'text-slate-600'}`}>
                {Math.round(percentage)}%
             </span>
          </div>
       </div>
    </div>
  );
};