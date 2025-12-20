import React, { useState, useEffect } from 'react';
import { WorkoutLog, WorkoutExercise, ExerciseSet, WorkoutTemplate } from '../types';
import { EXERCISE_DB, ExerciseDefinition } from '../data/exercises';
import { X, Dumbbell, Plus, Search, Trash2, CheckCircle2, Circle, Copy, ChevronDown, ChevronUp, Save, Layout, Zap, Layers, ArrowRight, Clock, Gauge, ArrowUpRight } from 'lucide-react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutData?: WorkoutLog;
  onSave: (workout: WorkoutLog) => void;
  dateStr: string;
}

const MuscleIcon: React.FC<{ muscle: string }> = ({ muscle }) => {
  const bodyColor = "#cbd5e1"; 
  const highlightColor = "#ef4444"; 

  const musclePaths: Record<string, React.ReactNode> = {
    'Chest': (
      <><path d="M15 10 Q25 15 35 10 L33 35 L17 35 Z" fill={bodyColor} opacity="0.5" /><path d="M17 12 Q25 18 33 12 L32 20 Q25 22 18 20 Z" fill={highlightColor} /></>
    ),
    'Back': (
      <><path d="M12 10 L38 10 L34 30 L16 30 Z" fill={bodyColor} opacity="0.5" /><path d="M13 11 L18 25 L32 25 L37 11 L25 25 L13 11 Z" fill={highlightColor} /></>
    ),
    'Legs': (
      <><path d="M15 10 L35 10 L35 15 L15 15 Z" fill={bodyColor} opacity="0.5" /><path d="M16 16 L23 16 L22 40 L17 40 Z" fill={highlightColor} /><path d="M27 16 L34 16 L33 40 L28 40 Z" fill={highlightColor} /></>
    ),
    'Shoulders': (
      <><path d="M18 15 L32 15 L30 35 L20 35 Z" fill={bodyColor} opacity="0.5" /><circle cx="15" cy="14" r="4" fill={highlightColor} /><circle cx="35" cy="14" r="4" fill={highlightColor} /></>
    ),
    'Arms': (
      <><path d="M20 10 L30 10 L28 30 L22 30 Z" fill={bodyColor} opacity="0.5" /><path d="M15 12 L12 25 L16 25 Z" fill={highlightColor} /><path d="M35 12 L38 25 L34 25 Z" fill={highlightColor} /></>
    ),
    'Core': (
      <><path d="M15 10 L35 10 L33 35 L17 35 Z" fill={bodyColor} opacity="0.3" /><rect x="20" y="15" width="10" height="15" rx="2" fill={highlightColor} /><path d="M20 20 H30 M20 25 H30 M25 15 V30" stroke="white" strokeWidth="1" opacity="0.5" /></>
    ),
    'Cardio': (
      <><path d="M25 15 C22 10 15 10 15 20 C15 30 25 40 25 40 C25 40 35 30 35 20 C35 10 28 10 25 15 Z" fill={highlightColor} /><path d="M10 25 L15 25 L18 18 L22 32 L26 22 L30 25 L40 25" stroke={highlightColor} strokeWidth="2" fill="none" className="animate-pulse"/></>
    )
  };

  return <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-sm">{musclePaths[muscle] || <circle cx="25" cy="25" r="15" fill={bodyColor} />}</svg>;
};

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose, workoutData, onSave, dateStr }) => {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'cardio' | 'core'>('all');
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [savingRoutineName, setSavingRoutineName] = useState<string | null>(null);

  const getDefaultTemplates = (): WorkoutTemplate[] => {
    const createSets = (count: number, reps: number) => {
        return Array.from({ length: count }).map(() => ({
            id: Math.random().toString(36).substr(2, 9),
            weight: 0,
            reps: reps,
            completed: false
        }));
    };

    return [
      // User's Custom 4-Day Plan
      {
        id: 'user_day_1',
        name: 'Day 1: Push (دفع)',
        exercises: [
          { id: 'u1_1', exerciseId: 'chest_press_machine', name: 'Chest Press Machine', muscle: 'Chest', sets: createSets(3, 10) },
          { id: 'u1_2', exerciseId: 'decline_cable_press', name: 'Decline Cable Press Full', muscle: 'Chest', sets: createSets(3, 10) },
          { id: 'u1_3', exerciseId: 'front_shoulder_press_machine', name: 'Front Shoulder Presses Machine', muscle: 'Shoulders', sets: createSets(3, 10) },
          { id: 'u1_4', exerciseId: 'lateral_raises_bench', name: 'Lateral Raises On Bench Shoulder', muscle: 'Shoulders', sets: createSets(3, 12) },
          { id: 'u1_5', exerciseId: 'tricep_rope_pushdown', name: 'Triceps Rope Pushdown', muscle: 'Arms', sets: createSets(3, 10) },
          { id: 'u1_6', exerciseId: 'tricep_cable_overhead', name: 'Seated Triceps Cable Overhead Extension', muscle: 'Arms', sets: createSets(3, 12) },
          { id: 'u1_7', exerciseId: 'crunches', name: 'Crunches', muscle: 'Core', sets: createSets(3, 20) },
        ]
      },
      {
        id: 'user_day_2',
        name: 'Day 2: Pull (سحب)',
        exercises: [
          { id: 'u2_1', exerciseId: 'lat_pulldown_wide', name: 'Lat Pull Down Wide', muscle: 'Back', sets: createSets(3, 10) },
          { id: 'u2_2', exerciseId: 'seated_row_neutral', name: 'Seated Rows Neutral Grip 11', muscle: 'Back', sets: createSets(3, 10) },
          { id: 'u2_3', exerciseId: 'seated_row_wide', name: 'Seated Row Wide Grip', muscle: 'Back', sets: createSets(3, 10) },
          { id: 'u2_4', exerciseId: 'back_extension', name: 'Back Extension Glutes & Hamstring', muscle: 'Back', sets: createSets(3, 12) },
          { id: 'u2_5', exerciseId: 'rear_delt_fly_machine', name: 'Rear Delt Fly Machine', muscle: 'Shoulders', sets: createSets(3, 10) },
          { id: 'u2_6', exerciseId: 'bicep_incline_db_curl', name: 'Biceps Inclined Dumbbell Curls', muscle: 'Arms', sets: createSets(3, 10) },
          { id: 'u2_7', exerciseId: 'preacher_curl_machine', name: 'Preacher Curl Machine', muscle: 'Arms', sets: createSets(3, 10) },
        ]
      },
      {
        id: 'user_day_3',
        name: 'Day 3: Legs & Core (أرجل وبطن)',
        exercises: [
          { id: 'u3_1', exerciseId: 'db_rdl', name: 'Dumbbell Romanian Deadlift', muscle: 'Legs', sets: createSets(3, 15) },
          { id: 'u3_2', exerciseId: 'seated_leg_curl', name: 'Seated Leg Curl Down', muscle: 'Legs', sets: createSets(3, 10) },
          { id: 'u3_3', exerciseId: 'leg_extensions', name: 'Leg Extensions', muscle: 'Legs', sets: createSets(3, 12) },
          { id: 'u3_4', exerciseId: 'machine_abduction', name: 'Machine Abductions', muscle: 'Legs', sets: createSets(3, 10) },
          { id: 'u3_5', exerciseId: 'standing_calf_raise_db', name: 'Standing Calf Raises With Dumbbell', muscle: 'Legs', sets: createSets(4, 15) },
          { id: 'u3_6', exerciseId: 'russian_twist', name: 'Russian Twist Exercise', muscle: 'Core', sets: createSets(3, 20) },
          { id: 'u3_7', exerciseId: 'plank', name: 'Plank Core', muscle: 'Core', sets: createSets(3, 60) },
        ]
      },
      {
        id: 'user_day_4',
        name: 'Day 4: Full Body (جسم كامل)',
        exercises: [
          { id: 'u4_1', exerciseId: 'leg_press', name: 'Leg Presses', muscle: 'Legs', sets: createSets(3, 10) },
          { id: 'u4_2', exerciseId: 'seated_calf_raise', name: 'Seated Calf Raise', muscle: 'Legs', sets: createSets(3, 20) },
          { id: 'u4_3', exerciseId: 'decline_cable_fly', name: 'Decline Cable Flys', muscle: 'Chest', sets: createSets(3, 10) },
          { id: 'u4_4', exerciseId: 'chest_press_machine', name: 'Chest Press Machine', muscle: 'Chest', sets: createSets(3, 10) },
          { id: 'u4_5', exerciseId: 'lat_pulldown_close', name: 'Lat Pulldown Close Grip (11)', muscle: 'Back', sets: createSets(3, 10) },
          { id: 'u4_6', exerciseId: 'rows_machine_wide', name: 'Rows Machine Wide Grip', muscle: 'Back', sets: createSets(3, 10) },
          { id: 'u4_7', exerciseId: 'cable_curl_pronated', name: 'Cable Curl Pronated Grip', muscle: 'Arms', sets: createSets(3, 15) },
        ]
      },
      // Arnold Split
      {
        id: 'arnold_1',
        name: 'Arnold: Chest & Back (صدر وظهر)',
        exercises: [
          { id: 'a1_1', exerciseId: 'bench_press', name: 'Barbell Bench Press', muscle: 'Chest', sets: createSets(3, 10) },
          { id: 'a1_2', exerciseId: 'lat_pulldown_wide', name: 'Lat Pull Down Wide', muscle: 'Back', sets: createSets(3, 10) },
        ]
      },
      // Upper / Lower
      {
        id: 'ul_1',
        name: 'Upper Body (جسم علوي)',
        exercises: [
          { id: 'u1_0', exerciseId: 'chest_press_machine', name: 'Chest Press Machine', muscle: 'Chest', sets: createSets(3, 10) },
          { id: 'u1_1', exerciseId: 'lat_pulldown_wide', name: 'Lat Pull Down Wide', muscle: 'Back', sets: createSets(3, 10) },
        ]
      }
    ];
  };

  useEffect(() => {
    if (isOpen) {
      setExercises(workoutData?.exercises || []);
      setIsAddingExercise(false);
      setSearchTerm('');
      setActiveTab('all');
      
      const savedTemplates = localStorage.getItem('workout_templates');
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      } else {
        const defaults = getDefaultTemplates();
        setTemplates(defaults);
        localStorage.setItem('workout_templates', JSON.stringify(defaults));
      }
    }
  }, [isOpen, workoutData]);

  if (!isOpen) return null;

  const handleSaveRoutine = (name: string) => {
    if (exercises.length === 0) return;
    const templateExercises = exercises.map(ex => ({
      ...ex,
      id: Math.random().toString(36).substr(2, 9),
      sets: ex.sets.map(s => ({ ...s, completed: false, id: Math.random().toString(36).substr(2, 9) }))
    }));

    const newTemplate: WorkoutTemplate = { id: Date.now().toString(), name, exercises: templateExercises };
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('workout_templates', JSON.stringify(updatedTemplates));
    setSavingRoutineName(null);
  };

  const handleLoadRoutine = (template: WorkoutTemplate) => {
    const newExercises = template.exercises.map(ex => ({
      ...ex,
      id: Math.random().toString(36).substr(2, 9),
      sets: ex.sets.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 9), completed: false }))
    }));
    setExercises(prev => [...prev, ...newExercises]);
    setIsAddingExercise(false);
  };

  const handleAddExercise = (def: ExerciseDefinition) => {
    const isCardio = def.muscle === 'Cardio';
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      exerciseId: def.id,
      name: def.name,
      muscle: def.muscle,
      sets: [
        isCardio 
          ? { id: Math.random().toString(36).substr(2, 9), time: 0, speed: 0, incline: 0, completed: false }
          : { id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, completed: false }
      ]
    };
    setExercises(prev => [...prev, newExercise]);
    setExpandedExerciseId(newExercise.id);
    setIsAddingExercise(false);
  };

  const handleUpdateSet = (exerciseId: string, setId: string, field: keyof ExerciseSet, value: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s) };
    }));
  };

  const handleToggleSet = (exerciseId: string, setId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s) };
    }));
  };

  const handleAddSet = (ex: WorkoutExercise) => {
    const lastSet = ex.sets[ex.sets.length - 1];
    const newSet: ExerciseSet = {
      id: Math.random().toString(36).substr(2, 9),
      weight: lastSet?.weight ?? 0,
      reps: lastSet?.reps ?? 0,
      time: lastSet?.time ?? 0,
      speed: lastSet?.speed ?? 0,
      incline: lastSet?.incline ?? 0,
      completed: false
    };
    setExercises(prev => prev.map(e => e.id === ex.id ? { ...e, sets: [...e.sets, newSet] } : e));
  };

  const formattedDate = new Date(dateStr).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen flex flex-col bg-slate-50 overflow-hidden animate-in slide-in-from-bottom-full duration-300">
      <div className="bg-slate-900 px-4 py-4 flex justify-between items-center text-white shrink-0 shadow-md safe-top">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl"><Dumbbell size={24} /></div>
          <div>
            <h2 className="font-bold text-lg leading-tight">تمرين اليوم</h2>
            <p className="text-xs text-slate-400">{formattedDate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isAddingExercise && (
            <button onClick={() => setIsAddingExercise(true)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300 transition-colors">
              <Plus size={20} />
            </button>
          )}
          {exercises.length > 0 && !isAddingExercise && (
            <button onClick={() => setSavingRoutineName('')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-indigo-300 transition-colors">
              <Save size={20} />
            </button>
          )}
          <button onClick={onClose} className="hover:bg-slate-700 p-2 rounded-full"><X size={24} /></button>
        </div>
      </div>

      {savingRoutineName !== null && (
        <div className="bg-indigo-600 p-4 text-white flex items-center gap-3 animate-in slide-in-from-top duration-300">
           <Layers size={20} />
           <input 
             type="text" 
             autoFocus
             placeholder="اسم الروتين الجديد..." 
             className="bg-indigo-700 border-none rounded-lg px-3 py-2 flex-1 text-white placeholder:text-indigo-300 outline-none text-right"
             value={savingRoutineName}
             onChange={(e) => setSavingRoutineName(e.target.value)}
           />
           <button onClick={() => handleSaveRoutine(savingRoutineName || 'روتين جديد')} className="bg-white text-indigo-600 p-2 rounded-lg font-bold"><CheckCircle2 size={20}/></button>
           <button onClick={() => setSavingRoutineName(null)} className="p-2"><X size={20}/></button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {exercises.length === 0 && !isAddingExercise && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center shadow-inner"><Dumbbell size={40} /></div>
            <div className="text-center"><h3 className="font-bold text-slate-700">ابدأ التمرين!</h3><p className="text-sm">أضف تمارين أو حمل روتينك.</p></div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button onClick={() => { setIsAddingExercise(true); setActiveTab('templates'); }} className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-700 transition-colors"><Layers size={20}/> استعراض الروتينات</button>
              <button onClick={() => setIsAddingExercise(true)} className="bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"><Plus size={20}/> إضافة تمرين يدوي</button>
            </div>
          </div>
        )}

        {exercises.map((ex) => {
          const isCardio = ex.muscle === 'Cardio';
          return (
            <div key={ex.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center" onClick={() => setExpandedExerciseId(expandedExerciseId === ex.id ? null : ex.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border p-1"><MuscleIcon muscle={ex.muscle} /></div>
                  <div><h3 className="font-bold text-slate-700 text-sm">{ex.name}</h3><span className="text-[10px] text-slate-400 font-bold uppercase">{ex.muscle}</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setExercises(prev => prev.filter(item => item.id !== ex.id)); }} className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                  {expandedExerciseId === ex.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>
              
              {expandedExerciseId === ex.id && (
                <div className="p-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-12 gap-2 mb-2 px-2 text-[10px] font-black text-slate-400 uppercase text-center">
                    <div className="col-span-1">#</div>
                    {isCardio ? (
                      <>
                        <div className="col-span-3">دقيقة</div>
                        <div className="col-span-3">سرعة</div>
                        <div className="col-span-3">ميل</div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-4">الوزن (kg)</div>
                        <div className="col-span-4">العدات</div>
                      </>
                    )}
                    <div className="col-span-2">تم</div>
                  </div>
                  {ex.sets.map((set, idx) => (
                    <div key={set.id} className={`grid grid-cols-12 gap-2 items-center mb-2 p-2 rounded-xl transition-colors ${set.completed ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                      <div className="col-span-1 text-xs font-black text-slate-400 text-center">{idx + 1}</div>
                      {isCardio ? (
                        <>
                          <div className="col-span-3"><input type="number" value={set.time || ''} placeholder="0" onChange={(e) => handleUpdateSet(ex.id, set.id, 'time', parseFloat(e.target.value))} className="w-full text-center py-2.5 bg-white rounded-lg border-none shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" /></div>
                          <div className="col-span-3"><input type="number" value={set.speed || ''} placeholder="0" onChange={(e) => handleUpdateSet(ex.id, set.id, 'speed', parseFloat(e.target.value))} className="w-full text-center py-2.5 bg-white rounded-lg border-none shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" /></div>
                          <div className="col-span-3"><input type="number" value={set.incline || ''} placeholder="0" onChange={(e) => handleUpdateSet(ex.id, set.id, 'incline', parseFloat(e.target.value))} className="w-full text-center py-2.5 bg-white rounded-lg border-none shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" /></div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-4"><input type="number" value={set.weight || ''} placeholder="0" onChange={(e) => handleUpdateSet(ex.id, set.id, 'weight', parseFloat(e.target.value))} className="w-full text-center py-2.5 bg-white rounded-lg border-none shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" /></div>
                          <div className="col-span-4"><input type="number" value={set.reps || ''} placeholder="0" onChange={(e) => handleUpdateSet(ex.id, set.id, 'reps', parseFloat(e.target.value))} className="w-full text-center py-2.5 bg-white rounded-lg border-none shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" /></div>
                        </>
                      )}
                      <div className="col-span-2 flex justify-center">
                        <button onClick={() => handleToggleSet(ex.id, set.id)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white border border-slate-200 text-transparent'}`}><CheckCircle2 size={18} strokeWidth={2.5} /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddSet(ex)} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:bg-slate-50 transition-colors mt-2">+ إضافة مجموعة جديدة</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isAddingExercise && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          <button onClick={() => onSave({ exercises })} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 active:scale-95 transition-all"><CheckCircle2 size={22}/> إنهاء وحفظ التمرين</button>
        </div>
      )}

      {isAddingExercise && (
        <div className="absolute inset-0 bg-white z-40 flex flex-col animate-in slide-in-from-bottom-full duration-400">
          <div className="p-4 border-b space-y-4 bg-slate-50">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="ابحث عن تمرين..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white rounded-2xl py-3.5 pl-10 pr-4 outline-none border border-slate-200 shadow-sm font-medium" dir="ltr" />
              </div>
              <button onClick={() => setIsAddingExercise(false)} className="font-bold text-slate-500 px-2">إلغاء</button>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button onClick={() => setActiveTab('all')} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border text-slate-500'}`}>الكل</button>
              <button onClick={() => setActiveTab('templates')} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'templates' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border text-slate-500'}`}>الروتينات المحفوظة</button>
              <button onClick={() => setActiveTab('cardio')} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'cardio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border text-slate-500'}`}>كارديو</button>
              <button onClick={() => setActiveTab('core')} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'core' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border text-slate-500'}`}>بطن</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {activeTab === 'templates' ? (
              templates.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600"><Layers size={20} /></div>
                    <div><h4 className="font-bold text-slate-700">{t.name}</h4><p className="text-[10px] text-slate-400 font-bold uppercase">{t.exercises.length} تمارين مبرمجة</p></div>
                  </div>
                  <button onClick={() => handleLoadRoutine(t)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all">تحميل</button>
                </div>
              ))
            ) : (
              EXERCISE_DB.filter(e => {
                const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
                if(activeTab === 'cardio') return e.muscle === 'Cardio' && matchesSearch;
                if(activeTab === 'core') return e.muscle === 'Core' && matchesSearch;
                return matchesSearch;
              }).map(e => (
                <button key={e.id} onClick={() => handleAddExercise(e)} className="w-full flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 p-2 group-hover:bg-white transition-colors"><MuscleIcon muscle={e.muscle}/></div>
                    <div className="text-right">
                      <span className="font-bold text-slate-700 block text-sm">{e.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{e.muscle}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all"><Plus size={18} /></div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};