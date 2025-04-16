import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import { countries } from "../constants/countries";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/authContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GroupsChartData() {
    const { user } = useAuth();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStake, setSelectedStake] = useState('');
    const [selectedStakeName, setSelectedStakeName] = useState('');

    const [stakes, setStakes] = useState([]);

    const [attendanceByGroup, setAttendanceByGroup] = useState([]);

    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingStakes, setLoadingStakes] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setSelectedCountry(user.wardId?.location ?? "");
        setSelectedStake(user.wardId?.stakeId?._id ?? "");
    }, [user]);

    useEffect(() => {
        setStakes([]); setSelectedStakeName('');
        setAttendanceByGroup([]); setChartData(null);

        if (selectedCountry) {
            const fetchStakes = async () => {
                setLoadingStakes(true);
                setError('');
                try {
                    const response = await api.get(`/stakes/country/${encodeURIComponent(selectedCountry)}`);
                    setStakes(response.data?.data || response.data || []);
                } catch (err) {
                    console.error('Error fetching stakes:', err);
                    setError('Failed to fetch stakes.'); setStakes([]);
                } finally {
                    setLoadingStakes(false);
                }
            };
            fetchStakes();
        }
    }, [selectedCountry]);

    useEffect(() => {
        setAttendanceByGroup([]);
        setChartData(null);
        setError('');

        if (selectedStake) {
            const stakeDetails = stakes.find(s => (s._id || s.id) === selectedStake);
            setSelectedStakeName(stakeDetails?.name || `Stake (ID: ${selectedStake.substring(0, 6)}...)`);

            const fetchAttendanceData = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/attendance/stake/${selectedStake}`);
                    setAttendanceByGroup(response.data?.data || []);
                    console.log(response.data)
                    if (!response.data?.data || response.data.data.length === 0) {
                        setError(response.data?.message ?? 'No attendance data found for any group in this stake.');
                    }
                } catch (err) {
                    console.error('Error fetching attendance data:', err);
                    setError('Failed to fetch attendance data.');
                    setAttendanceByGroup([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchAttendanceData();
        } else {
            setSelectedStakeName('');
        }
    }, [selectedStake, stakes]);

    useEffect(() => {
        if (attendanceByGroup && attendanceByGroup.length > 0) {
            try {
                const labels = attendanceByGroup.map(item => item.groupName || `Group (ID: ${item.groupId.substring(0, 6)}...)`);
                const data = attendanceByGroup.map(item => item.numberOfClassesTaken);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: `Number of Attendance Records by Group - ${selectedStakeName}`,
                        data: data,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
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
                            text: `Total Attendance Records per Group in ${selectedStakeName}`,
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y;
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Attendance Records'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Groups'
                            }
                        }
                    }
                });
                setError('');
            } catch (e) {
                console.error("Error processing chart data:", e);
                setError("Failed to process chart data.");
                setChartData(null);
            }
        } else {
            setChartData(null);
        }
    }, [attendanceByGroup, selectedStakeName]);

    return (
        <div className="groups-chart-container">
            <h1>Attendance Records per Group in Stake</h1>

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
                    disabled={!selectedCountry || loadingStakes || stakes.length === 0}
                    required
                >
                    <option value="" disabled>
                        {loadingStakes ? 'Loading...' : (selectedCountry ? (stakes.length > 0 ? 'Select Stake' : 'No Stakes Found') : 'Select Country First')}
                    </option>
                    {stakes.map((stake) => (
                        <option key={stake._id || stake.id} value={stake._id || stake.id}>{stake.name}</option>
                    ))}
                </select>
            </div>

            {error && <p className='form__error-message' >{error}</p>}

            <div className="chart-area" style={{ position: 'relative', minHeight: '300px', marginTop: '20px' }}>
                {loading && <Spinner status="loading" />}

                {!loading && !selectedStake && <p>Please select a stake to view attendance data by group.</p>}

                {!loading && chartData && Object.keys(chartData).length > 0 && (
                    <Bar data={chartData} options={chartOptions} />
                )}
            </div>
        </div>
    );
}

export default GroupsChartData;