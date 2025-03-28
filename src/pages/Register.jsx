import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'

const Register = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const cangeInputHandler = (e) => {
        setUserData(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        })
    }

    return (
        <section className='register'>
            <div className='container'>
                <h2>Sign Up</h2>
                <form className='form register__form'>
                    <ErrorMessage/>
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
