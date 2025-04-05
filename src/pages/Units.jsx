import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnitInformation from '../components/UnitInformation';
import { URL } from '../constants/url';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const Units = () => {
  const [selectedUnit, setSelectedUnit] = useState('');
  const [units, setUnits] = useState(['Select a Ward or Branch']);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUnits = async () => {
      setError('');
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${URL}/wards`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data.wards)) {
          const unitNames = response.data.wards.map(ward => ward.name);
          setUnits(['Select a Ward or Branch', ...unitNames]);
        } else {
          setError('Failed to load wards and branches: Invalid data format.');
        }
      } catch (err) {
        console.error('Error fetching wards and branches:', err.response?.data?.error || err.message || err);
        setError(err.response?.data?.error || 'Failed to load wards and branches.');
      }
    };

    if (isAuthenticated) {
      fetchUnits();
    } else {
      setError('You need to be logged in to view wards and branches.');
    }
  }, [isAuthenticated]);

  return (
    <section className='create-unit'>
      <div className='container'>
        <h2>Wards and Branches</h2>
        {error && <p className='form__error-message'>{error}</p>}
        <form className='form create-unit__form'>
          <select name='unit' value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)}>
            {units.map(unitName => (
              <option key={unitName} value={unitName}>
                {unitName}
              </option>
            ))}
          </select>
          <div className='create__unit'>
            <button className='create__unit-btn'><Link to="/createUnit">Create a unit</Link></button>
          </div>
        </form>
        <UnitInformation unit={selectedUnit} />
      </div>
    </section>
  );
};

export default Units;