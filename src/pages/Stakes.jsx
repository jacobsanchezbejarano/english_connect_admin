import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StakeInformation from '../components/StakeInformation';
import { URL } from '../constants/url';
import { useAuth } from '../context/authContext'; // Assuming AuthContext is one level up
import api from '../utils/axiosInstance'; // Import the axios instance

const Stakes = () => {
  const [selectedStake, setSelectedStake] = useState('');
  const [stakes, setStakes] = useState(['Select a Stake']);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchStakes = async () => {
      setError('');
      try {
        const response = await api.get(`${URL}/stakes`, {
        });
        if (response.data && Array.isArray(response.data.data)) {
          // Extract stake names from the response data.data
          const stakeNames = response.data.data.map(stake => stake.name);
          setStakes(['Select a Stake', ...stakeNames]);
        } else {
          setError('Failed to load stakes: Invalid data format.');
        }
      } catch (err) {
        console.error('Error fetching stakes:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load stakes.');
      }
    };

    if (isAuthenticated) {
      fetchStakes();
    } else {
      setError('You need to be logged in to view stakes.');
    }
  }, [isAuthenticated]);

  return (
    <section className='create-unit'>
      <div className='container'>
        <h2>Stakes</h2>
        {error && <p className='form__error-message'>{error}</p>}
        <form className='form create-unit__form'>
          <select name='stake' value={selectedStake} onChange={e => setSelectedStake(e.target.value)}>
            {stakes.map(stakeName => (
              <option key={stakeName} value={stakeName}>
                {stakeName}
              </option>
            ))}
          </select>
          <div className='create__unit'>
            <button className='create__unit-btn'><Link to="/createStake">Create a stake</Link></button>
          </div>
        </form>
        <StakeInformation stake={selectedStake} />
      </div>
    </section>
  );
};

export default Stakes;