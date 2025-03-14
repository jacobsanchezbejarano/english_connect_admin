import React, {useState} from 'react'

import Avatar1 from '../images/Avatar1.jpg'
import Avatar2 from '../images/Avatar2.jpg'
import Avatar3 from '../images/Avatar3.jpg'
import Avatar4 from '../images/Avatar4.jpg'
import Avatar5 from '../images/Avatar5.jpg'
import Avatar6 from '../images/Avatar6.jpg'
import Avatar7 from '../images/Avatar7.jpg'
import Avatar8 from '../images/Avatar8.jpg'
import { Link } from 'react-router-dom'
import GenericOptions from '../components/GenericOptions'

const instructorsData = [
  {id: 1, avatar: Avatar1, name: "John Smith", course: "English Connect 1"},
  {id: 2, avatar: Avatar2, name: "William Jones", course: "English Connect 1"},
  {id: 3, avatar: Avatar3, name: "Emma Brown", course: "English Connect 2"},
  {id: 4, avatar: Avatar4, name: "Kelly Snow", course: "English Connect 1"},
  {id: 5, avatar: Avatar5, name: "Anthony Kilpack", course: "English Connect 1"},
  {id: 6, avatar: Avatar6, name: "Paul Martin", course: "English Connect 2"},
  {id: 7, avatar: Avatar7, name: "Harry Kim", course: "English Connect 1"},
  {id: 8, avatar: Avatar8, name: "Samuel Jackson", course: "English Connect 2"}
]

const options = [
  {
    label: 'Edit',
    route: '/instructorProfile/:id',
  },
  {
    label: 'Delete',
    route: '/delete/:id',
  },
];

const Instructors = () => {
  const [instructors, setInstructors] = useState(instructorsData)
  return (
    <section className='instructors'>
      <h1 className='instructors__header'>Instructors</h1>
      {instructors.length > 0 ? <div className='container instructors__container'>
        {
          instructors.map(({id, avatar, name, course}) => {
            return <Link key={id} to={`/instructors/sdfsdf`} className='instructor'>
              <GenericOptions options={options} itemId={id}/>
               <div className='instructor__avatar'>
                <img src={avatar} alt={`Dp of ${name}`}></img>
               </div>
               <div className='instructor__info'>
                <h4>{name}</h4>
                <p>{course}</p>
               </div>
            </Link>
          })
        }
      </div> : <h2>No users/instructors found</h2> }
      <div className='add__instructor'>
          <button className='add__instructor-btn'><Link to="/createInstructor/sdfsdf">Add an instructor</Link></button>
      </div>
    </section>
  )
}

export default Instructors
