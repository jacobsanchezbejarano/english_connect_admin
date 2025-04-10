import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/authContext'; 
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New local loading
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const cangeInputHandler = (e) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true); // Start button loading

    try {
      await login({ username: userData.email, password: userData.password });
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false); // Stop button loading
    }
  };

  return (
    <section className='login'>
      <div className='container'>
        <h2>Sign In</h2>
        <form className='form login__form' onSubmit={handleSubmit}>
          {(localError || authError) && <ErrorMessage message={localError || authError} />}
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={userData.email}
            onChange={cangeInputHandler}
            autoFocus
            disabled={isSubmitting}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={userData.password}
            onChange={cangeInputHandler}
            disabled={isSubmitting}
          />
          <button type='submit' className='btn primary' disabled={isSubmitting}>
            {isSubmitting ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <small>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </small>
      </div>
    </section>
  );
};


export default Login;