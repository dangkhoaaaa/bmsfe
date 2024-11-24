import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material';

const DetailApplication = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/ShopApplication/${id}`
        );
        setShop(response.data.data);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  const updateShopStatus = async (status) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', status);

      const response = await axios.put(
        'https://bms-fs-api.azurewebsites.net/api/ShopApplication',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.isSuccess) {
        setSnackbarMessage('Shop status updated successfully!');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="shop-detail-container">
      <h1 className="shop-name">Chi tiết đơn của {shop.name}</h1>
      <div className="shop-info">
        <img
          src={shop.image || "https://via.placeholder.com/200x150"}
          alt={shop.name}
          className="shop-image"
        />
        <div className="shop-details">
          <p>
            <strong>Địa chỉ:</strong> {shop.address}
          </p>
          <p>
            <strong>Email:</strong> {shop.email}
          </p>
          <p>
            <strong>Mô tả:</strong> {shop.description}
          </p>
          <p>
            <strong>Trạng thái:</strong> {shop.status}
          </p>
          <button onClick={() => updateShopStatus('ACCEPTED')} className="accept-btn">Accept</button>
          <button onClick={() => updateShopStatus('DENIED')} className="deny-btn">Deny</button>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <style>{`
        .shop-detail-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .shop-name {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .shop-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .shop-image {
          width: 200px;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .shop-details {
          flex: 1;
        }

        .shop-details p {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 10px;
        }

        .shop-details strong {
          color: #333;
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
        @media (max-width: 768px) {
          .shop-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .shop-image {
            margin-bottom: 20px;
          }

          .shop-name {
            font-size: 1.5rem;
          }

          .shop-details p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailApplication;
