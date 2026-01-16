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
    <div className="relative overflow-hidden bg-white rounded-2xl p-3 shadow-sm border border-slate-200/60 flex flex-col justify-between h-28 group hover:shadow-md transition-all duration-300">
      
      {/* Background decoration */}
      <div className={`absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br ${colorFrom} ${colorTo} opacity-[0.05] rounded-full blur-xl group-hover:opacity-[0.1] transition-opacity`} />

      {/* Header */}
      <div className="flex flex-col z-10">
        <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm">{icon}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
        </div>
        <div className="flex items-baseline gap-0.5">
            <span className={`text-lg font-black ${isOver ? 'text-red-500' : 'text-slate-800'}`}>
                {Math.round(current)}
            </span>
            <span className="text-[9px] text-slate-400 font-bold">/ {max}{unit}</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-auto z-10 relative">
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
            <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative bg-gradient-to-r ${isOver ? 'from-red-500 to-red-600' : `${colorFrom} ${colorTo}`}`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
      </div>
    </div>
  );
};