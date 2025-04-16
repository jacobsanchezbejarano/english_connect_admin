import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericOptions from '../components/GenericOptions';
import api from '../utils/axiosInstance';

const options = [
  {
    label: 'Edit',
    route: '/stakes/:id',
  },
  {
    label: 'Delete',
    route: '/delete/:id', // You can keep the route for potential direct navigation
  },
];

const StakeInformation = ({ stake }) => {
  const [selectedStake, setSelectedStake] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const confirmToDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete stake with ID: ${id}?`)) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/stakes/${id}`);
      if (response.status === 200) {
        navigate('/stakes'); // Or update your stake list
      } else {
        setError(`Failed to delete stake: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting stake:", error);
      setError(error.response.data.error || "An error occurred while deleting the stake.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!stake) {
      setSelectedStake(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchStakeData = async () => {
      setLoading(true);
      setError(null);
      setSelectedStake(null);

      try {
        const response = await api.get(`/stakes/${stake}`);

        if (response.status !== 200) {
          throw new Error(`Failed to fetch stake data: ${response.status} ${response.statusText}`);
        }

        const data = response.data.stake;

        if (data) {
          setSelectedStake(data);
        } else {
          setError(`Stake with ID "${stake}" not found.`);
          setSelectedStake(null);
        }
      } catch (err) {
        console.error("Error fetching stake:", err);
        setError(err.message || "An error occurred while fetching stake information.");
        setSelectedStake(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStakeData();

  }, [stake]);

  if (loading) {
    return (
      <section className='unit__information'>
        <h2 className='unit-information__header'>Stake Information</h2>
        <div className='unit-information__container'>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='unit__information'>
        <h2 className='unit-information__header'>Stake Information</h2>
        <div className='unit-information__container'>
          <p className="form__error-message">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className='unit__information'>
      <h2 className='unit-information__header'>Stake Information</h2>
      <div className='unit-information__container'>
        {selectedStake ? (
          <div className='unit__info'>
            <GenericOptions options={options} itemId={selectedStake._id} confirmToDelete={confirmToDelete} />
            <div className='unit-information__details'>
              <p><strong>Stake Name:</strong> {selectedStake.name}</p>
              <p><strong>Location:</strong> {selectedStake.location}</p>
              {selectedStake.stakeNumber && <p><strong>Stake Number:</strong> {selectedStake.stakeNumber}</p>}
            </div>
          </div>
        ) : (
          <p>{stake ? `Stake "${stake}" not found.` : 'No stake selected.'}</p>
        )}
      </div>
    </section>
  );
};

export default StakeInformation;