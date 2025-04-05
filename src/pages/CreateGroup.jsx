import React, { useState, useEffect } from 'react';
import { countries } from "../constants/countries";
import { URL } from '../constants/url';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [stakesInCountry, setStakesInCountry] = useState([]);
  const [selectedStakeId, setSelectedStakeId] = useState('');
  const [wardsInStake, setWardsInStake] = useState([]);
  const [ward, setWard] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [schedule, setSchedule] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { isAuthenticated } = useAuth();

  // Fetch stakes by country
  useEffect(() => {
    const fetchStakesByCountry = async (country) => {
      if (!country) {
        setStakesInCountry([]);
        setSelectedStakeId('');
        setWardsInStake([]);
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
          setError('Failed to load stakes for the selected country.');
          setStakesInCountry([]);
          setSelectedStakeId('');
          setWardsInStake([]);
        }
      } catch (err) {
        console.error('Error fetching stakes by country:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load stakes for the selected country.');
        setStakesInCountry([]);
        setSelectedStakeId('');
        setWardsInStake([]);
      }
    };

    if (isAuthenticated && selectedCountry) {
      fetchStakesByCountry(selectedCountry);
    } else {
      setStakesInCountry([]);
      setSelectedStakeId('');
      setWardsInStake([]);
    }
  }, [selectedCountry, isAuthenticated]);

  // Fetch wards by stake
  useEffect(() => {
    const fetchWardsByStake = async (stakeId) => {
      if (!stakeId) {
        setWardsInStake([]);
        return;
      }
      setError('');
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${URL}/stakes/wards/${stakeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data.wards)) {
          setWardsInStake(response.data.wards);
        } else {
          setError('Failed to load wards for the selected stake.');
          setWardsInStake([]);
        }
      } catch (err) {
        console.error('Error fetching wards by stake:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load wards for the selected stake.');
        setWardsInStake([]);
      }
    };

    if (isAuthenticated && selectedStakeId) {
      fetchWardsByStake(selectedStakeId);
    } else {
      setWardsInStake([]);
    }
  }, [selectedStakeId, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isAuthenticated) {
      setError('You must be logged in to create a group.');
      return;
    }

    if (!selectedCountry) {
      setError('Please select a country.');
      return;
    }

    if (!selectedStakeId) {
      setError('Please select a stake.');
      return;
    }


    console.log({
      name,
      selectedCountry,
      selectedStakeId,
      selectedWardId: ward,
      startDate,
      endDate,
      schedule,
    });

    setName('');
    setSelectedCountry('');
    setStakesInCountry([]);
    setSelectedStakeId('');
    setWardsInStake([]);
    setStartDate('');
    setEndDate('');
    setSchedule('');
    setSuccessMessage('Group data logged (submission logic not yet implemented).');
  };

  return (
    <section className='create-instructor'>
      <div className='container'>
        <h2>Create a Group</h2>
        {error && <p className='form__error-message'>{error}</p>}
        {successMessage && <p className='form__success-message'>{successMessage}</p>}
        <form className='form create-instructor__form' onSubmit={handleSubmit}>
          <input type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} required autoFocus />

          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} required>
            <option value="" disabled>Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>

          {selectedCountry && stakesInCountry.length > 0 && (
            <select value={selectedStakeId} onChange={e => setSelectedStakeId(e.target.value)} required>
              <option value="" disabled>Select Stake</option>
              {stakesInCountry.map(stake => (
                <option key={stake._id} value={stake._id}>
                  {stake.name}
                </option>
              ))}
            </select>
          )}

          {selectedStakeId && wardsInStake.length > 0 && (
            <select value={ward} onChange={e => setWard(e.target.value)} required>
              <option value="" disabled>Select Ward</option>
              {wardsInStake.map(wardItem => (
                <option key={wardItem._id} value={wardItem._id}>
                  {wardItem.name}
                </option>
              ))}
            </select>
          )}

          <input type='date' placeholder='Start Date' value={startDate} onChange={e => setStartDate(e.target.value)} required />
          <input type='date' placeholder='End Date' value={endDate} onChange={e => setEndDate(e.target.value)} required />
          <input type='text' placeholder='Schedule' value={schedule} onChange={e => setSchedule(e.target.value)} required />

          <button type='submit' className='btn primary'>Create</button>
        </form>
      </div>
    </section>
  );
};

export default CreateGroup;