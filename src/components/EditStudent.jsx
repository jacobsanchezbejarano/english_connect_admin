import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
//import { FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/authContext';

const EditStudent = () => {
  const [student, setStudent] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [addressInfo, setAddressInfo] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  //const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const { data } = await api.get(`/students/user/${user.id}`);
        const studentData = data.data;
        setStudent(studentData);
        setUserInfo({
          firstName: studentData.userId.firstName || '',
          lastName: studentData.userId.lastName || '',
          phone: studentData.userId.phone || '',
          birthDate: studentData.birthDate ? studentData.birthDate.substring(0, 10) : '',
          language: studentData.language || 'Spanish',
          level: studentData.level || 'EC1',
          churchMembership: studentData.churchMembership || 'Member',
        });
        setAddressInfo({
          street: studentData.addressId?.street || '',
          neighborhood: studentData.addressId?.neighborhood || '',
          city: studentData.addressId?.city || '',
          state: studentData.addressId?.state || '',
          country: studentData.addressId?.country || '',
          postalCode: studentData.addressId?.postalCode || '',
        });
        setAvatarPreview(studentData.userId.avatar || '../images/Avatar2.jpg');
      } catch (err) {
        console.error(err);
        setError('Failed to load student data');
      }
    };
    fetchData();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatar || !student._id) return;
    const formData = new FormData();
    formData.append('avatar', avatar);
    setIsSubmitting(true);
    try {
      await api.put(`/students/upload/${student._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Avatar updated!');
      setAvatar(null);
    } catch (err) {
      setError('Failed to update avatar');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Update Student info
      await api.put(`/students/${student._id}`, {
        birthDate: userInfo.birthDate,
        language: userInfo.language,
        level: userInfo.level,
        churchMembership: userInfo.churchMembership,
      });

      // Update User info
      await api.put(`/users/${user.id}`, {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: userInfo.phone,
      });

      // Update or create address
      if (student.addressId) {
        await api.put(`/address/${student.addressId._id}`, addressInfo);
      } else {
        const { data } = await api.post('/address', addressInfo);
        await api.put(`/students/${student._id}/address`, { addressId: data.data._id });
      }

      setSuccess('Student updated successfully!');
      //setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to update student info');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='profile'>
      <h1 className="student__profile-header">Edit Student</h1>
      <div className='container profile__container'>
        <div className='profile__details'>
          {/* Avatar Section */}
          <div className='avatar__wrapper'>
            <div className='profile__avatar'>
              <img src={avatarPreview || null} alt='Avatar Preview' />
            </div>
            <input type='file' accept='image/*' onChange={handleAvatarChange} />
            <button
              onClick={handleUpdateAvatar}
              type="submit"
              className="btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Avatar"}
            </button>
          </div>

          {/* Form Section */}
          <form className='form profile__form' onSubmit={handleSubmit}>
            {error && <p className='form__error-message'>{error}</p>}
            {success && <p className='form__success-message'>{success}</p>}

            <h3>General Info</h3>
            <input type='text' placeholder='First Name' value={userInfo.firstName} onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })} />
            <input type='text' placeholder='Last Name' value={userInfo.lastName} onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })} />
            <input type='date' value={userInfo.birthDate} onChange={(e) => setUserInfo({ ...userInfo, birthDate: e.target.value })} />
            <input type='text' placeholder='Phone' value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />

            <label>Language</label>
            <select value={userInfo.language} onChange={(e) => setUserInfo({ ...userInfo, language: e.target.value })}>
              <option>Spanish</option>
              <option>French</option>
              <option>Portuguese</option>
              <option>Italian</option>
            </select>

            <label>Level</label>
            <select value={userInfo.level} onChange={(e) => setUserInfo({ ...userInfo, level: e.target.value })}>
              <option>EC1</option>
              <option>EC2</option>
            </select>

            <label>Church Membership</label>
            <select value={userInfo.churchMembership} onChange={(e) => setUserInfo({ ...userInfo, churchMembership: e.target.value })}>
              <option>Member</option>
              <option>Non-member</option>
            </select>

            <h3>Address Info</h3>
            <input type='text' placeholder='Street' value={addressInfo.street} onChange={(e) => setAddressInfo({ ...addressInfo, street: e.target.value })} />
            <input type='text' placeholder='Neighborhood' value={addressInfo.neighborhood} onChange={(e) => setAddressInfo({ ...addressInfo, neighborhood: e.target.value })} />
            <input type='text' placeholder='City' value={addressInfo.city} onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })} />
            <input type='text' placeholder='State' value={addressInfo.state} onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })} />
            <input type='text' placeholder='Country' value={addressInfo.country} onChange={(e) => setAddressInfo({ ...addressInfo, country: e.target.value })} />
            <input type='text' placeholder='Postal Code' value={addressInfo.postalCode} onChange={(e) => setAddressInfo({ ...addressInfo, postalCode: e.target.value })} />

            <button
              type="submit"
              className="btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Student"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditStudent;
