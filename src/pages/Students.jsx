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

const studentsData = [
  {id: 1, avatar: Avatar1, name: "Stacy Adams", course: "English Connect 1"},
  {id: 2, avatar: Avatar2, name: "Anthony Wildock", course: "English Connect 1"},
  {id: 3, avatar: Avatar3, name: "Jaden Erling", course: "English Connect 2"},
  {id: 4, avatar: Avatar4, name: "Asher Palmer", course: "English Connect 1"},
  {id: 5, avatar: Avatar5, name: "Browny Pla", course: "English Connect 1"},
  {id: 6, avatar: Avatar6, name: "John Stones", course: "English Connect 2"},
  {id: 7, avatar: Avatar7, name: "Shawn Pierre", course: "English Connect 1"},
  {id: 8, avatar: Avatar8, name: "Kingsley Stephenson", course: "English Connect 2"}
]

const options = [
  {
    label: 'Edit',
    route: '/studentProfile/:id',
  },
  {
    label: 'Delete',
    route: '/delete/:id',
  },
];

const Students = () => {
  const [students, setStudents] = useState(studentsData)
  return (
    <section className='students'>
      <h1 className='students__header'>Students</h1>
      {students.length > 0 ? <div className='container students__container'>
        {
          students.map(({id, avatar, name, course}) => {
            return <Link key={id} to={`/students/sdfsdf`} className='student'>
              <GenericOptions options={options} itemId={id}/>
               <div className='student__avatar'>
                <img src={avatar} alt={`Dp of ${name}`}></img>
               </div>
               <div className='student__info'>
                <h4>{name}</h4>
                <p>{course}</p>
               </div>
            </Link>
          })
        }
      </div> : <h2>No users/instructors found</h2> }
      <div className='add__student'>
          <button className='add__student-btn'><Link to="/createStudent/sdfsdf">Add a student</Link></button>
      </div>
    </section>
  )
}

export default Students
