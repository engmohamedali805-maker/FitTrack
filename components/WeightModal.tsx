import React, { useState, useEffect } from 'react';
import { X, Scale, Check } from 'lucide-react';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeight?: number;
  onSave: (weight: number) => void;
  dateStr: string;
}

export const WeightModal: React.FC<WeightModalProps> = ({
  isOpen,
  onClose,
  currentWeight,
  onSave,
  dateStr
}) => {
  const [weight, setWeight] = useState<string>(currentWeight ? currentWeight.toString() : '');

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setWeight(currentWeight ? currentWeight.toString() : '');
    }
  }, [isOpen, currentWeight]);

  if (!isOpen) return null;

  const handleSave = () => {
    const val = parseFloat(weight);
    if (!isNaN(val) && val > 0) {
      onSave(val);
      onClose();
    }
  };

  const formattedDate = new Date(dateStr).toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-900 px-4 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-slate-700 p-2 rounded-xl">
                <Scale size={20} className="text-pink-400" />
            </div>
            <div>
                <h2 className="font-bold text-lg leading-tight">تسجيل الوزن</h2>
                <p className="text-xs text-slate-400">{formattedDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-slate-700 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center justify-center space-y-6">
            
            <div className="relative w-full">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className="w-full text-center text-5xl font-black text-slate-800 border-b-2 border-slate-100 py-4 focus:border-pink-500 focus:outline-none transition-colors placeholder:text-slate-200"
                  autoFocus
                  dir="ltr"
                />
                <span className="absolute bottom-6 right-0 text-slate-400 font-bold text-sm">kg</span>
            </div>

            <p className="text-xs text-slate-400 text-center">
                يُفضل قياس الوزن صباحاً قبل الأكل وبملابس خفيفة للحصول على أدق النتائج.
            </p>

            <button
                onClick={handleSave}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
                <Check size={20} />
                <span>حفظ الوزن</span>
            </button>
        </div>
      </div>
    </div>
  );
};