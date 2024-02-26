import { reAuth } from '../../firebase';
import LoginForm from '../LoginForm';

// eslint-disable-next-line react/prop-types
export default function ReAuthModal({ close }) {
  const handleSubmit = async (event, password) => {
    event.preventDefault();

    console.log(password, 'password Reauth');
    const result = await reAuth(password);
    console.log('🚀 ~ handleSubmit ~ result:', result);

    close();
  };

  return <LoginForm handleSubmit={handleSubmit} noEmail />;
}
