import React, { useState, useEffect } from "react";
import { countries } from "../constants/countries";
import api from "../utils/axiosInstance";
import { useAuth } from "../context/authContext";
import { getCountryFromLocation } from "../utils/locationHelpers";
import { useNavigate } from "react-router-dom";

const EditStudent = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stakesInCountry, setStakesInCountry] = useState([]);
  const [selectedStakeId, setSelectedStakeId] = useState("");
  const [wardsInStake, setWardsInStake] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [student, setStudent] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [addressInfo, setAddressInfo] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.wardId && user.wardId?.stakeId) {
      setSelectedCountry(user.wardId?.location ?? "");
      setSelectedStakeId(user.wardId?.stakeId?._id ?? "");
      setSelectedWardId(user.wardId?._id ?? "");
    }
  }, [user]);

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
        setError("");
        setSelectedStakeId("");
        setStakesInCountry([]);
        setWardsInStake([]);
        setSelectedWardId("");
        const response = await api.get(`/stakes/country/${country}`);
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
    let userId = user?._id;
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        // If the user is not a student, get the student ID from the URL
        if (user.type !== 1) {
          const pathSegments = window.location.pathname.split("/");
          const studentId = pathSegments[pathSegments.length - 1];

          if (!studentId) {
            throw new Error("Student ID not found.");
          }

          const response = await api.get(`/students/${studentId}`);
          userId = response.data.data.userId._id;
        }
        const { data } = await api.get(`/students/user/${userId}`);
        const studentData = data.data;

        // Get the country (name and code) from the location
        let stakeCountry = null;
        if (studentData.userId?.wardId?.stakeId?.location) {
          stakeCountry = getCountryFromLocation(
            studentData.userId?.wardId?.stakeId?.location
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

            const stakeId = studentData.userId.wardId?.stakeId?._id;
            if (stakeId) {
              setSelectedStakeId(stakeId);

              const wardRes = await api.get(`/stakes/wards/${stakeId}`);
              const wards = wardRes.data?.wards || [];
              setWardsInStake(wards);

              const wardId = studentData.userId.wardId?._id;
              if (wardId) {
                setSelectedWardId(wardId);
              }
            }
          } catch (err) {
            console.error("Manual stake/ward load error:", err);
            setError("Failed to load stake/ward information");
          }
        }

        setStudent(studentData);
        setUserInfo({
          firstName: studentData.userId.firstName || "",
          lastName: studentData.userId.lastName || "",
          phone: studentData.userId.phone || "",
          birthDate: studentData.birthDate
            ? studentData.birthDate.substring(0, 10)
            : "",
          language: studentData.language || "Spanish",
          level: studentData.level || "EC1",
          churchMembership: studentData.churchMembership || "Member",
          wardId: studentData.userId.wardId?._id || "",
        });
        setAddressInfo({
          street: studentData.addressId?.street || "",
          neighborhood: studentData.addressId?.neighborhood || "",
          city: studentData.addressId?.city || "",
          state: studentData.addressId?.state || "",
          country: studentData.addressId?.country || "",
          postalCode: studentData.addressId?.postalCode || "",
        });
        setAvatarPreview(studentData.userId.avatar || "../images/Avatar2.jpg");
      } catch (err) {
        console.error(err);
        setError("Failed to load student data");
      }
    };
    fetchData();
  }, [user]);

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
    if (!avatar || !student._id) return;
    const formData = new FormData();
    formData.append("avatar", avatar);
    setIsSubmitting(true);
    try {
      await api.put(`/students/upload/${student._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Avatar updated!");
      setAvatar(null);
    } catch (err) {
      setError("Failed to update avatar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    setError("");
    setSuccess("");
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Update Student info
      const res = await api.put(`/students/${student._id}`, {
        birthDate: userInfo.birthDate,
        language: userInfo.language,
        level: userInfo.level,
        churchMembership: userInfo.churchMembership,
        user: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          phone: userInfo.phone,
          wardId: selectedWardId,
        },
      });

      // Update or create address
      if (student.addressId) {
        await api.put(`/address/${student.addressId._id}`, addressInfo);
      } else {
        const { data } = await api.post("/address", addressInfo);
        await api.put(`/students/${student._id}/address`, {
          addressId: data.data._id,
        });
      }

      // Update access token if needed
      const { accessToken } = res.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken); // or update your auth context
      }

      setSuccess("Student updated successfully!");
      //setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to update student info");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="profile">
      <h1 className="student__profile-header">Edit Student</h1>
      <div className="container profile__container">
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

          {/* Form Section */}
          <form className="form profile__form" onSubmit={handleSubmit}>
            {error && <p className="form__error-message">{error}</p>}
            {success && <p className="form__success-message">{success}</p>}

            <h3>General Info</h3>
            <input
              type="text"
              placeholder="First Name"
              value={userInfo.firstName ?? ""}
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={userInfo.lastName ?? ""}
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
            />
            <input
              type="date"
              value={userInfo.birthDate ?? ""}
              onChange={(e) =>
                setUserInfo({ ...userInfo, birthDate: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              value={userInfo.phone ?? ""}
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
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
                value={selectedStakeId || ""}
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
                value={selectedWardId || ""}
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

            <label>Language</label>
            <select
              value={userInfo.language}
              onChange={(e) =>
                setUserInfo({ ...userInfo, language: e.target.value })
              }
            >
              <option>Spanish</option>
              <option>French</option>
              <option>Portuguese</option>
              <option>Italian</option>
            </select>

            <label>Level</label>
            <select
              value={userInfo.level}
              onChange={(e) =>
                setUserInfo({ ...userInfo, level: e.target.value })
              }
            >
              <option>EC1</option>
              <option>EC2</option>
            </select>

            <label>Church Membership</label>
            <select
              value={userInfo.churchMembership || ""}
              onChange={(e) =>
                setUserInfo({ ...userInfo, churchMembership: e.target.value })
              }
            >
              <option>Member</option>
              <option>Non-member</option>
            </select>

            <h3>Address Info</h3>
            <input
              type="text"
              placeholder="Street"
              value={addressInfo.street || ""}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, street: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Neighborhood"
              value={addressInfo.neighborhood || ""}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, neighborhood: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="City"
              value={addressInfo.city || ""}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, city: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="State"
              value={addressInfo.state}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, state: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              value={addressInfo.country || ""}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, country: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={addressInfo.postalCode || ""}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, postalCode: e.target.value })
              }
            />

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

export default EditStudent;
