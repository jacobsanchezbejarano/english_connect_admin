import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance";
import GenericOptions from "../components/GenericOptions";
import { countries } from "../constants/countries";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stakes, setStakes] = useState([]);
  const [selectedStake, setSelectedStake] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    if (user?.type === 1 && user.wardId) {
      setSelectedCountry(user.wardId?.location ?? "");
      setSelectedStake(user.wardId?.stakeId?._id ?? "");
      setSelectedWard(user.wardId?._id ?? "");
    }
  }, [user]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        let url = "/students";
        if (selectedWard) {
          url = `/students/wards/${selectedWard}`;
        }
        const response = await api.get(url);
        setStudents(response.data.data);
      } catch (err) {
        console.error(
          "Error fetching students:",
          err.response?.data?.error || err.message || err
        );
        setError("Failed to load students. Please try again.");
      }
    };

    fetchStudents();
  }, [selectedWard]);

  useEffect(() => {
    if (selectedCountry) {
      fetchStakes(selectedCountry);
      setSelectedStake("");
      setSelectedWard("");
      setStakes([]);
      setWards([]);
    } else {
      setStakes([]);
      setWards([]);
      setSelectedStake("");
      setSelectedWard("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedStake) {
      fetchWards(selectedStake);
      setSelectedWard("");
      setWards([]);
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedStake]);

  const fetchStakes = async (countryName) => {
    try {
      const response = await api.get(`/stakes/country/${countryName}`);
      setStakes(response.data.data);
    } catch (error) {
      console.error("Error fetching stakes:", error);
      setError("Failed to load stakes. Please try again.");
    }
  };

  const fetchWards = async (stakeId) => {
    try {
      const response = await api.get(`/stakes/wards/${stakeId}`);
      setWards(response.data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
      setError("Failed to load wards. Please try again.");
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleStakeChange = (e) => {
    setSelectedStake(e.target.value);
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(students.length / studentsPerPage);

  // Get students to display on the current page
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = students.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const options = [
    {
      label: "Edit",
      route: "/students/:id",
    },
    {
      label: "Delete",
      route: "/delete/:id",
    },
  ];

  const confirmToDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete student with ID: ${id}?`)) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/students/${id}`);
      if (response.status === 204) {
        navigate('/students');
      } else {
        setError(response.data?.error || `Failed to delete student: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      setError(error.response?.data?.error || "An error occurred while deleting the student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="students">
      <h1 className="students__header">Students</h1>
      <div className="centered">
        <div className="filter__controls-vertical">
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <label htmlFor="stake">Stake:</label>
            <select
              id="stake"
              value={selectedStake}
              onChange={handleStakeChange}
              disabled={!selectedCountry}
            >
              <option value="">All Stakes</option>
              {stakes.map((stake) => (
                <option key={stake._id} value={stake._id}>
                  {stake.name}
                </option>
              ))}
            </select>

            <label htmlFor="ward">Ward:</label>
            <select
              id="ward"
              value={selectedWard}
              onChange={handleWardChange}
              disabled={!selectedStake}
            >
              <option value="">All Wards</option>
              {wards.map((ward) => (
                <option key={ward._id} value={ward._id}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <p className="form__error-message">{error}</p>}
      {students.length > 0 ? (
        <div className="container students__container">
          {currentStudents.map((student) => (
            <Link key={student._id} className="student">
              <GenericOptions options={options} itemId={student._id} confirmToDelete={confirmToDelete}/>
              <div className="student__avatar">
                {student.userId?.avatar ? (
                  <img
                    src={student.userId.avatar}
                    alt={`Dp of ${student.userId?.firstName} ${student.userId?.lastName}`}
                  />
                ) : (
                  <div className="avatar__placeholder">
                    {student.userId?.firstName
                      ? student.userId.firstName[0]
                      : ""}{" "}
                    {student.userId?.lastName ? student.userId.lastName[0] : ""}
                  </div>
                )}
              </div>
              <div className="student__info">
                <h4>
                  {student.userId?.firstName} {student.userId?.lastName}
                </h4>
                <p>{student.level}</p> {/* Display student-specific info */}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2>No students found for the selected criteria</h2>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination__control">
          <button
            className="btn primary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="pagination">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn primary"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      <div className="add__student">
        {/* <button className="add__student-btn">
          <Link to="/createStudent">Add a student</Link>
        </button> */}
        <button className="add__student-btn">
          <Link to="/registerStudentCourse">
            Register a student into a course
          </Link>
        </button>
      </div>
    </section>
  );
};

export default Students;
