import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { book_id } = req.query;
      const query = supabase.from('story_bibles').select('*');
      if (book_id) query.eq('book_id', book_id);
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw error;
      return res.status(200).json(data || null);
    }

    if (req.method === 'POST') {
      const { book_id, characters, settings, themes, voice_notes, raw_idea, outline } = req.body;
      const { data, error } = await supabase
        .from('story_bibles')
        .insert({ book_id, characters, settings, themes, voice_notes, raw_idea, outline })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('story_bibles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Story Bible API error:', err);
    res.status(500).json({ error: err.message });
  }
}