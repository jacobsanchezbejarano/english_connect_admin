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
      </div>
    </nav>
  )
}

export default Header
