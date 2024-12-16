import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CRUDCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [totalCategories, setTotalCategories] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Category?pageIndex=${currentPage}&pageSize=${categoriesPerPage}&search=${encodeURIComponent(
            searchTerm
          )}`
        );

        if (response.data.isSuccess) {
          setCategories(response.data.data.data);
          setTotalCategories(response.data.data.total);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchTerm, currentPage, categoriesPerPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    setDebounceTimeout(newTimeout);
  };

  const handleEdit = (category) => {
    const { id, name, description } = category;
    navigate(`/edit-category/${id}/${encodeURIComponent(name)}/${encodeURIComponent(description)}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(
          `https://bms-fs-api.azurewebsites.net/api/Category/${id}`,
          {
            headers: {
              Accept: "*/*",
            },
          }
        );
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleAddCategory = () => {
    navigate("/add-category");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="header">
        <h1>Categories</h1>
        <button className="add-button" onClick={handleAddCategory}>
          + Add
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="no-data">No categories found.</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="category-info">
                      <img
                        src={category.image || "https://via.placeholder.com/50"}
                        alt={category.name}
                      />
                      <span>{category.name}</span>
                    </div>
                  </td>
                  <td>{category.description}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(category)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(category.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(totalCategories / categoriesPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 1rem auto;
          padding: 0 0.5rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 1.5rem;
          color: #333;
          margin: 0;
        }

        .add-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .add-button:hover {
          background-color: #45a049;
        }

        .search-box {
          margin-bottom: 1rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .search-box input:focus {
          outline: none;
          border-color: #4caf50;
        }

        .table-container {
          background: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 0.6rem;
          text-align: left;
          border-bottom: 1px solid #eee;
          font-size: 0.9rem;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 500;
          color: #333;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-info img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
        }

        .action-buttons {
          display: flex;
          gap: 0.3rem;
          justify-content: center;
        }

        .edit-button,
        .delete-button {
          padding: 0.3rem;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          background: none;
        }

        .edit-button:hover,
        .delete-button:hover {
          background-color: #f0f0f0;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 0.3rem;
          margin-top: 1rem;
        }

        .page-button {
          padding: 0.3rem 0.6rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .page-button:hover {
          background-color: #f0f0f0;
        }

        .page-button.active {
          background-color: #4caf50;
          color: white;
          border-color: #4caf50;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #4caf50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .no-data {
          text-align: center;
          padding: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .container {
            padding: 0 0.3rem;
          }

          th,
          td {
            padding: 0.5rem;
          }

          .action-buttons {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default CRUDCategory;
