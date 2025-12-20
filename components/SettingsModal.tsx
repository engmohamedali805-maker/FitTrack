import React, { useState, useEffect } from 'react';
import { Targets } from '../types';
import { X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targets: Targets;
  onSave: (newTargets: Targets) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  targets,
  onSave,
}) => {
  const [tempTargets, setTempTargets] = useState<Targets>(targets);

  // Sync state with parent when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempTargets(targets);
    }
  }, [isOpen, targets]);

  if (!isOpen) return null;

  const handleChange = (key: keyof Targets, value: string) => {
    setTempTargets((prev) => ({
      ...prev,
      [key]: Number(value) || 0,
    }));
  };

  const handleSave = () => {
    onSave(tempTargets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-emerald-600 px-4 py-3 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg">تعديل الأهداف اليومية</h2>
          <button onClick={onClose} className="hover:bg-emerald-700 p-1 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {Object.entries(tempTargets).map(([key, value]) => {
            // Translate keys for display
            const labelMap: Record<string, string> = {
              calories: 'سعرات حرارية (kcal)',
              protein: 'بروتين (g)',
              carbs: 'كاربوهيدرات (g)',
              fat: 'دهون (g)',
              fiber: 'ألياف (g)',
              sugar: 'سكر (g)',
              sodium: 'صوديوم (mg)',
              waterTarget: 'هدف الماء (ml)'
            };
            
            return (
              <div key={key} className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  {labelMap[key] || key}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(key as keyof Targets, e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-left"
                  dir="ltr"
                />
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Check size={20} />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>
    </div>
  );
};