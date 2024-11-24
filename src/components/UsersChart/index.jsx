import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ApiGetTotalNewUser } from "../../services/UserServices";

Chart.register(...registerables);

const UsersChart = () => {
  const currentDate = new Date();
  const thisYear = currentDate.getFullYear(); // Năm hiện tại
  const thisMonth = currentDate.getMonth() + 1; // Tháng hiện tại (getMonth trả về giá trị từ 0-11)
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "New Users",
        data: [],
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  });

  const fetchTotalNewUsers6Months = async () => {
    const results = [];
    let currentMonth = thisMonth;
    let currentYear = thisYear;

    for (let i = 0; i < 6; i++) {
      const result = await ApiGetTotalNewUser(currentMonth, currentYear, 1, token);
      if (result.ok) {
        results.push({
          month: currentMonth,
          year: currentYear,
          total: result.body.data,
        });
      } else {
        results.push({
          month: currentMonth,
          year: currentYear,
          total: 0,
        });
      }
      currentMonth--;
      if (currentMonth === 0) {
        currentMonth = 12;
        currentYear--;
      }
    }

    // Xử lý labels và data cho biểu đồ
    const labels = [];
    const datas = [];
    results.reverse().forEach((item) => {
      labels.push(`${item.month}/${item.year}`);
      datas.push(item.total);
    });

    setData({
      labels: labels,
      datasets: [
        {
          label: "New Users",
          data: datas,
          fill: false,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    });
  };

  useEffect(() => {
    fetchTotalNewUsers6Months();
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      {data.labels.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
};

export default UsersChart;