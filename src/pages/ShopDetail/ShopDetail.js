import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ShopDetails = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="shop-detail-container">
      <h1 className="shop-name">Shop Details for {shop.name}</h1>
      <div className="shop-info">
        <img
          src={shop.image || "https://via.placeholder.com/200x150"}
          alt={shop.name}
          className="shop-image"
        />
        <div className="shop-details">
          <p>
            <strong>Address:</strong> {shop.address}
          </p>
          <p>
            <strong>Email:</strong> {shop.email}
          </p>
          <p>
            <strong>Description:</strong> {shop.description}
          </p>
          <p>
            <strong>Status:</strong> {shop.status}
          </p>
        </div>
      </div>

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

export default ShopDetails;
