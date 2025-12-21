import { neon } from '@neondatabase/serverless';

/**
 * وظيفة المزامنة لـ Vercel:
 * يتم جلب DATABASE_URL من Vercel Environment Variables.
 */

export default async function handler(req: any, res: any) {
  // التحقق من وجود رابط القاعدة
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured in Vercel settings.' });
  }

  const sql = neon(databaseUrl);
  const userId = 'user_default'; // يمكن تطويره لاحقاً لنظام مستخدمين حقيقي

  try {
    if (req.method === 'POST') {
      const { history, targets } = req.body;
      
      if (!history || !targets) {
        return res.status(400).json({ error: 'Missing history or targets data' });
      }

      await sql`
        INSERT INTO app_data (id, history, targets)
        VALUES (${userId}, ${JSON.stringify(history)}, ${JSON.stringify(targets)})
        ON CONFLICT (id) DO UPDATE 
        SET history = EXCLUDED.history, 
            targets = EXCLUDED.targets, 
            updated_at = CURRENT_TIMESTAMP
      `;
      
      return res.status(200).json({ success: true, message: 'Data synced successfully' });

    } else if (req.method === 'GET') {
      const result = await sql`SELECT history, targets FROM app_data WHERE id = ${userId} LIMIT 1`;
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'No data found for this user' });
      }
      
      return res.status(200).json(result[0]);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}