import React from 'react';

interface ProgressBarProps {
  label: string;
  icon: string;
  current: number;
  max: number;
  unit: string;
  colorFrom: string;
  colorTo: string;
  bgTint: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  icon,
  current,
  max,
  unit,
  colorFrom,
  colorTo,
  bgTint
}) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);
  const isOver = current > max;
  
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between h-32 group hover:shadow-md transition-all duration-300">
      
      {/* Background decoration - Vibrant Gradient Blur */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${colorFrom} ${colorTo} opacity-[0.08] rounded-full blur-2xl group-hover:opacity-[0.12] transition-opacity duration-500`} />

      {/* Header: Icon & Label */}
      <div className="flex justify-between items-start z-10 relative">
        <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorFrom} ${colorTo} text-white shadow-sm ring-2 ring-white`}>
                <span className="text-base">{icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide opacity-90">{label}</span>
              {isOver && <span className="text-[9px] font-bold text-red-500 animate-pulse">تجاوز الحد!</span>}
            </div>
        </div>
      </div>

      {/* Content: Value & Bar */}
      <div className="mt-auto z-10 relative">
        <div className="flex items-baseline gap-1 mb-2">
            <span className={`text-2xl font-black tracking-tight ${isOver ? 'text-red-600' : 'text-slate-800'}`}>
                {Math.round(current)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {max} <span className="text-[10px]">{unit}</span></span>
        </div>
        
        {/* Modern Bar Container */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 ring-1 ring-slate-50">
            {/* The Actual Bar */}
            <div
                className={`h-full rounded-full shadow-sm transition-all duration-1000 ease-out relative overflow-hidden bg-gradient-to-r ${isOver ? 'from-red-500 to-red-600' : `${colorFrom} ${colorTo}`}`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                {/* Shine Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
                {/* Shimmer Animation */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
      </div>
    </div>
  );
};