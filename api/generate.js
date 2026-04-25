import supabase from './_supabase.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, prompt, context, style_id, book_id } = req.body;

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
  }

  try {
    await supabase.from('generation_logs').insert({
      type,
      prompt: prompt?.substring(0, 500),
      book_id,
      style_id,
    });

    const messages = buildMessages(type, prompt, context);

    const openRouterRes = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://hydraskript.com',
        'X-Title': 'HYDRASKRIPT',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: type === 'outline' ? 1200 : 900,
        temperature: 0.8,
      }),
    });

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error('OpenRouter error:', openRouterRes.status, errText);
      return res.status(502).json({ error: 'AI generation failed. Check your OpenRouter API key.' });
    }

    const data = await openRouterRes.json();
    const generated_text = data.choices?.[0]?.message?.content || '';
    const tokens_used = data.usage?.total_tokens || 0;

    res.status(200).json({ success: true, generated_text, tokens_used, model: MODEL });
  } catch (err) {
    console.error('Generate API error:', err);
    res.status(500).json({ error: err.message });
  }
}

function buildMessages(type, prompt, context = {}) {
  const { bookTitle, genre, tone, description, storyBible, content, chapterTitle, chapterNumber } = context;

  const bookCtx = [
    bookTitle && `Title: ${bookTitle}`,
    genre && `Genre: ${genre}`,
    tone && `Tone: ${tone}`,
    description && `Description: ${description}`,
  ].filter(Boolean).join('\n');

  const bibleCtx = storyBible ? [
    storyBible.characters?.length && `Characters: ${storyBible.characters.map(c => `${c.name} (${c.role})`).join(', ')}`,
    storyBible.settings?.length && `Settings: ${storyBible.settings.map(s => s.name).join(', ')}`,
    storyBible.themes?.length && `Themes: ${storyBible.themes.join(', ')}`,
    storyBible.raw_idea && `Core concept: ${storyBible.raw_idea}`,
    storyBible.voice_notes && `Voice notes: ${storyBible.voice_notes}`,
  ].filter(Boolean).join('\n') : '';

  switch (type) {
    case 'outline':
      return [
        {
          role: 'system',
          content: 'You are a professional book outline writer. Format each chapter EXACTLY as:\nChapter N: Title\nSummary sentence.\n\nReturn only the outline, no preamble.',
        },
        {
          role: 'user',
          content: `Create a chapter outline for this book:\n\n${bookCtx}\n\n${bibleCtx}\n\nGenerate 6-10 chapters that tell a complete, satisfying story arc.`,
        },
      ];

    case 'chapter':
      return [
        {
          role: 'system',
          content: `You are a skilled ${genre || 'fiction'} writer. Write vivid, engaging prose in a ${tone || 'compelling'} tone. Write complete paragraphs, no placeholders.`,
        },
        {
          role: 'user',
          content: `Write Chapter ${chapterNumber}: "${chapterTitle}" for "${bookTitle}".\n\n${bibleCtx}\n\n${prompt || "Write the chapter opening, setting the scene and introducing the chapter's central conflict."}`,
        },
      ];

    case 'continue':
      return [
        {
          role: 'system',
          content: 'Continue the story seamlessly from where it ends. Match the existing style, voice, and pacing exactly. Write 2-3 paragraphs. Return only the new text.',
        },
        {
          role: 'user',
          content: `Continue this story:\n\n${(content || '').slice(-1500)}${bibleCtx ? `\n\nBook context:\n${bibleCtx}` : ''}`,
        },
      ];

    case 'expand':
      return [
        {
          role: 'system',
          content: "Expand the provided text with richer sensory detail, deeper character interiority, and more vivid description. Preserve the author's voice. Return the expanded version only.",
        },
        {
          role: 'user',
          content: `Expand this passage:\n\n${content || ''}`,
        },
      ];

    case 'rewrite':
      return [
        {
          role: 'system',
          content: `Rewrite the provided text to improve flow, clarity, and impact while keeping the core story beats and ${tone || 'original'} tone. Return the rewritten version only.`,
        },
        {
          role: 'user',
          content: `Rewrite this passage:\n\n${content || ''}`,
        },
      ];

    default:
      return [
        {
          role: 'system',
          content: `You are a skilled ${genre || 'fiction'} writer working on "${bookTitle || 'a book'}".`,
        },
        {
          role: 'user',
          content: prompt || 'Write something creative.',
        },
      ];
  }
}
