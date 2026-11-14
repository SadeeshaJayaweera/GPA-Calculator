import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  SchoolRounded,
  CalculateOutlined,
  TrackChangesOutlined,
  AutoAwesomeOutlined,
  TuneOutlined,
  InfoOutlined,
  RestartAltOutlined,
  FileDownloadOutlined,
  SettingsOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  activeTab: 'calculator' | 'planner' | 'ai' | 'grading' | 'about';
  setActiveTab: (tab: 'calculator' | 'planner' | 'ai' | 'grading' | 'about') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onResetData: () => void;
  onOpenExport: () => void;
  onOpenAISettings: () => void;
  onLoadSampleData?: () => void;
  selectedUniversityName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onResetData,
  onOpenExport,
  onOpenAISettings,
}) => {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDarkMode ? 'rgba(9, 5, 20, 0.88)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: 1,
        borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.18)' : 'rgba(226, 232, 240, 0.9)',
        color: 'text.primary',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <Box sx={{ maxWidth: '1440px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 60, md: 68 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          {/* Brand Logo & University Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: { xs: 38, sm: 42 },
                height: { xs: 38, sm: 42 },
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                flexShrink: 0,
              }}
            >
              <SchoolRounded sx={{ color: '#ffffff', fontSize: { xs: 22, sm: 24 } }} />
            </Box>

            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.15rem', sm: '1.3rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              GPA Mate{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 900,
                }}
              >
                LK
              </Box>
            </Typography>
          </Box>

          {/* Center Navigation Tabs (Desktop) */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              bgcolor: isDarkMode ? 'rgba(19, 10, 38, 0.65)' : 'rgba(241, 245, 249, 0.85)',
              p: 0.5,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(203, 213, 225, 0.6)',
              boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              slotProps={{
                indicator: {
                  sx: {
                    height: '100%',
                    borderRadius: '12px',
                    background: isDarkMode
                      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.45) 0%, rgba(99, 102, 241, 0.45) 100%)'
                      : '#ffffff',
                    boxShadow: isDarkMode
                      ? '0 2px 10px rgba(124, 58, 237, 0.3)'
                      : '0 2px 6px rgba(0, 0, 0, 0.08)',
                    zIndex: 0,
                  },
                },
              }}
              sx={{
                minHeight: 38,
                '& .MuiTabs-flexContainer': {
                  gap: 0.5,
                },
              }}
            >
              <Tab
                value="calculator"
                label="Calculator"
                icon={<CalculateOutlined sx={{ fontSize: 17 }} />}
                iconPosition="start"
                disableRipple
                sx={{
                  zIndex: 1,
                  minHeight: 38,
                  py: 0.75,
                  px: 1.75,
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  '&.Mui-selected': {
                    color: isDarkMode ? '#ffffff' : '#6d28d9',
                    fontWeight: 700,
                  },
                }}
              />
              <Tab
                value="planner"
                label="Target Planner"
                icon={<TrackChangesOutlined sx={{ fontSize: 17 }} />}
                iconPosition="start"
                disableRipple
                sx={{
                  zIndex: 1,
                  minHeight: 38,
                  py: 0.75,
                  px: 1.75,
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  '&.Mui-selected': {
                    color: isDarkMode ? '#ffffff' : '#6d28d9',
                    fontWeight: 700,
                  },
                }}
              />
              <Tab
                value="ai"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <span>AI Advisor</span>
                    <Chip
                      label="Gemini"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                        color: '#ffffff',
                        border: 'none',
                      }}
                    />
                  </Box>
                }
                icon={<AutoAwesomeOutlined sx={{ fontSize: 17, color: '#a855f7' }} />}
                iconPosition="start"
                disableRipple
                sx={{
                  zIndex: 1,
                  minHeight: 38,
                  py: 0.75,
                  px: 1.75,
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  '&.Mui-selected': {
                    color: isDarkMode ? '#ffffff' : '#6d28d9',
                    fontWeight: 700,
                  },
                }}
              />
              <Tab
                value="grading"
                label="Grading Scales"
                icon={<TuneOutlined sx={{ fontSize: 17 }} />}
                iconPosition="start"
                disableRipple
                sx={{
                  zIndex: 1,
                  minHeight: 38,
                  py: 0.75,
                  px: 1.75,
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  '&.Mui-selected': {
                    color: isDarkMode ? '#ffffff' : '#6d28d9',
                    fontWeight: 700,
                  },
                }}
              />
              <Tab
                value="about"
                label="About & Guide"
                icon={<InfoOutlined sx={{ fontSize: 17 }} />}
                iconPosition="start"
                disableRipple
                sx={{
                  zIndex: 1,
                  minHeight: 38,
                  py: 0.75,
                  px: 1.75,
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  '&.Mui-selected': {
                    color: isDarkMode ? '#ffffff' : '#6d28d9',
                    fontWeight: 700,
                  },
                }}
              />
            </Tabs>
          </Box>

          {/* Right Toolbar Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.25 } }}>
            {/* Reset Data Button */}
            <Tooltip title="Reset all subjects and start fresh">
              <IconButton
                size="small"
                onClick={onResetData}
                sx={{
                  p: 0.85,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)',
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                  '&:hover': {
                    color: '#ef4444',
                    bgcolor: isDarkMode ? 'rgba(239, 68, 68, 0.12)' : 'rgba(254, 242, 242, 1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                  },
                }}
              >
                <RestartAltOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Export Report Contained Button */}
            <Button
              variant="contained"
              size="small"
              onClick={onOpenExport}
              startIcon={<FileDownloadOutlined sx={{ fontSize: '18px !important' }} />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                fontSize: '0.8rem',
                fontWeight: 700,
                px: 2,
                py: 0.75,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)',
                  boxShadow: '0 6px 18px rgba(124, 58, 237, 0.45)',
                },
              }}
            >
              Export
            </Button>

            {/* AI Advisor Settings Button */}
            <Tooltip title="AI Advisor Settings & API Key">
              <IconButton
                size="small"
                onClick={onOpenAISettings}
                sx={{
                  p: 0.85,
                  color: isDarkMode ? '#c4b5fd' : '#6d28d9',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.2)',
                  bgcolor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(124, 58, 237, 0.06)',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(139, 92, 246, 0.22)' : 'rgba(124, 58, 237, 0.14)',
                  },
                }}
              >
                <SettingsOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Theme Toggle Button */}
            <Tooltip title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}>
              <IconButton
                size="small"
                onClick={() => setIsDarkMode(!isDarkMode)}
                sx={{
                  p: 0.85,
                  color: isDarkMode ? '#fbbf24' : '#6d28d9',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)',
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(251, 191, 36, 0.12)' : 'rgba(124, 58, 237, 0.08)',
                  },
                }}
              >
                {isDarkMode ? (
                  <LightModeOutlined sx={{ fontSize: 18, color: '#fbbf24' }} />
                ) : (
                  <DarkModeOutlined sx={{ fontSize: 18, color: '#7c3aed' }} />
                )}
              </IconButton>
            </Tooltip>

            {/* User Profile / Google Sign-in */}
            {currentUser ? (
              <>
                <Tooltip title={currentUser.displayName || 'Account profile'}>
                  <IconButton
                    size="small"
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0.25, border: '2px solid', borderColor: 'primary.main' }}
                  >
                    <Avatar
                      src={currentUser.photoURL || undefined}
                      alt={currentUser.displayName || 'User'}
                      sx={{ width: 32, height: 32, fontSize: '0.85rem', bgcolor: 'primary.main' }}
                    >
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={{
                    paper: {
                      elevation: 4,
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: '14px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: isDarkMode ? '#130a26' : '#ffffff',
                        p: 0.5,
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {currentUser.displayName || 'Student'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                      {currentUser.email}
                    </Typography>
                    <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Chip
                        label="Gemini AI Active"
                        size="small"
                        color="success"
                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={() => { handleCloseUserMenu(); loginWithGoogle(); }}>
                    <ListItemIcon>
                      <Box component="img" src="https://www.google.com/favicon.ico" alt="Google" sx={{ width: 16, height: 16 }} />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: '0.825rem' }}>Switch Google Account</Typography>} />
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); onOpenAISettings(); }}>
                    <ListItemIcon>
                      <SettingsOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: '0.825rem' }}>AI Key & Cloud Settings</Typography>} />
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                    <ListItemIcon>
                      <LogoutOutlined fontSize="small" sx={{ color: '#ef4444' }} />
                    </ListItemIcon>
                    <ListItemText primary={<Typography sx={{ fontSize: '0.825rem', fontWeight: 600 }}>Sign Out</Typography>} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={loginWithGoogle}
                startIcon={
                  <Box
                    component="img"
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    sx={{ width: 14, height: 14 }}
                  />
                }
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(203, 213, 225, 0.9)',
                  color: isDarkMode ? '#f8fafc' : '#334155',
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.6,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(248, 250, 252, 1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Navigation Tabs (Scrollable Bar) */}
        <Box
          sx={{
            display: { xs: 'block', lg: 'none' },
            borderTop: 1,
            borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(226, 232, 240, 0.8)',
            py: 0.5,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                fontSize: '0.78rem',
                py: 0.5,
                px: 1.5,
              },
            }}
          >
            <Tab value="calculator" label="Calc & Dashboard" icon={<CalculateOutlined sx={{ fontSize: 16 }} />} iconPosition="start" />
            <Tab value="planner" label="Target Planner" icon={<TrackChangesOutlined sx={{ fontSize: 16 }} />} iconPosition="start" />
            <Tab
              value="ai"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>AI Advisor</span>
                  <Chip label="Gemini" size="small" sx={{ height: 16, fontSize: '0.55rem', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff' }} />
                </Box>
              }
              icon={<AutoAwesomeOutlined sx={{ fontSize: 16, color: '#a855f7' }} />}
              iconPosition="start"
            />
            <Tab value="grading" label="Scales" icon={<TuneOutlined sx={{ fontSize: 16 }} />} iconPosition="start" />
            <Tab value="about" label="About" icon={<InfoOutlined sx={{ fontSize: 16 }} />} iconPosition="start" />
          </Tabs>
        </Box>
      </Box>
    </AppBar>
  );
};
