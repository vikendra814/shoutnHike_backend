const buildSocialMediaPrompt = ({ brandName, brandBrief, topics, tone }) => `
You are an expert social media copywriter for digital marketing agencies.

Brand: ${brandName}
Brief: ${brandBrief}
Tone: ${tone || 'professional yet engaging'}
Weekly Topics: ${topics.join(', ')}

Generate platform-specific social media posts for EACH topic listed above.
Return ONLY valid JSON in this exact structure:
{
  "posts": [
    {
      "topic": "<topic>",
      "linkedin": { "copy": "<post>", "hashtags": ["<tag>"] },
      "instagram": { "copy": "<post>", "hashtags": ["<tag>"], "caption": "<caption>" },
      "twitter": { "copy": "<post under 280 chars>", "hashtags": ["<tag>"] }
    }
  ]
}
No markdown, no explanation — pure JSON only.
`;

const buildSEOPrompt = ({ keyword, url, topic }) => `
You are an expert SEO strategist.

Target Keyword: ${keyword}
Topic/URL: ${url || topic}

Generate a complete SEO content plan. Return ONLY valid JSON:
{
  "metaTitle": "<60 chars max>",
  "metaDescription": "<160 chars max>",
  "blogOutline": {
    "h1": "<title>",
    "sections": [
      { "h2": "<heading>", "points": ["<point1>", "<point2>"] }
    ]
  },
  "suggestedInternalLinks": ["<anchor text> -> <suggested url slug>"],
  "focusKeywords": ["<kw1>", "<kw2>"]
}
No markdown, no explanation — pure JSON only.
`;

const buildGoogleAdsPrompt = ({ productDescription, targetAudience }) => `
You are a certified Google Ads specialist.

Product/Service: ${productDescription}
Target Audience: ${targetAudience}

Generate 3 Responsive Search Ad variations. Each headline max 30 chars, each description max 90 chars.
Return ONLY valid JSON:
{
  "ads": [
    {
      "variation": 1,
      "headlines": ["<h1>","<h2>","<h3>"],
      "descriptions": ["<d1>","<d2>"]
    }
  ]
}
No markdown, no explanation — pure JSON only.
`;

const buildDesignBriefPrompt = ({ campaignGoal, brandColors, brandTone }) => `
You are a creative director at a top digital agency.

Campaign Goal: ${campaignGoal}
Brand Colors: ${brandColors}
Brand Tone: ${brandTone}

Generate a structured creative brief. Return ONLY valid JSON:
{
  "headline": "<campaign headline>",
  "subheadline": "<supporting line>",
  "visualDirection": "<description of visual style>",
  "colorUsage": "<how to use the brand colors>",
  "ctaSuggestions": ["<cta1>", "<cta2>", "<cta3>"],
  "copyDirection": "<tone and messaging guidance>",
  "canvaTemplate": "<suggested Canva template type>"
}
No markdown, no explanation — pure JSON only.
`;

module.exports = {
  buildSocialMediaPrompt,
  buildSEOPrompt,
  buildGoogleAdsPrompt,
  buildDesignBriefPrompt,
};
