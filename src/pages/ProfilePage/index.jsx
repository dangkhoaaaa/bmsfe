import React, { useState, useEffect } from 'react';
import {
  ProfileContainer,
  ProfileCard,
  StyledAvatar,
  StyledList,
  StyledListItem,
  NameTypography,
  RoleTypography,
} from './ProfilePage.style';
import { ApiUpdateAccount, ApiUpdateAvatar } from '../../services/AccountServices';
import { Snackbar, Alert } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    avatar: null,
    phone: '',
    createDate: '',
    lastUpdateDate: '',
    role: '', // Change from array to string to reflect single role
    shopId: '',
    shopName: '',
  });

  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const [updatedData, setUpdatedData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });


  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please enter the old password, new password, and password confirmation.");
      //setOpenAlert(true);
     
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("The new password and password confirmation do not match.");
      //setOpenAlert(true);
      return;
    }
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    if (!lowercaseRegex.test(passwordData.newPassword)) {
      toast.error("The new password must contain at least one lowercase letter.");
     // setOpenAlert(true);
      return;
    }
    if (!uppercaseRegex.test(passwordData.newPassword)) {
      toast.error("The new password must contain at least one uppercase letter.");
      //setOpenAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
       toast.error("Token not found. Please log in again.");
        //setOpenAlert(true);
        return;
      }

      const response = await axios.put(
        'https://bms-fs-api.azurewebsites.net/api/Account/change-password',
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessageAlert("Password changed successfully.");
        setOpenAlert(true);
        setChangePasswordDialogOpen(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        if (response.data.message === "Incorrect password") {
          toast.error("The old password is incorrect.");
         // setOpenAlert(true);
        } else {
          toast.error("Password change unsuccessful. Please try again.");
        //  setOpenAlert(true);
        }
      }
    } catch (error) {
      toast.error("An error occurred while changing the password.");
     // setOpenAlert(true);
      console.error("Password change error:", error);
    }
  };
  
  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://bms-fs-api.azurewebsites.net/api/Account/my-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Pass the token in Authorization header
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          avatar: data.data.avatar,
          phone: data.data.phone,
          createDate: data.data.createDate,
          lastUpdateDate: data.data.lastUpdateDate,
          role: data.data.role,
          shopId: data.data.shopId,
          shopName: data.data.shopName,
        });
        if (data.data.shopId !== null) {
          localStorage.setItem("shopId", data.data.shopId);
        }
        localStorage.setItem("shopName", data.data.shopName);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Fetch user profile data from API
  useEffect(() => {
    fetchProfileData();
  }, [token]);

  // Open dialog for editing the profile
  const handleOpenEditDialog = () => {
    setUpdatedData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });
    setEditDialogOpen(true);
  };

  // Close the edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedFile(null); // Reset selected file when closing the dialog
  };

  // Save the updated data
  const handleSave = async () => {
    const resultAccount = await ApiUpdateAccount(updatedData.firstName, updatedData.lastName, updatedData.phone, token);
    if (resultAccount.ok) {
      const resultAvatar = await ApiUpdateAvatar(selectedFile, token);
      if (resultAvatar.ok) {
        fetchProfileData();
        setEditDialogOpen(false);
        setSelectedFile(null);
        setMessageAlert("Update Profile Successfully!");
        toast.success(messageAlert);
      } else {
        toast.error(resultAvatar.message);
      }
    } else {
      toast.error(resultAccount.message);
    } };

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleSubmit = async () => {
      if (!selectedFile) {
        // Handle case where no file is selected
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        const response = await axios.post('your/api/endpoint', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Handle response...
      } catch (error) {
        console.error("Error uploading file:", error);
      }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <StyledAvatar alt={`${userData.firstName} ${userData.lastName}`} src={userData.avatar || '/default-avatar.png'}>
          {userData.firstName[0]?.toUpperCase() + userData.lastName[0]?.toUpperCase()}
        </StyledAvatar>

        <NameTypography variant="h5">{`${userData.firstName} ${userData.lastName}`}</NameTypography>
        <RoleTypography variant="subtitle1" color="textSecondary">
          Role: {userData.role} {/* Displaying single role */}
        </RoleTypography>

        <StyledList>
          <StyledListItem>
            <ListItemText primary="Phone" secondary={userData.phone || 'Not Provided'} />
          </StyledListItem>
          <StyledListItem>
            <ListItemText primary="Account Created" secondary={new Date(userData.createDate).toLocaleDateString()} />
          </StyledListItem>
          <StyledListItem>
            <ListItemText primary="Last Updated" secondary={new Date(userData.lastUpdateDate).toLocaleDateString()} />
          </StyledListItem>
        </StyledList>
        <Button variant="contained" color="primary" onClick={handleOpenEditDialog} sx={{
                  borderRadius: '15px',
                  margin: '20px 0',
                  fontSize: '16px',
                  background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                  boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
                }}>
                  Update Profile
                </Button>

        <Button variant="contained" color="primary" onClick={() => setChangePasswordDialogOpen(true)} sx={{
                  borderRadius: '15px',
                  margin: '20px 0',
                  fontSize: '16px',
                  background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                  boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
                }}>
                  Change Password
                </Button>

        {/* Modal for changing password */}
        <Dialog open={changePasswordDialogOpen} onClose={() => setChangePasswordDialogOpen(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Old Password"
              type="password"
              fullWidth
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            />
            <TextField
              margin="dense"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleChangePassword} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>


               {/* Dialog for editing profile */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name *"
              fullWidth
              value={updatedData.firstName}
              onChange={(e) => setUpdatedData({ ...updatedData, firstName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Last Name *"
              fullWidth
              value={updatedData.lastName}
              onChange={(e) => setUpdatedData({ ...updatedData, lastName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Phone *"
              fullWidth
              value={updatedData.phone}
              onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
            />
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </ProfileCard>
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {messageAlert}
        </Alert>
      </Snackbar>
      <ToastContainer />
    </ProfileContainer>
  );
}
