import React, { useState, useEffect } from 'react';
import { TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Pagination, 
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Avatar, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './StaffPage.scss'; 
import axios from 'axios';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Fetch staff data based on search term and pagination
  const fetchStaff = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`https://bms-fs-api.azurewebsites.net/api/Staff/GetListStaff?status=active&search=${searchTerm}&isDesc=true&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response data:", response.data); // Log the response data
      setStaff(response.data.data.data); 
      setTotalCount(response.data.totalCount); 
    } catch (error) {
      console.error('Error fetching staff:', error);
      alert("Failed to fetch staff data. Please check your API.");
    }
  };

  // Debouncing the search term to delay API calls while user is typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStaff();
    }, 500);  // Adjust the debounce time as needed

    return () => clearTimeout(delayDebounceFn);  // Cleanup the timeout
  }, [searchTerm, pageIndex]);

  const handleAddStaff = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('firstName', newStaff.firstName);
      formData.append('lastName', newStaff.lastName);
      formData.append('email', newStaff.email);

      await axios.post('https://bms-fs-api.azurewebsites.net/api/Staff', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setOpen(false);
      setNewStaff({ firstName: '', lastName: '', email: '' });
      fetchStaff(); 
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff. Please check your input.");
    }
  };

  const handleDeleteStaff = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
      await axios.delete(`https://bms-fs-api.azurewebsites.net/api/Staff?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchStaff(); 
      setStaffToDelete(null); 
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member.");
    }
  };

  const handleConfirmDelete = (id) => {
    setStaffToDelete(id); 
    setConfirmOpen(true); 
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      handleDeleteStaff(staffToDelete); 
      setConfirmOpen(false); 
    }
  };

  return (
    <div className="staff-page">
      <div className="staff-header">
        <Typography variant="h4">Manage Staff</Typography>
        <div className="staff-actions">
          <TextField
            label="Search Staff"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className="search-bar"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add Account
          </Button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="staff-table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Create Date</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.length > 0 ? (
                staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>
                      <Avatar alt={staffMember.firstName} src={staffMember.avatar} />
                    </TableCell>
                    <TableCell>{staffMember.firstName}</TableCell>
                    <TableCell>{staffMember.lastName}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.phone || 'N/A'}</TableCell>
                    <TableCell>{new Date(staffMember.createDate).toLocaleDateString()}</TableCell>
                    <TableCell>{staffMember.role || 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleConfirmDelete(staffMember.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="h6">No staff found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(totalCount / pageSize)}
          page={pageIndex}
          onChange={(event, value) => setPageIndex(value)} 
          color="primary"
          className="pagination"
        />
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Staff</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={newStaff.firstName || ''}
                onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={newStaff.lastName || ''}
                onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={newStaff.email || ''}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddStaff} color="primary">Add Staff</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this staff member?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StaffPage;
