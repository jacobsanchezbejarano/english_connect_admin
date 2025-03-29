import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CountriesChartData() {
  const chartData = {
    labels: ['Country A', 'Country B', 'Country C'],
    datasets: [{
      label: 'Enrollment by Country',
      data: [650, 159, 480],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };
  const chartOptions = { title: { display: true, text: 'Enrollment by Country' } };

  return chartData && <Bar data={chartData} options={chartOptions} />;
}

export default CountriesChartData;