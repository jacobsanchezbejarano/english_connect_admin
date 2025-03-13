import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <ul className='footer__categories'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/instructors/sdfsdf">Instructors</Link></li>
        <li><Link to="/">Social Handle</Link></li>
      </ul>
      <div className='footer__copyright'>
        <small>All Rights Reserved &copy; Copyright, English Connect Admin.</small>
      </div>
    </footer>
  )
}

export default Footer