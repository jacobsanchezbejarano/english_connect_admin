import React, { useState } from 'react'

const CreateStudent = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [course, setCourse] = useState('Course')
  const [stake, setStake] = useState('Choose your stake')
  const [unit, setUnits] = useState('Choose your unit')

  const COURSES = ["Course","English Connect 1", "English Connect 2"]
  const STAKES = ["Choose your stake","Onna Stake", "North Central Stake", "South East Stake", "East West Stake"]
  const UNITS = ["Choose your unit","Ikot Akpaden ward", "Ikot Isighe ward", "Mkpat Enin ward",
    "Ibotio Branch", "Ikot Ekpenyong Branch", "Ikot Ekong ward", "Ndiko Ward", "Ette Branch", 
  ]
  return (
    <section className='create-instructor'>
      <div className='container'>
        <h2>Create Student</h2>
        <p className='form__error-message'>This is an error message</p>
        <form className='form create-instructor__form'>
          <input type='text' placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} autoFocus/>
          <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
          <input type='number' placeholder='Phone: xxx xxx xxx' value={phone} onChange={e => setPhone(e.target.value)}/>
          <input type='date' placeholder='Birth Date' id='birthdate' value={birthDate} onChange={e => setBirthDate(e.target.value)}/>
          <select name='course' value={course} onChange={e => setCourse(e.target.value)}>
            {
              COURSES.map(courses => <option key={courses}>{courses}</option>)
            }
          </select>
          <select name='stake' value={stake} onChange={e => setStake(e.target.value)}>
            {
              STAKES.map(stakes => <option key={stakes}>{stakes}</option>)
            }
          </select>
          <select name='unit' value={unit} onChange={e => setUnits(e.target.value)}>
            {
              UNITS.map(units => <option key={units}>{units}</option>)
            }
          </select>
          <button type='submit' className='btn primary'>Create</button>
        </form>
      </div>
    </section>
  )
}

export default CreateStudent
