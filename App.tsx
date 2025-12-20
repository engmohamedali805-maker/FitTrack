import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { SettingsModal } from './components/SettingsModal';
import { analyzeFood } from './services/geminiService';
import { persistenceService } from './services/persistenceService';
import { 
  ChatMessage, 
  DailyLog, 
  History,
  Targets, 
  DEFAULT_TARGETS, 
  INITIAL_DAILY_LOG,
  WorkoutLog
} from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<History>({});
  const [currentDateStr, setCurrentDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [targets, setTargets] = useState<Targets>(DEFAULT_TARGETS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const isToday = currentDateStr === new Date().toISOString().split('T')[0];
  const currentLog = history[currentDateStr] || INITIAL_DAILY_LOG;

  // تحميل البيانات عند البدء
  useEffect(() => {
    const local = persistenceService.loadLocal();
    if (local.history) setHistory(local.history);
    if (local.targets) setTargets(local.targets);

    // محاولة الجلب من السحابة (Neon)
    persistenceService.fetchFromCloud().then(cloudData => {
      if (cloudData) {
        setHistory(cloudData.history);
        setTargets(cloudData.targets);
      }
    });

    if (!localStorage.getItem('hasVisited_v4')) {
      setMessages([{
        id: 'init',
        role: 'model',
        text: 'مرحباً بك! 🚀 تم تفعيل المزامنة السحابية مع قاعدة بيانات Neon. بياناتك الآن محفوظة في السحابة وتعمل حتى لو مسحت بيانات المتصفح.'
      }]);
      localStorage.setItem('hasVisited_v4', 'true');
    }
  }, []);

  // الحفظ المحلي والمزامنة السحابية (مع تأخير Debounce)
  useEffect(() => {
    persistenceService.saveLocal(history, targets);
    
    const syncTimer = setTimeout(() => {
      if (Object.keys(history).length > 0) {
        setSyncStatus('syncing');
        persistenceService.syncWithCloud(history, targets).then(success => {
          setSyncStatus(success ? 'success' : 'error');
          if (success) setTimeout(() => setSyncStatus('idle'), 3000);
        });
      }
    }, 2000); // انتظر ثانيتين من الثبات قبل الرفع للسحابة

    return () => clearTimeout(syncTimer);
  }, [history, targets]);

  const handleDateChange = (offset: number) => {
    const date = new Date(currentDateStr);
    date.setDate(date.getDate() + offset);
    setCurrentDateStr(date.toISOString().split('T')[0]);
  };

  const handleWaterUpdate = (amount: number) => {
    if (!isToday) return;
    setHistory(prev => ({
      ...prev,
      [currentDateStr]: {
        ...(prev[currentDateStr] || INITIAL_DAILY_LOG),
        waterIntake: Math.max(0, (prev[currentDateStr]?.waterIntake || 0) + amount)
      }
    }));
  };

  const handleWeightUpdate = (weight: number) => {
    setHistory(prev => ({
      ...prev,
      [currentDateStr]: {
        ...(prev[currentDateStr] || INITIAL_DAILY_LOG),
        weight: weight
      }
    }));
  };

  const handleWorkoutSave = (workout: WorkoutLog) => {
    setHistory(prev => ({
      ...prev,
      [currentDateStr]: {
        ...(prev[currentDateStr] || INITIAL_DAILY_LOG),
        workout: workout
      }
    }));
  };

  const handleSupplementToggle = (key: 'creatine' | 'multivitamin') => {
    if (!isToday) return;
    setHistory(prev => {
      const log = prev[currentDateStr] || INITIAL_DAILY_LOG;
      return {
        ...prev,
        [currentDateStr]: {
          ...log,
          supplements: { ...(log.supplements || {creatine:false, multivitamin:false}), [key]: !(log.supplements?.[key]) }
        }
      };
    });
  };

  const handleSendMessage = async (text: string, imageFile?: File) => {
    if (!isToday) return;
    const newMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    let base64Image: string | undefined;
    if (imageFile) {
      const reader = new FileReader();
      base64Image = await new Promise(resolve => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
      newMessage.image = base64Image;
    }
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    try {
      const response = await analyzeFood(messages, text, base64Image, targets, currentLog);
      setMessages(prev => [...prev, { id: Date.now().toString() + '_ai', role: 'model', text: response.text }]);
      if (response.json) {
        setHistory(prev => ({
          ...prev,
          [currentDateStr]: { ...INITIAL_DAILY_LOG, ...(prev[currentDateStr] || {}), ...response.json }
        }));
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: 'خطأ في الاتصال.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden" dir="rtl">
      <Dashboard 
        dailyLog={currentLog} 
        history={history}
        targets={targets}
        dateStr={currentDateStr}
        isToday={isToday}
        syncStatus={syncStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPrevDay={() => handleDateChange(-1)}
        onNextDay={() => handleDateChange(1)}
        onWaterUpdate={handleWaterUpdate}
        onSupplementToggle={handleSupplementToggle}
        onWeightUpdate={handleWeightUpdate}
        onWorkoutSave={handleWorkoutSave}
      />
      <ChatInterface messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} isToday={isToday} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} targets={targets} onSave={setTargets} />
    </div>
  );
};

export default App;