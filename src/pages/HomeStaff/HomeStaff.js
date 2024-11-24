import React, { useState, useEffect } from "react";
import CRUDCategory from "../Category/Category";
import Feedback from "../Feedback/Feedback";

const HomeStaff = () => {
  const [categories, setCategories] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // Giả lập việc lấy dữ liệu từ CRUDCategory và Feedback
  useEffect(() => {
    // Giả lập gọi API để lấy dữ liệu
    const fetchData = async () => {
      // Simulate API call for categories
      const categoriesData = [
        {
          id: "1",
          shopName: "Shop A",
          orderStatus: "Duyệt",
          products: [
            { id: "p1", name: "Product 1", price: "$10" },
            { id: "p2", name: "Product 2", price: "$20" },
          ],
        },
        {
          id: "2",
          shopName: "Shop B",
          orderStatus: "Chưa duyệt",
          products: [
            { id: "p3", name: "Product 3", price: "$30" },
            { id: "p4", name: "Product 4", price: "$40" },
          ],
        },
      ];
      setCategories(categoriesData);

      // Simulate API call for feedbacks
      const feedbacksData = [
        {
          id: "97212764-4eb4-4c92-9cd1-08dcd30dca90",
          description: "ok",
          rate: 4,
          createDate: "2024-03-03T00:00:00",
          lastUpdateDate: "2024-03-03T00:00:00",
          userId: "93b615c1-b358-498f-9d72-08dcd30db045",
          shopId: "97212764-4eb4-4c92-9cd1-08dcd30dca90",
          userName: "John Doe",
          userPic: null,
          shopName: "Shop A",
          shoppic: null,
          blocked: false,
        },
        {
          id: "123",
          description: "Great service",
          rate: 5,
          createDate: "2024-04-01T00:00:00",
          lastUpdateDate: "2024-04-01T00:00:00",
          userId: "user2",
          shopId: "shop2",
          userName: "Jane Doe",
          userPic: null,
          shopName: "Shop B",
          shoppic: null,
          blocked: false,
        },
      ];
      setFeedbacks(feedbacksData);
    };
    fetchData();
  }, []);

  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      height: "100vh",
    },
    reportCard: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    header: {
      marginBottom: "20px",
    },
    statNumber: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    statLabel: {
      color: "#999",
      marginBottom: "10px",
    },
    productStatistic: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: "20px",
    },
    circleChart: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      border: "10px solid #3d9970",
    },
    smallText: {
      fontSize: "12px",
      color: "#999",
    },
  };

  return (
    <div style={styles.container}>
      {/* Total Sales Card */}
      <div style={styles.reportCard}>
        <div style={styles.header}>
          <h3>Total Sales</h3>
          <p style={styles.statNumber}>
            $
            {categories
              .reduce(
                (total, category) =>
                  total +
                  category.products.reduce(
                    (sum, product) =>
                      sum + parseFloat(product.price.replace("$", "")),
                    0
                  ),
                0
              )
              .toLocaleString()}
          </p>
          <p style={styles.smallText}>Products vs last month</p>
        </div>
      </div>

      {/* Total Orders Card */}
      <div style={styles.reportCard}>
        <div style={styles.header}>
          <h3>Total Orders</h3>
          <p style={styles.statNumber}>
            {categories
              .reduce((total, category) => total + category.products.length, 0)
              .toLocaleString()}
          </p>
          <p style={styles.smallText}>Orders vs last month</p>
        </div>
      </div>

      {/* Visitor Card */}
      <div style={styles.reportCard}>
        <div style={styles.header}>
          <h3>Visitor</h3>
          <p style={styles.statNumber}>{feedbacks.length.toLocaleString()}</p>
          <p style={styles.smallText}>Users vs last month</p>
        </div>
      </div>

      {/* Product Statistic */}
      <div style={{ ...styles.reportCard, gridColumn: "span 2" }}>
        <h3>Product Statistic</h3>
        <div style={styles.productStatistic}>
          <div style={styles.circleChart}></div>
          <div>
            <p>
              Electronics:{" "}
              {categories.find((c) => c.shopName === "Shop A")?.products
                .length || 0}
            </p>
            <p>
              Game:{" "}
              {categories.find((c) => c.shopName === "Shop B")?.products
                .length || 0}
            </p>
            <p>Furniture: {0}</p>
          </div>
        </div>
      </div>

      <div style={styles.reportCard}>
        <h3>Customer Habits</h3>
        <div style={styles.productStatistic}>
          <div>
            <p>Products viewed</p>
            <p style={styles.statNumber}>41,327</p>
          </div>
          <div>
            <p>Products bought</p>
            <p style={styles.statNumber}>39,784</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeStaff;
