import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  User,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { AIAdvisorRequest, AIAdvisorResponse } from '../../types/academic';
import { auth } from '../../lib/firebase';

interface MessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendations?: string[];
  mathSummary?: AIAdvisorResponse['mathematicalSummary'];
  timestamp: string;
}

interface AIAdvisorChatProps {
  currentCGPA: number;
  completedCredits: number;
  remainingCredits?: number;
  targetCGPA?: number;
  universityName: string;
  degreeName: string;
  semestersSummary?: { name: string; credits: number; gpa: number }[];
}

export const AIAdvisorChat: React.FC<AIAdvisorChatProps> = ({
  currentCGPA,
  completedCredits,
  remainingCredits = 30,
  targetCGPA = 3.7,
  universityName,
  degreeName,
  semestersSummary = [],
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **AI Academic Planning Advisor**, powered by Google Gemini and backed by the deterministic GPA engine of **GPA Mate LK**.\n\nI have loaded your verified academic standing:\n- **Current CGPA**: ${currentCGPA.toFixed(2)}\n- **Completed Credits**: ${completedCredits}\n- **Remaining Credits**: ${remainingCredits}\n- **Target CGPA**: ${targetCGPA.toFixed(2)}\n\nHow can I assist you with your academic goals today?`,
      recommendations: [
        'Ask which modules give the highest GPA leverage',
        'Check if First Class is achievable with your remaining credits',
        'Request study balance strategies for upcoming semesters',
      ],
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Can I still reach First Class with my remaining credits?',
    'What grades do I need in my upcoming subjects?',
    'What happens if I get B+ in my final semester?',
    'Which upcoming subject has the largest impact on my CGPA?',
    'Explain my current GPA calculation simply',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMessages: MessageItem[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload: AIAdvisorRequest = {
        currentCGPA,
        completedCredits,
        remainingCredits,
        targetCGPA,
        university: universityName,
        degree: degreeName,
        userMessage: textToSend,
        semestersSummary,
      };

      let idToken = '';
      if (auth.currentUser) {
        try {
          idToken = await auth.currentUser.getIdToken();
        } catch (e) {
          console.warn("Failed to get auth token", e);
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: AIAdvisorResponse = await res.json();

      setMessages([
        ...newMessages,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          recommendations: data.recommendations,
          mathSummary: data.mathematicalSummary,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: unknown) {
      console.error('Advisor request error:', err);
      setMessages([
        ...newMessages,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Unable to connect to the backend AI service.**\n\nEnsure your local server is running (\`npm run dev\`). If using a custom Gemini API Key, verify your \`GEMINI_API_KEY\` in your \`.env\` file.\n\n*Note: All deterministic GPA calculations in the Calculator & Planner continue to work seamlessly offline!*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[700px] dark:bg-[#120826] dark:border-purple-900/30">
      {/* Advisor Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between dark:bg-[#160b30] dark:border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-md shadow-purple-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-[#100722] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Gemini Academic Advisor
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40">
                Mathematical Guardrails Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-purple-300/70">
              Deterministic calculations guarantee zero mathematical hallucination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Secure Server API</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white dark:bg-[#120826]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-900/50 dark:border-purple-700/40 dark:text-purple-300 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-100/90 text-slate-900 border border-slate-200 rounded-tl-none dark:bg-[#180c33] dark:text-slate-200 dark:border-purple-900/40'
              }`}
            >
              {/* Message Content formatted */}
              <div className="whitespace-pre-line text-xs sm:text-sm">
                {msg.text}
              </div>

              {/* Recommendations pill tags */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-purple-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1 mb-1.5">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    Key Suggestions:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-400 list-disc list-inside font-medium">
                    {msg.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-2 text-right text-[10px] opacity-60">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-700/40 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-xs text-purple-700 dark:text-purple-300 font-semibold">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            </div>
            <span className="animate-pulse">
              Gemini is analyzing your credit distribution & formulating advice...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 overflow-x-auto dark:bg-[#140a2c] dark:border-purple-900/30">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-700 dark:text-purple-300 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick Prompts:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 whitespace-nowrap transition-colors dark:bg-[#1b0d38] dark:border-purple-800/40 dark:text-purple-200 dark:hover:bg-purple-900/40 dark:hover:text-white disabled:opacity-50 font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 dark:bg-[#160b30] dark:border-purple-900/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about target grades, degree class predictions, module weight strategies..."
            disabled={isLoading}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-[#100722] dark:border-purple-900/60 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
