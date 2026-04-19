const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const openaiGenerate = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
  });
  return completion.choices[0].message.content;
};

// Streaming version
const openaiStream = async (prompt, onChunk) => {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
    stream: true,
  });
  let full = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    full += text;
    if (text) onChunk(text);
  }
  return full;
};

module.exports = { openaiGenerate, openaiStream };
