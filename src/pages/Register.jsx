import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import api from '../utils/axiosInstance';

const Register = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const cangeInputHandler = (e) => {
        setUserData(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        })
    }

    const sendData = async (e) => {
        e.preventDefault();
        setError('');
    
        if (userData.password !== userData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        try {
            const response = await api.post('/auth/register', {
            email: userData.email,
            password: userData.password,
        });
        
        console.log('Success:', response.data);
        if (response.data && response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('accessToken stored in localStorage:', response.data.accessToken);
            navigate('/');
        } else {
            console.warn('accessToken not found in the registration response.');
            setError('Registration successful, but the authentication token was not received.');
        }
        
        } catch (error) {
            console.error('Error, not recorded:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'Try again.');
        }
    }

    return (
        <section className='register'>
            <div className='container'>
                <h2>Sign Up</h2>
                <form className='form register__form' onSubmit={sendData}>
                    {error != "" && <ErrorMessage/>}
                    <input type='email' placeholder='Email' name='email' value={userData.email} onChange={cangeInputHandler} autoFocus></input>
                    <input type='password' placeholder='Password' name='password' value={userData.password} onChange={cangeInputHandler} autoFocus></input>
                    <input type='password' placeholder='Confirm Password' name='confirmPassword' value={userData.confirmPassword} onChange={cangeInputHandler} autoFocus></input>
                    <button type='submit' className='btn primary'>Register</button>
                </form>
                <small>Already have an account?  <Link to="/login">Sign In</Link></small>
            </div>
        </section>
    )
}

export default Register
