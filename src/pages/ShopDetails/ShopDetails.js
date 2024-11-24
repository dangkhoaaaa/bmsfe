import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ShopDetails = ({ onUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const shop = location.state?.shop;

  const [updatedOrderStatus, setUpdatedOrderStatus] = useState(
    shop?.orderStatus || ""
  );
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (shop) {
      setUpdatedOrderStatus(shop.orderStatus);
    }
  }, [shop]);

  const handleUpdate = async () => {
    try {
      await onUpdate({ ...shop, orderStatus: updatedOrderStatus });

      setSuccessMessage(
        "Cập nhật thành công! Đang chuyển về trang danh mục..."
      );

      setTimeout(() => {
        navigate("/crud-category");
      }, 2000);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleClose = () => {
    navigate("/crud-category");
  };

  if (!shop) {
    return <div>Không tìm thấy cửa hàng!</div>;
  }

  return (
    <div className="shop-details">
      <h2>Chi Tiết Cửa Hàng</h2>
      <div className="info-section">
        <label>Tên Cửa Hàng:</label>
        <input type="text" value={shop.shopName} disabled />
      </div>
      <div className="info-section">
        <label>Sản Phẩm:</label>
        <ul>
          {shop.products.map((product) => (
            <li key={product.id}>
              <i className="fas fa-candy-cane"></i> {product.name} -{" "}
              {product.price} VND
            </li>
          ))}
        </ul>
      </div>
      <div className="info-section">
        <label>Trạng Thái Đơn Hàng:</label>
        <div className="status-options">
          <label>
            <input
              type="radio"
              value="Duyệt"
              checked={updatedOrderStatus === "Duyệt"}
              onChange={(e) => setUpdatedOrderStatus(e.target.value)}
            />
            Duyệt
          </label>
          <label>
            <input
              type="radio"
              value="Chưa duyệt"
              checked={updatedOrderStatus === "Chưa duyệt"}
              onChange={(e) => setUpdatedOrderStatus(e.target.value)}
            />
            Chưa duyệt
          </label>
        </div>
      </div>

      <div className="button-group">
        <button className="update-btn" onClick={handleUpdate}>
          <i className="fas fa-save"></i> Cập Nhật
        </button>
        <button className="close-details-btn" onClick={handleClose}>
          <i className="fas fa-times"></i> Đóng
        </button>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <style>{`
        .shop-details {
          margin: 20px auto;
          max-width: 600px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .shop-details h2 {
          margin-top: 0;
          text-align: center;
          color: #333;
        }

        .info-section {
          margin-bottom: 15px;
        }

        .info-section label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .info-section input,
        .info-section select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .info-section input[disabled] {
          background-color: #f0f0f0;
        }

        .info-section ul {
          list-style: none;
          padding: 0;
        }

        .info-section li {
          padding: 5px 0;
          display: flex;
          align-items: center;
        }

        .info-section li i {
          margin-right: 8px;
          color: #4CAF50;
        }

        .status-options {
          display: flex;
          gap: 15px;
        }

        .status-options label {
          display: flex;
          align-items: center;
        }

        .status-options input[type="radio"] {
          margin-right: 5px;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 20px;
        }

        .update-btn,
        .close-details-btn {
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: center;
        }

        .update-btn {
          background-color: #4CAF50; /* Xanh lá cây */
          color: #fff;
        }

        .update-btn:hover {
          background-color: #45a049; /* Xanh lá cây đậm */
        }

        .close-details-btn {
          background-color: #f44336; /* Đỏ */
          color: #fff;
        }

        .close-details-btn:hover {
          background-color: #d32f2f; /* Đỏ đậm */
        }

        .success-message {
          margin-top: 20px;
          color: #28a745;
          font-weight: bold;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ShopDetails;
