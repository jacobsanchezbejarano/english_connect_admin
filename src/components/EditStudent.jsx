import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { FaEdit, FaCheck } from 'react-icons/fa';
import { countries } from '../constants/countries';

const EditStudent = () => {
  const { id } = useParams();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [language, setLanguage] = useState('Spanish');
  const [level, setLevel] = useState('EC1');
  const [churchMembership, setChurchMembership] = useState('Member');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.get(`/students/${id}`);
        const studentData = response.data.data;
        setBirthDate(studentData.birthDate ? studentData.birthDate.substring(0, 10) : '');
        setLanguage(studentData.language || 'Spanish');
        setLevel(studentData.level || 'EC1');
        setChurchMembership(studentData.churchMembership || 'Member');
        
        if (studentData.userId?.avatar) {
          setAvatarPreview(studentData.userId.avatar);
        } else {
          setAvatarPreview('../images/Avatar2.jpg');
        }
      } catch (err) {
        console.error('Error fetching student data:', err.response?.data?.error || err.message || err);
        setError('Failed to load student data.');
      }
    };

    fetchStudentData();
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

      const response = await api.put(`/students/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Avatar updated successfully:', response.data);
      setSuccessMessage('Avatar updated successfully!');
      const studentDataResponse = await api.get(`/students/${id}`);
      setAvatarPreview(studentDataResponse.data.student.userId?.avatar || '../images/Avatar2.jpg');
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

    const studentData = {
      birthDate,
      language,
      level,
      churchMembership,
    };

    try {
      const response = await api.put(`/students/${id}`, studentData);
      console.log('Student details updated successfully:', response.data);
      setSuccessMessage('Student details updated successfully!');
      setTimeout(() => {
        navigate('/students');
      }, 1500);
    } catch (err) {
      console.error('Error updating student details:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || 'Failed to update student details.');
    }
  };

  return (
    <section className='profile'>
      <h1 className='student__profile-header'>Edit Student</h1>
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

          <form className='form profile__form' onSubmit={handleSubmit}>
            {error && <p className='form__error-message'>{error}</p>}
            {successMessage && <p className='form__success-message'>{successMessage}</p>}

            <label htmlFor="birthDate">Birth Date:</label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />

            <label htmlFor="language">Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Italian">Italian</option>
            </select>

            <label htmlFor="level">Level:</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="EC1">EC1</option>
              <option value="EC2">EC2</option>
            </select>

            <label htmlFor="churchMembership">Church Membership:</label>
            <select
              id="churchMembership"
              value={churchMembership}
              onChange={(e) => setChurchMembership(e.target.value)}
            >
              <option value="Member">Member</option>
              <option value="Non-member">Non-member</option>
            </select>

            <button type='submit' className='btn primary'>
              Update Student Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditStudent;