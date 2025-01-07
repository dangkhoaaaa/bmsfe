import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUniversity = () => {
  const { id } = useParams(); // Extract ID from the URL
  const [university, setUniversity] = useState({
    name: "",
    address: "",
    endMail: "",
    idStudentFormat: "",
    abbreviation: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Fetch the current university details
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/University/${id}`
        );
        if (response.data.isSuccess) {
          setUniversity({
            name: response.data.data.name,
            address: response.data.data.address,
            endMail: response.data.data.endMail,
            idStudentFormat: response.data.data.idStudentFormat,
            abbreviation: response.data.data.abbreviation,
          });
        }
      } catch (error) {
        console.error("Error fetching university details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [id]);

  // Validate the form inputs before submission
  const validateForm = () => {
    if (!university.name || !university.address || !university.endMail || !university.idStudentFormat || !university.abbreviation) {
      setError("All fields are required.");
      return false;
    }
    return true;
  };

  // Handle updating the university
  const handleUpdateUniversity = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) return;

    const universityData = {
      id, // Include the university ID
      name: university.name,
      address: university.address,
      endMail: university.endMail,
      idStudentFormat: university.idStudentFormat,
      abbreviation: university.abbreviation,
    };

    try {
      const response = await axios.put(
        `https://bms-fs-api.azurewebsites.net/api/University/${id}`,
        universityData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Replace with your access token
          },
        }
      );

      if (response.data.isSuccess) {
        toast.success("University updated successfully!");
        navigate("/university"); // Redirect to the university list
      } else {
        setError(response.data.messages?.[0]?.content || "Failed to update university.");
      }
    } catch (error) {
      console.error("Error updating university:", error);
      setError("An error occurred while updating the university.");
    }
  };

  return (
    <div className="edit-university-container">
      <h1>Edit University</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleUpdateUniversity}>
        <div className="form-group">
          <input
            type="text"
            placeholder="University Name"
            value={university.name}
            onChange={(e) => setUniversity({ ...university, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Address"
            value={university.address}
            onChange={(e) => setUniversity({ ...university, address: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Email"
            value={university.endMail}
            onChange={(e) => setUniversity({ ...university, endMail: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="ID Student Format"
            value={university.idStudentFormat}
            onChange={(e) => setUniversity({ ...university, idStudentFormat: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Abbreviation"
            value={university.abbreviation}
            onChange={(e) => setUniversity({ ...university, abbreviation: e.target.value })}
          />
        </div>
        <button type="submit" className="submit-btn">
          Update University
        </button>
      </form>
      <ToastContainer />
      <style>{`
        .edit-university-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .submit-btn {
          width: 100%;
          padding: 10px;
          background-color: #00cc69;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .submit-btn:hover {
          background-color: #009e50;
        }
        .error-message {
          color: red;
          text-align: center;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default EditUniversity;