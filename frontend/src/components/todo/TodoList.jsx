import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Alert, 
  Tabs, 
  Tab, 
  Paper,
  InputBase,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  SortByAlpha as SortIcon,
  Schedule as DueDateIcon,
  AccessTime as PendingIcon,
  Loop as InProgressIcon,
  CheckCircle as CompleteIcon
} from '@mui/icons-material';
import useTodo from '../../hooks/useTodo';
import TodoItem from './TodoItem';
import EmptyState from '../common/EmptyState';
import { formatDate, isValidDate, isPastDate, isTodayDate, isAfterDate, isBeforeDate } from '../../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import StaggerChildren from '../common/StaggerChildren';
import LoadingAnimation from '../common/LoadingAnimation';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'title', label: 'Title' }
];

// Add animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
};

const TodoList = ({ limit, hideTabs, hideSearch }) => {
  const { todos, loading, error, fetchTodos } = useTodo();
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const didInitialRender = useRef(false);
  const lastHandleRefreshTime = useRef(0);

  // Extract all unique tags from todos only when todos change
  useEffect(() => {
    const tags = new Set();
    todos.forEach(todo => {
      if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach(tag => tags.add(tag));
      }
    });
    setAvailableTags(Array.from(tags));
  }, [todos]);

  // Use URL to set initial tab if applicable
  useEffect(() => {
    // Default to showing all todos
    setActiveTab('all');
  }, []);

  // Filter and sort todos only when necessary
  useEffect(() => {
    let result = [...todos];
    
    // Filter by status
    if (activeTab !== 'all') {
      result = result.filter(todo => todo.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(query) || 
        (todo.description && todo.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      result = result.filter(todo => 
        todo.tags && selectedTags.some(tag => todo.tags.includes(tag))
      );
    }
    
    // Sort todos
    result = sortTodos(result, sortBy);
    
    // Apply limit if specified
    if (limit && result.length > limit) {
      result = result.slice(0, limit);
    }
    
    setFilteredTodos(result);
  }, [todos, activeTab, searchQuery, sortBy, selectedTags, limit]);

  const sortTodos = (todosToSort, sortMethod) => {
    if (!todosToSort) return [];
    
    let sortedTodos = [...todosToSort];
    
    switch (sortMethod) {
      case 'newest':
        sortedTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sortedTodos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'dueDate':
        sortedTodos.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      case 'title':
        sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        sortedTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return sortedTodos;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Throttle refresh to prevent multiple API calls
  const handleRefresh = async () => {
    const now = Date.now();
    // Only allow refresh once every 3 seconds
    if (now - lastHandleRefreshTime.current < 3000) {
      return;
    }
    
    lastHandleRefreshTime.current = now;
    try {
      setIsRefreshing(true);
      await fetchTodos(true); // Force refresh
    } catch (err) {
      console.error('Error refreshing todos:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Render loading state
  if (loading && todos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LoadingAnimation size={15} duration={0.7} />
      </Box>
    );
  }

  // Render error state
  if (error && todos.length === 0) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? <LoadingAnimation size={8} duration={0.6} /> : 'Retry'}
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  // Render empty state
  if (!loading && todos.length === 0) {
    return (
      <EmptyState
        title="No todos yet"
        description="Create your first todo to get started!"
        icon="todo"
      />
    );
  }

  // Render empty search results
  if (filteredTodos.length === 0 && (searchQuery || selectedTags.length > 0 || activeTab !== 'all')) {
    return (
      <>
        {!hideTabs && (
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                minWidth: 100,
              },
              '& .Mui-selected': {
                color: theme => {
                  switch (activeTab) {
                    case 'pending': return theme.palette.warning.main;
                    case 'in-progress': return theme.palette.info.main;
                    case 'completed': return theme.palette.success.main;
                    default: return theme.palette.primary.main;
                  }
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme => {
                  switch (activeTab) {
                    case 'pending': return theme.palette.warning.main;
                    case 'in-progress': return theme.palette.info.main;
                    case 'completed': return theme.palette.success.main; 
                    default: return theme.palette.primary.main;
                  }
                },
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            {statusOptions.map(option => (
              <Tab 
                key={option.value} 
                value={option.value} 
                label={option.label} 
                icon={
                  option.value === 'all' ? null :
                  option.value === 'pending' ? <PendingIcon fontSize="small" /> :
                  option.value === 'in-progress' ? <InProgressIcon fontSize="small" /> :
                  option.value === 'completed' ? <CompleteIcon fontSize="small" /> : null
                }
                iconPosition="start"
              />
            ))}
          </Tabs>
        )}
        
        {!hideSearch && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', flexGrow: 1, mb: 1 }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search todos..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            
            <FormControl sx={{ minWidth: 120, mb: 1 }}>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                size="small"
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        
        <EmptyState
          title="No matching todos"
          description="Try adjusting your filters or search"
          icon="search"
        />
      </>
    );
  }

  return (
    <>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? <LoadingAnimation size={8} duration={0.6} /> : 'Retry'}
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
    
      {!hideTabs && (
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              minWidth: 100,
            },
            '& .Mui-selected': {
              color: theme => {
                switch (activeTab) {
                  case 'pending': return theme.palette.warning.main;
                  case 'in-progress': return theme.palette.info.main;
                  case 'completed': return theme.palette.success.main;
                  default: return theme.palette.primary.main;
                }
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme => {
                switch (activeTab) {
                  case 'pending': return theme.palette.warning.main;
                  case 'in-progress': return theme.palette.info.main;
                  case 'completed': return theme.palette.success.main; 
                  default: return theme.palette.primary.main;
                }
              },
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          {statusOptions.map(option => (
            <Tab 
              key={option.value} 
              value={option.value} 
              label={option.label} 
              icon={
                option.value === 'all' ? null :
                option.value === 'pending' ? <PendingIcon fontSize="small" /> :
                option.value === 'in-progress' ? <InProgressIcon fontSize="small" /> :
                option.value === 'completed' ? <CompleteIcon fontSize="small" /> : null
              }
              iconPosition="start"
            />
          ))}
        </Tabs>
      )}
      
      {!hideSearch && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', flexGrow: 1, mb: 1 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search todos..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          
          <FormControl sx={{ minWidth: 120, mb: 1 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              size="small"
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      
      {availableTags.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {availableTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagSelect(tag)}
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      )}
      
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredTodos.map(todo => (
            <motion.div
              key={todo._id}
              variants={itemVariants}
              exit="exit"
            >
              <TodoItem todo={todo} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {loading && todos.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <LoadingAnimation size={10} duration={0.7} />
        </Box>
      )}
    </>
  );
};

export default TodoList; 