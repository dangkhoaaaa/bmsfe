import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Snackbar, Alert } from "@mui/material";

const ProductApplication = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [totalProducts, setTotalProducts] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Product?isDesc=true&isAICanDetect=1&pageIndex=${currentPage}&pageSize=${productsPerPage}&search=${encodeURIComponent(
            searchTerm
          )}`
        );

        if (response.data.isSuccess) {
          setProducts(response.data.data.data);
          setTotalProducts(response.data.data.total);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, currentPage]);

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const viewProductDetails = (id) => {
    navigate(`/detail-product-application/${id}`);
  };

  return (
    <div className="product-list-container">
      <h1 className="heading">Product Application Management</h1>

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
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <img
                      src={
                        product.images.length > 0
                          ? product.images[0].url
                          : "https://via.placeholder.com/50"
                      }
                      alt={product.name}
                      className="product-pic"
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.isOutOfStock ? "Out of Stock" : "Available"}</td>
                <td>
                  <button  className="details-btn" onClick={() => viewProductDetails(product.id)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(totalProducts / productsPerPage) },
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
        .product-list-container {
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

        .product-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .product-table th, .product-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        .product-info {
          display: flex;
          align-items: center;
        }

        .product-pic {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
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
   .details-btn {
          background-color: #007bff;
          color: white;
          border: none;
               padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
        }
        .pagination-button.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
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

export default ProductApplication;
