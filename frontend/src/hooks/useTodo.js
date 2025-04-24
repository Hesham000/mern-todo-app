import { useContext } from 'react';
import TodoContext from '../context/TodoContext';

const useTodo = () => {
  return useContext(TodoContext);
};

export default useTodo; 