import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import apiRouter from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Pi Commerce Onboarding Workspace & Meta WhatsApp API Service'
  });
});

// Serve public assets and audio
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

// Serve frontend in production (dist directory)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/audio')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Pi Commerce API Server</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>Pi Commerce Onboarding Workspace Backend is Running!</h2>
          <p>Client build not detected in <code>client/dist</code> yet.</p>
          <p>Run <code>npm run build:client</code> or run <code>npm run dev</code> for development.</p>
        </body>
        </html>
      `);
    }
  });
});

app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Pi Commerce Onboarding Workspace API Service`);
  console.log(`🌐 Server running at: http://localhost:${config.port}`);
  console.log(`📱 WhatsApp Meta Cloud Endpoint: ${config.meta.graphBaseUrl}/${config.meta.apiVersion}/...`);
  console.log(`🔑 Token configured: ${config.meta.token ? 'YES (Live Mode)' : 'NO (Sandbox Simulator Active)'}`);
  console.log(`=======================================================`);
});

