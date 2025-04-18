import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import GenericOptions from "../components/GenericOptions";
import { countries } from "../constants/countries";
import { useAuth } from '../context/authContext';

const Instructors = () => {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stakes, setStakes] = useState([]);
  const [selectedStake, setSelectedStake] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const confirmToDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete instructor with ID: ${id}?`)) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/instructors/${id}`);
      if (response.status === 200) {
        fetchInstructors();
      } else {
        setError(response.data?.error || `Failed to delete instructor: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting instructor:", error);
      setError(error.response?.data?.error || "An error occurred while deleting the instructor.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchInstructors = async () => {
    try {
      let url = "/instructors";
      if (selectedWard) {
        url = `/users/instructor/ward/${selectedWard}`;
        const response = await api.get(url);
        setInstructors(response.data.instructors);
        return;
      }
      const response = await api.get(url);
      setInstructors(response.data.data);
    } catch (err) {
      console.error(
        "Error fetching instructors:",
        err.response?.data?.error || err.message || err
      );
      setError("Failed to load instructors. Please try again.");
    }
  };

  useEffect(() => {
    fetchInstructors();
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
      setError("");
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

  const options = [
    {
      label: "Edit",
      route: "/editInstructor/:id",
    },
    {
      label: "Delete",
      route: "/delete/:id",
    },
  ];

  return (
    <section className="instructors">
      <h1 className="instructors__header">Instructors</h1>
      <div className="centered">
        <div className="filter__controls-vertical">
          <div className="instructor__form">
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

      {loading && <p>Loading instructors...</p>}
      {error && <p className="form__error-message">{error}</p>}
      {instructors?.length > 0 ? (
        <div className="container instructors__container">
          {instructors.map((instructor) => (
            <div key={instructor._id} className="instructor">
              <GenericOptions options={options} itemId={instructor._id} confirmToDelete={confirmToDelete} />
              <div className="instructor__info">
              <img
                  src={instructor.userId?.avatar}
                  alt={`${instructor.userId?.firstName} ${instructor.userId?.lastName}`}
                  className="instructor__avatar"
              />
                <h4>
                  {instructor.userId?.firstName} {instructor.userId?.lastName}
                </h4>
                <p>Ward: {instructor.wardId?.name ?? " Unknown"}</p>
                <p>Location: {instructor.wardId?.location ?? "Unknown"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2>No instructors found for the selected criteria</h2>
      )}
      <div className="add__instructor">
        <button className="add__instructor-btn">
          <Link to="/createInstructor">Add an instructor</Link>
        </button>
      </div>
    </section>
  );
};

export default Instructors;