import { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import todoService from '../services/todoService';
import useAuth from '../hooks/useAuth';

// Create TodoContext
export const TodoContext = createContext();

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const { isAuthenticated } = useAuth();
  const isFetchingRef = useRef(false);
  const fetchTimeoutRef = useRef(null);
  const todosRef = useRef(todos);
  
  // Keep todosRef updated with the latest todos value
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);
  
  // Clear any existing fetch timeouts
  const clearFetchTimeout = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
  }, []);
  
  // Schedule the next fetch without creating a dependency on fetchTodos
  const scheduleFetch = useCallback(() => {
    clearFetchTimeout();
    if (isAuthenticated) {
      fetchTimeoutRef.current = setTimeout(() => {
        // Use a local function instead of the fetchTodos from the closure
        const doFetch = async () => {
          if (!isAuthenticated) return;
          
          isFetchingRef.current = true;
          setLoading(true);
          setError(null);
          
          try {
            const response = await todoService.getAllTodos();
            const todosData = response.todos || response.data || response;
            
            if (Array.isArray(todosData)) {
              setTodos(todosData);
              setLastFetched(Date.now());
            }
          } catch (err) {
            setError(err.message || 'Failed to fetch todos');
            console.error('Error in scheduled fetch:', err);
          } finally {
            setLoading(false);
            isFetchingRef.current = false;
            // Schedule next fetch
            scheduleFetch();
          }
        };
        
        doFetch();
      }, CACHE_DURATION);
    }
  }, [isAuthenticated, clearFetchTimeout]);
  
  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      clearFetchTimeout();
    };
  }, [clearFetchTimeout]);
  
  // Memoized fetchTodos function to prevent unnecessary API calls
  const fetchTodos = useCallback(async (force = false) => {
    // Return empty array if not authenticated
    if (!isAuthenticated) {
      setTodos([]);
      setInitialLoading(false);
      setLoading(false);
      return [];
    }
    
    // If another fetch is already in progress, don't start a new one
    if (isFetchingRef.current && !force) {
      return todosRef.current;
    }
    
    // If we've fetched within the cache duration and not forcing, use cached data
    const now = Date.now();
    if (!force && lastFetched && now - lastFetched < CACHE_DURATION && todosRef.current.length > 0) {
      return todosRef.current;
    }
    
    // Set loading state and mark fetch in progress
    if (initialLoading) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);
    isFetchingRef.current = true;
    
    try {
      const response = await todoService.getAllTodos();
      
      // Check response structure and extract todos array
      const todosData = response.todos || response.data || response;
      if (Array.isArray(todosData)) {
        setTodos(todosData);
        setLastFetched(Date.now());
        
        // Schedule the next fetch
        scheduleFetch();
        
        return todosData;
      } else {
        console.error('Unexpected todos data format:', todosData);
        return todosRef.current; // Return current todos if response is invalid
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch todos');
      console.error('Error fetching todos:', err);
      return todosRef.current; // Return current todos on error
    } finally {
      setInitialLoading(false);
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [isAuthenticated, lastFetched, scheduleFetch, clearFetchTimeout]); // Remove todos from dependencies
  
  // Fetch todos when authenticated - only once on mount
  useEffect(() => {
    let mounted = true;
    
    const initialFetch = async () => {
      if (isAuthenticated && mounted && !lastFetched) {
        await fetchTodos(true);
      } else if (!isAuthenticated && mounted) {
        setTodos([]);
        setInitialLoading(false);
        setLoading(false);
      }
    };
    
    initialFetch();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      mounted = false;
      clearFetchTimeout();
    };
  }, [isAuthenticated, fetchTodos, clearFetchTimeout, lastFetched]);
  
  // Add a new todo
  const addTodo = useCallback(async (todoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await todoService.createTodo(todoData);
      const newTodo = response.data || response;
      
      // Optimistic update of the todos state
      setTodos(prevTodos => {
        const updatedTodos = [...prevTodos, newTodo];
        // Update lastFetched to avoid immediate re-fetch
        setLastFetched(Date.now());
        return updatedTodos;
      });
      
      return newTodo;
    } catch (err) {
      setError(err.message || 'Failed to add todo');
      console.error('Error adding todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update an existing todo
  const updateTodo = useCallback(async (id, todoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await todoService.updateTodo(id, todoData);
      const updatedTodo = response.data || response;
      
      // Update the todos state and refresh lastFetched
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo => todo._id === id ? updatedTodo : todo);
        // Update lastFetched to avoid immediate re-fetch
        setLastFetched(Date.now());
        return updatedTodos;
      });
      
      return updatedTodo;
    } catch (err) {
      setError(err.message || 'Failed to update todo');
      console.error('Error updating todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update just the status of a todo
  const updateTodoStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await todoService.updateTodoStatus(id, status);
      const updatedTodo = response.data || response;
      
      // Update the todos state and refresh lastFetched
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo => todo._id === id ? updatedTodo : todo);
        // Update lastFetched to avoid immediate re-fetch
        setLastFetched(Date.now());
        return updatedTodos;
      });
      
      return updatedTodo;
    } catch (err) {
      setError(err.message || 'Failed to update todo status');
      console.error('Error updating todo status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Delete a todo
  const deleteTodo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await todoService.deleteTodo(id);
      
      // Update the todos state and refresh lastFetched
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.filter(todo => todo._id !== id);
        // Update lastFetched to avoid immediate re-fetch
        setLastFetched(Date.now()); 
        return updatedTodos;
      });
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
      console.error('Error deleting todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get a single todo by ID
  const getTodoById = useCallback(async (id) => {
    setError(null);
    
    try {
      // First check if we have it in state
      const cachedTodo = todos.find(todo => todo._id === id);
      if (cachedTodo) return cachedTodo;
      
      // If not, fetch from API
      const response = await todoService.getTodoById(id);
      return response.data || response;
    } catch (err) {
      setError(err.message || 'Failed to get todo');
      console.error('Error getting todo:', err);
      throw err;
    }
  }, [todos]);
  
  // Calculate if a todo is overdue (matching the backend virtual)
  const isOverdue = useCallback((todo) => {
    if (!todo.dueDate) return false;
    return new Date() > new Date(todo.dueDate) && todo.status !== 'completed';
  }, []);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    todos,
    loading: initialLoading || loading,
    error,
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    getTodoById,
    fetchTodos,
    isOverdue
  }), [
    todos,
    initialLoading,
    loading,
    error,
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    getTodoById,
    fetchTodos,
    isOverdue
  ]);
  
  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext; 