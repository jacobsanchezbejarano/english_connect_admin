import React, { useState, useEffect } from 'react';

const AttendanceForm = () => {
  // Sample student data 
  const initialStudents = [
    { id: 1, name: 'John Doe', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 2, name: 'Jane Smith', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 3, name: 'Jim Beam', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 4, name: 'Jessica Alba', gender: 'F', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 5, name: 'Jack Daniels', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 6, name: 'Jill Scott', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 7, name: 'Tom Hanks', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 8, name: 'Silva Jane', gender: 'F', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 9, name: 'Henry Edet', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 10, name: 'Enobong Harry', gender: 'F', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 11, name: 'Samuel Janny', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 12, name: 'David Moore', gender: 'M', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
    { id: 13, name: 'Ashton Davis', gender: 'F', attendance: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false } },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(students.length / studentsPerPage);

  // Function to update attendance status
  const toggleAttendance = (studentId, day) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              attendance: {
                ...student.attendance,
                [day]: !student.attendance[day], // Toggle attendance
              },
            }
          : student
      )
    );
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get students for current page
  const currentStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className='container'>
      <div className='attendance__form'>

        <table border="1">
          <thead className='attendance__header'>
          <h2 className='attendance'>Student's Attendance</h2>
            <tr>
              <th>Student Name</th>
              <th className='gender'>Gender</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <div className='attendance__body'>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td className='name'>{student.name}</td>
                <td>{student.gender}</td>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <td key={day}>
                    <label className='attendance__input-container'>
                      <input
                        type="checkbox"
                        checked={student.attendance[day]}
                        onChange={() => toggleAttendance(student.id, day)}
                      />
                      <span className='checkmark'></span>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </div>
        </table>

        {/* Pagination Controls */}
        <div className='pagination__controls'>
          <button className='btn primary' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
          <span className='pagination'>Page {currentPage} of {totalPages}</span>
          <button className='btn primary' disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
