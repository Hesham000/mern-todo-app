import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Paper,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon,
  CheckCircle as CheckIcon,
  AccessTime as PendingIcon,
  Alarm as OverdueIcon,
  Today as TodayIcon,
  Loop as InProgressIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useTodo from '../hooks/useTodo';
import todoService from '../services/todoService';
import { isAfterDate, isBeforeDate, startOfDay, isPastDate, isTodayDate } from '../utils/dateUtils';
import AnimatedPage from '../components/common/AnimatedPage';
import StaggerChildren from '../components/common/StaggerChildren';
import FadeIn from '../components/common/FadeIn';
import LoadingAnimation from '../components/common/LoadingAnimation';
import TodoItem from '../components/todo/TodoItem';

// Animation variants for the stat cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
};

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const HomePage = () => {
  const { todos, loading } = useTodo();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    today: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [todayTodos, setTodayTodos] = useState([]);
  const didFetchStats = useRef(false);
  const todosRef = useRef([]);
  
  // Create a stringified representation of todos statuses to detect changes
  const todosStatusString = useMemo(() => {
    return todos.map(todo => `${todo._id}:${todo.status}`).join(',');
  }, [todos]);
  
  // Memoize the calculation of stats to prevent unnecessary recalculations
  const calculateStatsFromTodos = useCallback(() => {
    if (!todos || !todos.length) {
      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        today: 0
      });
      return;
    }

    const today = startOfDay(new Date());
    
    const newStats = {
      total: todos.length,
      pending: todos.filter(todo => todo.status === 'pending').length,
      inProgress: todos.filter(todo => todo.status === 'in-progress').length,
      completed: todos.filter(todo => todo.status === 'completed').length,
      overdue: todos.filter(todo => {
        if (!todo.dueDate || todo.status === 'completed') return false;
        const dueDate = new Date(todo.dueDate);
        return isPastDate(dueDate) && !isTodayDate(dueDate);
      }).length,
      today: todos.filter(todo => {
        if (!todo.dueDate) return false;
        return isTodayDate(new Date(todo.dueDate));
      }).length
    };
    
    setStats(newStats);
    setStatsLoading(false);
  }, [todos]);

  // Update stats whenever todos or their statuses change
  useEffect(() => {
    // Skip if we're in initial loading state
    if (loading && todos.length === 0) return;
    
    // Check if todos reference is the same as before
    if (todosRef.current === todos && didFetchStats.current) {
      // If the reference is the same, but the status string has changed,
      // that means a todo was updated without adding or removing
      calculateStatsFromTodos();
    } else {
      // New todos array (added/removed todos) or first load
      todosRef.current = todos;
      calculateStatsFromTodos();
      didFetchStats.current = true;
    }
  }, [todos, todosStatusString, calculateStatsFromTodos, loading]);

  // Fetch statistics from API only once on initial load
  useEffect(() => {
    // Skip API call if we don't have todos yet or are loading
    if (loading || didFetchStats.current) return;
    
    let isMounted = true;
    setStatsLoading(true);
    
    const fetchStats = async () => {
      if (!isMounted) return;
      
      setStatsError(null);
      
      try {
        const response = await todoService.getStats();
        
        if (!isMounted) return;
        
        // Extract stats from response
        const apiStats = response.data || response;
        
        setStats({
          total: apiStats.total || 0,
          pending: apiStats.pending || 0,
          inProgress: apiStats['in-progress'] || 0,
          completed: apiStats.completed || 0,
          overdue: apiStats.overdue || 0,
          today: apiStats.today || 0
        });
        
        // Mark that we've fetched stats
        didFetchStats.current = true;
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Failed to fetch todo statistics:', error);
        setStatsError(error.message || 'Failed to fetch statistics');
        
        // Fallback: Calculate stats from local todos
        calculateStatsFromTodos();
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };
    
    fetchStats();
    
    return () => {
      isMounted = false;
    };
  }, [loading, calculateStatsFromTodos]);
  
  // Filter today's todos from the local todos list - memoize the result
  const memoizedTodayTodos = useMemo(() => {
    // Skip if loading or no todos
    if (loading && todos.length === 0) return [];
    
    // Just calculate from local todos instead of making another API call
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      return isTodayDate(new Date(todo.dueDate));
    });
  }, [todos, loading, todosStatusString]);

  // Update todayTodos state from the memoized value
  useEffect(() => {
    setTodayTodos(memoizedTodayTodos);
  }, [memoizedTodayTodos]);

  if (loading && todos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LoadingAnimation size={15} duration={0.7} />
      </Box>
    );
  }

  return (
    <AnimatedPage>
      <FadeIn duration={0.6}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            gutterBottom
          >
            Welcome to Your Todo Dashboard
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Track, manage and organize your tasks in one place.
          </Typography>
        </Box>
      </FadeIn>

      {/* Stats Cards */}
      <StaggerChildren staggerDelay={0.05} initialDelay={0.3}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Todos */}
          <Grid item xs={6} sm={4} md={2}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.default'
                }}
              >
                <CardContent>
                  {statsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <LoadingAnimation size={8} duration={0.6} />
                    </Box>
                  ) : (
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                      {stats.total}
                    </Typography>
                  )}
                  <Typography color="text.secondary" variant="body2">
                    Total Tasks
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Pending Todos */}
          <Grid item xs={6} sm={4} md={2}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderColor: 'warning.light', 
                  bgcolor: 'warning.lightest'
                }}
              >
                <CardContent>
                  {statsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <LoadingAnimation size={8} duration={0.6} />
                    </Box>
                  ) : (
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }} color="warning.main">
                      {stats.pending}
                    </Typography>
                  )}
                  <Typography color="warning.dark" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PendingIcon fontSize="small" sx={{ mr: 0.5 }} /> Pending
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* In Progress Todos */}
          <Grid item xs={6} sm={4} md={2}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderColor: 'info.light', 
                  bgcolor: 'info.lightest' 
                }}
              >
                <CardContent>
                  {statsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <LoadingAnimation size={8} duration={0.6} />
                    </Box>
                  ) : (
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }} color="info.main">
                      {stats.inProgress}
                    </Typography>
                  )}
                  <Typography color="info.dark" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <InProgressIcon fontSize="small" sx={{ mr: 0.5 }} /> In Progress
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Completed Todos */}
          <Grid item xs={6} sm={4} md={2}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderColor: 'success.light', 
                  bgcolor: 'success.lightest' 
                }}
              >
                <CardContent>
                  {statsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <LoadingAnimation size={8} duration={0.6} />
                    </Box>
                  ) : (
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }} color="success.main">
                      {stats.completed}
                    </Typography>
                  )}
                  <Typography color="success.dark" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckIcon fontSize="small" sx={{ mr: 0.5 }} /> Completed
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Overdue Todos */}
          <Grid item xs={6} sm={4} md={2}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderColor: 'error.light', 
                  bgcolor: 'error.lightest' 
                }}
              >
                <CardContent>
                  {statsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <LoadingAnimation size={8} duration={0.6} />
                    </Box>
                  ) : (
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }} color="error.main">
                      {stats.overdue}
                    </Typography>
                  )}
                  <Typography color="error.dark" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <OverdueIcon fontSize="small" sx={{ mr: 0.5 }} /> Overdue
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Due Today Todos */}
          <Grid item xs={6} sm={4} md={2}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderColor: 'secondary.light', 
                  bgcolor: 'secondary.lightest' 
                }}
              >
                <CardContent>
                  {statsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <LoadingAnimation size={8} duration={0.6} />
                    </Box>
                  ) : (
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }} color="secondary.main">
                      {stats.today}
                    </Typography>
                  )}
                  <Typography color="secondary.dark" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TodayIcon fontSize="small" sx={{ mr: 0.5 }} /> Due Today
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </StaggerChildren>

      {/* Add Todo Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          component={Link}
          to="/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          New Task
        </Button>
      </Box>

      {/* Recent Todos */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Recent Tasks
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {/* Replace TodoList with directly filtered todos */}
        {todos.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
            No tasks created yet
          </Typography>
        ) : (
          <Box>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              key={todosStatusString}
            >
              <AnimatePresence mode="wait">
                {todos.slice(0, 5).map(todo => (
                  <TodoItem key={`${todo._id}-${todo.status}`} todo={todo} />
                ))}
              </AnimatePresence>
            </motion.div>
          </Box>
        )}
      </Paper>

      {/* Today's Tasks */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Due Today
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {todayTodos.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
            No tasks due today
          </Typography>
        ) : (
          <Box>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              key={todosStatusString}
            >
              <AnimatePresence mode="wait">
                {todayTodos.map(todo => (
                  <TodoItem key={`${todo._id}-${todo.status}`} todo={todo} />
                ))}
              </AnimatePresence>
            </motion.div>
          </Box>
        )}
      </Paper>
    </AnimatedPage>
  );
};

export default HomePage; 