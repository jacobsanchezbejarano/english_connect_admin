import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import './index.css';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentList from './pages/StudentList';
import AttendanceForm from './pages/Attendance';
import Create from './pages/CreateInstructor';
import Delete from './pages/Delete';
import Edit from './pages/Edit';
import Instructors from './pages/Instructors';
import Layout from './components/Layout';
import Register from './pages/Register';
import Units from './pages/Units';

const router = createBrowserRouter ([
  {
    path: "/",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      {index: true, element: <Home/>},
      {path: "students", element: <StudentList/>},
      {path: "attendance", element: <AttendanceForm/>},
      {path: "login", element: <Login/>},
      {path: "create", element: <Create/>},
      {path: "delete/:id", element: <Delete/>},
      {path: "edit/:id", element: <Edit/>},
      {path: "editInstructor/:id", element: <Edit/>},
      {path: "deleteInstructor/:id", element: <Delete/>},
      {path: "instructors/:id", element: <Instructors/>},
      {path: "units", element: <Units/>},
      {path: "register", element: <Register/>}
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
