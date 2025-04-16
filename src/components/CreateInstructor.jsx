import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { countries } from '../constants/countries';
import { FaUserPlus } from 'react-icons/fa'; // Or a similar icon
import { useAuth } from '../context/authContext';

const CreateInstructor = () => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('../images/Avatar2.jpg'); // Default avatar
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [stakes, setStakes] = useState([]);
  const [selectedStake, setSelectedStake] = useState('');
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [userType, setUserType] = useState(11); // Default to instructor

  useEffect(()=>{
    if(selectedCountry == "") {
      setSelectedCountry(user.wardId?.location ?? "");
      setTimeout(()=>{
        setSelectedStake(user.wardId?.stakeId?._id ?? "");
      },50)
      setTimeout(()=>{
        setSelectedWard(user.wardId?._id ?? "");
      },100)
    }
  });

  useEffect(() => {
    if (selectedCountry) {
      fetchStakes(selectedCountry);
      setSelectedStake('');
      setWards([]);
      setSelectedWard('');
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedStake) {
      fetchWards(selectedStake);
      setSelectedWard('');
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // You might have a separate function to handle avatar upload during instructor creation
  // or include it in the main handleSubmit.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('user[firstName]', firstName);
    formData.append('user[lastName]', lastName);
    formData.append('user[email]', email);
    formData.append('user[password]', password);
    formData.append('wardId', selectedWard);
    formData.append('user[type]', userType);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const response = await api.post('/instructors', formData, { // Adjust the API endpoint
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Instructor created successfully!');
      setTimeout(() => {
        navigate('/instructors'); // Adjust the navigation path
      }, 1500);
    } catch (err) {
      console.error('Error creating instructor:', err.response?.data?.message || err.message || err);
      setError(err.response?.data?.message || 'Failed to create instructor.');
    }
  };

  return (
    <section className='profile'> {/* You might want a different class name */}
      <h1 className='student__profile-header'>Create Instructor</h1> {/* Adjust the header */}
      <div className='container profile__container'> {/* Reuse container style */}
        <div className='profile__details'> {/* Reuse details style */}
          <div className='avatar__wrapper'>
            <div className='profile__avatar'>
              <img src={avatarPreview} alt='Profile DP' />
            </div>
            <form className='avatar__form'>
              <input
                type='file'
                name='avatar'
                id='avatar'
                onChange={handleAvatarChange}
                accept='png, jpg, jpeg'
              />
              <label htmlFor='avatar'><FaUserPlus /></label> {/* Different icon */}
            </form>
            {error && <p className='form__error-message'>{error}</p>}
            {successMessage && <p className='form__success-message'>{successMessage}</p>}
          </div>

          <h1>Add New Instructor</h1> {/* Adjust the heading */}

          <form className='form profile__form' onSubmit={handleSubmit}> {/* Reuse form styles */}
            {error && <p className='form__error-message'>{error}</p>}
            {successMessage && <p className='form__success-message'>{successMessage}</p>}
            <input
              type='text'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type='text'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

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
            </div>

            <button type='submit' className='btn primary'>
              Create Instructor
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateInstructor;