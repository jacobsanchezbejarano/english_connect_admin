import React, { useState } from 'react'
import Avatar from '../images/Avatar2.jpg'
import { FaEdit } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'

const EditStudent = () => {
  const [avatar, setAvatar] = useState(Avatar)
  const [firstName, setFirstName] = useState ('')
  const [lastName, setLastName] = useState ('')
  const [email, setEmail] = useState ('')
  const [currentPassword, setCurrentPassword] = useState ('')
  const [newPassword, setNewPassword] = useState ('')
  const [confirmNewPassword, setConfirmNewPassword] = useState ('')

  return (
    <section className='profile'>
        <h1 className='student__profile-header'>My profile</h1>
      <div className='container profile__container'>

        <div className='profile__details'>
          <div className='avatar__wrapper'>
            <div className='profile__avatar'>
              <img src={avatar} alt='Profile DP'/>
            </div>
            {/*Form to update avatar*/}
            <form className='avatar__form'>
              <input type='file' name='avatar' id='avatar' onChange={e => setAvatar(e.target.files[0])} accept='png, jpg, jpeg'/>
              <label htmlFor='avatar'><FaEdit/></label>
            </form>
            <button className='profile__avatar-btn'><FaCheck/></button>
          </div>

          <h1>Stacy Adams</h1>

          {/*Form to update user details*/}
          <form className='form profile__form'>
            <p className='form__error-message'>This is an error message</p>
            <input type='text' placeholder='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input type='text' placeholder='Last Name' value={lastName} onChange={e => setLastName(e.target.value)} />
            <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
            <input type='password' placeholder='Current password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type='password' placeholder='New password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type='password' placeholder='Confirm new password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            <button type='submit' className='btn primary'>Update details</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default EditStudent