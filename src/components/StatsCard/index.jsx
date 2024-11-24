import React from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"; // Biểu tượng mũi tên lên/xuống

const StatsCard = ({ title, thisMonth, lastMonth, icon, isMoney = false }) => {
  // Tính toán tỷ lệ phần trăm thay đổi
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 100; // Tránh chia cho 0, coi như tăng 100% nếu trước đó không có dữ liệu
    const change = ((current - previous) / previous) * 100;
    return Math.round(change);
  };

  const percentageChange = calculatePercentageChange(thisMonth, lastMonth);
  const isIncrease = percentageChange >= 0;

  return (
    <div style={styles.card}>
      <div style={styles.cardContent}>
        <div>{icon}</div>
        <div style={styles.textContainer}>
          <h2>{title}</h2>
          {isMoney ? (
            <>
              <p className="mt-3">
                This Month: {thisMonth.toLocaleString("vi-VN")} VNĐ
              </p>
              <p>Last Month: {lastMonth.toLocaleString("vi-VN")} VNĐ</p>
            </>
          ) : (
            <>
              <p className="mt-3">This Month: {thisMonth}</p>
              <p>Last Month: {lastMonth}</p>
            </>
          )}
          {/* Hiển thị tỷ lệ thay đổi */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: isIncrease ? "green" : "red",
              marginTop: 10,
            }}
          >
            {isIncrease ? (
              <ArrowUpward style={{ marginRight: 5 }} />
            ) : (
              <ArrowDownward style={{ marginRight: 5 }} />
            )}
            <span>{Math.abs(percentageChange)}% {isIncrease ? "Increase" : "Decrease"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    margin: "10px",
    backgroundColor: "#f9f9f9",
  },
  textContainer: {
    marginLeft: "15px",
  },
};

export default StatsCard;