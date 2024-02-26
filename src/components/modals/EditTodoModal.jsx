/* eslint-disable react/prop-types */
import { useState } from 'react';
import { updateTodo } from '../../firebase';

export default function EditTodoModal({ close, data }) {
  const [todo, setTodo] = useState(data.todo);
  const [done, setDone] = useState(data.done);

  const handleUpdateTodo = async () => {
    await updateTodo(data.id, {
      todo,
      done,
    });
    close();
  };

  return (
    <div className='flex flex-col gap-y-4'>
      <input
        type='text'
        placeholder='Update TO-DO'
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
      />
      <div className='flex items-center mb-4'>
        <input
          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
          id='default-checkbox'
          type='checkbox'
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
        />
        <label
          htmlFor='default-checkbox'
          className='ms-2 text-sm font-medium text-black'
        >
          Mark as completed
        </label>
      </div>
      <button
        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-40'
        disabled={!todo}
        onClick={handleUpdateTodo}
      >
        Save
      </button>
    </div>
  );
}
