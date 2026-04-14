require('dotenv').config();
const app = require('./src/app');

// Railway provides PORT, fallback to 8080 for local
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});