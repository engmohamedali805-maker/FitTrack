import React, { useState } from 'react';
import { DailyLog, Targets, History, WorkoutLog } from '../types';
import { ProgressBar } from './ProgressBar';
import { WaterTracker } from './WaterTracker';
import { ReportsModal } from './ReportsModal';
import { WeightModal } from './WeightModal';
import { WorkoutModal } from './WorkoutModal';
import { Settings, ChevronRight, ChevronLeft, Calendar, BarChart2, Check, Zap, Pill, Scale, Dumbbell, Cloud, CloudOff, RefreshCw } from 'lucide-react';

interface DashboardProps {
  dailyLog: DailyLog;
  history: History; 
  targets: Targets;
  dateStr: string;
  onOpenSettings: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onWaterUpdate: (amount: number) => void;
  onSupplementToggle: (key: 'creatine' | 'multivitamin') => void;
  onWeightUpdate: (weight: number) => void;
  onWorkoutSave: (workout: WorkoutLog) => void;
  isToday: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

export const Dashboard: React.FC<DashboardProps> = ({
  dailyLog,
  history,
  targets,
  dateStr,
  onOpenSettings,
  onPrevDay,
  onNextDay,
  onWaterUpdate,
  onSupplementToggle,
  onWeightUpdate,
  onWorkoutSave,
  isToday,
  syncStatus
}) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);

  const formattedDate = new Date(dateStr).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const supplements = dailyLog.supplements || { creatine: false, multivitamin: false };
  const workout = dailyLog.workout || { exercises: [] };

  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200 sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-md mx-auto p-4 pb-3">
        <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
                <button onClick={onOpenSettings} className="p-2.5 bg-slate-50 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-95"><Settings size={20} /></button>
                <button onClick={() => setIsReportsOpen(true)} className="p-2.5 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-95"><BarChart2 size={20} /></button>
                
                {/* مؤشر المزامنة */}
                <div className="flex items-center justify-center p-2.5">
                   {syncStatus === 'syncing' && <RefreshCw size={18} className="animate-spin text-indigo-500" />}
                   {syncStatus === 'success' && <Cloud size={18} className="text-emerald-500" />}
                   {syncStatus === 'error' && <CloudOff size={18} className="text-red-500" />}
                   {syncStatus === 'idle' && <Cloud size={18} className="text-slate-300" />}
                </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-50 rounded-2xl p-1 border border-slate-100 shadow-sm">
                <button onClick={onPrevDay} className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-emerald-600 transition-all"><ChevronRight size={18} /></button>
                <div className="px-3 flex items-center gap-2 text-xs font-bold text-slate-600 min-w-[110px] justify-center"><Calendar size={14} className="text-emerald-500" /><span>{isToday ? 'اليوم' : formattedDate}</span></div>
                <button onClick={onNextDay} disabled={isToday} className={`p-2 rounded-xl transition-all ${isToday ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm text-slate-400 hover:text-emerald-600'}`}><ChevronLeft size={18} /></button>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
            <div className="col-span-3 grid grid-cols-2 gap-2.5">
                <ProgressBar label="السعرات" icon="🔥" current={dailyLog.calories} max={targets.calories} unit="kcal" colorFrom="from-orange-500" colorTo="to-red-500" bgTint="bg-orange-50" />
                <ProgressBar label="البروتين" icon="🥩" current={dailyLog.protein} max={targets.protein} unit="g" colorFrom="from-blue-500" colorTo="to-indigo-600" bgTint="bg-blue-50" />
                <ProgressBar label="الكارب" icon="🍚" current={dailyLog.carbs} max={targets.carbs} unit="g" colorFrom="from-emerald-400" colorTo="to-teal-500" bgTint="bg-emerald-50" />
                <ProgressBar label="الدهون" icon="🥑" current={dailyLog.fat} max={targets.fat} unit="g" colorFrom="from-amber-400" colorTo="to-yellow-500" bgTint="bg-amber-50" />
            </div>
            <div className="col-span-1 h-full"><WaterTracker current={dailyLog.waterIntake} target={targets.waterTarget} onAdd={onWaterUpdate} /></div>
        </div>
        
        <div className="mt-2.5 grid grid-cols-3 gap-2">
            <button onClick={() => setIsWeightOpen(true)} className="p-3 rounded-2xl border bg-pink-50 border-pink-100 text-pink-700 flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"><Scale size={18} /><span className="text-[10px] font-bold">الوزن</span></button>
            <button onClick={() => isToday && onSupplementToggle('creatine')} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${supplements.creatine ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-100 text-slate-400'}`}><Zap size={18} /><span className="text-[10px] font-bold">كرياتين</span></button>
            <button onClick={() => isToday && onSupplementToggle('multivitamin')} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${supplements.multivitamin ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}><Pill size={18} /><span className="text-[10px] font-bold">فيتامين</span></button>
        </div>

        <button onClick={() => setIsWorkoutOpen(true)} className={`mt-2.5 w-full py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${workout.exercises.length > 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-900 text-white shadow-slate-200'}`}><Dumbbell size={20} /><span>{workout.exercises.length > 0 ? `إكمال التمرين (${workout.exercises.length})` : 'بدء تمرين جديد'}</span></button>
      </div>
      
      <ReportsModal isOpen={isReportsOpen} onClose={() => setIsReportsOpen(false)} history={history} />
      <WeightModal isOpen={isWeightOpen} onClose={() => setIsWeightOpen(false)} currentWeight={dailyLog.weight} onSave={onWeightUpdate} dateStr={dateStr} />
      <WorkoutModal isOpen={isWorkoutOpen} onClose={() => setIsWorkoutOpen(false)} workoutData={workout} onSave={onWorkoutSave} dateStr={dateStr} />
    </div>
  );
};