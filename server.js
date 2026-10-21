import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
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

// Auto-build fallback: If dist/index.html is missing because Render's Build Command only ran "npm install",
// automatically trigger "npm run build" so the site launches immediately without crashing.
if (!fs.existsSync(indexPath)) {
  console.log('[Render Service] dist/index.html not found. Automatically executing "npm run build"...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('[Render Service] Automatic build completed successfully!');
  } catch (err) {
    console.error('[Render Service] Automatic build execution failed:', err);
  }
}

// Serve compiled static assets from dist folder with caching
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
}));

// Single Page Application (SPA) fallback: serve index.html for all non-file routes
app.get('*', (_req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If still missing, try running build on-demand as a final safety net
    try {
      console.log('[Render Service] On-demand emergency build triggered...');
      execSync('npm run build', { stdio: 'inherit' });
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    } catch (e) {
      console.error('[Render Service] Emergency build failed:', e);
    }
    res.status(503).send('Application is currently building assets. Please refresh in a few seconds.');
  }
});

// Listen on all network interfaces (0.0.0.0 is required for Render Web Services)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Render Service] United Global School portal is live on port ${PORT} (0.0.0.0)`);
});

server.on('error', (err) => {
  console.error('[Render Service Server Error]:', err);
});
