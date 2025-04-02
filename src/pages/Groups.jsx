import React from 'react'
import { Link } from 'react-router-dom';

const Groups = () => {
  const groups = [
    { name: 'English Connect 1', description: 'Beginner level course focused on basic communication skills.' },
    { name: 'English Connect 2', description: 'Intermediate level course aimed at enhancing fluency and comprehension.' },
    { name: 'English Connect 3', description: 'Advanced level course designed to refine language skills and accuracy.' }
  ];

  return (
    <section className='container'>
        <div className="container groups__container">
        {groups.map((group, index) => (
            <div key={index} className="groups">
            <h2 className="text-xl font-bold mb-2">{group.name}</h2>
            <p className="text-gray-600">{group.description}</p>
            <Link to={group.link}>
            <button className="btn primary">View Info</button>
            </Link>
            </div>
        ))}
        </div>
    </section>
  )
}

export default Groups;
