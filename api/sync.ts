import { neon } from '@neondatabase/serverless';

/**
 * وظيفة المزامنة لـ Vercel:
 * تأكد من إضافة DATABASE_URL في إعدادات Vercel Environment Variables.
 * 
 * كود إنشاء الجدول في Neon:
 * CREATE TABLE app_data (
 *   id TEXT PRIMARY KEY,
 *   history JSONB NOT NULL,
 *   targets JSONB NOT NULL,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */

export default async function handler(req: any, res: any) {
  const sql = neon(process.env.DATABASE_URL!);
  const userId = 'user_1'; // يمكن استبداله بـ Session ID عند إضافة نظام تسجيل دخول

  if (req.method === 'POST') {
    const { history, targets } = req.body;
    try {
      await sql`
        INSERT INTO app_data (id, history, targets)
        VALUES (${userId}, ${JSON.stringify(history)}, ${JSON.stringify(targets)})
        ON CONFLICT (id) DO UPDATE 
        SET history = EXCLUDED.history, targets = EXCLUDED.targets, updated_at = CURRENT_TIMESTAMP
      `;
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await sql`SELECT history, targets FROM app_data WHERE id = ${userId}`;
      if (result.length === 0) return res.status(404).json({ error: 'No data' });
      return res.status(200).json(result[0]);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).end();
}