import React, { useState, useEffect } from 'react';
import { countries } from "../constants/countries";
import api from '../utils/axiosInstance';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [stakesInCountry, setStakesInCountry] = useState([]);
  const [selectedStakeId, setSelectedStakeId] = useState('');
  const [wardsInStake, setWardsInStake] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [schedule, setSchedule] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [wardInstructors, setWardInstructors] = useState([]);
  const [instructorFetchError, setInstructorFetchError] = useState('');
  const [assignedInstructorId, setAssignedInstructorId] = useState(''); // To store selected instructor ID
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Fetch stakes by country
  useEffect(() => {
    const fetchStakesByCountry = async (country) => {
      if (!country) {
        setStakesInCountry([]);
        setSelectedStakeId('');
        setSelectedWardId('');
        setWardsInStake([]);
        setWardInstructors([]); // Clear instructors
        return;
      }
      setError('');
      try {
        const response = await api.get(`/stakes/country/${country}`);
        if (response.data && Array.isArray(response.data.data)) {
          setStakesInCountry(response.data.data);
        } else {
          setError('Failed to load stakes for the selected country.');
          setStakesInCountry([]);
          setSelectedStakeId('');
          setSelectedWardId('');
          setWardsInStake([]);
          setWardInstructors([]); // Clear instructors
        }
      } catch (err) {
        console.error('Error fetching stakes by country:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load stakes for the selected country.');
        setStakesInCountry([]);
        setSelectedStakeId('');
        setWardsInStake([]);
        setWardInstructors([]); // Clear instructors
      }
    };

    if (isAuthenticated && selectedCountry) {
      fetchStakesByCountry(selectedCountry);
      setSelectedStakeId('');
      setSelectedWardId('');
    } else {
      setStakesInCountry([]);
      setSelectedStakeId('');
      setWardsInStake([]);
      setWardInstructors([]); // Clear instructors
    }
  }, [selectedCountry, isAuthenticated]);

  // Fetch wards by stake
  useEffect(() => {
    const fetchWardsByStake = async (stakeId) => {
      if (!stakeId) {
        setWardsInStake([]);
        setSelectedWardId('');
        setWardInstructors([]); // Clear instructors
        return;
      }
      setSelectedWardId('');
      setError('');
      try {
        const response = await api.get(`/stakes/wards/${stakeId}`);
        if (response.data && Array.isArray(response.data.wards)) {
          setWardsInStake(response.data.wards);
        } else {
          setError('Failed to load wards for the selected stake.');
          setWardsInStake([]);
          setSelectedWardId('');
          setWardInstructors([]); // Clear instructors
        }
      } catch (err) {
        console.error('Error fetching wards by stake:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load wards for the selected stake.');
        setWardsInStake([]);
        setSelectedWardId('');
        setWardInstructors([]); // Clear instructors
      }
    };

    if (isAuthenticated && selectedStakeId) {
      fetchWardsByStake(selectedStakeId);
    } else {
      setWardsInStake([]);
      setSelectedWardId('');
      setWardInstructors([]); // Clear instructors
    }
  }, [selectedStakeId, isAuthenticated]);

  // Fetch instructors by ward
  useEffect(() => {
    const fetchInstructorsByWard = async (wardId) => {
      if (!wardId) {
        setWardInstructors([]);
        setInstructorFetchError('');
        return;
      }
      setInstructorFetchError('');
      try {
        const response = await api.get(`/instructors/wards/${wardId}`);
        if (response.data && Array.isArray(response.data.data)) {
          setWardInstructors(response.data.data);
        } else {
          setWardInstructors([]);
          setInstructorFetchError('No instructors found for this ward.');
        }
      } catch (err) {
        console.error('Error fetching instructors by ward:', err.response?.data?.error || err.message || err);
        setInstructorFetchError(err.response?.data?.error || 'Failed to load instructors for this ward.');
        setWardInstructors([]);
      }
    };

    if (isAuthenticated && selectedWardId) {
      fetchInstructorsByWard(selectedWardId);
    } else {
      setWardInstructors([]);
      setInstructorFetchError('');
    }
  }, [selectedWardId, isAuthenticated]);

  const handleInstructorChange = (e) => {
    const selectedOption = e.target.value;
    setAssignedInstructorId(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!isAuthenticated) {
      setError('You must be logged in to create a group.');
      return;
    }

    if (!selectedCountry) {
      setError('Please select a country.');
      return;
    }

    if (!selectedStakeId) {
      setError('Please select a stake.');
      return;
    }

    if (!selectedWardId) {
      setError('Please select a ward.');
      return;
    }

    try {
      const response = await api.post(
        `/groups`,
        {
          name: name,
          // stake: selectedStakeId,
          wardId: selectedWardId,
          start_date: startDate,
          end_date: endDate,
          schedule: schedule,
          room: room,
          instructorId: assignedInstructorId,
        }
      );

      //console.log('Group created successfully:', response.data);
      setSuccessMessage('Group created successfully!');
      setTimeout(() => {
        navigate('/groups');
      }, 1500);

      setName('');
      setSelectedCountry('');
      setStakesInCountry([]);
      setSelectedStakeId('');
      setWardsInStake([]);
      setSelectedWardId('');
      setStartDate('');
      setEndDate('');
      setSchedule('');
      setAssignedInstructorId('');
    } catch (err) {
      console.error('Error creating group:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || 'Failed to create group. Please try again.');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='create-group'>
      <div className='container'>
        <h2 className='groups__header'>Create a Group</h2>
        {error && <p className='form__error-message'>{error}</p>}
        {successMessage && <p className='form__success-message'>{successMessage}</p>}
        <form className='form create-group__form' onSubmit={handleSubmit}>
          <input type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} required autoFocus />

          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} required>
            <option value="" disabled>Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>

          {selectedCountry && stakesInCountry.length > 0 && (
            <select value={selectedStakeId} onChange={e => setSelectedStakeId(e.target.value)} required>
              <option value="" disabled>Select Stake</option>
              {stakesInCountry.map(stake => (
                <option key={stake._id} value={stake._id}>
                  {stake.name}
                </option>
              ))}
            </select>
          )}

          {selectedStakeId && wardsInStake.length > 0 && (
            <select value={selectedWardId} onChange={e => setSelectedWardId(e.target.value)} required>
              <option value="" disabled>Select Ward</option>
              {wardsInStake.map(wardItem => (
                <option key={wardItem._id} value={wardItem._id}>
                  {wardItem.name}
                </option>
              ))}
            </select>
          )}

          <input type='date' placeholder='Start Date' value={startDate} onChange={e => setStartDate(e.target.value)} required />
          <input type='date' placeholder='End Date' value={endDate} onChange={e => setEndDate(e.target.value)} />
          <input type='text' placeholder='Schedule' value={schedule} onChange={e => setSchedule(e.target.value)} />
          <input type='text' placeholder='Room' value={room} onChange={e => setRoom(e.target.value)} />

          {selectedWardId && (
            <div className='assign-instructors'>
              <h3>Assign Instructors to Group</h3>
              {instructorFetchError && <p className='form__error-message'>{instructorFetchError}</p>}
              {wardInstructors.length > 0 ? (
                <select
                  // multiple
                  value={assignedInstructorId}
                  onChange={handleInstructorChange}
                >
                  <option value="">Select an instructor</option>
                  {wardInstructors.map(instructor => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.userId?.firstName} {instructor.userId?.lastName} ({instructor.userId?.email})
                    </option>
                  ))}
                </select>
              ) : (
                <p>{instructorFetchError ? '' : 'No instructors found in this ward to assign.'}</p>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
                type="submit"
                className="btn primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create"}
            </button>
            
            <button
                type="button"
                className="btn secondary"
                onClick={() => navigate(-1)} // Go back to the previous page
              >
                Cancel
            </button>
          </div>
          
        </form>
      </div>
    </section>
  );
};

export default CreateGroup;