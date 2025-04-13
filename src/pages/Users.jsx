import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance";
import GenericOptions from "../components/GenericOptions";
import { countries } from "../constants/countries";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stakes, setStakes] = useState([]);
  const [selectedStake, setSelectedStake] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = "/users";
        if (selectedWard) {
          url = `/users/wards/${selectedWard}`;
        }
        const response = await api.get(url);
        setUsers(response.data.data);
      } catch (err) {
        //console.error('Error fetching users:', err.response?.data?.error || err.message || err);
        setError("Failed to load users. Please try again.");
      }
    };

    fetchUsers();
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
      //console.error('Error fetching stakes:', error);
      setError("Failed to load stakes. Please try again.");
    }
  };

  const fetchWards = async (stakeId) => {
    try {
      const response = await api.get(`/stakes/wards/${stakeId}`);
      setWards(response.data.wards);
    } catch (error) {
      //console.error('Error fetching wards:', error);
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
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Get users to display on the current page
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const options = [
    {
      label: "Edit",
      route: "/users/:id",
    },
    {
      label: "Delete",
      route: "/delete/:id",
    },
  ];

  return (
    <section className="students">
      <h1 className="students__header">Users</h1>
      <div className="centered">
        <div className="filter__controls-vertical">
          <div className="form-group">
            <label htmlFor="country">Country</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="stake">Stake</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="ward">Ward</label>
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
      {users.length > 0 ? (
        <div className="container students__container">
          {currentUsers.map((user) => (
            <Link key={user._id} className="student">
              <GenericOptions options={options} itemId={user._id} />
              <div className="student__avatar">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`Dp of ${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="avatar__placeholder">
                    {user.firstName ? user.firstName[0] : ""}
                    {user.lastName ? user.lastName[0] : ""}
                  </div>
                )}
              </div>
              <div className="student__info">
                <h4>
                  {user.firstName} {user.lastName}
                </h4>
                <p>{user.email}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2>No users found for the selected criteria</h2>
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
    </section>
  );
};

export default Users;
