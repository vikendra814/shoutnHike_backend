const Generation = require('../models/Generation');
const User = require('../models/User');
const { geminiGenerate, geminiStream } = require('../services/geminiService');
const { openaiGenerate, openaiStream } = require('../services/openaiService');
const {
  buildSocialMediaPrompt,
  buildSEOPrompt,
  buildGoogleAdsPrompt,
  buildDesignBriefPrompt,
} = require('../services/promptBuilders');

const MODULE_PROMPTS = {
  'social-media': buildSocialMediaPrompt,
  seo: buildSEOPrompt,
  'google-ads': buildGoogleAdsPrompt,
  'design-brief': buildDesignBriefPrompt,
};

const parseJSON = (raw) => {
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { raw };
  }
};

// Standard generation (non-streaming)
const generate = async (req, res) => {
  const { module, provider = 'gemini', input } = req.body;

  if (!MODULE_PROMPTS[module])
    return res.status(400).json({ success: false, message: 'Invalid module' });

  try {
    const user = await User.findById(req.user._id);
    if (!user.hasQuota())
      return res.status(403).json({
        success: false,
        message: 'Quota exceeded. Upgrade to Pro for more generations.',
        quotaExceeded: true,
      });

    const prompt = MODULE_PROMPTS[module](input);
    let rawOutput;

    if (provider === 'openai') {
      try {
        rawOutput = await openaiGenerate(prompt);
      } catch (openaiErr) {
        if (openaiErr.status === 429 || openaiErr.message?.includes('429')) {
          rawOutput = await geminiGenerate(prompt);
        } else {
          throw openaiErr;
        }
      }
    } else {
      rawOutput = await geminiGenerate(prompt);
    }

    const output = parseJSON(rawOutput);
    user.usageCount += 1;
    await user.save();

    const gen = await Generation.create({ user: user._id, module, provider, input, output });

    res.json({
      success: true,
      data: output,
      generationId: gen._id,
      usage: { used: user.usageCount, limit: user.quotaLimit },
    });
  } catch (err) {
    console.error('[AI generate error]', err?.message || err);
    const isQuotaErr = err.message?.includes('quota') || err.message?.includes('429') || err.status === 429;
    res.status(isQuotaErr ? 429 : 500).json({
      success: false,
      message: isQuotaErr ? 'AI provider quota exceeded. Try again later.' : 'AI generation failed. Please try again.',
    });
  }
};

// Streaming generation via SSE
const generateStream = async (req, res) => {
  const { module, provider = 'gemini', input } = req.body;

  if (!MODULE_PROMPTS[module])
    return res.status(400).json({ success: false, message: 'Invalid module' });

  const user = await User.findById(req.user._id);
  if (!user.hasQuota())
    return res.status(403).json({
      success: false,
      message: 'Quota exceeded. Upgrade to Pro.',
      quotaExceeded: true,
    });

  const prompt = MODULE_PROMPTS[module](input);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    let fullText = '';
    const onChunk = (chunk) => {
      fullText += chunk;
      send('chunk', { text: chunk });
    };

    if (provider === 'openai') {
      try {
        await openaiStream(prompt, onChunk);
      } catch (openaiErr) {
        if (openaiErr.status === 429 || openaiErr.message?.includes('429')) {
          send('info', { message: 'OpenAI quota exceeded — falling back to Gemini...' });
          fullText = '';
          await geminiStream(prompt, onChunk);
        } else {
          throw openaiErr;
        }
      }
    } else {
      await geminiStream(prompt, onChunk);
    }

    const output = parseJSON(fullText);

    user.usageCount += 1;
    await user.save();

    const gen = await Generation.create({
      user: user._id,
      module,
      provider,
      input,
      output,
    });

    send('done', {
      data: output,
      generationId: gen._id,
      usage: { used: user.usageCount, limit: user.quotaLimit },
    });
    res.end();
  } catch (err) {
    console.error('[AI stream error]', err?.message || err);
    send('error', { message: err.message || 'AI generation failed. Please try again.' });
    res.end();
  }
};

module.exports = { generate, generateStream };
