import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, prompt, context, style_id, book_id } = req.body;

    // Log the generation request
    await supabase.from('generation_logs').insert({
      type,
      prompt: prompt?.substring(0, 500),
      book_id,
      style_id,
    });

    // Simulate AI generation response
    // In production, this would call OpenRouter or similar
    const response = {
      success: true,
      generated_text: generateMockResponse(type, prompt),
      tokens_used: Math.floor(Math.random() * 1000) + 500,
      model: 'grok-2',
    };

    res.status(200).json(response);
  } catch (err) {
    console.error('Generate API error:', err);
    res.status(500).json({ error: err.message });
  }
}

function generateMockResponse(type, prompt) {
  const responses = {
    outline: `Chapter 1: The Beginning
The story opens with our protagonist discovering an unusual artifact that will change their life forever.

Chapter 2: Rising Action
Strange events begin to occur, drawing the protagonist deeper into a mystery they don't understand.

Chapter 3: The Discovery
The true nature of the artifact is revealed, along with its dangerous implications.

Chapter 4: Confrontation
The protagonist must face those who seek to control the artifact's power.

Chapter 5: Resolution
A bittersweet ending that sets up the next chapter in the saga.`,

    chapter: `The rain fell in sheets against the window, each drop a tiny drumbeat in the symphony of the storm. Sarah stood at the glass, watching the city dissolve into watercolor grays and blues.

She hadn't expected the package. Hadn't expected anything, really, not since the incident. But there it sat on her kitchen table: a plain brown box, no return address, her name written in handwriting she almost recognized.

The tape gave way with a satisfying rip. Inside, nestled in layers of yellowed newspaper, was something that made her breath catch in her throat.

It couldn't be. It was impossible.

And yet, there it was.

The clock she'd lost twenty years ago, in the fire that took everything else. The clock that had belonged to her grandmother, and her grandmother before her. The clock that was supposed to have melted into slag along with the rest of her childhood.

It ticked now, loud in the silent apartment, marking seconds that suddenly felt very precious indeed.`,

    rewrite: `The storm battered the window with relentless force. Sarah watched the city blur into abstract shades of gray and blue, lost in thoughts she couldn't quite articulate.

The package shouldn't have surprised her. Nothing should have, not anymore. But surprise her it did—a simple cardboard box resting on her table, anonymous except for her name written in almost-familiar script.

She opened it.

Inside, cushioned by aged newspaper, lay an impossibility.

The clock. Her grandmother's clock. The one destroyed in the fire two decades past, consumed by flames that took her entire history with them.

Yet here it ticked, loud and insistent, counting moments that suddenly seemed freighted with meaning she couldn't quite grasp.`,

    expand: `The rain fell in sheets against the window, each drop a tiny drumbeat in the symphony of the storm. The sound was hypnotic, relentless, a natural percussion that had accompanied humanity through millennia of sheltering indoors. Sarah stood at the glass, watching the city dissolve into watercolor grays and blues, the streetlights halos in the mist, the cars below reduced to abstract smears of red and white light.

She hadn't expected the package. Hadn't expected anything, really, not since the incident that had stripped her life down to its barest essentials. But there it sat on her kitchen table: a plain brown box, no return address, her name written in handwriting she almost recognized—a looping, elegant script that tugged at memories she thought she'd buried long ago.

The tape gave way with a satisfying rip, the sound sharp against the rain's white noise. Inside, nestled in layers of yellowed newspaper dated from years before her birth, was something that made her breath catch in her throat and her hands begin to shake.`,

    continue: `She reached for it, her fingers hovering over the smooth, cool surface. The ticking seemed to grow louder, syncopating with her own heartbeat. When she finally touched it—when her skin made contact with the brass casing that had survived what nothing else had—she felt something shift. Not in the room. In the world. Or perhaps in the fabric of reality itself.

The second hand stuttered. Paused. Reversed.

Sarah jerked her hand back, but it was too late. The clock was glowing now, faint but unmistakable, a soft luminescence that shouldn't exist, couldn't exist, in any rational universe. And yet.

The air pressure dropped. Her ears popped. And in the reflection of the window, superimposed over the rain-streaked cityscape, she saw a face she knew intimately but had never met.

Her own face. Twenty years younger. Terrified.`,
  };

  return responses[type] || responses.chapter;
}