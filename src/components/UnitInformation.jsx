import React, {useState} from 'react'

import { Link } from 'react-router-dom'
import GenericOptions from '../components/GenericOptions'

const unitInformationData = [
  {id: 1, name: "Ikot Akpaden Ward", location: "Nigeria", unitNumber: "12345"},
]

const options = [
  {
    label: 'Edit',
    route: '/unitInfo/:id',
  },
  {
    label: 'Delete',
    route: '/delete/:id',
  },
];

const UnitInformation = () => {
  const [units, setUnits] = useState(unitInformationData)
  return (
    <section className='unit__information'>
      <h2 className='unit-information__header'>Unit Information</h2>
      <div className='unit-information__container'>
        {
          units.map(({id, name, location, unitNumber}) => {
            return <Link key={id} to={`/units`} className='unit__info'>
              <GenericOptions options={options} itemId={id}/>
               <div className='unit-information__details'>
                <p><strong>Unit Name:</strong> {name}</p>
                <p><strong>Location:</strong> ({location})</p>
                <p><strong>Unit Number:</strong> ({unitNumber})</p>
               </div>
            </Link>
          })
        }
      </div>
    </section>
  )
}

export default UnitInformation
