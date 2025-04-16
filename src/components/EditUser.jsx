import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosInstance";
import { FaEdit } from "react-icons/fa";
import { countries } from "../constants/countries";
import { useAuth } from '../context/authContext';

const EditUser = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stakes, setStakes] = useState([]);
  const [selectedStake, setSelectedStake] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [userWard, setUserWard] = useState(null);
  const [isWardSelectEnabled, setIsWardSelectEnabled] = useState(false);
  const [userType, setUserType] = useState();
  const [initialUserType, setInitialUserType] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(()=>{
    setSelectedCountry(user.wardId.location??"");
    setSelectedStake(user.wardId.stakeId._id??"");
    setSelectedWard(user.wardId._id??"");
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const userData = response.data.data;
        setInitialData(userData);
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setEmail(userData.email || "");
        setUserWard(userData.ward);
        setSelectedWard(userData.ward?._id || "");
        setInitialUserType(userData.type);
        setUserType(userData.type);
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        } else {
          setAvatarPreview("../images/Avatar2.jpg");
        }
        if (userData.ward?.stake?.country?.name) {
          setSelectedCountry(userData.ward.stake.country.name);
          fetchStakes(
            userData.ward.stake.country.name,
            userData.ward.stake._id
          );
        }
        if (userData.ward?.stake?._id) {
          setSelectedStake(userData.ward.stake._id);
          fetchWards(userData.ward.stake._id, userData.ward._id);
        }
      } catch (err) {
        //console.error('Error fetching user data:', err.response?.data?.error || err.message || err);
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (
      selectedCountry &&
      selectedCountry !== (userWard?.stake?.country?.name || "")
    ) {
      fetchStakes(selectedCountry);
      setSelectedStake("");
      setSelectedWard("");
      setIsWardSelectEnabled(true);
    } else if (!userWard) {
      setIsWardSelectEnabled(true);
    } else {
      setSelectedStake(userWard?.stake?._id || "");
      setSelectedWard(userWard?._id || "");
      setIsWardSelectEnabled(false);
    }
  }, [selectedCountry, userWard]);

  useEffect(() => {
    if (selectedStake && selectedStake !== (userWard?.stake?._id || "")) {
      fetchWards(selectedStake);
      setSelectedWard("");
      setIsWardSelectEnabled(true);
    } else if (!userWard) {
      setIsWardSelectEnabled(true);
    } else if (selectedCountry === userWard?.stake?.country?.name) {
      setIsWardSelectEnabled(false);
      setSelectedWard(userWard?._id || "");
    }
  }, [selectedStake, userWard, selectedCountry]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const fetchStakes = async (countryName, initialStakeId = null) => {
    try {
      const response = await api.get(`/stakes/country/${countryName}`);
      setStakes(response.data.data);
      if (initialStakeId) {
        setSelectedStake(initialStakeId);
      }
    } catch (error) {
      //console.error('Error fetching stakes:', error);
      setError("Failed to load stakes. Please try again.");
    }
  };

  const fetchWards = async (stakeId, initialWardId = null) => {
    try {
      const response = await api.get(`/stakes/wards/${stakeId}`);
      setWards(response.data.wards);
      if (initialWardId) {
        setSelectedWard(initialWardId);
      }
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword && newPassword !== confirmNewPassword) {
      setError("New password and confirm new password do not match.");
      return;
    }

    const formData = new FormData();
    if (avatar) formData.append("avatar", avatar);
    if (initialData) {
      if (firstName) formData.append("firstName", firstName);
      if (lastName) formData.append("lastName", lastName);
      if (selectedWard && selectedWard !== initialData?.ward?._id) {
        formData.append("wardId", selectedWard);
      }
    }

    if (userType !== initialUserType) formData.append("type", userType);

    if (currentPassword) formData.append("currentPassword", currentPassword);
    if (newPassword) formData.append("newPassword", newPassword);

    setIsSubmitting(true);
    try {
      await api.put(`/users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log('User details updated successfully:', response.data);
      setSuccessMessage("User details updated successfully!");
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (err) {
      //console.error('Error updating user details:', err.response?.data?.error || err.message || err);
      setError(err.response?.data?.error || "Failed to update user details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="profile">
      <h1 className="student__profile-header">Edit User</h1>
      <div className="container profile__container">
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={avatarPreview} alt="Profile DP" />
            </div>
            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
                accept="png, jpg, jpeg"
                style={{ display: "none" }}
              />
              <label htmlFor="avatar">
                <FaEdit />
              </label>
            </form>

            {error && <p className="form__error-message">{error}</p>}
            {successMessage && (
              <p className="form__success-message">{successMessage}</p>
            )}
          </div>

          <h1>
            {firstName} {lastName}
          </h1>

          <form className="form profile__form" onSubmit={handleSubmit}>
            {error && <p className="form__error-message">{error}</p>}
            {successMessage && (
              <p className="form__success-message">{successMessage}</p>
            )}
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
            />
            <div className="filter__controls-vertical">
              <div className="filter__controls">
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <select
                  id="stake"
                  value={selectedStake}
                  onChange={handleStakeChange}
                  disabled={!selectedCountry}
                >
                  <option value="">Select Stake</option>
                  {stakes.map((stake) => (
                    <option key={stake._id} value={stake._id}>
                      {stake.name}
                    </option>
                  ))}
                </select>

                {userWard && !isWardSelectEnabled ? (
                  <input type="text" value={userWard.name} readOnly />
                ) : (
                  <select
                    id="ward"
                    value={selectedWard}
                    onChange={handleWardChange}
                    disabled={!selectedStake}
                  >
                    <option value="">Select Ward</option>
                    {wards.map((ward) => (
                      <option key={ward._id} value={ward._id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="user-type-row">
              <label htmlFor="type">User Type:</label>
              <div className="button-group">
                {[
                  { label: "Student", value: 1 },
                  { label: "Admin", value: 10 },
                  { label: "Instructor", value: 11 },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`type-button ${
                      userType === option.value ? "active" : ""
                    }`}
                    onClick={() => setUserType(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button
              type="submit"
              className="btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update details"}
            </button>
            <button
              type="button"
              className="btn danger"
              onClick={() => navigate("/users")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditUser;
