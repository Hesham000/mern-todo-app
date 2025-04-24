import { useState } from 'react';
import useTodo from '../../hooks/useTodo';
import TodoForm from './TodoForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate, isPastDate, getRelativeTime, isTodayDate } from '../../utils/dateUtils';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Badge,
  Avatar,
  Tooltip,
  Stack
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  CheckCircle as CompleteIcon,
  Replay as ResetIcon,
  CalendarToday as CalendarIcon,
  AccessTime as PendingIcon,
  Loop as InProgressIcon,
  LowPriority as LowPriorityIcon,
  PriorityHigh as HighPriorityIcon,
  DragHandle as MediumPriorityIcon,
  Flag as PriorityIcon,
  Schedule as DueDateIcon,
  Label as LabelIcon,
  Today as TodayIcon,
  Launch as OpenIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteTodo, updateTodoStatus, updateTodo } = useTodo();

  const isPastDue = todo.dueDate && isPastDate(todo.dueDate);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await deleteTodo(todo._id);
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      console.log(`Updating status to: ${newStatus}`);
      await updateTodoStatus(todo._id, newStatus);
      handleMenuClose();
    } catch (error) {
      console.error('Error updating todo status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    setLoading(true);
    try {
      await updateTodo(todo._id, { ...todo, priority: newPriority });
      handleMenuClose();
    } catch (error) {
      console.error('Error updating todo priority:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'in-progress':
        return <InProgressIcon fontSize="small" />;
      case 'completed':
        return <CompleteIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', bgcolor: 'warning.light' };
      case 'in-progress':
        return { color: 'info', bgcolor: 'info.light' };
      case 'completed':
        return { color: 'success', bgcolor: 'success.light' };
      default:
        return { color: 'default', bgcolor: 'gray.light' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  // Format due date if it exists
  const formattedDueDate = todo.dueDate ? formatDate(todo.dueDate) : null;

  // Check if the due date is overdue
  const isOverdue = () => {
    if (!todo.dueDate) return false;
    return isPastDate(todo.dueDate) && todo.status !== 'completed';
  };

  // Add priority handling functions
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <HighPriorityIcon fontSize="small" color="error" />;
      case 'low':
        return <LowPriorityIcon fontSize="small" color="success" />;
      case 'medium':
      default:
        return <MediumPriorityIcon fontSize="small" color="primary" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'low':
        return 'success';
      case 'medium':
      default:
        return 'primary';
    }
  };

  // Render due date with appropriate color based on status
  const renderDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    let color = 'default';
    
    if (isPastDate(date) && !isTodayDate(date)) {
      color = 'error';
    } else if (isTodayDate(date)) {
      color = 'warning';
    }
    
    return (
      <Tooltip title="Due date">
        <Chip
          icon={<DueDateIcon />}
          label={formatDate(date)}
          size="small"
          color={color}
          variant="outlined"
          sx={{ mr: 0.5, mb: 0.5 }}
        />
      </Tooltip>
    );
  };

  if (isEditing) {
    return <TodoForm todo={todo} setIsEditing={setIsEditing} />;
  }

  const statusStyles = getStatusColor(todo.status);

  return (
    <>
      {isEditing ? (
        <TodoForm todo={todo} setIsEditing={setIsEditing} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            variant="outlined" 
            sx={{ 
              mb: 2, 
              position: 'relative',
              borderColor: todo.status === 'completed' ? 'success.main' : 
                (isOverdue() ? 'error.main' : 'divider'),
              opacity: todo.status === 'completed' ? 0.8 : 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderColor: 'primary.main'
              }
            }}
          >
            <CardContent>
              <Box className="flex justify-between items-start">
                {/* Title and Description */}
                <Box className="flex-grow">
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                      mb: 1
                    }}
                  >
                    {todo.title}
                  </Typography>
                  
                  {todo.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      className="mb-3"
                      sx={{ opacity: todo.status === 'completed' ? 0.7 : 1 }}
                    >
                      {todo.description}
                    </Typography>
                  )}
                  
                  {/* Tags */}
                  {todo.tags && todo.tags.length > 0 && (
                    <Box className="flex flex-wrap gap-1 mb-2">
                      {todo.tags.map(tag => (
                        <motion.div
                          key={tag}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip 
                            label={tag} 
                            size="small"
                            variant="outlined"
                          />
                        </motion.div>
                      ))}
                    </Box>
                  )}
                  
                  {/* Footer with Date and Status */}
                  <Box className="flex items-center gap-3 mt-2">
                    {/* Due Date */}
                    {renderDueDate(todo.dueDate)}
                    
                    <Divider orientation="vertical" flexItem />
                    
                    {/* Status */}
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Chip 
                        label={getStatusLabel(todo.status)}
                        size="small"
                        color={statusStyles.color}
                        variant="outlined"
                      />
                    </motion.div>
                    
                    {/* Priority */}
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Tooltip title={`Priority: ${todo.priority || 'Medium'}`}>
                        <Chip 
                          icon={getPriorityIcon(todo.priority)}
                          label={todo.priority ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1) : 'Medium'}
                          size="small"
                          color={getPriorityColor(todo.priority)}
                          variant="outlined"
                        />
                      </Tooltip>
                    </motion.div>
                    
                    {/* Other metadata */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'text.secondary' }}>
                      {/* Updated time */}
                      <Tooltip title="Last updated">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                          <Typography variant="caption">{getRelativeTime(todo.updatedAt)}</Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
                
                {/* Menu */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton 
                    aria-label="options" 
                    onClick={handleMenuOpen}
                    size="small"
                    edge="end"
                  >
                    <MoreIcon />
                  </IconButton>
                </motion.div>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* Status Change Options */}
                  {todo.status !== 'in-progress' && (
                    <motion.div whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                      <MenuItem onClick={() => handleStatusChange('in-progress')}>
                        <ListItemIcon>
                          <StartIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Start</ListItemText>
                      </MenuItem>
                    </motion.div>
                  )}
                  
                  {todo.status !== 'completed' && (
                    <motion.div whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                      <MenuItem onClick={() => handleStatusChange('completed')}>
                        <ListItemIcon>
                          <CompleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Complete</ListItemText>
                      </MenuItem>
                    </motion.div>
                  )}
                  
                  {todo.status !== 'pending' && (
                    <motion.div whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                      <MenuItem onClick={() => handleStatusChange('pending')}>
                        <ListItemIcon>
                          <ResetIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Reset to Pending</ListItemText>
                      </MenuItem>
                    </motion.div>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  {/* Edit and Delete */}
                  <motion.div whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                    <MenuItem onClick={handleEdit}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ 
                      backgroundColor: 'rgba(220,0,0,0.08)', 
                      color: 'rgb(211, 47, 47)' 
                    }}
                  >
                    <MenuItem onClick={handleDeleteClick}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </motion.div>
                </Menu>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Todo"
        content="Are you sure you want to delete this todo? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={loading}
      />
    </>
  );
};

export default TodoItem; 