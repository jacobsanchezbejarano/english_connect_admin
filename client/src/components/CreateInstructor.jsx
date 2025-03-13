import React, { useState } from 'react'

const CreateInstructor = () => {
    const [name, setName] = useState('');
    const [course, setCourse] = useState('')
  return (
    <section className='create__instructor'>
        <div className='container'>
            <h2>Create an Instructor</h2>
            <p className='form__error-message'>
                This is an error message
            </p>
            <form className='form create-instructor__form'>
                <input type='text' placeholder='Full Name'></input>
            </form>
        </div>
    </section>
  )
}

export default CreateInstructor
