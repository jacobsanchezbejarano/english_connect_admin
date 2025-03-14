import React from 'react'
import Hero1 from '../images/HeroImage.png'
import Hero2 from '../images/HeroImage2.png'
import { Link } from 'react-router-dom'

const Welcome = () => {
  return (
    <section className='hero_image'>
        <div className='hero__image-grid'>
            <div className='hero__image-one'><img src={Hero1} alt='Hero-one' /></div>
            <div className='hero__image-two'><img src={Hero2} alt='Hero-two' /></div>
        </div>
        <div className='call__to-action'>
            <button className='call__to-action-btn'><Link to="/register">Click here to Register</Link></button>
        </div>
    </section>
  )
}

export default Welcome
