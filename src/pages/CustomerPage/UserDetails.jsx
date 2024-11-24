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
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';

function UserDetails() {
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      // Redirect to login if no token is present
      window.location.href = '/login';
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://bms-fs-api.azurewebsites.net/api/User/GetListUser?status=active&search=%20&isDesc=true&pageIndex=2&pageSize=6",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Authorization header
            },
          }
        );

        // Access the nested data structure
        if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
          setUsers(response.data.data.data); // Set the correct users array
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
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <TableContainer>
      <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Customer Details
        <TextField
          placeholder="Search Customer..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
      <StyledBox>
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
                  <ActionButton>
                    <VisibilityIcon color="primary" />
                  </ActionButton>
                  <ActionButton>
                    <DeleteIcon color="error" />
                  </ActionButton>
                </TableCell>
              </CustomTableRow>
            ))}
          </TableBody>
        </CustomTable>
        <p>{sortedUsers.length} out of {users.length} Customer(s)</p>
      </StyledBox>
    </TableContainer>
  );
}

export default UserDetails;
