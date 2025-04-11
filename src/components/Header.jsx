import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../images/Logo.png'
import {FaBars} from "react-icons/fa"
import {AiOutlineClose} from "react-icons/ai"

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800 ? true : false)

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false)
    } else {
      setIsNavShowing(true)
    }
  }
  return (
    <nav>
      <div className='container nav__container'>
        <Link to="/" className='nav__logo' onClick={closeNavHandler}>
          <img src={Logo} alt='Navbar Logo' />
        </Link>
        {isNavShowing && <ul className='nav__menu'>
          <li><Link to="/" onClick={closeNavHandler}>Home</Link></li>
          <li><Link to="/attendance" onClick={closeNavHandler}>Attendance</Link></li>
          <li><Link to="/students/sdfsdf" onClick={closeNavHandler}>Students</Link></li>
          <li><Link to="/instructors/sdfsdf" onClick={closeNavHandler}>Instructors</Link></li>
          <li><Link to="/groups" onClick={closeNavHandler}>Groups</Link></li>
          <li><Link to="/stakes" onClick={closeNavHandler}>Stakes</Link></li>
          <li><Link to="/units" onClick={closeNavHandler}>Wards & Branches</Link></li>
          <li><Link to="/statistics" onClick={closeNavHandler}>Statistics</Link></li>
          <li><Link to="/register" onClick={closeNavHandler}>Register</Link></li>
          <li><Link to="/login" onClick={closeNavHandler}>Login</Link></li>
        </ul>}
        <button className='nav__toggle-btn' onClick={() => setIsNavShowing(!isNavShowing)}>
          {isNavShowing ? <AiOutlineClose/> : <FaBars/>}
        </button>
      </div>
    </nav>
  )
}

export default Header
