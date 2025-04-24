import { create } from 'zustand';
import todoService from '../services/todoService';

const useTodoStore = create((set, get) => ({
  // State
  todos: [],
  filteredTodos: [],
  loading: false,
  error: null,
  activeFilter: 'all',
  searchQuery: '',
  sortOrder: 'newest',
  
  // Actions
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const todos = await todoService.getAllTodos();
      set({ todos, loading: false });
      get().applyFilters();
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch todos', 
        loading: false 
      });
    }
  },
  
  addTodo: async (todoData) => {
    set({ loading: true, error: null });
    try {
      const newTodo = await todoService.createTodo(todoData);
      set(state => ({ 
        todos: [...state.todos, newTodo], 
        loading: false 
      }));
      get().applyFilters();
      return newTodo;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to add todo', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateTodo: async (id, todoData) => {
    set({ loading: true, error: null });
    try {
      const updatedTodo = await todoService.updateTodo(id, todoData);
      set(state => ({
        todos: state.todos.map(todo => 
          todo._id === id ? updatedTodo : todo
        ),
        loading: false
      }));
      get().applyFilters();
      return updatedTodo;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update todo', 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteTodo: async (id) => {
    set({ loading: true, error: null });
    try {
      await todoService.deleteTodo(id);
      set(state => ({
        todos: state.todos.filter(todo => todo._id !== id),
        loading: false
      }));
      get().applyFilters();
    } catch (error) {
      set({ 
        error: error.message || 'Failed to delete todo', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateTodoStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updatedTodo = await todoService.updateTodoStatus(id, status);
      set(state => ({
        todos: state.todos.map(todo => 
          todo._id === id ? { ...todo, status: updatedTodo.status } : todo
        ),
        loading: false
      }));
      get().applyFilters();
      return updatedTodo;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update todo status', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Filter and sort functions
  setFilter: (filter) => {
    set({ activeFilter: filter });
    get().applyFilters();
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },
  
  setSortOrder: (order) => {
    set({ sortOrder: order });
    get().applyFilters();
  },
  
  applyFilters: () => {
    const { todos, activeFilter, searchQuery, sortOrder } = get();
    
    // First filter by status
    let filtered = [...todos];
    if (activeFilter !== 'all') {
      filtered = filtered.filter(todo => todo.status === activeFilter);
    }
    
    // Then filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(query) || 
        (todo.description && todo.description.toLowerCase().includes(query))
      );
    }
    
    // Finally sort
    filtered = get().sortTodos(filtered, sortOrder);
    
    set({ filteredTodos: filtered });
  },
  
  sortTodos: (todosToSort, sortMethod) => {
    switch (sortMethod) {
      case 'newest':
        return [...todosToSort].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      case 'oldest':
        return [...todosToSort].sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
      case 'dueDate':
        return [...todosToSort].sort((a, b) => {
          // Handle todos without due dates
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case 'title':
        return [...todosToSort].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return todosToSort;
    }
  },
  
  // Reset state
  reset: () => {
    set({
      todos: [],
      filteredTodos: [],
      loading: false,
      error: null,
      activeFilter: 'all',
      searchQuery: '',
      sortOrder: 'newest'
    });
  }
}));

export default useTodoStore; 