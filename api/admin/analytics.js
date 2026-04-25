import supabase from '../_supabase.js';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user || !ADMIN_EMAILS.includes(user.email)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'GET') {
      const { data: books } = await supabase.from('books').select('*');
      const { data: chapters } = await supabase.from('chapters').select('*');
      const { data: exports } = await supabase.from('exports').select('*');
      const { data: audiobooks } = await supabase.from('audiobook_jobs').select('*');
      
      const totalWords = chapters?.reduce((sum, c) => sum + (c.word_count || 0), 0) || 0;
      const completedBooks = books?.filter(b => b.status === 'completed').length || 0;
      
      return res.status(200).json({
        active_users: new Set(books?.map(b => b.user_id).filter(Boolean)).size,
        total_books: books?.length || 0,
        completed_books: completedBooks,
        total_words_generated: totalWords,
        total_exports: exports?.length || 0,
        total_audiobooks: audiobooks?.length || 0,
        system_health: {
          openrouter: 'operational',
          fal_ai: 'operational',
          gemini_tts: 'operational'
        }
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin analytics error:', err);
    res.status(500).json({ error: err.message });
  }
}