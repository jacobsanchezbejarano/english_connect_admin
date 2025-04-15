import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';

const EditUnitInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [header, setHeader] = useState('Edit Unit');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setErrorMessage('Invalid Unit ID');
      return;
    }

    const fetchUnitDetails = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await api.get(`/wards/${id}`);
        if (response.status === 200 && response.data) {
          setName(response.data.ward.name || '');
          setLocation(response.data.ward.location || '');
          setHeader(response.data.ward.name || 'Edit Unit');
        } else {
          setErrorMessage('Failed to load unit details.');
        }
      } catch (error) {
        console.error('Error fetching unit details:', error);
        setErrorMessage('Failed to load unit details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUnitDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const payload = {
        name,
        location,
      };

      const response = await api.put(`/wards/${id}`, payload);

      if (response.status === 200 && response.data) {
        navigate('/units');
      } else {
        setErrorMessage(response.data?.error || 'Failed to update unit.');
      }
    } catch (error) {
      console.error('Error updating unit:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred while updating the unit.');
    }
  };

  if (loading) {
    return (
      <section className='profile'>
        <div className='container profile__container'>
          <div className='profile__details'>
            <h1>Loading Unit Information...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className='profile'>
        <div className='container profile__container'>
          <div className='profile__details'>
            <h1>Edit Unit</h1>
            <p className='form__error-message'>{errorMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='profile'>
      <div className='container profile__container'>
        <div className='profile__details'>
          <h1>Edit Unit - {header}</h1>
          <form className='form profile__form' onSubmit={handleSubmit}>
            {errorMessage && <p className='form__error-message'>{errorMessage}</p>}
            <input
              type='text'
              placeholder='Unit Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button type='submit' className='btn primary'>
              Update Unit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditUnitInfo;