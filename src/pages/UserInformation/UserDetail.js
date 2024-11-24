import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User ID:", id);

    if (!id) {
      setError("User ID is undefined.");
      setLoading(false);
      return;
    }

    const fetchUserAndOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        const userResponse = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/User/GetUserById/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const ordersResponse = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/User/GetAllOrderAndFeedbackOfUser/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.data.isSuccess) {
          setUser(userResponse.data.data);
        } else {
          setError("User not found.");
        }

        if (ordersResponse.data.isSuccess) {
          setOrders(ordersResponse.data.data || []);
        } else {
          setError("Failed to fetch orders and feedback.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-detail-container">
      <h1>User Details</h1>
      <button onClick={() => navigate("/")}>Back to List</button>
      {user && (
        <>
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt={`${user.firstName} ${user.lastName}`}
            className="user-avatar-large"
          />
          <p>
            <strong>Full Name:</strong> {`${user.firstName} ${user.lastName}`}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Registration Date:</strong>{" "}
            {new Date(user.createDate).toLocaleDateString()}
          </p>
        </>
      )}

      <h2>Order and Feedback</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="order-item">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Date:</strong> {order.date}
            </p>
            <p>
              <strong>Amount:</strong> {order.amount}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ))
      ) : (
        <p>No orders or feedback available.</p>
      )}

      <style>{`
        .user-detail-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .user-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: block;
          margin: 0 auto 20px;
        }
        .order-item {
          margin-top: 15px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
};

export default UserDetail;
