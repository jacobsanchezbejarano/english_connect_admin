import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import './index.css';
import ErrorPage from './pages/ErrorPage';
import Layout from './components/Layout';
import Home from './pages/Home';
import StudentList from './pages/StudentList';
import AttendanceForm from './pages/AttendanceForm';
import Login from './pages/Login';

const router = createBrowserRouter ([
  {
    path: "/",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      {index: true, element: <Home/>},
      {path: "students", element: <StudentList/>},
      {path: "attendance/:id", element: <AttendanceForm/>},
      {path: "login", element: <Login/>}
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
