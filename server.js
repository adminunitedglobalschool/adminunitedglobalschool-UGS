import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Render service uptime monitoring
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve compiled static assets from dist folder with caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true,
}));

// Single Page Application (SPA) fallback: serve index.html for all non-file routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Listen on all network interfaces (required for Render)
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Render Service] United Global School portal is live on port ${PORT} (0.0.0.0)`);
});
