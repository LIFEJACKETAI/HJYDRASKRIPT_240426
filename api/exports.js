import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { book_id } = req.query;
      const query = supabase.from('exports').select('*').order('created_at', { ascending: false });
      if (book_id) query.eq('book_id', book_id);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { book_id, format, status, download_url, file_size } = req.body;
      const { data, error } = await supabase
        .from('exports')
        .insert({ book_id, format, status, download_url, file_size })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Exports API error:', err);
    res.status(500).json({ error: err.message });
  }
}