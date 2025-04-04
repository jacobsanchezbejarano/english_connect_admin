import React from 'react'
import {useState} from 'react'

const CreateGroup = () => {
  const [name, setName] = useState('')
  const [stake, setStake] = useState('')
  const [ward, setWard] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [schedule, setSchedule] = useState('')
  return (
    <section className='create-instructor'>
      <div className='container'>
        <h2>Create a Group</h2>
        <p className='form__error-message'>This is an error message</p>
        <form className='form create-instructor__form'>
          <input type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} autoFocus/>
          <input type='text' placeholder='Stake' value={stake} onChange={e => setStake(e.target.value)} autoFocus/>
          <input type='text' placeholder='Ward' value={ward} onChange={e => setWard(e.target.value)} autoFocus/>
          <input type='text' placeholder='Start Date' value={startDate} onChange={e => setStartDate(e.target.value)} autoFocus/>
          <input type='text' placeholder='End Date' value={endDate} onChange={e => setEndDate(e.target.value)} autoFocus/>
          <input type='text' placeholder='Schedule' value={schedule} onChange={e => setSchedule(e.target.value)} autoFocus/>
          <button type='submit' className='btn primary'>Create</button>
        </form>
      </div>
    </section>
  )
}

export default CreateGroup