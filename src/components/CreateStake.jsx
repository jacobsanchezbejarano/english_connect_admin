import React, { useState } from 'react';
import { countries } from "../constants/countries";
import api from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/authContext'; // Assuming AuthContext is one level up

const CreateStake = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [stakeNumber, setStakeNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Correctly destructure user and isAuthenticated

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isAuthenticated) {
      setError('You must be logged in to create a stake.');
      return;
    }

    try {
      const response = await api.post(
        `/stakes`,
        {
          name: name,
          location: location,
        }
      );

      console.log('Stake created successfully:', response.data);
      setSuccessMessage('Stake created successfully!');
      setTimeout(() => {
        navigate('/stakes');
      }, 1500);

      setName('');
      setLocation('');
      setStakeNumber('');
    } catch (err) {
      console.error('Error creating stake:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || 'Failed to create stake. Please try again.');
    }
  };

  return (
    <section className='profile'>
      <div className='container profile__container'>
        <div className='profile__details'>
          <h1>Create Stake</h1>
          {error && <p className='form__error-message'>{error}</p>}
          {successMessage && <p className='form__success-message'>{successMessage}</p>}
          {/*Form to update user details*/}
          <form className='form profile__form' onSubmit={handleSubmit}>
            <select value={location} onChange={e => setLocation(e.target.value)} required>
              <option value="" disabled>Select Location</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            <input
              type='text'
              placeholder='Stake Name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            {/* <input
              type='number'
              placeholder='Stake Number'
              value={stakeNumber}
              onChange={e => setStakeNumber(e.target.value)}
            /> */}
            <button type='submit' className='btn primary'>Create Stake</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateStake;