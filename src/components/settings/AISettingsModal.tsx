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
