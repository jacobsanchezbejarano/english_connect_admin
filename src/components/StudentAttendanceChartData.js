import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StudentAttendanceChartData() {
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [allAttendances, setAllAttendances] = useState([]);
  const [ward, setWard] = useState('Valle Sanchez');
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [groupId, setGroupId] = useState("67def02c189395ecba1fd906");
  const [loading, setLoading] = useState(true);
  function buildInitialStudents(students, attendances, meetings) {
    if (!students || students.length === 0) {
      return [];
    }

    const initialStudents = students.map((student) => {
      const studentAttendance = {};

      meetings.forEach((meetingDate) => {
        const attendanceRecord = attendances.find((attendance) => {
          const attendanceDate = new Date(attendance.date).toISOString().split('T')[0];
          const meetingDateOnly = new Date(meetingDate).toISOString().split('T')[0];
          return (
            attendance.studentId._id === student._id && attendanceDate === meetingDateOnly
          );
        });

        studentAttendance[meetingDate] = attendanceRecord
          ? { isPresent: attendanceRecord.isPresent, _id: attendanceRecord._id }
          : { isPresent: false, _id: null };
      });

      const studentName = student.userId
        ? `${student.userId.firstName} ${student.userId.lastName}`
        : 'Unknown';

      return {
        id: student._id,
        name: studentName,
        gender: 'M',
        attendance: studentAttendance,
      };
    });

    return initialStudents;
  }

  function getUniqueAttendanceDates(attendances) {
    if (!attendances || attendances.length === 0) {
      return [];
    }

    const uniqueDates = Array.from(
      new Set(
        attendances.map((attendance) =>
          new Date(attendance.date).toISOString().split('T')[0]
        )
      )
    );
    return uniqueDates.sort((a, b) => new Date(a) - new Date(b));
  }

  async function fetchData() {
    const token = localStorage.getItem('accessToken'); // Assuming your token is stored in localStorage
  
    try {
      const attendanceResponse = await api.get(
        `/attendance/group/${groupId}`
      );
      const attendanceData = attendanceResponse.data;
      setAllAttendances(attendanceData);
      const meetingsData = getUniqueAttendanceDates(attendanceData);
      setMeetings(meetingsData);
      setMeetings(meetingsData.sort((a, b) => new Date(a) - new Date(b)));
  
      const studentsResponse = await api.get(
        `/registrations/group/${groupId}/students`
      );
      const studentsData = studentsResponse.data;
  
      const data = buildInitialStudents(
        studentsData,
        attendanceData,
        meetingsData
      );
      setStudents(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access. Redirecting to login.');
        // navigate('/login');
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const meetingsData = getUniqueAttendanceDates(allAttendances);
    setMeetings(meetingsData);
  }, [allAttendances]);

  useEffect(() => {
    if (students.length > 0 && meetings.length > 0) {
      try {
        const studentData = students.map((student) => {
          let attendanceCount = 0;
          meetings.forEach((meetingDate) => {
            if (student.attendance[meetingDate]?.isPresent) {
              attendanceCount++;
            }
          });
          const attendancePercentage = meetings.length > 0 ? (attendanceCount / meetings.length) * 100 : 0;
          return { name: student.name, percentage: attendancePercentage.toFixed(2) };
        });

        const labels = studentData.map((student) => student.name);
        const percentages = studentData.map((student) => student.percentage);

        setChartData({
          labels: labels,
          datasets: [{
            label: `Attendance Percentage by Student (Ward level) ${ward}`,
            data: percentages,
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          }],
        });
        setChartOptions({ title: { display: true, text: `Attendance Percentage by Student (Ward level) ${ward}` } });
        setLoading(false);
      } catch (error) {
        console.error('Error calculating student percentages:', error);
      }
    }
  }, [students, meetings]);

  if(loading) return <Spinner status="loading"/>;

  return chartData && <Bar data={chartData} options={chartOptions} />;
}

export default StudentAttendanceChartData;