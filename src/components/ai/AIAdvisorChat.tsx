import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  User,
  Lightbulb,
  Loader2,
  Key,
} from 'lucide-react';
import { AIAdvisorRequest, AIAdvisorResponse } from '../../types/academic';
import { useAuth } from '../../contexts/AuthContext';
import { requestAIAdvisor } from '../../lib/geminiClient';

interface MessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: 'gemini' | 'deterministic_fallback';
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
  onOpenSettings?: () => void;
}

export const AIAdvisorChat: React.FC<AIAdvisorChatProps> = ({
  currentCGPA,
  completedCredits,
  remainingCredits = 30,
  targetCGPA = 3.7,
  universityName,
  degreeName,
  semestersSummary = [],
  onOpenSettings,
}) => {
  const { currentUser, loginWithGoogle } = useAuth();

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
  const [isLiveGeminiConfigured, setIsLiveGeminiConfigured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // When currentUser changes or on initial mount, personalize welcome message if untouched
  useEffect(() => {
    if (currentUser) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === 'welcome') {
          const firstName = currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Student';
          return [
            {
              ...prev[0],
              text: `Hello **${firstName}**! I am your personal **AI Academic Planning Advisor**, powered by Google Gemini and backed by the deterministic GPA engine of **GPA Mate LK**.\n\nYour Google account (**${currentUser.displayName || currentUser.email}**) is linked and your **Gemini AI access is active**!\n\nI have loaded your verified academic standing:\n- **Current CGPA**: ${currentCGPA.toFixed(2)}\n- **Completed Credits**: ${completedCredits}\n- **Remaining Credits**: ${remainingCredits}\n- **Target CGPA**: ${targetCGPA.toFixed(2)}\n\nHow can I assist you with your academic planning today?`,
            },
          ];
        }
        return prev;
      });
    }
  }, [currentUser, currentCGPA, completedCredits, remainingCredits, targetCGPA]);

  useEffect(() => {
    // Check if Gemini API is configured on server or in localStorage
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        const hasKey = Boolean(data.hasServerKey || localStorage.getItem('gemini_api_key'));
        setIsLiveGeminiConfigured(hasKey);
      })
      .catch(() => {
        setIsLiveGeminiConfigured(Boolean(localStorage.getItem('gemini_api_key')));
      });
  }, []);

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
        studentName: currentUser?.displayName || undefined,
        studentEmail: currentUser?.email || undefined,
        semestersSummary,
      };

      let idToken = '';
      if (currentUser?.getIdToken) {
        try {
          idToken = await currentUser.getIdToken();
        } catch (e) {
          console.warn('Failed to get auth token:', e);
        }
      }

      const data: AIAdvisorResponse = await requestAIAdvisor(payload, idToken);

      setMessages([
        ...newMessages,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          source: data.source,
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
                Mathematical Ground Truth Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-purple-300/70">
              {currentUser
                ? `Personalized for ${currentUser.displayName || currentUser.email} • Gemini AI Active`
                : isLiveGeminiConfigured
                ? 'Gemini 3.5 Flash online with verified academic context'
                : 'Deterministic calculations guarantee zero mathematical hallucination'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-xs font-semibold text-purple-800 dark:text-purple-200">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt=""
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                </div>
              )}
              <span className="hidden sm:inline">
                {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Account Linked'}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                Active
              </span>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-purple-950/40 border border-slate-300 dark:border-purple-800/40 hover:bg-slate-50 dark:hover:bg-purple-900/40 transition-colors shadow-xs"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-3.5 h-3.5"
              />
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Configure Gemini API Key"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-100/70 hover:bg-purple-200/70 border border-purple-200 dark:bg-purple-950/60 dark:border-purple-800/40 dark:text-purple-300 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isLiveGeminiConfigured || currentUser ? 'Gemini Linked' : 'Set Key'}
              </span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/40">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Secure Server API</span>
          </div>
        </div>
      </div>

      {/* Google Sign-in Banner (Visible when not signed in) */}
      {!currentUser && (
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border-b border-purple-100 flex items-center justify-between gap-3 dark:bg-gradient-to-r dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 dark:border-purple-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#150a2e] border border-purple-200 dark:border-purple-800/50 flex items-center justify-center shrink-0 shadow-xs">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Sign in with your Google account to automatically switch to your Gemini AI Advisor
              </p>
              <p className="text-[11px] text-slate-500 dark:text-purple-300/70">
                Unlock instant personalized student counseling, module priorities, and synced degree targets.
              </p>
            </div>
          </div>
          <button
            onClick={loginWithGoogle}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shrink-0 shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Connect Google</span>
          </button>
        </div>
      )}

      {/* Connected Student Status Bar (Visible when signed in) */}
      {currentUser && (
        <div className="px-4 py-2 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Signed in as <strong>{currentUser.displayName || currentUser.email}</strong> • Gemini AI Academic Advisor Active
            </span>
          </div>
          <button
            onClick={loginWithGoogle}
            className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
          >
            Switch Account
          </button>
        </div>
      )}

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
              {/* Source badge for AI */}
              {msg.sender === 'ai' && msg.source === 'gemini' && (
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-2 py-0.5 rounded-md mb-2 border border-purple-200 dark:border-purple-800/40">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Powered by Google Gemini</span>
                </div>
              )}
              {msg.sender === 'ai' && msg.source === 'deterministic_fallback' && (
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-2 py-0.5 rounded-md mb-2 border border-slate-300/60 dark:border-slate-700/40">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Deterministic Advisory Engine</span>
                </div>
              )}

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
              Gemini is analyzing your credit distribution & formulating academic guidance...
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
