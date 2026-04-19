const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    module: {
      type: String,
      enum: ['social-media', 'seo', 'google-ads', 'design-brief'],
      required: true,
    },
    provider: { type: String, enum: ['gemini', 'openai'], required: true },
    input: { type: mongoose.Schema.Types.Mixed, required: true },
    output: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    tokensUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for fast per-user queries
generationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Generation', generationSchema);
