// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
 
import React from 'react'

const StudentList = () => {
  return (
    <div>
      Student List
    </div>
  )
}
// function StudentList() {
//   const [students, setStudents] = useState([]);
 
//   useEffect(() => {
//     axios.get('/api/students') // Replace with your API endpoint
//       .then(response => setStudents(response.data))
//       .catch(error => console.error(error));
//   }, []);
 
//   return (
// <div>
//     <h2>Student List</h2>
//     <table>
//         <thead>
//             <tr>
//                 <th>Name</th>
//                 <th>Course 1</th>
//                 <th>Course 2</th>
//                 {/* ... */}
//             </tr>
//         </thead>
//         <tbody>
//             {students.map(student => (
//                 <tr key={student._id}>
//                     <td>{student.name}</td>
//                     <td>{student.course1Status}</td>
//                     <td>{student.course2Status}</td>
//                     {/* ... */}
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// </div>
//   );
// }
 
export default StudentList;