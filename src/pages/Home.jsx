import { useAutoAnimate } from '@formkit/auto-animate/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addTodo, deleteTodo, emailVerification, logout } from '../firebase';
import { logout as logoutHandle } from '../store/auth';
import { modal } from '../utils';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [animationParent] = useAutoAnimate();

  const { user } = useSelector((state) => state.auth);
  const { todos } = useSelector((state) => state.todos);

  const [todo, setTodo] = useState('');
  const [done, setDone] = useState(false);

  const submitHandle = async (event) => {
    event.preventDefault();

    await addTodo({
      todo,
      uid: user.uid,
      done,
    });

    setTodo('');
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
  };

  const handleLogout = async () => {
    await logout();
    dispatch(logoutHandle());

    navigate('/login', { replace: true });
  };

  const handleVerification = async () => {
    await emailVerification();
  };

  if (user) {
    return (
      <>
        <h1 className='flex gap-x-4 items-center'>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt='profile'
              className='w-10 h-10 rounded-full'
            />
          )}
          Welcome abord captain!! {user.displayName} ({user.email})
          <Link
            to={'/settings'}
            className='h-8 rounded px-4 text-sm text-white flex items-center bg-indigo-700'
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className='h-8 rounded px-4 text-sm text-white bg-indigo-700'
          >
            Logout
          </button>
          {!user.emailVerified && (
            <button
              onClick={handleVerification}
              className='h-8 rounded px-4 text-sm text-white bg-indigo-700'
            >
              Verify your email
            </button>
          )}
        </h1>

        <form className='flex gap-x-4 mt-4' onSubmit={submitHandle}>
          <input
            id='addTodo'
            name='addTodo'
            type='text'
            required
            placeholder='TO-DO'
            value={todo}
            onChange={(event) => setTodo(event.target.value)}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
          <label>
            <input
              type='checkbox'
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
            />
            Mark as completed
          </label>
          <button
            disabled={!todo}
            className='flex h-8 w-32 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-40'
          >
            Add Todo
          </button>
        </form>

        <ul ref={animationParent} className='mt-4 flex flex-col gap-y-2'>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`p-4 rounded flex justify-between items-center  text-sm  ${
                todo.done
                  ? 'bg-green-100 text-green-700'
                  : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              <div className='flex flex-col gap-y-2'>
                <span className={`${todo.done ? 'line-through' : ''}`}>
                  {todo.todo}
                </span>
                {todo.createdAt && (
                  <span>{dayjs.unix(todo.createdAt.seconds).fromNow()}</span>
                )}
              </div>
              <div className='flex gap-x-2'>
                <button
                  onClick={() => modal('edit-todo-modal', todo)}
                  className='h-7 rounded px-3 text-xs bg-yellow-500 text-white'
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className='h-7 rounded px-3 text-xs bg-red-700 text-white'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {todos.length === 0 && (
            <li className='p-4 rounded flex justify-between items-center bg-orange-50 text-sm text-orange-700'>
              you haven&apos;t added any to-dos yet.
            </li>
          )}
        </ul>
      </>
    );
  }

  return (
    <div>
      <Link to={'/register'}>Kayıt Ol</Link>
      <Link to={'/login'}>Giriş yap</Link>
    </div>
  );
}
