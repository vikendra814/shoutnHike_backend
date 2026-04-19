const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

const geminiGenerate = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Streaming version — yields chunks via callback
const geminiStream = async (prompt, onChunk) => {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContentStream(prompt);
  let full = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    full += text;
    onChunk(text);
  }
  return full;
};

module.exports = { geminiGenerate, geminiStream };
