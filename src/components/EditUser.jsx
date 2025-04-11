import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { FaEdit, FaCheck } from 'react-icons/fa';

const EditUser = () => {
  const { id } = useParams();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const userData = response.data.data;
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setEmail(userData.email || '');
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        } else {
          setAvatarPreview('../images/Avatar2.jpg'); // Default avatar
        }
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data?.error || err.message || err);
        setError('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatar) {
      setError('Please select an avatar to update.');
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await api.patch(`/users/${id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Avatar updated successfully:', response.data);
      setSuccessMessage('Avatar updated successfully!');
      const userDataResponse = await api.get(`/users/${id}`);
      setAvatarPreview(userDataResponse.data.user.avatar);
      setAvatar(null); 
    } catch (err) {
      console.error('Error updating avatar:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || 'Failed to update avatar.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('New password and confirm new password do not match.');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      currentPassword,
      newPassword,
    };

    try {
      const response = await api.patch(`/users/${id}`, userData);
      console.log('User details updated successfully:', response.data);
      setSuccessMessage('User details updated successfully!');
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err) {
      console.error('Error updating user details:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || 'Failed to update user details.');
    }
  };

  return (
    <section className='profile'>
      <h1 className='student__profile-header'>Edit User</h1>
      <div className='container profile__container'>
        <div className='profile__details'>
          <div className='avatar__wrapper'>
            <div className='profile__avatar'>
              <img src={avatarPreview} alt='Profile DP' />
            </div>
            {/*Form to update avatar*/}
            <form className='avatar__form'>
              <input
                type='file'
                name='avatar'
                id='avatar'
                onChange={handleAvatarChange}
                accept='png, jpg, jpeg'
              />
              <label htmlFor='avatar'><FaEdit /></label>
            </form>
            <button className='profile__avatar-btn' onClick={handleUpdateAvatar}>
              <FaCheck />
            </button>
            {error && <p className='form__error-message'>{error}</p>}
            {successMessage && <p className='form__success-message'>{successMessage}</p>}
          </div>

          <h1>{firstName} {lastName}</h1>

          {/*Form to update user details*/}
          <form className='form profile__form' onSubmit={handleSubmit}>
            {error && <p className='form__error-message'>{error}</p>}
            {successMessage && <p className='form__success-message'>{successMessage}</p>}
            <input
              type='text'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
            />
            <input
              type='password'
              placeholder='Current password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type='password'
              placeholder='New password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type='password'
              placeholder='Confirm new password'
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type='submit' className='btn primary'>
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditUser;