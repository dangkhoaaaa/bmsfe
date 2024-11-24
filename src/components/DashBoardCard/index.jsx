import React from "react";

function DashboardCard({ title, count, description }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={styles.count}>{count}</p>
      <p style={styles.description}>{description}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    width: "200px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  count: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  description: {
    color: "#555",
  },
};

export default DashboardCard;
