import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

// Initialize Firebase Admin
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[Firebase Admin] Initialized successfully with provided service account.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    console.log('[Firebase Admin] Initialized with default credentials.');
  } else {
    console.log('[Firebase Admin] No service account or credentials configured. Skipping Firebase Admin initialization.');
  }
} catch (error) {
  console.warn('[Firebase Admin] Failed to initialize:', (error as Error).message);
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GPA Mate LK Backend',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0),
  });
});

// Serve static assets in production if built
const clientDistPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(clientDistPath));

// Fallback to client index.html for SPA routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Vite dev server is running on port 5173. Run in production mode after npm run build.');
    }
  });
});

const HOST = '127.0.0.1';
app.listen(Number(PORT), HOST, () => {
  console.log(`[GPA Mate LK API] Server running on http://${HOST}:${PORT}`);
  console.log(`[GPA Mate LK API] Gemini Key Configured: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0)}`);
});
