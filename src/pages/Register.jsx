import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import api from '../utils/axiosInstance';
import { useAuth } from '../context/authContext'; 

const Register = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // New local loading
    const { login, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (!userData.email || !userData.password || !userData.confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        try {
            setIsSubmitting(true); // Start button loading
            await api.post('/auth/register', {
                email: userData.email,
                password: userData.password,
            });
        
            const success = await login({ username: userData.email, password: userData.password });
            if (success) {
                navigate('/');
            } else {
                setError('Login failed');
            }
        
        } catch (error) {
            setError(error.response?.data?.error || setError(authError) || 'Try again.');
        }
        finally {
            setIsSubmitting(false); // Stop button loading
        }
    }

    return (
        <section className='register'>
            <div className='container'>
                <h2>Student Sign Up</h2>
                <form className='form register__form' onSubmit={handleSubmit}>
                    {(error) && <ErrorMessage message={error} />}
                    <input type='email' placeholder='Email' name='email' value={userData.email} onChange={handleChange} autoFocus></input>
                    <input type='password' placeholder='Password' name='password' value={userData.password} onChange={handleChange}></input>
                    <input type='password' placeholder='Confirm Password' name='confirmPassword' value={userData.confirmPassword} onChange={handleChange}></input>
                    <button type='submit' className='btn primary' disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <small>Already have an account?  <Link to="/login">Sign In</Link></small>
            </div>
        </section>
    )
}

export default Register
