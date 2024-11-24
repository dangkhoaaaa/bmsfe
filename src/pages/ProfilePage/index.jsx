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
import { Button, TextField, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [selectedFile, setSelectedFile] = useState(null); // State for selected file

  const token = localStorage.getItem('token');

  // Fetch user profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
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
          localStorage.setItem ("shopId",data.data.shopId );
          console.log (data.data.shopId);
          localStorage.setItem("shopName", data.data.shopName);
          console.log (data.data.shopName);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

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
    try {
      console.log('Token:', token);
      console.log('Updated Data:', updatedData); // Log updated data to debug the request payload

      // Create a FormData object
      const formData = new FormData();
      formData.append('firstName', updatedData.firstName);
      formData.append('lastName', updatedData.lastName);
      formData.append('phone', updatedData.phone);

      // Append selected file if it exists
      if (selectedFile) {
        formData.append('avatar', selectedFile); // Append selected file
      }

      const response = await fetch('https://bms-fs-api.azurewebsites.net/api/Account', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        if (updatedProfile && updatedProfile.data) {
          setUserData(updatedProfile.data); // Update the state with the returned updated data
          setEditDialogOpen(false);
          setSelectedFile(null); // Reset selected file after successful update
        }
      } else {
        let errorMessage = 'Failed to update profile';
        try {
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage; // Log specific error message
          console.error('Error response:', errorResponse); // Log the entire error response for debugging
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        console.error(errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        alert('Network error: Please check your internet connection.');
      } else {
        console.error('Network or other error:', error);
        alert(`Error: ${error.message}`);
      }
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

        <Button variant="contained" color="primary" onClick={handleOpenEditDialog} style={{ marginTop: '20px' }}>
          Update Profile
        </Button>

        {/* Dialog for editing profile */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              fullWidth
              value={updatedData.firstName}
              onChange={(e) => setUpdatedData({ ...updatedData, firstName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              value={updatedData.lastName}
              onChange={(e) => setUpdatedData({ ...updatedData, lastName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Phone"
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
    </ProfileContainer>
  );
}
