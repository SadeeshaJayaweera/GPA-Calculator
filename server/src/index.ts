import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import * as admin from 'firebase-admin';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

// Initialize Firebase Admin
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
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

app.listen(PORT, () => {
  console.log(`[GPA Mate LK API] Server running on http://localhost:${PORT}`);
  console.log(`[GPA Mate LK API] Gemini Key Configured: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0)}`);
});
