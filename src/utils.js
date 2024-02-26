import { auth } from './firebase';
import store from './store';
import { login } from './store/auth';
import { closeModal, openModal } from './store/modal';

export const modalClose = () => store.dispatch(closeModal());

export const modal = (name, data = false) =>
  store.dispatch(
    openModal({
      name,
      data,
    })
  );

export const setUserData = () => {
  store.dispatch(
    login({
      photoURL: auth.currentUser.photoURL,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      emailVerified: auth.currentUser.emailVerified,
      uid: auth.currentUser.uid,
    })
  );
};
