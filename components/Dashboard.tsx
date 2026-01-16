import React, { useState } from 'react';
import { DailyLog, Targets, History, WorkoutLog } from '../types';
import { ProgressBar } from './ProgressBar';
import { CircularProgress } from './CircularProgress';
import { WaterTracker } from './WaterTracker';
import { ReportsModal } from './ReportsModal';
import { WeightModal } from './WeightModal';
import { WorkoutModal } from './WorkoutModal';
import { Settings, ChevronRight, ChevronLeft, Calendar, BarChart2, Check, Zap, Pill, Scale, Dumbbell, Cloud, CloudOff, RefreshCw, LayoutGrid } from 'lucide-react';

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
    day: 'numeric',
    month: 'short'
  });

  const supplements = dailyLog.supplements || { creatine: false, multivitamin: false };
  const workout = dailyLog.workout || { exercises: [] };

  return (
    <div className="bg-slate-50/80 backdrop-blur-2xl sticky top-0 z-30 border-b border-slate-200/60 shadow-sm transition-all duration-500">
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center">
            <div className="flex gap-2">
                <button onClick={onOpenSettings} className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-90">
                    <Settings size={20} />
                </button>
                <button onClick={() => setIsReportsOpen(true)} className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-600 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-90">
                    <BarChart2 size={20} />
                </button>
            </div>

            <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                <button onClick={onPrevDay} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                    <ChevronRight size={18} />
                </button>
                <div className="px-2 flex items-center gap-2 text-[11px] font-black text-slate-600 min-w-[90px] justify-center">
                    <Calendar size={13} className="text-indigo-500" />
                    <span>{isToday ? 'اليوم' : formattedDate}</span>
                </div>
                <button onClick={onNextDay} disabled={isToday} className={`p-1.5 rounded-lg transition-all ${isToday ? 'text-slate-100 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-400 hover:text-indigo-600'}`}>
                    <ChevronLeft size={18} />
                </button>
            </div>

            <div className="w-10 h-10 flex items-center justify-center">
                {syncStatus === 'syncing' && <RefreshCw size={18} className="animate-spin text-indigo-500" />}
                {syncStatus === 'success' && <Cloud size={20} className="text-emerald-500 drop-shadow-sm" />}
                {syncStatus === 'error' && <CloudOff size={20} className="text-red-500" />}
                {syncStatus === 'idle' && <Cloud size={20} className="text-slate-200" />}
            </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-12 gap-3">
            {/* Calories Focal Point */}
            <div className="col-span-8">
                <CircularProgress 
                    value={dailyLog.calories} 
                    max={targets.calories} 
                    label="السعرات" 
                    subLabel={dailyLog.calories > targets.calories ? "تجاوزت الهدف!" : "متبقي " + Math.max(0, targets.calories - dailyLog.calories)}
                    icon="🔥"
                    colorClass="text-orange-500"
                    strokeColor="#f97316"
                />
            </div>
            {/* Vertical Water Tracker */}
            <div className="col-span-4">
                <WaterTracker current={dailyLog.waterIntake} target={targets.waterTarget} onAdd={onWaterUpdate} />
            </div>
        </div>

        {/* Macros Secondary Grid */}
        <div className="grid grid-cols-3 gap-3">
            <ProgressBar label="بروتين" icon="🥩" current={dailyLog.protein} max={targets.protein} unit="g" colorFrom="from-blue-500" colorTo="to-indigo-600" bgTint="bg-blue-50" />
            <ProgressBar label="كارب" icon="🍚" current={dailyLog.carbs} max={targets.carbs} unit="g" colorFrom="from-emerald-400" colorTo="to-teal-500" bgTint="bg-emerald-50" />
            <ProgressBar label="دهون" icon="🥑" current={dailyLog.fat} max={targets.fat} unit="g" colorFrom="from-amber-400" colorTo="to-yellow-500" bgTint="bg-amber-50" />
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setIsWeightOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 py-3 px-4 rounded-2xl shadow-sm hover:border-pink-200 hover:bg-pink-50/30 transition-all active:scale-95 group">
                <div className="p-1.5 bg-pink-100 text-pink-600 rounded-lg group-hover:bg-pink-200 transition-colors"><Scale size={16} /></div>
                <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">الوزن</span>
                    <span className="text-xs font-black text-slate-700">{dailyLog.weight || '--'} <span className="text-[8px]">kg</span></span>
                </div>
            </button>
            <button onClick={() => isToday && onSupplementToggle('creatine')} className={`flex items-center gap-2 border py-3 px-4 rounded-2xl shadow-sm transition-all active:scale-95 group ${supplements.creatine ? 'bg-purple-600 border-purple-600 text-white shadow-purple-100' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                <div className={`p-1.5 rounded-lg transition-colors ${supplements.creatine ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'}`}><Zap size={16} /></div>
                <div className="flex flex-col text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${supplements.creatine ? 'text-purple-100' : 'text-slate-400'}`}>كرياتين</span>
                    <span className={`text-[10px] font-black ${supplements.creatine ? 'text-white' : 'text-slate-700'}`}>{supplements.creatine ? 'تم' : 'لم يتم'}</span>
                </div>
            </button>
            <button onClick={() => isToday && onSupplementToggle('multivitamin')} className={`flex items-center gap-2 border py-3 px-4 rounded-2xl shadow-sm transition-all active:scale-95 group ${supplements.multivitamin ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-100' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                <div className={`p-1.5 rounded-lg transition-colors ${supplements.multivitamin ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'}`}><Pill size={16} /></div>
                <div className="flex flex-col text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${supplements.multivitamin ? 'text-emerald-100' : 'text-slate-400'}`}>فيتامين</span>
                    <span className={`text-[10px] font-black ${supplements.multivitamin ? 'text-white' : 'text-slate-700'}`}>{supplements.multivitamin ? 'تم' : 'لم يتم'}</span>
                </div>
            </button>
        </div>

        {/* Main Workout CTA */}
        <button 
            onClick={() => setIsWorkoutOpen(true)} 
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 group relative overflow-hidden ${workout.exercises.length > 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-900 text-white shadow-slate-300'}`}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Dumbbell size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm">{workout.exercises.length > 0 ? `إكمال التمرين (${workout.exercises.length} حركات)` : 'بدء تمرين جديد الآن'}</span>
        </button>
      </div>
      
      <ReportsModal isOpen={isReportsOpen} onClose={() => setIsReportsOpen(false)} history={history} />
      <WeightModal isOpen={isWeightOpen} onClose={() => setIsWeightOpen(false)} currentWeight={dailyLog.weight} onSave={onWeightUpdate} dateStr={dateStr} />
      <WorkoutModal isOpen={isWorkoutOpen} onClose={() => setIsWorkoutOpen(false)} workoutData={workout} onSave={onWorkoutSave} dateStr={dateStr} />
    </div>
  );
};