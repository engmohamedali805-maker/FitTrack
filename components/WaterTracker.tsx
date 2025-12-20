import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface WaterTrackerProps {
  current: number; // in ml
  target: number; // in ml (User target, typically 3000)
  onAdd: (amount: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ current, target, onAdd }) => {
  const maxCapacity = 5000; // 5 Liters
  const cupSize = 1000; // 1 Liter increment
  
  // Calculate heights
  const fillPercentage = Math.min((current / maxCapacity) * 100, 100);
  // Target line position
  const targetPercentage = (target / maxCapacity) * 100;
  
  const isTargetReached = current >= target;

  return (
    <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 h-full flex flex-col items-center justify-between relative overflow-hidden group min-h-[250px]">
      
      {/* Controls (Top) */}
      <div className="z-20 w-full flex justify-center mb-1 pt-2">
        <button 
            onClick={() => onAdd(cupSize)}
            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all border border-blue-100"
            title="إضافة 1 لتر"
        >
            <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      {/* The Bottle Visualization */}
      <div className="relative flex-1 w-full flex items-end justify-center py-1">
        {/* Bottle Body - Smaller width */}
        <div className="relative w-12 h-full bg-slate-50 border-2 border-slate-200 rounded-[1rem] rounded-t-lg overflow-hidden shadow-inner">
            
            {/* Cap */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1/2 h-1.5 bg-slate-300 rounded-b-sm z-10"></div>

            {/* Target Line */}
            <div 
                className="absolute w-full border-t border-dashed border-slate-400 z-10 flex items-end justify-end pr-0.5 opacity-70"
                style={{ bottom: `${targetPercentage}%` }}
            >
                <span className="text-[7px] font-bold text-slate-500 bg-white/80 px-0.5 rounded -mb-2 backdrop-blur-sm">
                    {(target / 1000)}L
                </span>
            </div>

            {/* Liquid */}
            <div 
                className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out flex items-start justify-center overflow-hidden ${isTargetReached ? 'bg-emerald-500' : 'bg-cyan-400'}`}
                style={{ height: `${fillPercentage}%` }}
            >
                {/* Bubbles / Wave effect */}
                <div className="w-full h-1 bg-white/30 absolute top-0 animate-pulse"></div>
            </div>
            
            {/* Current Value Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="text-center">
                    <span className={`text-xs font-black drop-shadow-sm ${fillPercentage > 50 ? 'text-white' : 'text-slate-700'}`}>
                        {(current / 1000).toFixed(0)}
                    </span>
                    <span className={`block text-[6px] font-bold uppercase ${fillPercentage > 50 ? 'text-white/80' : 'text-slate-400'}`}>L</span>
                </div>
            </div>
        </div>
      </div>

       {/* Controls (Bottom) */}
       <div className="z-20 w-full flex justify-center pb-1">
        <button 
            onClick={() => onAdd(-cupSize)}
            disabled={current <= 0}
            className="w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 hover:text-slate-600"
        >
            <Minus size={14} />
        </button>
      </div>

    </div>
  );
};