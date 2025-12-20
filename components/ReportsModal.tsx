import React, { useMemo, useState } from 'react';
import { History, WorkoutExercise } from '../types';
import { X, TrendingUp, Calendar, Activity, Dumbbell, Zap, MessageSquare, ChevronRight, BarChart3, Trophy, BrainCircuit, Loader2, Info } from 'lucide-react';
import { analyzeWorkoutPerformance } from '../services/geminiService';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: History;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  const [reportTab, setReportTab] = useState<'nutrition' | 'workout'>('nutrition');
  const [metric, setMetric] = useState<'calories' | 'protein' | 'weight' | 'volume'>('calories');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const stats = useMemo(() => {
    const dates = Object.keys(history).sort();
    const last30Days = dates.slice(-30);
    
    if (last30Days.length === 0) return null;

    let totals = { calories: 0, protein: 0, water: 0, volume: 0, cardioMinutes: 0, workoutsCount: 0 };
    let weights = { sum: 0, count: 0, first: 0, last: 0 };
    let muscleFocus: Record<string, number> = {};

    const chartData = last30Days.map(date => {
      const log = history[date];
      totals.calories += log.calories;
      totals.protein += log.protein;
      totals.water += log.waterIntake || 0;
      
      let dayVolume = 0;
      let dayCardio = 0;
      if (log.workout && log.workout.exercises.length > 0) {
        totals.workoutsCount++;
        log.workout.exercises.forEach(ex => {
          muscleFocus[ex.muscle] = (muscleFocus[ex.muscle] || 0) + 1;
          ex.sets.filter(s => s.completed).forEach(s => {
            if (ex.muscle === 'Cardio') {
              dayCardio += (s.time || 0);
            } else {
              dayVolume += (s.weight || 0) * (s.reps || 0);
            }
          });
        });
      }
      totals.volume += dayVolume;
      totals.cardioMinutes += dayCardio;

      if (log.weight) {
        weights.sum += log.weight;
        weights.count++;
        weights.last = log.weight;
        if (weights.first === 0) weights.first = log.weight;
      }

      let value = 0;
      if (metric === 'weight') value = log.weight || 0;
      else if (metric === 'volume') value = dayVolume;
      else value = (log as any)[metric] || 0;

      return {
        date,
        dayName: new Date(date).toLocaleDateString('ar-EG', { weekday: 'short' }),
        dayNum: new Date(date).getDate(),
        value,
        dayCardio,
        workout: log.workout
      };
    });

    const topMuscle = Object.entries(muscleFocus).sort((a,b) => b[1] - a[1])[0]?.[0] || '-';

    return {
      avgCalories: Math.round(totals.calories / last30Days.length),
      avgProtein: Math.round(totals.protein / last30Days.length),
      totalVolume: totals.volume,
      totalCardio: totals.cardioMinutes,
      workoutsCount: totals.workoutsCount,
      avgWeight: weights.count > 0 ? (weights.sum / weights.count).toFixed(1) : '-',
      weightChange: (weights.first > 0 && weights.last > 0) ? (weights.last - weights.first).toFixed(1) : null,
      topMuscle,
      daysCount: last30Days.length,
      chartData: chartData.reverse()
    };
  }, [history, metric]);

  if (!isOpen) return null;

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeWorkoutPerformance(history);
      setAiAnalysis(result);
    } catch (e) {
      setAiAnalysis("فشل التحليل الذكي. تأكد من تسجيل تمارين كافية خلال الشهر.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-slate-700 p-2.5 rounded-2xl">
               <BarChart3 size={24} className="text-emerald-400" />
            </div>
            <div>
                <h2 className="font-bold text-lg leading-tight">مركز التحليلات</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Monthly Performance Hub</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-slate-700 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white border-b flex p-1 m-4 rounded-2xl shadow-sm shrink-0">
            <button 
                onClick={() => { setReportTab('nutrition'); setMetric('calories'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${reportTab === 'nutrition' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
            >
                <Zap size={16} /> تغذية ووزن
            </button>
            <button 
                onClick={() => { setReportTab('workout'); setMetric('volume'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${reportTab === 'workout' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
                <Dumbbell size={16} /> أداء رياضي
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-6">
            {!stats ? (
                <div className="text-center py-20 text-slate-400">لا توجد بيانات كافية للتحليل. سجل المزيد من الأيام أولاً.</div>
            ) : (
                <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {reportTab === 'nutrition' ? (
                        <>
                            <div className="bg-white border p-3 rounded-2xl text-center shadow-sm hover:border-orange-200 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 block mb-1">متوسط سعرات</span>
                                <span className="text-xl font-black text-orange-600">{stats.avgCalories}</span>
                            </div>
                            <div className="bg-white border p-3 rounded-2xl text-center shadow-sm hover:border-indigo-200 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 block mb-1">متوسط بروتين</span>
                                <span className="text-xl font-black text-indigo-600">{stats.avgProtein}g</span>
                            </div>
                            <div className="bg-white border p-3 rounded-2xl text-center shadow-sm hover:border-pink-200 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 block mb-1">متوسط الوزن</span>
                                <span className="text-xl font-black text-pink-600">{stats.avgWeight}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white border p-3 rounded-2xl text-center shadow-sm hover:border-indigo-200 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 block mb-1">حجم التمرين (كجم)</span>
                                <span className="text-xl font-black text-indigo-600">{stats.totalVolume >= 1000 ? (stats.totalVolume/1000).toFixed(1) + 't' : stats.totalVolume}</span>
                            </div>
                            <div className="bg-white border p-3 rounded-2xl text-center shadow-sm hover:border-emerald-200 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 block mb-1">دقائق كارديو</span>
                                <span className="text-xl font-black text-emerald-600">{stats.totalCardio}</span>
                            </div>
                            <div className="bg-white border p-3 rounded-2xl text-center shadow-sm hover:border-amber-200 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 block mb-1">أيام التمرين</span>
                                <span className="text-xl font-black text-amber-600">{stats.workoutsCount}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* AI Coach Button & Result */}
                {reportTab === 'workout' && (
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-3xl p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                                    <BrainCircuit size={24} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">التحليل الذكي والترشيحات</h3>
                                    <p className="text-[10px] text-indigo-200 font-medium">AI Coach Recommendations</p>
                                </div>
                            </div>
                            {!aiAnalysis && !isAnalyzing && (
                                <button 
                                    onClick={handleAiAnalysis}
                                    className="bg-white text-indigo-700 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg hover:bg-slate-50 active:scale-95 transition-all"
                                >
                                    تحليل الأداء
                                </button>
                            )}
                        </div>
                        
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center gap-3 py-6">
                                <Loader2 size={32} className="animate-spin text-white/80" />
                                <span className="text-sm font-bold text-indigo-100 animate-pulse">جاري فحص سجلاتك وتحليل القوة...</span>
                            </div>
                        ) : aiAnalysis ? (
                            <div className="bg-white/10 rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap backdrop-blur-md border border-white/20 animate-in fade-in slide-in-from-top-2">
                                {aiAnalysis}
                                <div className="mt-4 flex justify-end">
                                    <button 
                                        onClick={() => setAiAnalysis(null)}
                                        className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors"
                                    >
                                        تحديث التحليل 🔄
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10">
                                <span className="text-indigo-200 shrink-0">
                                  <Info size={16} />
                                </span>
                                <p className="text-[11px] text-indigo-100 font-medium">اضغط على الزر للحصول على تقرير مفصل عن تطورك في الأوزان ونصائح مخصصة لجدولك.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* History List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                         <h4 className="font-bold text-slate-700 flex items-center gap-2">
                             <Calendar size={18} className="text-slate-400" />
                             سجل الشهر (30 يوم)
                         </h4>
                    </div>

                    <div className="space-y-2.5">
                        {stats.chartData.map((data) => (
                            <div key={data.date} className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                                <div className="flex items-center gap-3.5">
                                    <div className="text-center w-12 py-1 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                        <span className="block text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">{data.dayName}</span>
                                        <span className="text-xl font-black text-slate-800 group-hover:text-indigo-600">{data.dayNum}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        {reportTab === 'nutrition' ? (
                                            <>
                                                <span className="text-xs font-bold text-slate-700">{data.value > 0 ? `${data.value.toLocaleString()} سعرة` : 'لا توجد بيانات طعام'}</span>
                                                <div className="flex gap-2 items-center mt-1">
                                                    {history[data.date]?.weight && <span className="text-[9px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full font-bold">⚖️ {history[data.date].weight}kg</span>}
                                                    {history[data.date]?.waterIntake > 0 && <span className="text-[9px] bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full font-bold">💧 {(history[data.date].waterIntake/1000).toFixed(1)}L</span>}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xs font-bold text-slate-700">{data.workout && data.workout.exercises.length > 0 ? `${data.workout.exercises.length} تمارين تم إنجازها` : 'يوم راحة ☕'}</span>
                                                <div className="flex gap-1.5 flex-wrap mt-1.5">
                                                    {data.workout?.exercises.slice(0, 3).map((ex, i) => (
                                                        <span key={i} className="text-[8px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-bold border border-slate-200/50 group-hover:bg-white">{ex.muscle}</span>
                                                    ))}
                                                    {data.workout?.exercises && data.workout.exercises.length > 3 && <span className="text-[8px] text-slate-400 font-bold">+{data.workout.exercises.length - 3}</span>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {reportTab === 'workout' && data.workout && data.workout.exercises.length > 0 && (
                                    <div className="text-left flex flex-col items-end gap-1">
                                         {data.value > 0 && (
                                            <span className="text-[10px] font-black text-indigo-600">
                                                {data.value >= 1000 ? (data.value/1000).toFixed(1) + 't' : data.value + 'kg'}
                                            </span>
                                         )}
                                         {data.dayCardio > 0 && (
                                            <span className="text-[10px] font-black text-emerald-600">
                                                ⏱️ {data.dayCardio}د
                                            </span>
                                         )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};