import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import { countries } from "../constants/countries";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/authContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function WardsChartData() {
    const { user } = useAuth();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStake, setSelectedStake] = useState('');
    const [selectedStakeName, setSelectedStakeName] = useState('');

    const [stakes, setStakes] = useState([]);
    const [groupStudentStats, setGroupStudentStats] = useState([]);

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
        setSelectedStake(''); setStakes([]); setSelectedStakeName('');
        setGroupStudentStats([]); setChartData(null);

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
        setGroupStudentStats([]);
        setChartData(null);
        setError('');

        if (selectedStake) {
            const stakeDetails = stakes.find(s => (s._id || s.id) === selectedStake);
            setSelectedStakeName(stakeDetails?.name || `Stake (ID: ${selectedStake.substring(0,6)}...)`);

            const fetchGroupStudentCounts = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/stats/stake/${selectedStake}/group-students`);
                    setGroupStudentStats(response.data?.studentStats || []);
                    if (!response.data?.studentStats || response.data.studentStats.length === 0) {
                         setError('No group student count data found for this stake.');
                    }
                } catch (err) {
                    console.error('Error fetching group student counts:', err);
                    setError('Failed to fetch group student count data.');
                    setGroupStudentStats([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchGroupStudentCounts();
        } else {
             setSelectedStakeName('');
        }
    }, [selectedStake, stakes]);

    useEffect(() => {
        if (groupStudentStats && groupStudentStats.length > 0) {
             try {
                const labels = groupStudentStats.map(stat => stat.groupName || `Group (ID: ${stat.groupId.substring(0,6)}...)`);
                const data = groupStudentStats.map(stat => stat.studentCount);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: `Student Count by Group - ${selectedStakeName}`,
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
                            text: `Student Count per Group in ${selectedStakeName}`,
                        },
                         tooltip: {
                             callbacks: {
                                 label: function(context) {
                                     let label = context.dataset.label || '';
                                      if (label) {
                                         label = 'Students: ';
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
                             allowDecimals: false,
                             ticks: {
                                 stepSize: 1
                             },
                            title: {
                                display: true,
                                text: 'Number of Students'
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
    }, [groupStudentStats, selectedStakeName]);


    return (
        <div className="wards-chart-container">
            <h1>Student Count by Group (Stake Level)</h1>

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

export default WardsChartData;