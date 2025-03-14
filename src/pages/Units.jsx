import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import UnitInformation from '../components/UnitInformation'

const Units = () => {
  const [unit, setUnit] = useState('Ikot Akpaden Nigeria Stake')

  const UNITS = ["Ikot Akpaden ward", "Ikot Isighe ward", "Mkpat Enin ward",
    "Ibotio Branch", "Ikot Ekpenyong Branch", "Ikot Ekong ward", "Ndiko Ward", "Ette Branch", 
    "Ikot Akpaden Nigeria Stake"
  ]

  return (
    <section className='create-unit'>
      <div className='container'>
        <h2>Wards and Branches</h2>
        <form className='form create-unit__form'>
          <select name='unit' value={unit} onChange={e => setUnit(e.target.value)}>
            {
              UNITS.map(items => <option key={items}>{items}</option>)
            }
          </select>
          <div className='create__unit'>
            <button className='create__unit-btn'><Link to="/createUnit">Create a unit</Link></button>
          </div>
        </form>
        <UnitInformation/>
      </div>
    </section>
  )
}

export default Units
