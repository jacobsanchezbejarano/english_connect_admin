import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvatarPlaceholder from '../images/Avatar1.jpg';
import { FaEdit } from 'react-icons/fa';
import api from '../utils/axiosInstance';
import { useAuth } from '../context/authContext';

const EditInstructor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(AvatarPlaceholder);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { authAxios } = useAuth();

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/instructors/${id}`);
        if (response.status === 200 && response.data) {
          const instructorData = response.data.data;
          setFirstName(instructorData.userId?.firstName || '');
          setLastName(instructorData.userId?.lastName || '');
          setEmail(instructorData.userId?.email || '');
        } else {
          setError('Failed to load instructor details.');
        }
      } catch (err) {
        console.error('Error fetching instructor details:', err);
        setError(err.response?.data?.error || 'Failed to load instructor details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstructorDetails();
    } else {
      setError('Invalid Instructor ID');
      setLoading(false);
    }
  }, [id, authAxios]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (avatar) {
        formData.append('avatar', avatar);
      }
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      if (newPassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
        formData.append('confirmNewPassword', confirmNewPassword);
      }

      const response = await api.put(`/instructors/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 && response.data) {
        navigate('/instructors');
      } else {
        setError(response.data?.error || 'Failed to update instructor details.');
      }
    } catch (err) {
      console.error('Error updating instructor:', err);
      setError(err.response?.data?.error || 'Failed to update instructor details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className='profile'>
        <div className='container profile__container'>
          <div className='profile__details'>
            <h1>Loading Instructor Information...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='profile'>
        <div className='container profile__container'>
          <div className='profile__details'>
            <h1>Edit Instructor</h1>
            <p className='form__error-message'>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='profile'>
      <div className='container profile__container'>
        <div className='profile__details'>
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
                accept='png, jpg, jpeg, webp'
              />
              <label htmlFor='avatar'><FaEdit /></label>
            </form>
          </div>

          <h1>Edit Instructor</h1>

          <form className='form profile__form' onSubmit={handleSubmit}>
            {error && <p className='form__error-message'>{error}</p>}
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
            <button type='submit' className='btn primary' disabled={loading}>
              {loading ? 'Updating...' : 'Update details'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditInstructor;