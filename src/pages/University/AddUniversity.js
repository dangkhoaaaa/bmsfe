import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUniversity = () => {
  const [name, setName] = useState(""); // Tên trường đại học
  const [address, setAddress] = useState(""); // Địa chỉ trường đại học
  const [endMail, setEndMail] = useState(""); // Email trường đại học
  const [idStudentFormat, setIdStudentFormat] = useState(""); // Định dạng ID sinh viên
  const [abbreviation, setAbbreviation] = useState(""); // Viết tắt
  const [error, setError] = useState(null); // Lỗi khi gửi dữ liệu
  const [success, setSuccess] = useState(null); // Thành công khi gửi dữ liệu
  const navigate = useNavigate(); // Chuyển hướng
  const token = localStorage.getItem("token");
  // Gửi yêu cầu tạo trường đại học
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn refresh trang

    // Validate input
    if (!name || !address || !endMail || !idStudentFormat || !abbreviation) {
      setError("All fields are required. Please fill them in.");
      return;
    }

    const universityData = {
      name,
      address,
      endMail,
      idStudentFormat,
      abbreviation,
    };

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/University",
        universityData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thay <YOUR_ACCESS_TOKEN> bằng token của bạn
          },
        }
      );

      if (response.status === 200) {
        setSuccess("University created successfully!");
        setError(null);
        navigate("/university"); // Chuyển hướng về trang danh sách trường đại học
      }
    } catch (err) {
      console.error("Error creating university:", err);
      const apiError =
        err.response?.data?.messages[0]?.content ||
        "An error occurred while creating the university.";
      setError(apiError);
      setSuccess(null);
    }
  };

  return (
    <div className="add-university-container">
      <h1>Add New University</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="add-university-form">
        <div className="form-group">
          <label>University Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter university name"
            required
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter university address"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={endMail}
            onChange={(e) => setEndMail(e.target.value)}
            placeholder="Enter university email"
            required
          />
        </div>

        <div className="form-group">
          <label>ID Student Format:</label>
          <input
            type="text"
            value={idStudentFormat}
            onChange={(e) => setIdStudentFormat(e.target.value)}
            placeholder="Enter ID student format"
            required
          />
        </div>

        <div className="form-group">
          <label>Abbreviation:</label>
          <input
            type="text"
            value={abbreviation}
            onChange={(e) => setAbbreviation(e.target.value)}
            placeholder="Enter abbreviation"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add University
        </button>
      </form>

      <style>{`
        .add-university-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .submit-btn {
          display: block;
          width: 100%;
          padding: 10px;
          background-color: #00cc69;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .submit-btn:hover {
          background-color: #009e50;
        }

        .error-message {
          color: red;
          margin-bottom: 10px;
          text-align: center;
        }

        .success-message {
          color: green;
          margin-bottom: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default AddUniversity; 