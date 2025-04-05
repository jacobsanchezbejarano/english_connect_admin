import React, { useState, useEffect } from 'react';
import { URL } from '../constants/url';
import { countries } from '../constants/countries';
import axios from 'axios';

const AttendanceForm = () => {
  const [stakes, setStakes] = useState([]);
  const [wards, setWards] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStake, setSelectedStake] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [groupId, setGroupId] = useState('');
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState(null);
  const [newAttendanceDate, setNewAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [allAttendances, setAllAttendances] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (selectedCountry) {
      fetchStakes(selectedCountry);
      setSelectedStake('');
      setSelectedWard('');
      setGroupId('');
      setStakes([]);
      setWards([]);
      setGroups([]);
      setStudents([]);
      setMeetings([]);
      setAllAttendances([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedStake) {
      fetchWards(selectedStake);
      setSelectedWard('');
      setGroupId('');
      setWards([]);
      setGroups([]);
      setStudents([]);
      setMeetings([]);
      setAllAttendances([]);
    }
  }, [selectedStake]);

  useEffect(() => {
    if (selectedWard) {
      fetchGroups(selectedWard);
      setGroupId('');
      setGroups([]);
      setStudents([]);
      setMeetings([]);
      setAllAttendances([]);
    }
  }, [selectedWard]);

  useEffect(() => {
    if (groupId) {
      fetchData();
    } else {
      setStudents([]);
      setMeetings([]);
      setAllAttendances([]);
    }
  }, [groupId]);

  async function fetchStakes(countryId) {
    try {
      const response = await axios.get(URL + `/stakes/country/${countryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStakes(response.data.data);
    } catch (error) {
      console.error('Error fetching stakes:', error);
      setError(error);
    }
  }

  async function fetchWards(stakeId) {
    try {
      const response = await axios.get(URL + `/stakes/wards/${stakeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWards(response.data.wards);
    } catch (error) {
      console.error('Error fetching wards:', error);
      setError(error);
    }
  }

  async function fetchGroups(wardId) {
    try {
      const response = await axios.get(URL + `/groups/ward/${wardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError(error);
    }
  }

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
        gender: 'M', // Assuming default gender
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
        URL + `/attendance/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const attendanceData = attendanceResponse.data;
      setAllAttendances(attendanceData);
      const meetingsData = getUniqueAttendanceDates(attendanceData);
      setMeetings(meetingsData.sort((a, b) => new Date(a) - new Date(b)));
      const studentsResponse = await axios.get(
        URL + `/registrations/group/${groupId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    const meetingsData = getUniqueAttendanceDates(allAttendances);
    setMeetings(meetingsData);
    console.log(allAttendances);
  }, [allAttendances]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleStakeChange = (event) => {
    setSelectedStake(event.target.value);
  };

  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  const handleGroupChange = (event) => {
    setGroupId(event.target.value);
  };

  if (error) {
    return <div>Error loading data.</div>;
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
          s.id === studentId
            ? {
                ...s,
                attendance: {
                  ...s.attendance,
                  [day]: { isPresent: isChecked, _id: isChecked ? s.attendance[day]?._id : null },
                },
              }
            : s
        )
      );

      try {
        if (isChecked) {
          await axios.post(
            URL + '/attendance',
            {
              studentId: studentId,
              groupId: groupId,
              date: dateISO,
              isPresent: true,
              notes: 'Attendance recorded',
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          fetchData();
        } else {
          // Delete attendance using _id
          const attendanceId = student.attendance[day]?._id;
          if (attendanceId) {
            await axios.delete(URL + `/attendance/${attendanceId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
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
    <div className='container d-flex'>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className='filter__controls'>
        <label htmlFor='country'>Country:</label>
        <select id='country' value={selectedCountry} onChange={handleCountryChange}>
          <option value=''>Select Country</option>
          {countries.map((country) => (
            <option key={country._id} value={country._id}>
              {country.name}
            </option>
          ))}
        </select>

        <label htmlFor='stake'>Stake:</label>
        <select id='stake' value={selectedStake} onChange={handleStakeChange} disabled={!selectedCountry}>
          <option value=''>Select Stake</option>
          {stakes.map((stake) => (
            <option key={stake._id} value={stake._id}>
              {stake.name}
            </option>
          ))}
        </select>

        <label htmlFor='ward'>Ward:</label>
        <select id='ward' value={selectedWard} onChange={handleWardChange} disabled={!selectedStake}>
          <option value=''>Select Ward</option>
          {wards.map((ward) => (
            <option key={ward._id} value={ward._id}>
              {ward.name}
            </option>
          ))}
        </select>

        <label htmlFor='group'>Group:</label>
        <select id='group' value={groupId} onChange={handleGroupChange} disabled={!selectedWard}>
          <option value=''>Select Group</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {groupId && (
        

        <div className='attendance__form'>
          <table border='1'>
            <thead className='attendance__header'>
              <h2 className='attendance'>Student Attendance</h2>
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
                            checked={student.attendance[day]?.isPresent || false}
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
      )}

      {!groupId && (selectedWard || selectedStake || selectedCountry) && students.length === 0 && !error && (
        <div>Please select a group to view attendance.</div>
      )}

      {!groupId && !selectedWard && !selectedStake && !selectedCountry && (
        <div>Please select a country, stake, and ward to view groups.</div>
      )}

      {students.length === 0 && groupId && !error && meetings.length > 0 && (
        <div>No students are registered in this group.</div>
      )}

      {students.length === 0 && groupId && !error && meetings.length === 0 && (
        <div>No attendance records found for this group.</div>
      )}
    </div>
  );
};

export default AttendanceForm;