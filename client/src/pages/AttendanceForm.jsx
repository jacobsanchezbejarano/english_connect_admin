import React from "react";

const AttendanceForm  = () => {
  return (
    <div>
      Attendance Form
    </div>
  )
}
// import React, {useState} from 'react';
// import axios from 'axios';
 
// function AttendanceForm({students}){
//     const [attendance, setAttendance] = useState({});
 
//     const handleAttendanceChange = (studentId, status) =>{
//         setAttendance({...attendance, [studentId]: status});
//     };
 
//     const handleSubmit = ()=>{
//         axios.post('/api/attendance', attendance).then((res)=>{
//             console.log("attendance updated");
//         }).catch((err)=>{
//             console.log(err);
//         });
//     };
 
//     return (
// <div>
//     <h2>Attendance</h2>
//     {students.map((student) => (
//     <div key={student._id}>
//         {student.name}
//         <select onChange={(e)=> handleAttendanceChange(student._id, e.target.value)}>
//             <option value="present">Present</option>
//             <option value="absent">Absent</option>
//         </select>
//     </div>
//     ))}
//     <button onClick={handleSubmit}>Submit</button>
// </div>
//     );
// }
 
export default AttendanceForm;