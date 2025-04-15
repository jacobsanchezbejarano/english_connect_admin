import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';

const EditStakeInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStakeDetails = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await api.get(`/stakes/${id}`);
        if (response.status === 200 && response.data.stake) {
          setName(response.data.stake.name || '');
          setLocation(response.data.stake.location || '');
        } else {
          setErrorMessage('Failed to load stake details.');
        }
      } catch (error) {
        console.error('Error fetching stake details:', error);
        setErrorMessage('Failed to load stake details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStakeDetails();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const payload = {
        name,
        location,
      };

      const response = await api.put(`/stakes/${id}`, payload);

      if (response.status === 200 && response.data.message === 'Stake updated successfully') {
        navigate('/stakes');
      } else {
        setErrorMessage(response.data?.error || 'Failed to update stake.');
      }
    } catch (error) {
      console.error('Error updating stake:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred while updating the stake.');
    }
  };

  if (loading && id) {
    return (
      <section className='profile'>
        <div className='container profile__container'>
          <div className='profile__details'>
            <h1>Loading Stake Information...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (!id) {
    return (
      <section className='profile'>
        <div className='container profile__container'>
          <div className='profile__details'>
            <h1>Invalid Stake ID</h1>
            <p>No stake ID provided for editing.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='profile'>
      <div className='container profile__container'>
        <div className='profile__details'>
          <h1>Edit Stake</h1>

          {errorMessage && <p className='form__error-message'>{errorMessage}</p>}

          {/*Form to update stake details*/}
          <form className='form profile__form' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Stake Name'
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
              Update Stake
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditStakeInfo;