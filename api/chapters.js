import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { book_id } = req.query;
      const query = supabase.from('chapters').select('*').order('chapter_number', { ascending: true });
      if (book_id) query.eq('book_id', book_id);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { book_id, title, content, chapter_number, summary } = req.body;
      const word_count = content ? content.trim().split(/\s+/).length : 0;
      const { data, error } = await supabase
        .from('chapters')
        .insert({ book_id, title, content, chapter_number, summary, word_count, status: 'draft' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, content, ...updates } = req.body;
      const word_count = content ? content.trim().split(/\s+/).length : undefined;
      const updateData = { ...updates };
      if (content !== undefined) updateData.content = content;
      if (word_count !== undefined) updateData.word_count = word_count;
      
      const { data, error } = await supabase
        .from('chapters')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('chapters').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Chapters API error:', err);
    res.status(500).json({ error: err.message });
  }
}