import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import PortraitIcon from "@mui/icons-material/Portrait";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import {
  FaHome,
  FaFileAlt,
  FaListAlt,
  FaComments,
  FaCog,
} from "react-icons/fa"; // Import react-icons
import { Link, useNavigate } from "react-router-dom";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import AuthContext from "../../auth/AuthContext";
import BalanceIcon from "@mui/icons-material/Balance";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Default sidebar items
  let sidebarItems = [

    { text: 'Dashboard', icon: <HomeIcon />, path: "/admin" },
    { text: 'Staff', icon: <AnalyticsIcon />, path: "/admin/manage-staff" },
    { text: 'Feedback', icon: <RateReviewOutlinedIcon />, path: "/admin/feedback" },
    { text: 'Customer', icon: <PersonIcon />, path: "/admin/customer-details" },
    { text: 'Orders', icon: <StoreOutlinedIcon />, path: "/admin/orders" },
    { text: "Package", icon: <Inventory2OutlinedIcon />, path: "/admin/Package" },
    { text: 'Profile', icon: <PortraitIcon />, path: "/admin/profile" },
  ];

  

  // Ensure user and user.role are defined before using them
  if (user && user.role && user.role.includes("Staff")) {
    sidebarItems = [
      { text: "DashboardStaff", icon: <PortraitIcon />, path: "/dashboardStaff" },
      { text: "ShopOverview", icon: <FaCog />, path: "/shopOverview" },
      { text: "Category", icon: <FaListAlt />, path: "/category" },
      { text: "Feedback", icon: <FaComments />, path: "/feedback" },
      { text: "Student Confirm", icon: <FaComments />, path: "/student-confirm" },
      {
        text: "Shop Application",
        icon: <FaListAlt />,
        path: "/shop-application",
      },
      { text: "Package", icon: <Inventory2OutlinedIcon />, path: "/admin/Package" },
      { text: "Product Application", icon: <RestaurantMenuIcon />, path: "/productApplication" },
      { text: 'Customer', icon: <PersonIcon />, path: "/admin/customer-details" },

      { text: "Profile", icon: <PortraitIcon />, path: "/admin/profile" },
    ];
  } else if (user && user.role && user.role.includes("Shop")) {
    sidebarItems = [
      { text: "Dashboard", icon: <PortraitIcon />, path: "/shop/dashboard" },
      { text: "Morning Prep List", icon: <RestaurantMenuIcon />, path: "/shop/prep-list" },
      { text: "Coupon", icon: <ConfirmationNumberIcon />, path: "/shop/coupon-page" },
      { text: "Breakfast-Menu", icon: <RestaurantMenuIcon />, path: "/shop/menu" },
      { text: "Shop Package", icon: <BalanceIcon />, path: "/shop/package" },
      { text: "Feedback", icon: <RateReviewOutlinedIcon />, path: "/shop/feedback-shop" },
      { text: "Operating Hours", icon: <ContactPhoneIcon />, path: "/shop/operating-hours" },
      // { text: "Location", icon: <FmdGoodOutlinedIcon />, path: "/shop/location" },
      { text: "Location", icon: <FmdGoodOutlinedIcon />, path: "/shop/location" },
      { text: 'Orders', icon: <StoreOutlinedIcon />, path: "/shop/orders" },
      // { text: "Profile", icon: <PortraitIcon />, path: "/shop/profile" },
      { text: "About Shop", icon: <ContactPhoneIcon />, path: "/shop/about-shop" },
    ];
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://bms-fs-api.azurewebsites.net/api/Auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("shopId");
        localStorage.removeItem("shopName");
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)",
          color: "#fff",
        },
      }}
      variant="persistent"
      anchor="left"
      open
    >
      <Toolbar sx={{ padding: "16px !important" }}>
        <Box sx={{ minWidth: "56px" }}>
          <DensityMediumIcon />
        </Box>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        
          style={{ cursor: "pointer" }}
        >
          {user?.role || "User"} {/* Dynamically display the role */}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {sidebarItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            sx={{ color: "#fff" }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem button onClick={handleLogout} sx={{ color: "#fff" }}>
        <ListItemIcon sx={{ color: "#fff" }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Log Out" />
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;
