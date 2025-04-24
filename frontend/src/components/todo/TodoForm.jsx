import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  InputAdornment,
  IconButton,
  Autocomplete,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Close as CloseIcon,
  AddCircleOutline as AddIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import useTodo from '../../hooks/useTodo';
import { formatDateForInput, formatDate, isValidDate } from '../../utils/dateUtils';
import AnimatedPage from '../common/AnimatedPage';

const TodoForm = ({ todo, setIsEditing }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { addTodo, updateTodo, getTodoById, todos } = useTodo();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: null,
    tags: [],
    priority: 'medium'
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  // Validation state
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: ''
  });

  // Format due date for display
  const [formattedDueDate, setFormattedDueDate] = useState('');

  // Extract all unique tags from existing todos
  useEffect(() => {
    const tags = new Set();
    todos.forEach(todo => {
      if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach(tag => tags.add(tag));
      }
    });
    setAvailableTags(Array.from(tags));
  }, [todos]);

  // Load existing todo data if editing
  useEffect(() => {
    const loadTodo = async () => {
      if (id) {
        const todoData = await getTodoById(id);
        if (todoData) {
          setFormData({
            ...todoData,
            dueDate: todoData.dueDate ? new Date(todoData.dueDate) : null
          });
        } else {
          navigate('/404');
        }
      } else if (todo) {
        setFormData({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : null
        });
      }
    };

    loadTodo();
  }, [id, todo, getTodoById, navigate]);

  // Format due date for display
  useEffect(() => {
    if (formData.dueDate) {
      const dateObj = new Date(formData.dueDate);
      if (isValidDate(dateObj)) {
        setFormattedDueDate(formatDate(dateObj));
      } else {
        setFormattedDueDate('');
      }
    } else {
      setFormattedDueDate('');
    }
  }, [formData.dueDate]);

  // Format due date for input field
  const getDueDateInputValue = () => {
    if (!formData.dueDate) return '';
    const date = new Date(formData.dueDate);
    return formatDateForInput(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleTagSelect = (newValue) => {
    setFormData({
      ...formData,
      tags: Array.isArray(newValue) ? newValue : []
    });
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      title: '',
      description: '',
      status: '',
      dueDate: ''
    };

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      valid = false;
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
      valid = false;
    }

    // Validate description
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
      valid = false;
    }

    // Validate status
    if (!formData.status) {
      newErrors.status = 'Status is required';
      valid = false;
    }

    // Validate due date
    if (formData.dueDate && isNaN(new Date(formData.dueDate).getTime())) {
      newErrors.dueDate = 'Invalid date format';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare the data for submission
    const todoData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
    
    try {
      if (id || todo?._id) {
        // Update existing todo
        const todoId = id || todo._id;
        await updateTodo(todoId, todoData);
        
        enqueueSnackbar('Todo updated successfully', { variant: 'success' });
        
        // If in edit mode (not on the edit page), exit edit mode
        if (setIsEditing) {
          setIsEditing(false);
        } else {
          // Otherwise, go back to the previous page
          navigate(-1);
        }
      } else {
        // Add new todo
        const response = await addTodo(todoData);
        
        enqueueSnackbar('Todo created successfully', { variant: 'success' });
        
        // Redirect to the todo list
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving todo:', error);
      enqueueSnackbar(error.message || 'Failed to save todo. Please try again.', { 
        variant: 'error' 
      });
    }
  };

  const handleCancel = () => {
    if (setIsEditing) {
      setIsEditing(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={0} 
          variant="outlined" 
          className="glass-card" 
          sx={{ 
            p: 4, 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3
          }}
        >
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h5" component="h1" gutterBottom>
              {id || todo ? 'Edit Todo' : 'Add New Todo'}
            </Typography>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<BackIcon />}
              >
                Cancel
              </Button>
            </motion.div>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                  InputProps={{
                    sx: {
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={4}
                  InputProps={{
                    sx: {
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                  {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    name="priority"
                    value={formData.priority || 'medium'}
                    onChange={handleChange}
                    label="Priority"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  value={getDueDateInputValue()}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="tags-input"
                  options={availableTags}
                  value={formData.tags}
                  onChange={(event, newValue) => handleTagSelect(newValue)}
                  freeSolo
                  renderTags={(value, getTagProps) => 
                    value.map((tag, index) => {
                      // Create our own props without spreading the key
                      const customProps = {
                        label: tag,
                        variant: "outlined",
                        onDelete: getTagProps({ index }).onDelete,
                        disabled: getTagProps({ index }).disabled
                      };
                      
                      return (
                        <motion.div
                          key={tag}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ display: 'inline-block', marginRight: 5, marginBottom: 5 }}
                        >
                          <Chip {...customProps} />
                        </motion.div>
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tags"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <TagIcon color="action" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                        sx: {
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} className="flex justify-end">
                <Stack direction="row" spacing={2}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      startIcon={<CloseIcon />}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                    >
                      {id || todo ? 'Update' : 'Create'} Todo
                    </Button>
                  </motion.div>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </AnimatedPage>
  );
};

export default TodoForm; 