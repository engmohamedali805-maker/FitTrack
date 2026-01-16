import React from 'react';

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  subLabel: string;
  icon: string;
  colorClass: string; 
  strokeColor: string; 
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
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isOver = value > max;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 flex items-center justify-between relative overflow-hidden group h-[132px]">
       {/* Background Glow */}
       <div className={`absolute -right-4 -top-4 w-28 h-28 bg-current opacity-[0.03] rounded-full blur-2xl ${colorClass}`} />

       <div className="flex flex-col z-10 flex-1">
          <div className="flex items-center gap-2 mb-1">
             <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-current opacity-10 ${colorClass}`}></div>
             <span className={`absolute ml-2 text-base ${colorClass}`}>{icon}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
             <span className={`text-3xl font-black tracking-tight ${isOver ? 'text-red-600' : 'text-slate-800'}`}>
                {Math.round(value).toLocaleString()}
             </span>
             <span className="text-xs text-slate-400 font-bold">/ {max} <span className="text-[10px]">kcal</span></span>
          </div>
          <p className={`text-[10px] font-bold mt-1 ${isOver ? 'text-red-500' : 'text-slate-500'} opacity-80 leading-tight`}>{subLabel}</p>
       </div>

       <div className="relative flex items-center justify-center shrink-0 ml-4">
          <svg className="transform -rotate-90 w-[88px] h-[88px] drop-shadow-md">
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              className="text-slate-50"
            />
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke={isOver ? '#ef4444' : strokeColor}
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5">
             <span className={`text-base font-black ${isOver ? 'text-red-600' : 'text-slate-800'}`}>
                {Math.round(percentage)}%
             </span>
          </div>
       </div>
    </div>
  );
};