import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
  const { id } = useParams(); // Extract ID from the URL
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: null,
    currentImage: "", // Display the current image
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the current category details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Category/${id}`
        );
        if (response.data.isSuccess) {
          setCategory({
            name: response.data.data.name,
            description: response.data.data.description,
            currentImage: response.data.data.image,
            image: null, // To allow for new image uploads
          });
        } else {
          // Do not set error message here
          // setError(response.data.message || "Failed to fetch category details.");
        }
      } catch (error) {
        // Do not set error message here
        // const apiError = error.response?.data?.message || "Error fetching category details.";
        // setError(apiError);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  // Validate the form inputs before submission
  const validateForm = () => {
    if (!category.name || !category.description) {
      setError("Name and description are required.");
      return false;
    }
    return true;
  };

  // Handle updating the category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("id", id); // Append the category ID
    formData.append("name", category.name); // Append the category name
    formData.append("description", category.description); // Append the description
    if (category.image) {
      formData.append("image", category.image); // Append the new image if provided
    }

    try {
      const response = await axios.put(
        "https://bms-fs-api.azurewebsites.net/api/Category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer <YOUR_ACCESS_TOKEN>`, 
          },
        }
      );

      if (response.data.isSuccess) {
        toast.success("Category updated successfully!");
        navigate("/category"); // Redirect to the category list
      } else {
        setError(
          response.data.messages?.[0]?.content || "Failed to update category."
        );
      }
    } catch (error) {
      // Handle error without setting specific error messages
      // const apiError = error.response?.data?.message || "Error updating category.";
      // setError(apiError);
    }
  };

  return (
    <div className="edit-category-container">
      <h1>Edit Category</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleUpdateCategory}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Category Name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Description"
            value={category.description}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            onChange={(e) =>
              setCategory({ ...category, image: e.target.files[0] })
            }
          />
          {category.currentImage && (
            <div>
              <p>Current Image:</p>
              <img
                src={category.currentImage}
                alt="Current"
                style={{ width: "100px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Update Category
        </button>
      </form>
      <ToastContainer />
      <style>{`
        .edit-category-container {
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
        .form-group input,
        .form-group textarea {
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

export default EditCategory;
