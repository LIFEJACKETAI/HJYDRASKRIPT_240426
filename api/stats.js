import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data: books, error: booksError } = await supabase.from('books').select('word_count');
      const { data: chapters, error: chaptersError } = await supabase.from('chapters').select('word_count');
      const { data: audiobooks, error: audioError } = await supabase.from('audiobook_jobs').select('duration');
      
      if (booksError) throw booksError;
      
      const totalBooks = books?.length || 0;
      const totalWords = (books?.reduce((sum, b) => sum + (b.word_count || 0), 0) || 0) + 
                         (chapters?.reduce((sum, c) => sum + (c.word_count || 0), 0) || 0);
      const totalAudioMinutes = audiobooks?.reduce((sum, a) => sum + (a.duration || 0), 0) || 0;
      
      return res.status(200).json({
        total_books: totalBooks,
        total_words: totalWords,
        total_audio_minutes: Math.round(totalAudioMinutes / 60),
        completed_books: books?.filter(b => b.status === 'completed').length || 0
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Stats API error:', err);
    res.status(500).json({ error: err.message });
  }
}