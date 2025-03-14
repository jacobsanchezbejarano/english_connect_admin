import React, { useState } from 'react'

const EditUnitInfo = () => {
  const [name, setName] = useState ('')
  const [location, setLocation] = useState ('')
  const [unitNumber, setUnitNumber] = useState ('')


  return (
    <section className='profile'>
      <div className='container profile__container'>

        <div className='profile__details'>

          <h1>Edit Unit - Ikot Akpaden Ward</h1>

          {/*Form to update user details*/}
          <form className='form profile__form'>
            <p className='form__error-message'>This is an error message</p>
            <input type='text' placeholder='Unit Name' value={name} onChange={e => setName(e.target.value)} />
            <input type='text' placeholder='Location' value={location} onChange={e => setLocation(e.target.value)} />
            <input type='number' placeholder='Unit Number' value={unitNumber} onChange={e => setUnitNumber(e.target.value)} />
            <button type='submit' className='btn primary'>Update details</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default EditUnitInfo