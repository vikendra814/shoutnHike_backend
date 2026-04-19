require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Warn on missing critical env vars at startup
['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY', 'OPENAI_API_KEY'].forEach((key) => {
  if (!process.env[key]) console.warn(`⚠️  Missing env var: ${key}`);
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
});
