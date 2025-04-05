import React, { useState, useEffect } from 'react';
import { countries } from "../constants/countries";
import { URL } from '../constants/url';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const CreateUnit = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [stakesInCountry, setStakesInCountry] = useState([]);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchStakesByCountry = async (country) => {
      if (!country) {
        setStakesInCountry([]);
        return;
      }
      setError('');
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${URL}/stakes/country/${country}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data.data)) {
          setStakesInCountry(response.data.data);
        } else {
          setError('Failed to load stakes for the selected country: Invalid data format.');
          setStakesInCountry([]);
        }
      } catch (err) {
        console.error('Error fetching stakes by country:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load stakes for the selected country.');
        setStakesInCountry([]);
      }
    };

    if (isAuthenticated && location) {
      fetchStakesByCountry(location);
    } else {
      setStakesInCountry([]);
    }
  }, [location, isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend to create a ward
    // You would likely want to include the selected stake (from stakesInCountry)
    // in this submission, along with the ward name (which is currently 'name').
    console.log({ wardName: name, location, unitNumber, stakesInCountry });
    // Reset the form after submission (optional)
    setName('');
    setLocation('');
    setUnitNumber('');
    setStakesInCountry([]); // Optionally clear the stakes dropdown
  };

  return (
    <section className='profile'>
      <div className='container profile__container'>
        <div className='profile__details'>
          <h1>Create Unit (Ward)</h1>
          {error && <p className='form__error-message'>{error}</p>}
          {/*Form to update user details*/}
          <form className='form profile__form' onSubmit={handleSubmit}>
            <select value={location} onChange={e => setLocation(e.target.value)} required>
              <option value="" disabled>Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            {location && stakesInCountry.length > 0 && (
              <select name="stake" required>
                <option value="" disabled>Select Stake</option>
                {stakesInCountry.map(stake => (
                  <option key={stake._id} value={stake._id}>
                    {stake.name}
                  </option>
                ))}
              </select>
            )}
            
            <input
              type='text'
              placeholder='Ward Name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            {location && stakesInCountry.length === 0 && error === '' && (
              <p>No stakes found in {location}.</p>
            )}

            {/* The backend schema for Ward might include unitNumber, adjust accordingly */}
            <input
              type='number'
              placeholder='Ward Number (Optional)'
              value={unitNumber}
              onChange={e => setUnitNumber(e.target.value)}
            />
            <button type='submit' className='btn primary'>Create Ward</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateUnit;