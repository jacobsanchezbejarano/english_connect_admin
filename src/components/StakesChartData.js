import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StakesChartData() {
  const [city, setCity] = useState('Santa Cruz'); // Or get this from props/context

  const chartData = {
    labels: ['Stake 1', 'Stake 2', 'Stake 3'],
    datasets: [{
      label: `Participation by Stake (City level) ${city}`,
      data: [50, 75, 60],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };
  const chartOptions = { title: { display: true, text: `Participation by Stake (City level) ${city}` } };

  return chartData && <Bar data={chartData} options={chartOptions} />;
}

export default StakesChartData;