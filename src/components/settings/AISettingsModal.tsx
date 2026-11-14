import React, { useState, useEffect } from 'react';
import { Bot, Key, X, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserData, saveUserData } from '../../lib/db';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(savedKey);

      if (currentUser) {
        fetchUserData(currentUser.uid).then((data) => {
          if (data && data.geminiApiKey) {
            setApiKey(data.geminiApiKey);
          }
        });
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('idle');
    try {
      const trimmed = apiKey.trim();
      if (trimmed) {
        localStorage.setItem('gemini_api_key', trimmed);
      } else {
        localStorage.removeItem('gemini_api_key');
      }

      if (currentUser) {
        await saveUserData(currentUser.uid, { geminiApiKey: trimmed });
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 1200);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#120826] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-purple-900/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-purple-900/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">AI Advisor Settings</h3>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-purple-300/70">Connect your personal Gemini API key</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-purple-900/40 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 rounded-xl flex gap-3 text-amber-800 dark:text-amber-200/90 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              By adding your own API key, you bypass the global limits and get an uninterrupted AI Advisor experience. Your key is stored securely in your private cloud profile.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-purple-300">Google Gemini API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:bg-[#1a0f30] dark:border-purple-900/50 dark:text-white dark:focus:ring-purple-500/30 transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              You can get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Google AI Studio</a>.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0c051a] border-t border-slate-100 dark:border-purple-900/30 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-70 transition-colors shadow-md shadow-purple-600/20"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {status === 'success' ? 'Saved!' : 'Save Key'}
          </button>
        </div>
      </div>
    </div>
  );
};
