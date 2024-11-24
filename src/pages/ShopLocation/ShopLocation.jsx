import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiGetShopById } from '../../services/ShopServices'; // Import API
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ShopLocation = () => {
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopDetails = async () => {
      const shopId = localStorage.getItem('shopId');
      if (!shopId) {
        alert('ShopId is not found');
        navigate('/login'); // Navigate to login page
        return;
      }

      const result = await ApiGetShopById(shopId);
      if (result.ok) {
        setShopDetails(result.body.data);
        console.log(result.body.data);
      } else {
        alert(result.message);
      }
      setLoading(false);
    };

    fetchShopDetails();
  }, [navigate]);

  useEffect(() => {
    let map;

    if (shopDetails && shopDetails.lat !== undefined && shopDetails.lng !== undefined) {
      // Initialize the map only if it hasn't been initialized yet
      if (!mapRef.current._leaflet_map) {
        map = L.map(mapRef.current).setView([shopDetails.lat, shopDetails.lng], 15); // Tọa độ của shop

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,

        }).addTo(map);

        // Tạo icon tùy chỉnh với hình ảnh từ shopDetails
        const restaurantIcon = L.divIcon({
          className: 'custom-icon', // Tên lớp CSS
          html: `<img src="https://media.istockphoto.com/id/981368726/vi/vec-to/h%C3%ACnh-%E1%BA%A3nh-vector-h%C3%ACnh-%E1%BA%A3nh-vector-n%E1%BB%81n-c%E1%BB%A7a-food-drinks-logo-fork-knife.jpg?s=612x612&w=0&k=20&c=-jZfFWEoT2kRq-pkmBcKpcfVt6IeiqyheKBN6K1OtUM=" alt="${shopDetails.name}" style="width:40px;height:40px;border-radius:50%;">`, // Hình ảnh với border-radius
          iconSize: [40, 40], // Kích thước của icon
          iconAnchor: [20, 40], // Điểm neo của icon
          popupAnchor: [1, -34], // Điểm neo của popup
        });

        // Sử dụng icon tùy chỉnh khi tạo marker
        L.marker([shopDetails.lat, shopDetails.lng], { icon: restaurantIcon }).addTo(map)
          .bindPopup(`
            <b>${shopDetails.name}</b><br>
            <img src="${shopDetails.image}" alt="${shopDetails.name}" style="width:100px;height:auto;">
          `)
          .openPopup();
      }
    } else {
      console.error("Invalid shop details:", shopDetails); // Log the invalid shop details for debugging
    }

    // Cleanup function to remove the map instance
    return () => {
      if (map) {
        map.remove(); // Remove the map instance
      }
    };
  }, [shopDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!shopDetails) {
    return <div>No details found for this shop.</div>;
  }

  return (
    <div>
      <h1>{shopDetails.name}</h1>
      <div
        ref={mapRef}
        style={{ height: '400px', width: '100%' }}
      />
    </div>
  );
};

export default ShopLocation;