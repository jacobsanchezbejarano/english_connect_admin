import React, { useState, useEffect } from 'react';
import GenericOptions from '../components/GenericOptions';
import api from '../utils/axiosInstance';

const options = [
  {
    label: 'Edit',
    route: '/stakeInfo/:id',
  },
  {
    label: 'Delete',
    route: '/delete/:id',
  },
];

const StakeInformation = ({ stake }) => {
  const [selectedStake, setSelectedStake] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(stake)

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

  }, [stake]); // Changed dependency to stake

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
          <p style={{ color: 'red' }}>Error: {error}</p>
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
            <GenericOptions options={options} itemId={selectedStake._id} /> {/* Use _id from the schema */}
            <div className='unit-information__details'>
              <p><strong>Stake Name:</strong> {selectedStake.name}</p>
              <p><strong>Location:</strong> {selectedStake.location}</p>
              {selectedStake.stakeNumber && <p><strong>Stake Number:</strong> {selectedStake.stakeNumber}</p>} {/* Assuming stakeNumber might exist */}
              <p><strong>Created At:</strong> {new Date(selectedStake.createdAt).toLocaleDateString()} {new Date(selectedStake.createdAt).toLocaleTimeString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedStake.updatedAt).toLocaleDateString()} {new Date(selectedStake.updatedAt).toLocaleTimeString()}</p>
            </div>
          </div>
        ) : (
          <p>{stake ? `Stake with ID "${stake}" not found.` : 'No stake selected.'}</p>
        )}
      </div>
    </section>
  );
};

export default StakeInformation;