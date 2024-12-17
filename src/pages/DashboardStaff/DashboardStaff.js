import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";

const StatsCard = ({ title, value, gradient }) => (
  <Paper
    sx={{
      padding: 3,
      borderRadius: 4,
      boxShadow: 3,
      background: gradient,
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 140,
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.05)",
      },
    }}
  >
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h3" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);

const DashboardStaff = () => {
  const [newUsersData, setNewUsersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); // New state for total revenue
  const [totalOrders, setTotalOrders] = useState(0); // New state for total orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const currentDate = new Date(); // Get the current date
  const year = currentDate.getFullYear(); // Get the current year
  const month = currentDate.getMonth() + 1; 
        // Fetch monthly new users
        const userRequests = Array.from({ length: 12 }, (_, i) =>
          axios.get(
            `https://bms-fs-api.azurewebsites.net/api/User/CountNewUser?month=${
              i + 1
            }&year=${year}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        );

        const userResponses = await Promise.all(userRequests);
        const monthlyNewUsers = userResponses.map((response) =>
          response.data.isSuccess ? response.data.data : 0
        );
        setNewUsersData(monthlyNewUsers);

        // Fetch total users
        const totalUsersResponse = await axios.get(
          "https://bms-fs-api.azurewebsites.net/api/User/GetTotalUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (totalUsersResponse.data.isSuccess) {
          setTotalUsers(totalUsersResponse.data.data);
        }

        // Fetch revenue data for each month
        const revenueRequests = Array.from({ length: 12 }, (_, i) =>
          axios.get(
            `https://bms-fs-api.azurewebsites.net/api/Transaction/GetTotalRevenue?month=${
              i + 1
            }&year=${year}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        );

        const revenueResponses = await Promise.all(revenueRequests);
        const monthlyRevenue = revenueResponses.map((response) =>
          response.data.isSuccess ? response.data.data : 0
        );
        setRevenueData(monthlyRevenue);

        // Fetch total revenue for November
        const totalRevenueResponse = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Transaction/GetTotalRevenue?month=${month}&year=${year}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (totalRevenueResponse.data.isSuccess) {
          setTotalRevenue(totalRevenueResponse.data.data); // Update total revenue
        }

        // Fetch total orders for November
        const totalOrdersResponse = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Order/GetTotalOrder?month=${month}&year=${year}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (totalOrdersResponse.data.isSuccess) {
          setTotalOrders(totalOrdersResponse.data.data); // Update total orders
        }

        // Fetch orders data (you can replace this with an actual API if available)
        setOrdersData([50, 60, 70, 85, 95, 110, 120, 140, 150, 160, 170, 200]); // Example data
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: newUsersData,
        backgroundColor: "#42a5f5",
        borderColor: "#1e88e5",
        borderWidth: 1,
      },
      {
        label: "Orders",
        data: ordersData,
        backgroundColor: "#66bb6a",
        borderColor: "#43a047",
        borderWidth: 1,
      },
      {
        label: "Revenue (x1000 VND)",
        data: revenueData.map((r) => r / 1000), // Divide by 1000 to display in thousands
        backgroundColor: "#ffa726",
        borderColor: "#fb8c00",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: { legend: { position: "top" } },
  };

  const currentDate = new Date();
  const options = { month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options); // e.g., "November 2023"

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard - Breakfast App ({formattedDate})
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={6} sm={6} md={2}>
          <StatsCard
            title="Total Users"
            value={totalUsers}
            gradient="linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatsCard
            title="Total Orders"
            value={totalOrders}
            gradient="linear-gradient(135deg, #66BB6A 0%, #43A047 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <StatsCard
            title="Total Revenue"
            value={<span className="total-revenue">{`${totalRevenue.toLocaleString()}`}</span>}
            gradient="linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatsCard
            title="New Users"
            value={newUsersData.reduce((acc, val) => acc + val, 0)}
            gradient="linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)"
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              padding: 3,
              borderRadius: 4,
              backgroundColor: "#fff",
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Monthly Performance
            </Typography>
            <Bar data={barChartData} options={chartOptions} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStaff;
