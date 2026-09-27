import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as admin from 'firebase-admin';
import { getAcademicAdvice } from '../services/geminiService';

const router = Router();

const adviceRequestSchema = z.object({
  currentCGPA: z.number().min(0).max(4.0),
  completedCredits: z.number().min(0),
  remainingCredits: z.number().min(0),
  targetCGPA: z.number().min(0).max(4.0),
  targetClass: z.string().optional(),
  university: z.string().optional().default('Sri Lankan University'),
  degree: z.string().optional().default('Undergraduate'),
  userMessage: z.string().min(1, 'Message is required'),
  semestersSummary: z
    .array(
      z.object({
        name: z.string(),
        credits: z.number(),
        gpa: z.number(),
      })
    )
    .optional(),
  upcomingSubjects: z
    .array(
      z.object({
        name: z.string(),
        credits: z.number(),
      })
    )
    .optional(),
});

router.post('/advisor', async (req: Request, res: Response) => {
  try {
    const parseResult = adviceRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: parseResult.error.format(),
      });
    }

    let userApiKey: string | undefined;

    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
    return res.json(advice);
  } catch (error) {
    console.error('AI Advisor endpoint error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing academic advice.',
    });
  }
});

export default router;
