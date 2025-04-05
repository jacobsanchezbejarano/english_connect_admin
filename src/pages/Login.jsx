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
  const [localError, setLocalError] = useState(''); // Local error for form handling
  const { login, error: authError, loading } = useAuth(); // Get login function, error, and loading from context
  const navigate = useNavigate();

  const cangeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState, [e.target.name]: e.target.value};
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(''); // Clear local error
    try {
      await login({ username: userData.email, password: userData.password });
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setLocalError(err.message || 'Login failed. Please try again.');
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
            disabled={loading}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={userData.password}
            onChange={cangeInputHandler}
            disabled={loading}
          />
          <button type='submit' className='btn primary' disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
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