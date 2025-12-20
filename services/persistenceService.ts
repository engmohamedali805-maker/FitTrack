import { History, Targets } from '../types';

/**
 * خدمة إدارة البيانات:
 * تستخدم LocalStorage للاستجابة السريعة، وتتزامن مع قاعدة بيانات Neon عبر Vercel API.
 */
export const persistenceService = {
  saveLocal: (history: History, targets: Targets) => {
    localStorage.setItem('nutrition_history', JSON.stringify(history));
    localStorage.setItem('targets', JSON.stringify(targets));
  },

  loadLocal: () => {
    const history = localStorage.getItem('nutrition_history');
    const targets = localStorage.getItem('targets');
    return {
      history: history ? JSON.parse(history) as History : {},
      targets: targets ? JSON.parse(targets) as Targets : null
    };
  },

  /**
   * مزامنة البيانات مع Neon DB.
   * يتم استدعاء هذا المسار في Vercel Serverless Function.
   */
  syncWithCloud: async (history: History, targets: Targets): Promise<boolean> => {
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, targets }),
      });

      if (!response.ok) throw new Error('Sync failed');
      return true;
    } catch (error) {
      console.error('Cloud sync error:', error);
      return false;
    }
  },

  /**
   * جلب أحدث نسخة من البيانات من السحابة.
   */
  fetchFromCloud: async (): Promise<{history: History, targets: Targets} | null> => {
    try {
      const response = await fetch('/api/sync');
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Fetch cloud error:', error);
      return null;
    }
  }
};