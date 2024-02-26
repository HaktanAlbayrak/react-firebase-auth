import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
};

const todos = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, { payload }) => {
      state.todos = payload;
    },
    appendTodo: (state, { payload }) => {
      state.todos = [...state.todos, payload];
    },
  },
});

export const { setTodos, appendTodo } = todos.actions;
export default todos.reducer;
