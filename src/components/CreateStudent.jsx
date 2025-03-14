import React, { useState } from 'react'

const CreateStudent = () => {
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  return (
    <section className='create-instructor'>
      <div className='container'>
        <h2>Create Student</h2>
        <p className='form__error-message'>This is an error message</p>
        <form className='form create-instructor__form'>
          <input type='text' placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} autoFocus/>
          <input type='text' placeholder='Course' value={course} onChange={e => setCourse(e.target.value)} autoFocus/>
          <button type='submit' className='btn primary'>Create</button>
        </form>
      </div>
    </section>
  )
}

export default CreateStudent
