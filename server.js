import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Health check endpoint for Render service uptime monitoring
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve compiled static assets from dist folder with caching
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
  }));
} else {
  console.warn(`[Warning] dist folder not found at ${distPath}. Did "npm run build" complete during Render build step?`);
}

// Single Page Application (SPA) fallback: serve index.html for all non-file routes
app.get('*', (_req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Application is building or dist/index.html is missing. Please ensure "npm run build" ran successfully.');
  }
});

// Listen on all network interfaces (0.0.0.0 is mandatory for Render)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Render Service] United Global School portal is live on port ${PORT} (0.0.0.0)`);
});

server.on('error', (err) => {
  console.error('[Render Service Server Error]:', err);
});
