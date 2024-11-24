import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState(""); // Tên danh mục
  const [description, setDescription] = useState(""); // Mô tả danh mục
  const [image, setImage] = useState(null); // Ảnh danh mục
  const [error, setError] = useState(null); // Lỗi khi gửi dữ liệu
  const [success, setSuccess] = useState(null); // Thành công khi gửi dữ liệu
  const navigate = useNavigate(); // Chuyển hướng

  // Xử lý thay đổi file ảnh
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Lưu file được chọn vào state
  };

  // Gửi yêu cầu tạo danh mục
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn refresh trang

    // Validate input
    if (!name || !description || !image) {
      setError("All fields are required. Please fill them in.");
      return;
    }

    // Tạo FormData để gửi dữ liệu dạng multipart/form-data
    const formData = new FormData();
    formData.append("name", name); // Thêm trường tên
    formData.append("description", description); // Thêm trường mô tả
    formData.append("image", image); // Thêm file ảnh

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer <YOUR_ACCESS_TOKEN>`, // Thay <YOUR_ACCESS_TOKEN> bằng token của bạn
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Category created successfully!");
        setError(null);
        navigate("/category"); // Chuyển hướng về trang danh sách danh mục
      }
    } catch (err) {
      console.error("Error creating category:", err);
      // Hiển thị lỗi từ API nếu có
      const apiError =
        err.response?.data?.errors ||
        "An error occurred while creating the category.";
      setError(JSON.stringify(apiError));
      setSuccess(null);
    }
  };

  return (
    <div className="add-category-container">
      <h1>Add New Category</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="add-category-form">
        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            required
          />
        </div>

        <div className="form-group">
          <label>Category Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add Category
        </button>
      </form>

      <style>{`
        .add-category-container {
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .form-group textarea {
          resize: vertical;
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

export default AddCategory;
