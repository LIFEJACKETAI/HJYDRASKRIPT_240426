import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { book_id } = req.query;
      const query = supabase.from('audiobook_jobs').select('*').order('created_at', { ascending: false });
      if (book_id) query.eq('book_id', book_id);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { book_id, chapter_id, voice_id, status, progress, audio_url, duration } = req.body;
      const { data, error } = await supabase
        .from('audiobook_jobs')
        .insert({ book_id, chapter_id, voice_id, status, progress, audio_url, duration })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('audiobook_jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Audiobooks API error:', err);
    res.status(500).json({ error: err.message });
  }
}