import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { useAuth } from '../context/authContext';
import { countries } from '../constants/countries';

const CreateInstructor = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [stakes, setStakes] = useState([]);
  const [selectedStake, setSelectedStake] = useState('');
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await api.get('/users/ward/'+selectedWard);
        setUsers(usersResponse.data.users);
      } catch (err) {
        console.error('Error fetching users:', err.response?.data?.error || err.message || err);
        setError('Failed to load users. Please try again.');
      }
    };

    if (selectedWard) {
      fetchUsers();
    }
  }, [selectedWard]);

  useEffect(() => {
    if (selectedCountry) {
      fetchStakes(selectedCountry);
      setSelectedStake('');
      setSelectedWard('');
      setStakes([]);
      setWards([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedStake) {
      fetchWards(selectedStake);
      setSelectedWard('');
      setWards([]);
    }
  }, [selectedStake]);

  const fetchStakes = async (countryName) => {
    try {
      const response = await api.get(`/stakes/country/${countryName}`);
      setStakes(response.data.data);
    } catch (error) {
      console.error('Error fetching stakes:', error);
      setError('Failed to load stakes. Please try again.');
    }
  };

  const fetchWards = async (stakeId) => {
    try {
      const response = await api.get(`/stakes/wards/${stakeId}`);
      setWards(response.data.wards);
    } catch (error) {
      console.error('Error fetching wards:', error);
      setError('Failed to load wards. Please try again.');
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleStakeChange = (e) => {
    setSelectedStake(e.target.value);
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isAuthenticated) {
      setError('You must be logged in to create an instructor.');
      return;
    }

    if (!selectedUser || !selectedWard) {
      setError('Please select a user and a ward.');
      return;
    }

    try {
      const response = await api.post(
        `/instructors`,
        {
          userId: selectedUser,
          wardId: selectedWard,
        }
      );

      console.log('Instructor created successfully:', response.data);
      setSuccessMessage('Instructor created successfully!');
      setTimeout(() => {
        navigate('/instructors');
      }, 1500);

      setSelectedUser('');
      setSelectedWard('');
      setSelectedStake('');
      setSelectedCountry('');
      setStakes([]);
      setWards([]);
    } catch (err) {
      console.error('Error creating instructor:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || 'Failed to create instructor. Please try again.');
    }
  };

  return (
    <section className='profile'>
      <br />
      <br />
      <br />
      <div className='container profile__container'>
        <div className='profile__details'>
          <h1>Create Instructor</h1>
          {error && <p className='form__error-message'>{error}</p>}
          {successMessage && <p className='form__success-message'>{successMessage}</p>}
          <form className='form profile__form' onSubmit={handleSubmit}>
            <div className='filter__controls'>
              <label htmlFor='country'>Country:</label>
              <select id='country' value={selectedCountry} onChange={handleCountryChange} required>
                <option value=''>Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              <label htmlFor='stake'>Stake:</label>
              <select id='stake' value={selectedStake} onChange={handleStakeChange} disabled={!selectedCountry} required>
                <option value=''>Select Stake</option>
                {stakes.map((stake) => (
                  <option key={stake._id} value={stake._id}>
                    {stake.name}
                  </option>
                ))}
              </select>

              <label htmlFor='ward'>Ward:</label>
              <select id='ward' value={selectedWard} onChange={handleWardChange} disabled={!selectedStake} required>
                <option value=''>Select Ward</option>
                {wards.map((ward) => (
                  <option key={ward._id} value={ward._id}>
                    {ward.name}
                  </option>
                ))}
              </select>

              <label htmlFor='user'>User:</label>
              <select id='user' value={selectedUser} onChange={handleUserChange} required>
                <option value=''>Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <button type='submit' className='btn primary'>Create Instructor</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateInstructor;