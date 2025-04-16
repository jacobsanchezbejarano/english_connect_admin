import React, { useState, useEffect } from "react";
import { countries } from "../constants/countries";
import { useNavigate, useParams } from "react-router-dom";
import AvatarPlaceholder from "../images/Avatar1.jpg";
import api from "../utils/axiosInstance";
import { useAuth } from "../context/authContext";
import { getCountryFromLocation } from "../utils/locationHelpers";

const EditInstructor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(AvatarPlaceholder);
  const [instructor, setInstructor] = useState({});
  const [selectedWardId, setSelectedWardId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stakesInCountry, setStakesInCountry] = useState([]);
  const [selectedStakeId, setSelectedStakeId] = useState("");
  const [wardsInStake, setWardsInStake] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const { isAuthenticated } = useAuth();
  const { authAxios } = useAuth();

  // Fetch stakes by country
  useEffect(() => {
    const fetchStakesByCountry = async (country) => {
      if (!country) {
        setSelectedStakeId("");
        setStakesInCountry([]);
        setWardsInStake([]);
        setSelectedWardId("");
        return;
      }
      try {
        setSelectedStakeId("");
        setStakesInCountry([]);
        setWardsInStake([]);
        setSelectedWardId("");
        let response;
        try {
          response = await api.get(`/stakes/country/${country}`);
        } catch (err) {
          console.error(
            "Error fetching stakes by country:",
            err.response?.data?.error || err.message || err
          );
          setFetchError(
            err.response?.data?.error || "Failed to load instructor details."
          );
        }

        if (response.data && Array.isArray(response.data.data)) {
          const stakes = response.data.data;
          setStakesInCountry(stakes);

          if (stakes.length === 1) {
            setSelectedStakeId(stakes[0]._id); // auto-select if only one
          }
        } else {
          setError("Failed to load stakes for the selected country.");
          setStakesInCountry([]);
          setSelectedStakeId("");
          setWardsInStake([]);
        }
      } catch (err) {
        console.error(
          "Error fetching stakes by country:",
          err.response?.data?.error || err.message || err
        );
        setError(
          err.response?.data?.error ||
            "Failed to load stakes for the selected country."
        );
        setStakesInCountry([]);
        setSelectedStakeId("");
        setWardsInStake([]);
      }
    };

    if (isAuthenticated && selectedCountry) {
      fetchStakesByCountry(selectedCountry);
    } else {
      setStakesInCountry([]);
      setSelectedStakeId("");
      setWardsInStake([]);
    }
  }, [selectedCountry, isAuthenticated]);

  // Fetch wards by stake
  useEffect(() => {
    const fetchWardsByStake = async (stakeId) => {
      if (!stakeId) {
        setWardsInStake([]);
        setSelectedWardId("");
        return;
      }
      setError("");
      try {
        const response = await api.get(`/stakes/wards/${stakeId}`);
        if (response.data && Array.isArray(response.data.wards)) {
          setWardsInStake(response.data.wards);
        } else {
          setError("Failed to load wards for the selected stake.");
          setWardsInStake([]);
          setSelectedWardId("");
        }
      } catch (err) {
        console.error(
          "Error fetching wards by stake:",
          err.response?.data?.error || err.message || err
        );
        setError(
          err.response?.data?.error ||
            "Failed to load wards for the selected stake."
        );
        setWardsInStake([]);
        setSelectedWardId("");
      }
    };

    if (isAuthenticated && selectedStakeId) {
      fetchWardsByStake(selectedStakeId);
    } else {
      setWardsInStake([]);
      setSelectedWardId("");
    }
  }, [selectedStakeId, isAuthenticated]);

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      setError("");
      setSuccess("");
      try {
        const data = await api.get(`/instructors/${id}`);
        const instructorData = data.data;

        // Get the country (name and code) from the location
        let stakeCountry = null;
        if (instructorData.wardId?.stakeId?.location) {
          stakeCountry = getCountryFromLocation(
            instructorData.wardId?.stakeId?.location
          );
        }

        // Set the selected country if it exists
        if (stakeCountry) {
          const countryName = stakeCountry.name;
          setSelectedCountry(countryName);

          // Fetch stakes directly
          try {
            const stakeRes = await api.get(`/stakes/country/${countryName}`);
            const stakes = stakeRes.data?.data || [];
            setStakesInCountry(stakes);

            const stakeId = instructorData.wardId?.stakeId?._id;
            if (stakeId) {
              setSelectedStakeId(stakeId);

              const wardRes = await api.get(`/stakes/wards/${stakeId}`);
              const wards = wardRes.data?.wards || [];
              setWardsInStake(wards);

              const wardId = instructorData.userId.wardId?._id;
              if (wardId) {
                setSelectedWardId(wardId);
              }
            }
          } catch (err) {
            console.error("Manual stake/ward load error:", err);
            setError("Failed to load stake/ward information");
          }
        }

        const resp = data.data;
        if (data.status === 200 && data.data) {
          setInstructor(resp);
          setFirstName(resp.data.userId?.firstName || "");
          setLastName(resp.data.userId?.lastName || "");
          setEmail(resp.data.userId?.email || "");
          setPhone(resp.data.userId?.phone || "");
          setSelectedWardId(resp.data.wardId?._id || "");
          setAvatarPreview(resp.data.userId?.avatar || "../images/Avatar2.jpg");
        } else {
          setError("Failed to load instructor details.");
        }
      } catch (err) {
        console.error("Error fetching instructor details:", err);
        setError(
          err.response?.data?.error || "Failed to load instructor details."
        );
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    };

    if (id) {
      fetchInstructorDetails();
    } else {
      setError("Invalid Instructor ID");
      setLoading(false);
    }
  }, [id, authAxios]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateAvatar = async () => {
    setError("");
    setSuccess("");
    if (!avatar || !instructor._id) return;
    const formData = new FormData();
    formData.append("avatar", avatar);
    setIsSubmitting(true);
    try {
      await api.put(`/instructors/upload/${instructor._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Avatar updated succesfully!");
      setAvatar(null);
    } catch (err) {
      setError("Failed to update avatar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Update Student info
      const res = await api.put(`/instructors/${id}`, {
        user: {
          firstName,
          lastName,
          email,
          phone,
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        wardId: selectedWardId,
      });

      if (res.status === 200 && res.data) {
        setSuccess("Instructor updated successfully!");
      } else {
        //console.error('Error updating instructor:', res);
        setError(res.data?.error || "Failed to update instructor details.");
      }
    } catch (err) {
      //console.error('Error updating instructor:', err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update instructor details."
      );
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="profile">
        <div className="container profile__container">
          <div className="profile__details">
            <h1>Loading Instructor Information...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="profile">
        <div className="container profile__container">
          <div className="profile__details">
            <h1>Edit Instructor</h1>
            <p className="form__error-message">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <h1>Edit Instructor</h1>
        <div className="profile__details">
          {/* Avatar Section */}
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={avatarPreview || null} alt="Avatar Preview" />
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <button
              onClick={handleUpdateAvatar}
              type="submit"
              className="btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Avatar"}
            </button>
          </div>

          <form className="form profile__form" onSubmit={handleSubmit}>
            {error && <p className="form__error-message">{error}</p>}
            {success && <p className="form__success-message">{success}</p>}
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
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label>Ward Adscription</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            {selectedCountry && stakesInCountry.length > 0 && (
              <select
                value={selectedStakeId}
                onChange={(e) => setSelectedStakeId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Stake
                </option>
                {stakesInCountry.map((stake) => (
                  <option key={stake._id} value={stake._id}>
                    {stake.name}
                  </option>
                ))}
              </select>
            )}

            {selectedStakeId && wardsInStake.length > 0 && (
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Ward
                </option>
                {wardsInStake.map((wardItem) => (
                  <option key={wardItem._id} value={wardItem._id}>
                    {wardItem.name}
                  </option>
                ))}
              </select>
            )}

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
            {/* <button type='submit' className='btn primary' disabled={loading}>
              {loading ? 'Updating...' : 'Update details'}
            </button> */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                className="btn primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                className="btn secondary"
                onClick={() => navigate(-1)} // Go back to the previous page
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditInstructor;
