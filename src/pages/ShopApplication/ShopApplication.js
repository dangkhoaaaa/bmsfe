import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const ShopApplication = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shopsPerPage] = useState(5);
  const [totalShops, setTotalShops] = useState(0);
  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null); // State for debounce timeout

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/ShopApplication?status=1&pageIndex=${currentPage}&pageSize=${shopsPerPage}&search=${encodeURIComponent(
            searchTerm
          )}`
        );

        if (response.data.isSuccess) {
          setShops(response.data.data.data);
          setTotalShops(response.data.data.total);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [searchTerm, currentPage]);

  const viewShopDetails = (id) => {
    navigate(`/detail-application/${id}`);
  };

  const updateShopStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", status);

      const response = await axios.put(
        "https://bms-fs-api.azurewebsites.net/api/ShopApplication",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.isSuccess) {
        setShops((prevShops) =>
          prevShops.map((shop) =>
            shop.id === id ? { ...shop, status: status } : shop
          )
        );
        setSnackbarMessage("Shop status updated successfully!");
        setSnackbarOpen(true);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Error updating shop status:", response.data.messages);
      }
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear the previous timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout to fetch shops after 300ms
    const newTimeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      setSearchTerm(value); // Update the search term
    }, 300); // Adjust the delay as needed

    setDebounceTimeout(newTimeout); // Store the timeout ID
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="shop-list-container">
      <h1 className="heading">Shop Application Management</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : shops.length === 0 ? (
        <div>No shop applications found.</div>
      ) : (
        <table className="shop-table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Description</th>
              <th>Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td>
                  <div className="shop-info">
                    <img
                      src={shop.image || "https://via.placeholder.com/50"}
                      alt={shop.name}
                      className="shop-pic"
                    />
                    <span>{shop.name}</span>
                  </div>
                </td>
                <td>{shop.description}</td>
                <td>{shop.rate} / 5</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => viewShopDetails(shop.id)}
                  >
                    Xem Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(totalShops / shopsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`pagination-button ${
                currentPage === i + 1 ? "active" : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <style>{`
        .shop-list-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .heading {
          text-align: center;
          margin-bottom: 20px;
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


        .shop-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .shop-table th, .shop-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        .shop-info {
          display: flex;
          align-items: center;
        }

        .shop-pic {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
        }

        .details-btn, .accept-btn, .deny-btn {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
        }

        .details-btn {
          background-color: #007bff;
          color: white;
          border: none;
        }

        .accept-btn {
          background-color: #00cc69;
          color: white;
          border: none;
        }

        .deny-btn {
          background-color: red;
          color: white;
          border: none;
        }

        .deny-btn.disabled {
          background-color: gray;
          cursor: not-allowed;
        }

        .pagination {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }

        .pagination-button {
          padding: 10px 15px;
          margin: 0 5px;
          border: 1px solid #ddd;
          background-color: #fff;
          cursor: pointer;
          font-size: 14px;
          border-radius: 5px;
        }

        .pagination-button.active {
          background-color: #00cc69;
          color: white;
          border-color: #00cc69;
        }

        .pagination-button:hover {
          background-color: #f1f1f1;
        }
      `}</style>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShopApplication;
