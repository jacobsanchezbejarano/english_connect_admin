import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GroupsChartData() {
  const [stake, setStake] = useState('Viru Viru'); // Or get this from props/context

  const chartData = {
    labels: ['Group 1', 'Group 2', 'Group 3'],
    datasets: [{
      label: `Average Attendance by Group (Stake Level) ${stake}`,
      data: [80, 90, 85],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }],
  };
  const chartOptions = { title: { display: true, text: `Average Attendance by Group (Stake Level) ${stake}` } };

  return chartData && <Bar data={chartData} options={chartOptions} />;
}

export default GroupsChartData;