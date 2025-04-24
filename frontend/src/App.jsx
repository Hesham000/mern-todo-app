import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, CircularProgress } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import useAuth from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/common/Layout';
import TodoList from './components/todo/TodoList';
import TodoForm from './components/todo/TodoForm';
import LoadingAnimation from './components/common/LoadingAnimation';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3a86ff',
      light: '#5e9bff',
      dark: '#2b62cc',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff006e',
      light: '#ff4b93',
      dark: '#c5004d',
      contrastText: '#fff',
    },
    success: {
      main: '#06d6a0',
      light: '#53e0b9',
      dark: '#048f6b',
      lightest: 'rgba(6, 214, 160, 0.08)',
    },
    warning: {
      main: '#ffbe0b',
      light: '#ffce4f',
      dark: '#d19700',
      lightest: 'rgba(255, 190, 11, 0.08)',
    },
    error: {
      main: '#ff5757',
      light: '#ff8080',
      dark: '#cc2929',
      lightest: 'rgba(255, 87, 87, 0.08)',
    },
    info: {
      main: '#3a86ff',
      light: '#5e9bff',
      dark: '#2b62cc',
      lightest: 'rgba(58, 134, 255, 0.08)',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#20293A',
      secondary: '#5d7290',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Poppins',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        outlined: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// AnimatedRoutes component to wrap all routes with AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Route guard component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <LoadingAnimation size={15} duration={0.7} />
        </Box>
      );
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/todos" element={
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute>
            <TodoForm />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <TodoForm />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Error routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider 
          maxSnack={3} 
          autoHideDuration={3000}
          anchorOrigin={{ 
            vertical: 'bottom', 
            horizontal: 'right' 
          }}
        >
          <Router>
            <Layout>
              <AnimatedRoutes />
            </Layout>
          </Router>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
