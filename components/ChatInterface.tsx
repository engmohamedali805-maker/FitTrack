import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { Send, ImagePlus, Loader2, Info, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, image?: File) => void;
  isToday: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  isToday
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    onSendMessage(inputText, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50/50 relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6 p-6 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-100 relative group">
                    <Sparkles className="text-white animate-pulse" size={40} />
                    <div className="absolute inset-0 bg-white opacity-20 rounded-[2.5rem] blur-xl group-hover:scale-110 transition-transform"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="font-black text-xl text-slate-800 tracking-tight">اليوم هو يوم إنجازاتك! 💪</p>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">أنا هنا لأساعدك في تحقيق أهدافك بدقة. صور وجبتك الآن أو صفها لي لنبدأ رحلة التحسين معاً.</p>
                </div>
                <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-xs font-bold text-emerald-600 animate-bounce">
                   ابدأ الآن.. لا تؤجل نجاحك! ✨
                </div>
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-slate-200'} ${msg.isError ? 'border-red-500 bg-red-50 text-red-600' : ''}`}>
              {msg.image && (
                <div className="mb-3 rounded-xl overflow-hidden shadow-sm">
                  <img src={`data:image/jpeg;base64,${msg.image}`} alt="User upload" className="w-full h-auto max-h-60 object-cover" />
                </div>
              )}
              <div className="whitespace-pre-wrap font-medium text-sm leading-7 tracking-wide" style={{ direction: 'rtl' }}>{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
             <div className="bg-white text-emerald-600 border border-emerald-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-xs font-bold animate-pulse">جاري تحليل بياناتك بدقة...</span>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4">
        {!isToday ? (
             <div className="max-w-md mx-auto p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-amber-700 text-sm flex items-center justify-center gap-2"><Info size={16} /><span>تذكير: الإضافة متاحة لليوم الحالي فقط.</span></div>
        ) : (
        <div className="max-w-md mx-auto">
          {selectedImage && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 animate-in slide-in-from-bottom-2">
              <span className="font-bold">📸 الصورة المختارة:</span>
              <span className="truncate flex-1">{selectedImage.name}</span>
              <button onClick={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-slate-400 hover:text-red-500 p-1"><span className="text-lg">×</span></button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className={`p-3.5 rounded-2xl transition-all duration-200 ${selectedImage ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}><ImagePlus size={22} /></button>
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="أخبرني ماذا أكلت اليوم أو أرسل صورة..." className="flex-1 bg-slate-100 text-slate-800 rounded-2xl p-3.5 max-h-32 min-h-[52px] focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none resize-none text-right transition-all shadow-inner placeholder:text-slate-400" rows={1} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }} />
            <button type="submit" disabled={isLoading || (!inputText.trim() && !selectedImage)} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-3.5 rounded-2xl transition-all duration-200 active:scale-95">{isLoading ? <Loader2 className="animate-spin" size={22} /> : <Send size={22} className="rtl:-scale-x-100" />}</button>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};