import React, { useState, useEffect } from 'react';
import { countries } from "../constants/countries";
import api from '../utils/axiosInstance';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreateUnit = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [stakesInCountry, setStakesInCountry] = useState([]);
  const [selectedStakeId, setSelectedStakeId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    setLocation(user.wardId.location??"");
    setSelectedStakeId(user.wardId.stakeId._id??"");
  });

  useEffect(() => {
    const fetchStakesByCountry = async (country) => {
      if (!country) {
        setStakesInCountry([]);
        return;
      }
      setError('');
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/stakes/country/${country}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isAuthenticated) {
      setError('You must be logged in to create a ward.');
      return;
    }

    if (!selectedStakeId) {
      setError('Please select a stake for this ward.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post(
        `/wards`,
        {
          name: name,
          location: location,
          stakeId: selectedStakeId,
        }
      );

      setSuccessMessage('Ward created successfully!');
      setTimeout(() => {
        navigate('/units'); // Redirect to the units page or wherever appropriate
      }, 1500);

      setName('');
      setLocation('');
      setUnitNumber('');
      setStakesInCountry([]);
      setSelectedStakeId('');
    } catch (err) {
      console.error('Error creating ward:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || 'Failed to create ward. Please try again.');
    }
  };

  return (
    <section className='profile'>
      <div className='container profile__container'>
        <div className='profile__details'>
          <h1>Create Unit (Ward)</h1>
          {error && <p className='form__error-message'>{error}</p>}
          {successMessage && <p className='form__success-message'>{successMessage}</p>}
          {/*Form to update user details*/}
          <form className='form profile__form' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Ward Name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <select value={location} onChange={e => setLocation(e.target.value)} required>
              <option value="" disabled>Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            {location && stakesInCountry.length > 0 && (
              <select
                name="stakeId"
                value={selectedStakeId}
                onChange={e => setSelectedStakeId(e.target.value)}
                required
              >
                <option value="" disabled>Select Stake</option>
                {stakesInCountry.map(stake => (
                  <option key={stake._id} value={stake._id}>
                    {stake.name}
                  </option>
                ))}
              </select>
            )}
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