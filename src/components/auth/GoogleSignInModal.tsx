import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  AutoAwesomeRounded,
  ShieldRounded,
} from '@mui/icons-material';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../../lib/firebase';

interface GoogleSignInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!isFirebaseConfigured || !auth || !googleProvider) {
        setError(
          'Firebase configuration is missing in your .env file. Please add your VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID to enable live Google authentication.'
        );
        setLoading(false);
        return;
      }

      await signInWithPopup(auth, googleProvider);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err);
      const msg = (err as Error)?.message || 'An error occurred during Google Sign-In.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            p: 1.5,
            boxShadow: '0 25px 50px -12px rgba(109, 40, 217, 0.25)',
            border: '1px solid rgba(139, 92, 246, 0.18)',
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="https://www.google.com/favicon.ico"
            alt="Google"
            sx={{ width: 22, height: 22 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
            Sign in with Google
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.5 }}>
          Sign in with your Google account to automatically switch to your personal{' '}
          <strong style={{ color: '#7c3aed' }}>Gemini AI Academic Advisor</strong> and sync your
          academic degree progress.
        </Typography>

        {/* Value Proposition Badges */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mb: 3,
            p: 1.75,
            borderRadius: '14px',
            bgcolor: 'rgba(124, 58, 237, 0.05)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeRounded sx={{ fontSize: 17, color: '#7c3aed' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Instant Gemini AI Advisor Activation
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldRounded sx={{ fontSize: 17, color: '#10b981' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Verified Mathematical Ground Truth Protection
            </Typography>
          </Box>
        </Box>

        {/* Error / Configuration Message */}
        {error && (
          <Alert severity="warning" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.8rem' }}>
            {error}
          </Alert>
        )}

        {/* Official Google Sign-In Action */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleGoogleSignIn}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Box
                component="img"
                src="https://www.google.com/favicon.ico"
                alt="Google"
                sx={{ width: 18, height: 18 }}
              />
            )
          }
          sx={{
            py: 1.4,
            borderRadius: '12px',
            bgcolor: '#ffffff',
            color: '#1e293b',
            border: '1.5px solid #cbd5e1',
            fontSize: '0.925rem',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#94a3b8',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {loading ? 'Connecting to Google...' : 'Sign in with Google'}
        </Button>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Secure Google authentication powered by Firebase Auth
        </Typography>
      </DialogActions>
    </Dialog>
  );
};
