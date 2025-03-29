import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function WardsChartData() {
  const [stake, setStake] = useState('Viru Viru'); // Or get this from props/context

  const chartData = {
    labels: ['Ward A', 'Ward B', 'Ward C'],
    datasets: [{
      label: `Average Attendance by Ward (Stake Level) ${stake}`,
      data: [90, 80, 89],
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    }],
  };
  const chartOptions = { title: { display: true, text: `Average Attendance by Ward (Stake Level) ${stake}` } };

  return chartData && <Bar data={chartData} options={chartOptions} />;
}

export default WardsChartData;