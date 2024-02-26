import { initializeApp } from 'firebase/app';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import store from './store';
import { logout as logoutHandle } from './store/auth';
import { openModal } from './store/modal';
import { setTodos } from './store/todos';
import { setUserData } from './utils';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const register = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

const getReauthCredential = async (email, password) => {
  return EmailAuthProvider.credential(email, password);
};

export const reAuth = async (password) => {
  try {
    console.log(password, 'password');
    const credential = await getReauthCredential(
      auth.currentUser.email,
      password
    );

    const { user } = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    );

    toast.success('Re-authentication successful');

    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);

    return true;
  } catch (error) {
    toast.error(error.message);
  }
};

export const update = async (data) => {
  try {
    await updateProfile(auth.currentUser, data);
    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    toast.error(error.message);
  }
};

export const resetPassword = async (password) => {
  try {
    await updatePassword(auth.currentUser, password);
    toast.success('Account password changed !!');

    return true;
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      store.dispatch(
        openModal({
          name: 're-auth-modal',
        })
      );
    }
    toast.error(error.message);
  }
};

export const emailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    toast.success(`Email verification sent to ${auth.currentUser.email}`);
  } catch (error) {
    toast.error(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    setUserData();

    onSnapshot(
      query(
        collection(db, 'todos'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      ),
      (doc) => {
        store.dispatch(
          setTodos(
            doc.docs.reduce(
              (todos, todo) => [...todos, { ...todo.data(), id: todo.id }],
              []
            )
          )
        );
        // store.dispatch(setTodos());
      }
    );
  } else {
    store.dispatch(logoutHandle());
  }
});

export const addTodo = async (data) => {
  try {
    data.createdAt = serverTimestamp();
    const result = await addDoc(collection(db, 'todos'), data);
    if (result.id) {
      toast.success('Todo added successfully');
    }

    return result.id;
  } catch (error) {
    toast.error(error.message);
  }
};

export const updateTodo = async (id, data) => {
  try {
    const todoRef = doc(db, 'todos', id);

    await updateDoc(todoRef, data);

    toast.success('Todo updated successfully');
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteTodo = async (id) => {
  try {
    await deleteDoc(doc(db, 'todos', id));
  } catch (error) {
    toast.error(error.message);
  }
};

export default app;
