import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import { countries } from "../constants/countries";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/authContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StakesChartData() {
    const { user } = useAuth();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStake, setSelectedStake] = useState('');
    const [selectedStakeName, setSelectedStakeName] = useState('');

    const [stakes, setStakes] = useState([]);
    const [groupAttendanceStats, setGroupAttendanceStats] = useState([]);

    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingStakes, setLoadingStakes] = useState(false);
    const [error, setError] = useState('');

    useEffect(()=>{
        setSelectedCountry(user.wardId.location??"");
        setSelectedStake(user.wardId.stakeId._id??"");
    });

    useEffect(() => {
        setStakes([]);
        setGroupAttendanceStats([]); setChartData(null);

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
        setGroupAttendanceStats([]);
        setChartData(null);
        setError('');

        if (selectedStake) {
            const stakeDetails = stakes.find(s => (s._id || s.id) === selectedStake);
            setSelectedStakeName(stakeDetails?.name || `Stake (ID: ${selectedStake.substring(0,6)}...)`);

            const fetchGroupAttendance = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/stats/stake/${selectedStake}/group-attendance`);
                    setGroupAttendanceStats(response.data || []);
                     if (!response.data || response.data.length === 0) {
                         setError('No group attendance data found for this stake.');
                    }
                } catch (err) {
                    console.error('Error fetching group attendance stats:', err);
                    setError('Failed to fetch group attendance data.');
                    setGroupAttendanceStats([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchGroupAttendance();
        } else {
             setSelectedStakeName('');
        }
    }, [selectedStake, stakes]);

    useEffect(() => {
        if (groupAttendanceStats && groupAttendanceStats.length > 0) {
            try {
                const labels = groupAttendanceStats.map(stat => stat.groupName || `Group (ID: ${stat.groupId.substring(0,6)}...)`);
                const data = groupAttendanceStats.map(stat => stat.averageAttendance);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: `Average Attendance by Group - ${selectedStakeName}`,
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
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
                            text: `Average Attendance per Group in ${selectedStakeName}`,
                        },
                         tooltip: {
                             callbacks: {
                                 label: function(context) {
                                     let label = context.dataset.label || '';
                                      if (label) {
                                         label = 'Avg Attendance: ';
                                     }
                                     if (context.parsed.y !== null) {
                                         label += context.parsed.y.toFixed(2) + '%';
                                     }
                                     return label;
                                 }
                             }
                         }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Average Attendance (%)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + "%";
                                }
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
             } catch(e) {
                 console.error("Error processing chart data:", e);
                 setError("Failed to process chart data.");
                 setChartData(null);
             }
        } else {
            setChartData(null);
        }
    }, [groupAttendanceStats, selectedStakeName]);


    return (
        <div className="stakes-chart-container">
            <h1>Average Attendance by Group (Stake Level)</h1>

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

            {error && <p className='form__error-message' style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <div className="chart-area" style={{ position: 'relative', minHeight: '300px', marginTop: '20px' }}>
                {loading && <Spinner status="loading" />}

                {!loading && !selectedStake && <p>Please select a stake to view data.</p>}

                {!loading && chartData && Object.keys(chartData).length > 0 && (
                    <Bar data={chartData} options={chartOptions} />
                )}
            </div>
        </div>
    );
}

export default StakesChartData;