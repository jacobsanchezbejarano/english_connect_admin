import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnitInformation from '../components/UnitInformation';
import api from '../utils/axiosInstance';
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
        const response = await api.get(`/wards`);
        if (response.data.data && Array.isArray(response.data.data)) {
          const units = response.data.data;
          setUnits([{_id:"",name:'Select a Ward or Branch'}, ...units]);
        } else {
          setError('Failed to load wards and branches: Invalid data format.');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load wards and branches.');
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
            {units.map(unit => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
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