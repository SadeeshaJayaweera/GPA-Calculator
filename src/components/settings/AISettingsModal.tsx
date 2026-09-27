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
    if (isOpen && currentUser) {
      fetchUserData(currentUser.uid).then((data) => {
        if (data && data.geminiApiKey) {
          setApiKey(data.geminiApiKey);
        }
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setStatus('idle');
    try {
      await saveUserData(currentUser.uid, { geminiApiKey: apiKey.trim() });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 1500);
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
