import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { URL } from '../constants/url';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const GroupInfo = () => {
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchGroupInfo = async () => {
      setError('');
      setGroupInfo(null);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${URL}/groups/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.data.group) {
          setGroupInfo(response.data.group);
        } else {
          setError('Failed to load group information: Invalid data format.');
        }
      } catch (err) {
        console.error('Error fetching group information:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load group information.');
      }
    };

    if (isAuthenticated && id) {
      fetchGroupInfo();
    } else if (!isAuthenticated) {
      setError('You need to be logged in to view group information.');
    } else {
      setError('Invalid Group ID.');
    }
  }, [isAuthenticated, id]);

  if (error) {
    return (
      <section className='groupInfo'>
        <div className="container group-info__container">
          <h2 className="group-info__header">Group Info</h2>
          <p className="form__error-message">{error}</p>
        </div>
      </section>
    );
  }

  if (!groupInfo) {
    return (
      <section className='groupInfo'>
        <div className="container group-info__container">
          <h2 className="group-info__header">Group Info</h2>
          <p>Loading group information...</p>
        </div>
      </section>
    );
  }

  return (
    <section className='groupInfo'>
      <div className="container group-info__container">
        <h2 className="group-info__header">Group Info</h2>
        <div className="group-info__details">
          <div>
            <strong>Name:</strong> {groupInfo.name}
          </div>
          {groupInfo.stake && (
            <div>
              <strong>Stake:</strong> {groupInfo.stake.name}
            </div>
          )}
          {groupInfo.ward && (
            <div>
              <strong>Ward:</strong> {groupInfo.ward.name}
            </div>
          )}
          <div>
            <strong>Start Date:</strong> {new Date(groupInfo.start_date).toLocaleDateString()}
          </div>
          {groupInfo.end_date && (
            <div>
              <strong>End Date:</strong> {new Date(groupInfo.end_date).toLocaleDateString()}
            </div>
          )}
          {groupInfo.schedule && (
            <div>
              <strong>Schedule:</strong> {groupInfo.schedule}
            </div>
          )}
          {groupInfo.other_group_data && groupInfo.other_group_data.teacher && (
            <div>
              <strong>Teacher:</strong> {groupInfo.other_group_data.teacher}
            </div>
          )}
          {groupInfo.other_group_data && groupInfo.other_group_data.room && (
            <div>
              <strong>Room:</strong> {groupInfo.other_group_data.room}
            </div>
          )}
          {/* Add other group information as needed based on your backend data */}
        </div>
      </div>
    </section>
  );
};

export default GroupInfo;