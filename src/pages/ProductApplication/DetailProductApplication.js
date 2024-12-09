import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
const DetailProductApplication = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thay thế bằng token thực tế
            },
          }
        );

        if (response.data.isSuccess) {
          setProduct(response.data.data);
        } else {
          setSnackbarMessage("Failed to fetch product details.");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setSnackbarMessage("Error fetching product details.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const updateProductStatus = async (status) => {
    try {
      const formData = new FormData();
      formData.append("productId", id);
      formData.append("status", status);
      console.log("id"+id);
      console.log("status"+status);
      const response = await axios.put(
        "https://bms-fs-api.azurewebsites.net/api/Product/ChangeAICanDetect",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Replace with the actual token
          },
        }
      );

      if (response.data.isSuccess) {
      
        setSnackbarMessage('Product Application status updated successfully!');
        setSnackbarOpen(true);
        navigate('/productApplication');
      } else {
        console.error("Error updating product status:", response.data.messages);
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail-container">
      <h1 className="product-name">{product.name}</h1>
      <div className="product-info">
        <img
          src={product.images.length > 0 ? product.images[0].url : "https://via.placeholder.com/200x150"}
          alt={product.name}
          className="product-image"
        />
        <div className="product-details">
          <div className="detail-field">
            <strong>ID:</strong> {product.id}
          </div>
          <div className="detail-field">
            <strong>Name:</strong> {product.name}
          </div>
          <div className="detail-field">
            <strong>Description:</strong> {product.description}
          </div>
          <div className="detail-field">
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </div>
          <div className="detail-field">
            <strong>Shop ID:</strong> {product.shopId}
          </div>
          <button
            onClick={() => updateProductStatus(2)}
            className="accept-btn"
          >
            Accept
          </button>
          <button
            onClick={() => updateProductStatus(3)}
            className="deny-btn"
          >
            Deny
          </button>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <style>{`
        .product-detail-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .product-name {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .product-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .product-image {
          width: 200px;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .product-details {
          flex: 1;
        }

        .detail-field {
          margin-bottom: 15px;
        }

        .accept-btn, .deny-btn {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
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
      `}</style>
    </div>
  );
};

export default DetailProductApplication;
