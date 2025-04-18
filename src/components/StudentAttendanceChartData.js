import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import { countries } from "../constants/countries";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
//import { useAuth } from '../context/authContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StudentAttendanceChartData() {
    //const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [setAllAttendances] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStake, setSelectedStake] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

    const [stakes, setStakes] = useState([]);
    const [wards, setWards] = useState([]);
    const [groups, setGroups] = useState([]);

    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingFilters, setLoadingFilters] = useState({
        stakes: false,
        wards: false,
        groups: false,
    });
    const [error, setError] = useState('');


    function buildInitialStudents(students, attendances, meetings) {
        if (!students || students.length === 0) return [];
        const initialStudents = students.map((student) => {
            const studentAttendance = {};
            const studentName = student.userId ? `${student.userId.firstName} ${student.userId.lastName}` : 'Unknown';
            meetings.forEach((meetingDate) => {
                const attendanceRecord = attendances.find((attendance) => {
                    const attendanceDate = new Date(attendance.date).toISOString().split('T')[0];
                    const meetingDateOnly = new Date(meetingDate).toISOString().split('T')[0];
                    // Ensure studentId might be nested or direct based on API response structure
                    const studentIdToCheck = attendance.studentId?._id || attendance.studentId;
                    return studentIdToCheck === student._id && attendanceDate === meetingDateOnly;
                });
                studentAttendance[meetingDate] = attendanceRecord
                    ? { isPresent: attendanceRecord.isPresent, _id: attendanceRecord._id }
                    : { isPresent: false, _id: null };
            });
            return { id: student._id, name: studentName, attendance: studentAttendance };
        });
        return initialStudents;
    }

    function getUniqueAttendanceDates(attendances) {
        if (!attendances || attendances.length === 0) return [];
        const uniqueDates = Array.from(
            new Set(
                attendances.map((attendance) => new Date(attendance.date).toISOString().split('T')[0])
            )
        );
        return uniqueDates.sort((a, b) => new Date(a) - new Date(b));
    }

    // --- Fetching Logic ---

    // Fetch Stakes on Country change
    useEffect(() => {
        setSelectedStake(''); setStakes([]);
        setSelectedWard(''); setWards([]);
        setSelectedGroup(''); setGroups([]);
        setChartData(null); setStudents([]); setMeetings([]); setAllAttendances([]); // Clear data

        if (selectedCountry) {
            const fetchStakes = async () => {
                setLoadingFilters(prev => ({ ...prev, stakes: true }));
                setError('');
                try {
                    const response = await api.get(`/stakes/country/${encodeURIComponent(selectedCountry)}`);
                    setStakes(response.data?.data || response.data || []);
                } catch (err) {
                    console.error('Error fetching stakes:', err);
                    setError('Failed to fetch stakes.'); setStakes([]);
                } finally {
                    setLoadingFilters(prev => ({ ...prev, stakes: false }));
                }
            };
            fetchStakes();
        }
    }, [selectedCountry]);

    // Fetch Wards on Stake change
    useEffect(() => {
        setSelectedWard(''); setWards([]);
        setSelectedGroup(''); setGroups([]);
        setChartData(null); setStudents([]); setMeetings([]); setAllAttendances([]); // Clear data

        if (selectedStake) {
            const fetchWards = async () => {
                setLoadingFilters(prev => ({ ...prev, wards: true }));
                setError('');
                try {
                    const response = await api.get(`/stakes/wards/${selectedStake}`);
                    setWards(response.data?.wards || response.data || []);
                } catch (err) {
                    console.error('Error fetching wards:', err);
                    setError('Failed to fetch wards.'); setWards([]);
                } finally {
                    setLoadingFilters(prev => ({ ...prev, wards: false }));
                }
            };
            fetchWards();
        }
    }, [selectedStake]);

    useEffect(() => {
        setSelectedGroup(''); setGroups([]);
        setChartData(null); setStudents([]); setMeetings([]); setAllAttendances([]);

        if (selectedWard) {
            const fetchGroups = async () => {
                setLoadingFilters(prev => ({ ...prev, groups: true }));
                setError('');
                try {
                    const response = await api.get(`/groups/ward/${selectedWard}`);
                    setGroups(response.data?.groups || response.data || []);
                } catch (err) {
                    console.error('Error fetching groups:', err);
                    setError('Failed to fetch groups.'); setGroups([]);
                } finally {
                    setLoadingFilters(prev => ({ ...prev, groups: false }));
                }
            };
            fetchGroups();
        }
    }, [selectedWard]);


    useEffect(() => {
        setChartData(null);
        setStudents([]);
        setMeetings([]);
        setAllAttendances([]);
        setError('');

        if (selectedGroup) {
            const fetchData = async () => {
                setLoading(true);
                setError('');
                try {
                    const attendanceResponse = await api.get(`/attendance/group/${selectedGroup}`);
                    const attendanceData = attendanceResponse.data.data || [];
                    setAllAttendances(attendanceData);

                    const meetingsData = getUniqueAttendanceDates(attendanceData);
                    setMeetings(meetingsData);

                    const studentsResponse = await api.get(`/registrations/group/${selectedGroup}/students`);
                    const studentsData = studentsResponse.data.students || [];

                    const processedStudents = buildInitialStudents(studentsData, attendanceData, meetingsData);
                    setStudents(processedStudents);

                } catch (error) {
                    console.error('Error fetching attendance/student data:', error);
                    setError('Failed to fetch attendance data for the selected group.');
                    if (error.response && error.response.status === 401) {
                        console.error('Unauthorized access.');
                    }
                    setStudents([]);
                    setMeetings([]);
                    setAllAttendances([]);
                    setChartData(null);
                } finally {
                     setLoading(false);
                }
            };
            fetchData();
        } else {
             setLoading(false);
        }
    }, [selectedGroup]);


    useEffect(() => {
        if (students.length > 0 && meetings.length > 0 && selectedGroup) {
             setLoading(true);
            try {
                const studentData = students.map((student) => {
                    let attendanceCount = 0;
                    meetings.forEach((meetingDate) => {
                        if (student.attendance[meetingDate]?.isPresent) {
                            attendanceCount++;
                        }
                    });
                    const attendancePercentage = meetings.length > 0 ? (attendanceCount / meetings.length) * 100 : 0;
                    return { name: student.name, percentage: attendancePercentage.toFixed(2) };
                });

                const labels = studentData.map((student) => student.name);
                const percentages = studentData.map((student) => student.percentage);

                const currentGroup = groups.find(g => (g._id || g.id) === selectedGroup);
                const groupName = currentGroup?.name || `Group (ID: ${selectedGroup.substring(0, 6)}...)`;

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: `Attendance Percentage - ${groupName}`,
                        data: percentages,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                });
                setChartOptions({
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: `Student Attendance Percentage for ${groupName}`,
                        },
                    },
                    scales: {
                         y: {
                             beginAtZero: true,
                             max: 100,
                             ticks: {
                                callback: function(value) {
                                    return value + "%"
                                }
                             }
                         }
                    }
                });
            } catch (error) {
                console.error('Error calculating student percentages:', error);
                setError('Error processing attendance data.');
                setChartData(null);
            } finally {
                 setLoading(false);
            }
        } else if (!selectedGroup) {
             setChartData(null);
             setLoading(false);
        }
    }, [students, meetings, selectedGroup, groups]);

    return (
        <div className="attendance-chart-container">
            <h1>Student Attendance Percentage</h1>

            {/* Filter Controls */}
            <div className='form filters-form' style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} required>
                    <option value="" disabled>Select Country</option>
                    {countries.map((country) => (
                        <option key={country.code} value={country.name}>{country.name}</option>
                    ))}
                </select>

                <select
                    value={selectedStake}
                    onChange={e => setSelectedStake(e.target.value)}
                    disabled={!selectedCountry || loadingFilters.stakes || stakes.length === 0}
                    required
                >
                    <option value="" disabled>
                        {loadingFilters.stakes ? 'Loading...' : (selectedCountry ? (stakes.length > 0 ? 'Select Stake' : 'No Stakes') : 'Select Country')}
                    </option>
                    {stakes.map((stake) => (
                        <option key={stake._id || stake.id} value={stake._id || stake.id}>{stake.name}</option>
                    ))}
                </select>

                <select
                    value={selectedWard}
                    onChange={e => setSelectedWard(e.target.value)}
                    disabled={!selectedStake || loadingFilters.wards || wards.length === 0}
                    required
                >
                    <option value="" disabled>
                        {loadingFilters.wards ? 'Loading...' : (selectedStake ? (wards.length > 0 ? 'Select Ward' : 'No Wards') : 'Select Stake')}
                    </option>
                    {wards.map((ward) => (
                        <option key={ward._id || ward.id} value={ward._id || ward.id}>{ward.name}</option>
                    ))}
                </select>

                <select
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                    disabled={!selectedWard || loadingFilters.groups || groups.length === 0}
                    required
                >
                    <option value="" disabled>
                        {loadingFilters.groups ? 'Loading...' : (selectedWard ? (groups.length > 0 ? 'Select Group' : 'No Groups') : 'Select Ward')}
                    </option>
                    {groups.map((group) => (
                        <option key={group._id || group.id} value={group._id || group.id}>{group.name}</option>
                    ))}
                </select>
            </div>

            {error && <p className='form__error-message' style={{ color: 'red' }}>{error}</p>}

            <div className="chart-area" style={{ position: 'relative', minHeight: '300px' }}>
                {loading && <Spinner status="loading" />}

                {!loading && !selectedGroup && <p>Please select a group to view attendance data.</p>}

                {!loading && selectedGroup && !chartData && !error && <p>No attendance data available for the selected group.</p>}

                {!loading && chartData && Object.keys(chartData).length > 0 && (
                    <Bar data={chartData} options={chartOptions} />
                )}
            </div>
        </div>
    );
}

export default StudentAttendanceChartData;