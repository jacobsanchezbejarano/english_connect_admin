import React from 'react'
import { Link } from 'react-router-dom';

const Groups = () => {
  const groups = [
    { name: 'English Connect 1', description: 'Beginner levels course focused on basic communication skills.' },
    { name: 'English Connect 2', description: 'Intermediate levels course aimed at enhancing fluency and comprehension.' },
    { name: 'English Connect 3', description: 'Advanced levels course designed to refine language skills and accuracy.' }
  ];

  return (
    <section className='container'>
      <h1 className='groups__header'>Groups</h1>
        <div className="container groups__container">
        {groups.map((group, index) => (
          <Link to="/groupInfo">
            <div key={index} className="groups">
              <h2 className="group__header">{group.name}</h2>
              <p className="group__desc">{group.description}</p>
            </div>
          </Link>
        ))}
        <button className='create__unit-btn'><Link to="/createGroup">Create a group</Link></button>
        </div>
    </section>
  )
}

export default Groups;
