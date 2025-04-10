import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { URL } from '../constants/url';
import { useAuth } from '../context/authContext';
import api from '../utils/axiosInstance'; // Import the axios instance

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      setError('');
      try {
        const response = await api.get(`${URL}/groups`);
        if (response.data.groups && Array.isArray(response.data.groups)) {
          setGroups(response.data.groups);
        } else {
          setError('Failed to load groups: Invalid data format.');
        }
      } catch (err) {
        console.error('Error fetching groups:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load groups.');
      }
    };

    if (isAuthenticated) {
      fetchGroups();
    } else {
      setError('You need to be logged in to view groups.');
    }
  }, [isAuthenticated]);

  return (
    <section className='container'>
      <h1 className='groups__header'>Groups</h1>
      {error && <p className='form__error-message'>{error}</p>}
      <div className="container groups__container">
        {groups.map((group) => (
          <Link to={`/groupInfo/${group._id}`} key={group._id}>
            <div className="groups">
              <h2 className="group__header">{group.name}</h2>
              {group.stake && <p className="group__desc">Stake: {group.stake.name}</p>}
              {group.ward && <p className="group__desc">Ward: {group.ward.name}</p>}
              {group.start_date && <p className="group__desc">Start Date: {new Date(group.start_date).toLocaleDateString()}</p>}
              {group.schedule && <p className="group__desc">Schedule: {group.schedule}</p>}
            </div>
          </Link>
        ))}
        <br />
        <button className='create__unit-btn'><Link to="/createGroup">Create a group</Link></button>
      </div>
    </section>
  );
};

export default Groups;