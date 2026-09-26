import { GoogleGenAI } from '@google/genai';
import { AIAdvisorRequest, AIAdvisorResponse } from '../../src/types/academic';

/**
 * Calculates mathematical ground truth before prompting Gemini.
 * This guarantees that the AI cannot hallucinate or override mathematical facts.
 */
function computeMathContext(data: AIAdvisorRequest) {
  const currentWeighted = data.currentCGPA * data.completedCredits;
  const totalFutureCredits = data.completedCredits + data.remainingCredits;

  const maxPossibleCGPA =
    data.remainingCredits > 0
      ? Number(((currentWeighted + data.remainingCredits * 4.0) / totalFutureCredits).toFixed(2))
      : Number(data.currentCGPA.toFixed(2));

  let requiredFutureGPA = 0;
  let isAchievable = true;

  if (data.remainingCredits > 0) {
    const rawRequired =
      (data.targetCGPA * totalFutureCredits - currentWeighted) / data.remainingCredits;
    requiredFutureGPA = Number(rawRequired.toFixed(2));
    isAchievable = rawRequired <= 4.0;
  } else {
    isAchievable = data.currentCGPA >= data.targetCGPA;
  }

  return {
    currentCGPA: data.currentCGPA,
    completedCredits: data.completedCredits,
    remainingCredits: data.remainingCredits,
    requiredFutureGPA,
    maxPossibleCGPA,
    isAchievable,
  };
}

/**
 * Generates academic advisory advice via Google Gemini API
 * or fallback calculation-based advisor if GEMINI_API_KEY is not configured.
 */
export async function getAcademicAdvice(
  request: AIAdvisorRequest,
  userApiKey?: string
): Promise<AIAdvisorResponse> {
  const mathContext = computeMathContext(request);
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  // Build key recommendations based on deterministic data
  const recommendations: string[] = [];

  if (mathContext.remainingCredits <= 0) {
    if (mathContext.currentCGPA >= request.targetCGPA) {
      recommendations.push('You have already secured your target CGPA!');
    } else {
      recommendations.push('No remaining credits left. Consider retaking deficiency modules if your university allows.');
    }
  } else if (!mathContext.isAchievable) {
    recommendations.push(`Maximum mathematically possible CGPA is ${mathContext.maxPossibleCGPA.toFixed(2)}.`);
    recommendations.push('Consider recalibrating your target or inquiring about module repeat / grade improvement policies at your university.');
  } else if (mathContext.requiredFutureGPA >= 3.7) {
    recommendations.push(`Aim for A/A+ (4.0) in high-weight modules (3 to 6 credits) to relieve pressure on smaller modules.`);
    recommendations.push('Prioritize coursework and continuous assessments (typically 30-50% in Sri Lankan universities).');
  } else if (mathContext.requiredFutureGPA >= 3.0) {
    recommendations.push(`Target consistent B+ to A- grades across remaining subjects.`);
    recommendations.push('Form peer study circles for challenging computing/engineering modules.');
  } else {
    recommendations.push('Maintain steady pass grades above C+ to comfortably protect your standing.');
  }

  // If Gemini API Key is available, prompt Gemini with system guardrails
  if (apiKey && apiKey.trim().length > 0 && apiKey !== 'your_gemini_api_key_here') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are the AI Academic Planning Advisor for "GPA Mate LK", an academic planning platform built specifically for Sri Lankan university undergraduates (UGC state universities like Colombo, Moratuwa, Kelaniya, USJ, Peradeniya, and leading institutions like SLIIT, NSBM, IIT).
The application developer is Sadeesha Jayaweera.

IMPORTANT GUARDRAILS:
1. The deterministic mathematical GPA engine has already calculated the student's true standing:
   - Current CGPA: ${mathContext.currentCGPA.toFixed(2)}
   - Completed Credits: ${mathContext.completedCredits}
   - Remaining Credits: ${mathContext.remainingCredits}
   - Target CGPA: ${request.targetCGPA.toFixed(2)}
   - Required Future GPA: ${mathContext.requiredFutureGPA.toFixed(2)}
   - Max Achievable CGPA: ${mathContext.maxPossibleCGPA.toFixed(2)}
   - Target Achievable?: ${mathContext.isAchievable ? 'YES' : 'NO (Mathematically unreachable)'}
   - University: ${request.university || 'Sri Lankan University'}
   - Degree Program: ${request.degree || 'Undergraduate Degree'}

2. You MUST NOT contradict these numbers or invent different mathematical results.
3. Explicitly state what is a CALCULATED FACT vs what is a STRATEGIC SUGGESTION.
4. Keep the tone encouraging, pragmatic, professional, and tailored to Sri Lankan undergraduate academic realities (semester systems, credit weights, final year projects, exams vs continuous assessments).
5. Format your response cleanly with markdown, bullet points, and concise sections.`;

      const userContent = `Student Question: "${request.userMessage}"
Additional Academic Details:
${request.semestersSummary ? JSON.stringify(request.semestersSummary) : 'None'}
${request.upcomingSubjects ? 'Upcoming Subjects: ' + JSON.stringify(request.upcomingSubjects) : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userContent}` }] },
        ],
      });

      const replyText = response.text || 'Unable to generate response from AI Advisor.';

      return {
        answer: replyText,
        mathematicalSummary: mathContext,
        recommendations,
      };
    } catch (err: unknown) {
      console.error('Gemini API call error:', err);
      // Gracefully fall back to rule-based response if API error occurs
    }
  }

  // Deterministic Intelligent Fallback Advisor (Offline / No API Key Mode)
  let fallbackAnswer = '';

  if (!mathContext.isAchievable) {
    fallbackAnswer = `### ⚠️ Target Analysis
Based on your current **${mathContext.currentCGPA.toFixed(2)} CGPA** with **${mathContext.completedCredits} completed credits**, reaching **${request.targetCGPA.toFixed(2)}** is **mathematically impossible** within your remaining **${mathContext.remainingCredits} credits**.

Even if you achieve a straight **4.00 (A+)** across all remaining subjects, your maximum achievable cumulative GPA is **${mathContext.maxPossibleCGPA.toFixed(2)}**.

#### Strategic Suggestions:
- Consider aiming for **${mathContext.maxPossibleCGPA.toFixed(2)}** or the nearest degree classification (such as Second Class Upper or Second Class Lower).
- Check your university's **repeat / retake policy**: some Sri Lankan universities allow upgrading C-, D, or E grades by re-sitting exams, which can raise your weighted base.`;
  } else if (mathContext.remainingCredits > 0) {
    fallbackAnswer = `### 🎯 Academic Target Assessment
To achieve your target CGPA of **${request.targetCGPA.toFixed(2)}**, you must maintain an average GPA of **${mathContext.requiredFutureGPA.toFixed(2)}** across your remaining **${mathContext.remainingCredits} credits**.

#### Key Mathematical Facts:
- **Current CGPA**: ${mathContext.currentCGPA.toFixed(2)} (${mathContext.completedCredits} credits completed)
- **Required Future GPA**: **${mathContext.requiredFutureGPA.toFixed(2)}**
- **Maximum Possible CGPA**: ${mathContext.maxPossibleCGPA.toFixed(2)} (if you score 4.0 in all future modules)

#### High-Yield Recommendations:
1. **Focus on Heavy-Credit Modules**: Modules with 4 to 6 credits (like Final Year Projects or Software Architecture) have 2x-3x the impact of 2-credit electives. Securing an A or A+ in these modules provides the highest mathematical boost.
2. **Maximize Continuous Assessment (CA)**: In Sri Lankan universities, labs, assignments, and midterms typically comprise 30% to 50% of the grade. Aiming for 90%+ in CA reduces pressure in the final end-semester exam.
3. **Avoid Deficiency Grades**: A single C- or D grade significantly drags down the cumulative score and requires multiple 4.0 modules to counterbalance.`;
  } else {
    fallbackAnswer = `### 📊 Academic Overview
You currently have **${mathContext.completedCredits} credits** with a **${mathContext.currentCGPA.toFixed(2)} CGPA**. Enter your remaining upcoming subjects in the Academic Planner to model target scenarios!`;
  }

  return {
    answer: fallbackAnswer,
    mathematicalSummary: mathContext,
    recommendations,
  };
}
