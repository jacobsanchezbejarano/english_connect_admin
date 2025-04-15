import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import { useAuth } from '../context/authContext';

const ShowAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const userId = user?._id;
    if (!userId) return;

    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/students/${userId}/attendance`);
        setAttendanceData(res.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [isAuthenticated, user?._id]);

  if (loading) return <div className="loading">Loading attendance data...</div>;
  if (!attendanceData) return <div className="no-data">No attendance data available.</div>;

  const { summary, sessions } = attendanceData;

  return (
    <div className="container attendance-section">
      <h1 className="attendance-title">My Attendance</h1>

      {/* Summary */}
      <div className="summary-boxes">
        <SummaryBox label="Total Sessions" value={summary.total} />
        <SummaryBox label="Attended" value={summary.attended} color="text-green" />
        <SummaryBox label="Missed" value={summary.missed} color="text-red" />
        <SummaryBox label="Attendance %" value={`${summary.percentage}%`} />
      </div>

      {/* Session list */}
      <div className="session-list">
        {sessions.map((session, index) => (
          <div key={index} className="session-card">
            <div>
              <p className="session-date">{new Date(session.date).toLocaleDateString()}</p>
              <p className="session-name">{session.groupName}</p>
              {session.notes && (
                <p className="session-notes"><em>Notes:</em> {session.notes}</p>
              )}
            </div>
            <div className={`session-status ${session.status === 'attended' ? 'text-green' : 'text-red'}`}>
              {session.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SummaryBox = ({ label, value, color = 'text-dark' }) => (
  <div className="summary-box">
    <p className="summary-label">{label}</p>
    <p className={`summary-value ${color}`}>{value}</p>
  </div>
);

export default ShowAttendance;
