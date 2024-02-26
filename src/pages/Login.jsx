import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../firebase';

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (event, password, email) => {
    event.preventDefault();

    const user = await login(email, password);

    if (user) {
      navigate('/', {
        replace: true,
      });
    }
  };

  return <LoginForm handleSubmit={handleSubmit} />;
}
