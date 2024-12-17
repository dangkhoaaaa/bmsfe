import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacksPerPage] = useState(5);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const navigate = useNavigate();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch feedbacks when debouncedSearchTerm or currentPage changes
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Feedback?search=${encodeURIComponent(
            debouncedSearchTerm
          )}&pageIndex=${currentPage}&pageSize=${feedbacksPerPage}&isDesc=true`
        );

        if (response.data.isSuccess) {
          setFeedbacks(response.data.data.data);
          setTotalFeedbacks(response.data.data.total);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [debouncedSearchTerm, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBlock = (id) => {
    console.log(`Blocking feedback with id: ${id}`);
    // Add your API call here to block the feedback
  };

  return (
    <div className="feedback-list-container">
      <h1 className="heading">Feedback List</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div>Loading feedbacks...</div>
      ) : feedbacks.length === 0 ? (
        <div>No feedbacks found.</div>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Shop</th>
              <th>Feedback</th>
              <th>Rate</th>
              <th>Date</th>
           
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={feedback.userPic || "https://via.placeholder.com/50"}
                      alt="User"
                      className="user-pic"
                    />
                    <span>{feedback.userName}</span>
                  </div>
                </td>
                <td>
                  <div className="shop-info">
                    <img
                      src={feedback.shoppic || "https://via.placeholder.com/50"}
                      alt="Shop"
                      className="shop-pic"
                    />
                    <span>{feedback.shopName}</span>
                  </div>
                </td>
                <td>{feedback.description}</td>
                <td>
                  <span className="rate-status">{feedback.rate} / 5</span>
                </td>
                <td>{new Date(feedback.createDate).toLocaleDateString()}</td>
          
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(totalFeedbacks / feedbacksPerPage) },
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

      {/* Styles */}
      <style>{`
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

        .feedback-list-container {
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

        .feedback-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .feedback-table th, .feedback-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        .user-pic, .shop-pic {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .user-info, .shop-info {
          display: flex;
          align-items: center;
        }

        .blocked-notice {
          color: red;
          font-weight: bold;
        }

        .rate-status {
          font-weight: bold;
        }

        .block-btn {
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Feedback;
