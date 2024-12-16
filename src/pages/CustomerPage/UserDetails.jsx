import React, { useState, useEffect } from "react";
import {
  TableContainer,
  CustomTable,
  CustomTableRow,
  ActionButton,
  StyledBox
} from "./UserDetails.style";
import {
  TableHead,
  TableBody,
  TableCell,
  TextField,
  InputAdornment,
  Pagination,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserDetails() {
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 5; // Set the number of items per page
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [userIdToDelete, setUserIdToDelete] = useState(null); // Store user ID to delete

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      // Redirect to login if no token is present
      window.location.href = '/login';
      return;
    }

    const fetchUsers = async (page, search) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/User/GetListUser?status=active&search=${encodeURIComponent(search)}&isDesc=true&pageIndex=${page}&pageSize=${PAGE_SIZE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Authorization header
            },
          }
        );

        // Access the nested data structure
        if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
          setUsers(response.data.data.data); // Set the correct users array
          setTotalPages(Math.ceil(response.data.data.total / PAGE_SIZE)); // Assuming total is in the response
        } else {
          console.error("API response does not contain a valid user array:", response.data);
          setUsers([]); // Fallback to an empty array if data is not as expected
        }

      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized error, redirect to login
          console.error("Unauthorized access - redirecting to login");
          window.location.href = '/login';
        } else {
          console.error("Error fetching user data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Safeguard filter and map operations
  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Sort users by firstName
  const sortedUsers = filteredUsers.sort((a, b) => {
    const comparison = a.firstName.localeCompare(b.firstName);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`https://bms-fs-api.azurewebsites.net/api/User?id=${userIdToDelete}`, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
        },
      });
      
      if (response.status === 200) {
        toast.success("User deleted successfully!");
        setOpenDialog(false); // Close the dialog
        window.location.reload(); // Refresh the current page
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred while deleting the user");
      } else {
        toast.error("An error occurred while deleting the user");
      }
    }
  };

  const openConfirmationDialog = (id) => {
    setUserIdToDelete(id); // Set the user ID to delete
    setOpenDialog(true); // Open the confirmation dialog
  };

  return (
    <div>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
       
          <TextField
            placeholder="Search Customer..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ width: "250px" }}
          />
        </h2>
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : users.length === 0 ? (
        <Typography variant="h6" color="error">No customers found.</Typography>
      ) : (
        <>
          <TableContainer>
            <CustomTable>
              <TableHead>
                <CustomTableRow>
                  <TableCell>#</TableCell>
                  <TableCell onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                    Name {sortOrder === 'asc' ? '↑' : '↓'}
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Actions</TableCell>
                </CustomTableRow>
              </TableHead>
              <TableBody>
                {sortedUsers.map((user, index) => (
                  <CustomTableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell> {/* Handle null phone */}
                    <TableCell>
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" width="40" height="40" style={{ borderRadius: '50%' }} />
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => openConfirmationDialog(user.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </CustomTableRow>
                ))}
              </TableBody>
            </CustomTable>
            <p>{sortedUsers.length} out of {users.length} Customer(s)</p>
          </TableContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteUser} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserDetails;
