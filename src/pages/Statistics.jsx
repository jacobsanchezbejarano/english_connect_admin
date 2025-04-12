import React, { useState } from 'react';
import StudentAttendanceChartData from '../components/StudentAttendanceChartData';
import CountriesChartData from '../components/CountriesChartData';
import CitiesChartData from '../components/CitiesChartData';
import StakesChartData from '../components/StakesChartData';
import WardsChartData from '../components/WardsChartData';
import GroupsChartData from '../components/GroupsChartData';

function StatisticsPage() {
  const [level, setLevel] = useState('');

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  return (
    <div className="container-graph">
      <h1>Educational Control Panel</h1>
      <label htmlFor="level">Select Level:</label>
      <select id="level" value={level} onChange={handleLevelChange}>
        <option value="">Select</option>
        <option value="countries">Countries</option>
        <option value="cities">Cities</option>
        <option value="stakes">Average Attendance by Group (Stake Level)</option>
        <option value="wards">Student's count by group (Stake Level)</option>
        <option value="groups">Group's number of sessions by Stake</option>
        <option value="students">Student's Attendance by Group</option>
      </select>
      {level === 'students' && <StudentAttendanceChartData />}
      {level === 'countries' && <CountriesChartData />}
      {level === 'cities' && <CitiesChartData />}
      {level === 'stakes' && <StakesChartData />}
      {level === 'wards' && <WardsChartData />}
      {level === 'groups' && <GroupsChartData />}
    </div>
  );
}

export default StatisticsPage;