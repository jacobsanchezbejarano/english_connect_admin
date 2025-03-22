import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Statistics() {
  const [level, setLevel] = useState('');
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  
  // These variables will be linked to the admin or instructor 
  const [country, setCountry] = useState('Bolivia');
  const [city, setCity] = useState('Santa Cruz');
  const [stake, setStake] = useState('Viru Viru');
  const [ward, setWard] = useState('Valle Sanchez');


  const updateChart = (selectedLevel) => {
    let data = {};
    let options = {};

    switch (selectedLevel) {
      case 'countries':
        data = {
          labels: ['Country A', 'Country B', 'Country C'],
          datasets: [{
            label: 'Enrollment by Country',
            data: [650, 159, 480],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        };
        options = { title: { display: true, text: 'Enrollment by Country' } };
        break;

      case 'cities':
        data = {
          labels: ['City X', 'City Y', 'City Z'],
          datasets: [{
            label: 'Enrollment by City (Country level) '+ country,
            data: [70, 85, 92],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        };
        options = { title: { display: true, text: 'Enrollment by City (Country level) '+ country } };
        break;

      case 'stakes':
        data = {
          labels: ['Stake 1', 'Stake 2', 'Stake 3'],
          datasets: [{
            label: 'Participation by Stake (City level) '+ city,
            data: [50, 75, 60],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        };
        options = { title: { display: true, text: 'Participation by Stake (City level) '+ city } };
        break;

      case 'wards':
        data = {
          labels: ['Ward A', 'Ward B', 'Ward C'],
          datasets: [{
            label: 'Average Attendance by Ward (Stake Level) '+ stake,
            data: [90, 80, 89],
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          }]
        };
        options = { title: { display: true, text: 'Average Attendance by Ward (Stake Level) '+ stake } };
        break;

      case 'groups':
        data = {
          labels: ['Group 1', 'Group 2', 'Group 3'],
          datasets: [{
            label: 'Average Attendance by Group (Stake Level) '+ stake,
            data: [80, 90, 85],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        };
        options = { title: { display: true, text: 'Average Attendance by Group (Stake Level) '+ stake } };
        break;

      case 'students':
        data = {
          labels: ['Student 1', 'Student 2', 'Student 3'],
          datasets: [{
            label: 'Attendance Percentage by Student (Ward level) '+ ward,
            data: [90, 85, 95],
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        };
        options = { title: { display: true, text: 'Attendance Percentage by Student (Ward level) '+ ward } };
        break;

      default:
        break;
    }

    setChartData(data);
    setChartOptions(options);
  };

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
    updateChart(event.target.value);
  };

  useEffect(() => {
    updateChart(level);
  }, [level]);

  return (
    <div className="container-graph">
      <h1>Educational Control Panel</h1>
      <label htmlFor="level">Select Level:</label>
      {/* The select options will be visible to people who have adequate permisions */}
      <select id="level" value={level} onChange={handleLevelChange}>
        <option value="">Select</option>
        <option value="countries">Countries</option>
        <option value="cities">Cities</option>
        <option value="stakes">Stakes</option>
        <option value="wards">Wards</option>
        <option value="groups">Groups</option>
        <option value="students">Students</option>
      </select>
      { level != '' && <Bar data={chartData} options={chartOptions} />}
    </div>
  );
}

export default Statistics;