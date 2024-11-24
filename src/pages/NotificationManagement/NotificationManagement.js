import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [tabIndex, setTabIndex] = useState(0); // 0 for All, 1 for Unread
  const pageSize = 10;

  const fetchNotifications = async (pageIndex, pageSize, status = null) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const params = new URLSearchParams({
        pageIndex,
        pageSize,
        ...(status !== null && { status }),
      });

      const response = await axios.get(
        `https://bms-fs-api.azurewebsites.net/api/Notification/GetNotificationForStaff?${params.toString()}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setNotifications((prevNotifications) =>
          pageIndex === 1
            ? response.data.data.data
            : [...prevNotifications, ...response.data.data.data]
        );
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.orderId === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setPageIndex(1); // Reset to first page for new tab
    fetchNotifications(1, pageSize, newIndex === 1 ? 1 : null); // Fetch unread or all
  };

  const handleNextPage = () => {
    const newPageIndex = pageIndex + 1;
    setPageIndex(newPageIndex);
    fetchNotifications(newPageIndex, pageSize, tabIndex === 1 ? 1 : null); // Fetch next page
  };

  const filteredNotifications =
    tabIndex === 1
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  useEffect(() => {
    fetchNotifications(pageIndex, pageSize, tabIndex === 1 ? 1 : null);
  }, [pageIndex, tabIndex]);

  if (loading) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: "900px", margin: "0 auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", marginBottom: 2 }}
      >
        Notifications
      </Typography>

      {/* Tabs for All and Unread */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="All" />
        <Tab label="Unread" />
      </Tabs>

      <Box
        sx={{
          maxHeight: "600px",
          overflowY: "auto",
          padding: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#666", marginTop: 1 }}>
          New
        </Typography>

        {filteredNotifications.slice(0, pageSize).map((notification) => (
          <Box
            key={notification.orderId}
            sx={{
              display: "flex",
              alignItems: "center",
              paddingY: 1.5,
              borderBottom: "1px solid #e0e0e0",
              cursor: "pointer",
              backgroundColor: notification.read ? "#f5f5f5" : "#fff",
              "&:hover": { backgroundColor: "#eaeaea" },
              position: "relative",
            }}
            onClick={() => markAsRead(notification.orderId)}
          >
            <Avatar
              src={notification.avatar}
              alt={`${notification.firstName} ${notification.lastName}`}
              sx={{ width: 56, height: 56, marginRight: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: notification.read ? "normal" : "bold" }}
              >
                {notification.object} - {notification.shopName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {`Order ID: ${notification.orderId}`} · {notification.time} ago
              </Typography>
            </Box>
            {!notification.read && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "blue",
                  marginLeft: 1,
                }}
              />
            )}
          </Box>
        ))}

        <Typography variant="subtitle1" sx={{ color: "#666", marginTop: 2 }}>
          Earlier
        </Typography>

        {filteredNotifications.slice(pageSize).map((notification) => (
          <Box
            key={notification.orderId}
            sx={{
              display: "flex",
              alignItems: "center",
              paddingY: 1.5,
              borderBottom: "1px solid #e0e0e0",
              cursor: "pointer",
              backgroundColor: notification.read ? "#f5f5f5" : "#fff",
              "&:hover": { backgroundColor: "#eaeaea" },
              position: "relative",
            }}
            onClick={() => markAsRead(notification.orderId)}
          >
            <Avatar
              src={notification.avatar}
              alt={`${notification.firstName} ${notification.lastName}`}
              sx={{ width: 56, height: 56, marginRight: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: notification.read ? "normal" : "bold" }}
              >
                {notification.object} - {notification.shopName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {`Order ID: ${notification.orderId}`} · {notification.time} ago
              </Typography>
            </Box>
            {!notification.read && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "blue",
                  marginLeft: 1,
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Button
        variant="outlined"
        onClick={handleNextPage}
        sx={{ marginTop: 2, width: "100%" }}
      >
        View earlier notifications
      </Button>
    </Box>
  );
};

export default NotificationManagement;
