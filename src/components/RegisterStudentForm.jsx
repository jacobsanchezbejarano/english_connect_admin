import React, { useState, useEffect } from 'react';
import { countries } from "../constants/countries";
import api from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const RegisterStudentForm = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStake, setSelectedStake] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [registrationDate, setRegistrationDate] = useState(getTodayDate()); // Default to today
    const [notes, setNotes] = useState('');

    const [stakes, setStakes] = useState([]);
    const [wards, setWards] = useState([]);
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);

    const [loadingStakes, setLoadingStakes] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        setSelectedStake(''); setStakes([]);
        setSelectedWard(''); setWards([]);
        setSelectedGroup(''); setGroups([]);
        setSelectedStudent(''); setStudents([]);

        if (selectedCountry) {
            const fetchStakes = async () => {
                setLoadingStakes(true);
                setError('');
                try {
                    const response = await api.get(`/stakes/country/${encodeURIComponent(selectedCountry)}`);
                    setStakes(response.data?.data || response.data || []);
                } catch (err) {
                    console.error('Error fetching stakes:', err);
                    setError('Failed to fetch stakes.');
                    setStakes([]);
                } finally {
                    setLoadingStakes(false);
                }
            };
            fetchStakes();
        }
    }, [selectedCountry]);

    useEffect(() => {
        setSelectedWard(''); setWards([]);
        setSelectedGroup(''); setGroups([]);
        setSelectedStudent(''); setStudents([]);

        if (selectedStake) {
            const fetchWards = async () => {
                setLoadingWards(true);
                setError('');
                try {
                    const response = await api.get(`/stakes/wards/${selectedStake}`);
                    setWards(response.data?.wards || response.data || []);
                } catch (err) {
                    console.error('Error fetching wards:', err);
                    setError('Failed to fetch wards.');
                    setWards([]);
                } finally {
                    setLoadingWards(false);
                }
            };
            fetchWards();
        }
    }, [selectedStake]);

    useEffect(() => {
        setSelectedGroup(''); setGroups([]);
        setSelectedStudent(''); setStudents([]);

        if (selectedWard) {
            let groupError = false;
            let studentError = false;

            const fetchGroups = async () => {
                setLoadingGroups(true);
                setError('');
                try {
                    const response = await api.get(`/groups/ward/${selectedWard}`);
                    setGroups(response.data?.groups || response.data || []);
                } catch (err) {
                    console.error('Error fetching groups:', err);
                    groupError = true;
                    setGroups([]);
                } finally {
                    setLoadingGroups(false);
                }
            };

            const fetchStudents = async () => {
                setLoadingStudents(true);
                setError('');
                try {
                    const response = await api.get(`/students/wards/${selectedWard}`);
                    setStudents(response.data?.data || []);
                } catch (err) {
                    console.error('Error fetching students:', err);
                    studentError = true;
                    setStudents([]);
                } finally {
                    setLoadingStudents(false);
                }
            };

            Promise.all([fetchGroups(), fetchStudents()]).then(() => {
                if (groupError || studentError) {
                    setError('Failed to fetch groups or students for the selected ward.');
                }
            });
        }
    }, [selectedWard]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!isAuthenticated) {
            setError('You must be logged in to register a student.');
            return;
        }

        if (!selectedGroup || !selectedStudent || !registrationDate) {
            setError('Please select a group, a student, and specify the registration date.');
            return;
        }

        try {
            const payload = {
                groupId: selectedGroup,
                studentId: selectedStudent,
                date: registrationDate,
                notes: notes
            };

            const response = await api.post('/registrations', payload);

            console.log('Registration successful:', response.data);
            setSuccessMessage('Student registered successfully!');

            setTimeout(() => {
                setSelectedCountry(''); // Resetting country will cascade other resets
                setRegistrationDate(getTodayDate()); // Reset date to today
                setNotes(''); // Reset notes
                setSuccessMessage('');
                // navigate('/some-success-page');
            }, 2000);

        } catch (err) {
            console.error('Error creating registration:', err.response?.data?.error || err.message || err);
            setError(err.response?.data?.error || 'Failed to register student. Please try again.');
        }
    };

    return (
        <section className='profile'>
            <div className='container profile__container'>
                <div className='profile__details'>
                    <h1>Register Student to Group</h1>
                    {error && <p className='form__error-message'>{error}</p>}
                    {successMessage && <p className='form__success-message'>{successMessage}</p>}

                    <form className='form profile__form' onSubmit={handleSubmit}>

                        <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} required>
                            <option value="" disabled>Select Country</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStake}
                            onChange={e => setSelectedStake(e.target.value)}
                            disabled={!selectedCountry || loadingStakes || stakes.length === 0}
                            required
                        >
                            <option value="" disabled>
                                {loadingStakes ? 'Loading Stakes...' : (selectedCountry ? (stakes.length > 0 ? 'Select Stake' : 'No Stakes Found') : 'Select Country First')}
                            </option>
                            {stakes.map((stake) => (
                                <option key={stake._id || stake.id} value={stake._id || stake.id}>
                                    {stake.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedWard}
                            onChange={e => setSelectedWard(e.target.value)}
                            disabled={!selectedStake || loadingWards || wards.length === 0}
                            required
                        >
                             <option value="" disabled>
                                {loadingWards ? 'Loading Wards...' : (selectedStake ? (wards.length > 0 ? 'Select Ward' : 'No Wards Found') : 'Select Stake First')}
                            </option>
                            {wards.map((ward) => (
                                <option key={ward._id || ward.id} value={ward._id || ward.id}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedGroup}
                            onChange={e => setSelectedGroup(e.target.value)}
                            disabled={!selectedWard || loadingGroups || groups.length === 0}
                            required
                        >
                            <option value="" disabled>
                                {loadingGroups ? 'Loading Groups...' : (selectedWard ? (groups.length > 0 ? 'Select Group' : 'No Groups Found') : 'Select Ward First')}
                            </option>
                            {groups.map((group) => (
                                <option key={group._id || group.id} value={group._id || group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>

                         <select
                            value={selectedStudent}
                            onChange={e => setSelectedStudent(e.target.value)}
                            disabled={!selectedWard || loadingStudents || students.length === 0}
                            required
                        >
                            <option value="" disabled>
                                {loadingStudents ? 'Loading Students...' : (selectedWard ? (students.length > 0 ? 'Select Student' : 'No Students Found') : 'Select Ward First')}
                            </option>
                            {students.map((student) => {
                                const firstName = student.user?.firstName || 'Unknown';
                                const lastName = student.user?.lastName || 'Name';
                                const studentId = student._id;
                                return (
                                    <option key={studentId} value={studentId}>
                                        {firstName} {lastName}
                                    </option>
                                );
                            })}
                        </select>

                         <input
                             type="date"
                             placeholder="Registration Date"
                             value={registrationDate}
                             onChange={e => setRegistrationDate(e.target.value)}
                             required
                         />

                         <textarea
                             placeholder="Notes (Optional)"
                             value={notes}
                             onChange={e => setNotes(e.target.value)}
                             rows={3}
                         />


                        <button
                            type='submit'
                            className='btn primary'
                            disabled={!selectedGroup || !selectedStudent || !registrationDate || !isAuthenticated}
                        >
                            Register Student
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterStudentForm;