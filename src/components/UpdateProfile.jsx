import { useState } from 'react';
import { useSelector } from 'react-redux';
import { resetPassword, update } from '../firebase';
import { setUserData } from '../utils';

export default function UpdateProfile() {
  const { user } = useSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [avatar, setAvatar] = useState(user.photoURL || '');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    await update({
      displayName,
      photoURL: avatar,
    });

    setUserData();
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const result = await resetPassword(password);

    if (result) {
      setPassword('');
    }
  };

  return (
    <div className='grid gap-y-10'>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Update your account
          </h2>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Name
              </label>
              <div className='mt-2'>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  placeholder='John doe'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='photo'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Profile Photo
              </label>
              <div className='mt-2'>
                <input
                  id='photo'
                  name='photo'
                  type='text'
                  placeholder='URL'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={avatar}
                  onChange={(event) => setAvatar(event.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type='submit'
                disabled={displayName === ''}
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-40'
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Update your password
          </h2>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleResetPassword} className='space-y-6'>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Password
              </label>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='*****'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type='submit'
                disabled={!password}
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-40'
              >
                Update password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
