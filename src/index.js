import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import './index.css';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Edit from './pages/InstructorProfile';
import Instructors from './pages/Instructors';
import Layout from './components/Layout';
import Register from './pages/Register';
import Units from './pages/Units';
import InstructorProfile from './pages/InstructorProfile';
import StudentProfile from './pages/StudentProfile';
import CreateStudent from './components/CreateStudent';
import CreateInstructor from './components/CreateInstructor';
import CreateUnit from './pages/CreateUnit';
import EditUnitInfo from './components/EditUnitInfo';
import UnitInfo from './pages/UnitInfo';
import Statistics from './pages/Statistics';
import Groups from './pages/Groups';


const router = createBrowserRouter ([
  {
    path: "/",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      {index: true, element: <Home/>},
      {path: "students/:id", element: <Students/>},
      {path: "studentProfile/:id", element: <StudentProfile/>},
      {path: "createStudent/:id", element: <CreateStudent/>},
      {path: "attendance", element: <Attendance/>},
      {path: "login", element: <Login/>},
      {path: "instructorProfile/:id", element: <InstructorProfile/>},
      {path: "editInstructor/:id", element: <Edit/>},
      {path: "instructors/:id", element: <Instructors/>},
      {path: "createInstructor/:id", element: <CreateInstructor/>},
      {path: "register", element: <Register/>},
      {path: "units", element: <Units/>},
      {path: "createUnit", element: <CreateUnit/>},
      {path: "editUnitInfo", element: <EditUnitInfo/>},
      {path: "unitInfo/:id", element: <UnitInfo/>},
      {path: "statistics", element: <Statistics/>},
      {path: "groups", element: <Groups/>}
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
