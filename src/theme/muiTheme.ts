import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#a78bfa' : '#7c3aed',
        light: '#c4b5fd',
        dark: '#5b21b6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      background: {
        default: isDarkMode ? '#090514' : '#f8fafc',
        paper: isDarkMode ? '#130a26' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f8fafc' : '#0f172a',
        secondary: isDarkMode ? '#c4b5fd' : '#475569',
      },
      divider: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(226, 232, 240, 0.8)',
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '6px 16px',
            fontSize: '0.8125rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          contained: {
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.2s ease',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 44,
          },
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
            background: 'linear-gradient(90deg, #7c3aed, #6366f1)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.84rem',
            minHeight: 44,
            padding: '8px 16px',
            borderRadius: '10px 10px 0 0',
            transition: 'all 0.2s ease',
            opacity: 0.72,
            '&.Mui-selected': {
              opacity: 1,
              fontWeight: 700,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.75rem',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.75rem',
            padding: '6px 10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
