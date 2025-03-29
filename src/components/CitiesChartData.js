import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CitiesChartData() {
  const [country, setCountry] = useState('Bolivia'); // Or get this from props/context

  const chartData = {
    labels: ['City X', 'City Y', 'City Z'],
    datasets: [{
      label: `Enrollment by City (Country level) ${country}`,
      data: [70, 85, 92],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }],
  };
  const chartOptions = { title: { display: true, text: `Enrollment by City (Country level) ${country}` } };

  return chartData && <Bar data={chartData} options={chartOptions} />;
}

export default CitiesChartData;