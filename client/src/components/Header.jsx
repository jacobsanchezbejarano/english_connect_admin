import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../images/Logo.png'
import {AiOutlineClose} from "react-icons/ai"

const Header = () => {
  return (
    <nav>
      <div className='container nav__container'>
        <Link to="/" className='nav__logo'>
          <img src={Logo} alt='Navbar Logo' />
        </Link>
        <ul className='nav__menu'>
          <li><Link to="/attendance">Attendance</Link></li>
          <li><Link to="/students">Student List</Link></li>
          <li><Link to="/create">Create Instructor</Link></li>
          <li><Link to="/units">Wards & Branches</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
        <button className='nav__toggle-btn'>
          <AiOutlineClose/>
        </button>
      </div>
    </nav>
  )
}

export default Header
