import React, { useState, useEffect } from 'react';
import { URL } from '../constants/url';
import axios from 'axios';

const AttendanceForm = () => {
  const [groupId, setGroupId] = useState("67def02c189395ecba1fd906");
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState(null);
  const [newAttendanceDate, setNewAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [allAttendances, setAllAttendances] = useState([]);

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
    try {
      const attendanceResponse = await axios.get(
        URL + `/attendance/group/${groupId}`
      );
      const attendanceData = attendanceResponse.data;
      setAllAttendances(attendanceData); // Add this line
      const meetingsData = getUniqueAttendanceDates(attendanceData);
      setMeetings(meetingsData);
      setMeetings(meetingsData.sort((a, b) => new Date(a) - new Date(b)));
      const studentsResponse = await axios.get(
        URL + `/registrations/group/${groupId}/students`
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
      setError(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=>{
    const meetingsData = getUniqueAttendanceDates(allAttendances);
    setMeetings(meetingsData);
    console.log(allAttendances)
  },[allAttendances])

  if (error) {
    return <div>Error.</div>;
  }

  if (students.length === 0 && !error && meetings) {
    return <div>Loading...</div>;
  }

  const studentsPerPage = 10;
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const toggleAttendance = async (studentId, day, isChecked) => {
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      console.error('Student not found.');
      return;
    }

    const dateISO = new Date(day).toISOString();

    const confirmMessage = isChecked
      ? 'Are you sure you want to record attendance for this student?'
      : 'Are you sure you want to remove attendance for this student?';

    if (window.confirm(confirmMessage)) {
      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s._id === studentId
            ? {
                ...s,
                attendance: {
                  ...s.attendance,
                  [day]: { isPresent: isChecked, _id: isChecked ? s.attendance[day]._id : null },
                },
              }
            : s
        )
      );

      try {
        if (isChecked) {
          const response = await axios.post(URL + '/attendance', {
            studentId: studentId,
            groupId: groupId,
            date: dateISO,
            isPresent: true,
            notes: 'Attendance recorded',
          });

          fetchData();
        } else {
          // Delete attendance using _id
          const attendanceId = student.attendance[day]._id;
          if (attendanceId) {
            await axios.delete(URL + `/attendance/${attendanceId}`);
            fetchData();
          } else {
            console.error('Attendance record not found for deletion.');
          }
        }
      } catch (postError) {
        console.error('Error handling attendance:', postError);
        setError(postError);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewAttendanceDateChange = (e) => {
    setNewAttendanceDate(e.target.value);
  };

  const currentStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className='container'>
      <div className='attendance__form'>
        <table border='1'>
          <thead className='attendance__header'>
            <h2 className='attendance'>Student's Attendance</h2>
            <tr>
              <th>Student Name</th>
              <th className='gender'>Gender</th>
              {meetings.map((item) => (
                <th key={item}>{item}</th>
              ))}
              {!meetings.includes(new Date().toISOString().split('T')[0]) && (
                <th>
                  <input
                    type='date'
                    value={newAttendanceDate}
                    onChange={handleNewAttendanceDateChange}
                  />
                </th>
              )}
            </tr>
          </thead>
          <div className='attendance__body'>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td className='name'>{student.name}</td>
                  <td>{student.gender}</td>
                  {meetings.map((day) => (
                    <td key={day}>
                      <label className='attendance__input-container'>
                        <input
                          type='checkbox'
                          checked={student.attendance[day].isPresent}
                          onChange={(e) => toggleAttendance(student.id, day, e.target.checked)}
                        />
                        <span className='checkmark'></span>
                      </label>
                    </td>
                  ))}
                  {!meetings.includes(new Date().toISOString().split('T')[0]) && (
                    <td>
                      <label className='attendance__input-container'>
                        <input
                          type='checkbox'
                          onChange={(e) => toggleAttendance(student.id, newAttendanceDate, e.target.checked)}
                        />
                        <span className='checkmark'></span>
                      </label>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </div>
        </table>

        <div className='pagination__controls'>
          <button
            className='btn primary'
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className='pagination'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='btn primary'
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;