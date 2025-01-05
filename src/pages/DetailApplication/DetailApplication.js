import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
const DetailApplication = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(shop ? shop.name : "");
  const [description, setDescription] = useState(shop ? shop.description : "");
  const [address, setAddress] = useState(shop ? shop.address : "");
  const [phone, setPhone] = useState(shop ? shop.phone : "");
  const [lat, setLat] = useState(shop ? shop.lat : "");
  const [lng, setLng] = useState(shop ? shop.lng : "");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [toHour, setToHour] = useState(shop ? shop.to_Hour : "");
  const [fromHour, setFromHour] = useState(shop ? shop.from_Hour : "");
  const [toMinute, setToMinute] = useState(shop ? shop.to_Minume : "");
  const [fromMinute, setFromMinute] = useState(shop ? shop.from_Minume : "");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/ShopApplication/${id}`
        );
        setShop(response.data.data);

        const { to_Hour, from_Hour, to_Minune, from_Minune } = response.data.data;
        setToHour(to_Hour);
        setFromHour(from_Hour);
        setToMinute(to_Minune);
        setFromMinute(from_Minune);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setDescription(shop.description);
      setAddress(shop.address);
      setPhone(shop.phone);
      setLat(shop.lat);
      setLng(shop.lng);
      setImage(shop.image);
    }
  }, [shop]);

  const updateShopStatus = async (status) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', status);
      formData.append('message', message);

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
        navigate('/shop-application');
      } else {
        console.error("Error updating shop status:", response.data.messages);
      }
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const updateApplicationDetails = async () => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('lat', lat || "");
      formData.append('lng', lng || "");
      formData.append('phone', phone);

      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(
        `https://bms-fs-api.azurewebsites.net/api/Shop/UpdateShopByStaff/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.isSuccess) {
        setSnackbarMessage('Shop details updated successfully!');
        setSnackbarOpen(true);
        setIsEditing(false);
      } else {
        console.error("Error updating shop details:", response.data.messages);
      }
    } catch (error) {
      console.error("Error updating shop details:", error);
    }
  };

  // Function to format time
  const formatTime = (hour, minute) => {
    const formattedHour = hour < 10 ? `0${hour}` : hour; // Add leading zero if needed
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Add leading zero if needed
    return `${formattedHour}:${formattedMinute}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="shop-detail-container">
      <h1 className="shop-name">Detail of application for {shop.name}</h1>
      <div className="shop-info">
        <img
          src={shop.image || "https://via.placeholder.com/200x150"}
          alt={shop.name}
          className="shop-image"
        />
        <div className="shop-details">
          <div className="detail-field">
            <strong>Name:</strong>
            {isEditing ? (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <span onClick={() => setIsEditing(true)}>{name}</span>
            )}
          </div>
          <div className="detail-field">
            <strong>Address:</strong>
            {isEditing ? (
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            ) : (
              <span onClick={() => setIsEditing(true)}>{address}</span>
            )}
          </div>
          <div className="detail-field">
            <strong>Email:</strong> {shop.email}
          </div>
          <div className="detail-field">
            <strong>Description:</strong>
            {isEditing ? (
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            ) : (
              <span onClick={() => setIsEditing(true)}>{description}</span>
            )}
          </div>
          <div className="detail-field">
            <strong>Phone:</strong>
            {isEditing ? (
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            ) : (
              <span onClick={() => setIsEditing(true)}>{phone}</span>
            )}
          </div>
          <div className="detail-field">
            <strong>Latitude:</strong>
            {isEditing ? (
              <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} />
            ) : (
              <span onClick={() => setIsEditing(true)}>{lat}</span>
            )}
          </div>
          <div className="detail-field">
            <strong>Longitude:</strong>
            {isEditing ? (
              <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} />
            ) : (
              <span onClick={() => setIsEditing(true)}>{lng}</span>
            )}
          </div>
          <div className="detail-field">
            <strong>Status:</strong> {shop.status}
          </div>
          <div className="detail-field">
            <strong>Operating Hours: </strong>
         
              <span onClick={() => setIsEditing(true)}>
                {formatTime(fromHour, fromMinute)} - {formatTime(toHour, toMinute)}
              </span>
            
          </div>
          {isEditing && (
            <button onClick={updateApplicationDetails} className="submit-btn">Save</button>
          )}
                  <div className="detail-field">
                <strong>Message:</strong>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
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

        .detail-field {
          margin-bottom: 15px;
        }

        .detail-field input, .detail-field textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-top: 5px;
        }

        .submit-btn, .accept-btn, .deny-btn {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
        }

        .submit-btn {
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
        }
      `}</style>
    </div>
  );
};

export default DetailApplication;
