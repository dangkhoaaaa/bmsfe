import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShopOverview = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shopsPerPage] = useState(5);
  const [totalShops, setTotalShops] = useState(0);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/ShopApplication?pageIndex=${currentPage}&pageSize=${shopsPerPage}&search=${encodeURIComponent(
            debouncedSearchTerm
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
  }, [debouncedSearchTerm, currentPage]);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset lại trang đầu khi tìm kiếm thay đổi
  };

  const handleViewDetails = (id) => {
    navigate(`/shop-details/${id}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="shop-overview-container">
      <h1>Shop Overview</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange} // Đã sửa lỗi tại đây
        />
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : shops.length === 0 ? (
        <div className="no-results">No shops found.</div>
      ) : (
        <table className="shop-table">
          <thead>
            <tr>
              <th>Shop Image</th>
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
                  <img
                    src={shop.image || "https://via.placeholder.com/50"}
                    alt={shop.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{shop.name}</td>
                <td>{shop.description}</td>
                <td>{renderStars(shop.rate)}</td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(shop.id)}
                  >
                    View Details
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
        .shop-overview-container {
          padding: 20px;
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
        .star {
          color: #ccc; /* Default star color */
          font-size: 20px;
        }
        .star.filled {
          color: #ffcc00; /* Color for filled stars */
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
          transition: background-color 0.3s;
        }
        .pagination-button.active {
          background-color: #00cc69;
          color: white;
        }
        .pagination-button:hover {
          background-color: #f1f1f1;
        }
        .no-results {
          text-align: center;
          font-size: 18px;
          color: #777;
          margin: 20px 0;
        }
        .loading-spinner {
          text-align: center;
          font-size: 18px;
          color: #00cc69;
          margin: 20px 0;
        }
        .view-details-btn {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .view-details-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ShopOverview;
