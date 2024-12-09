import React, { useState, useEffect } from 'react';
import {
  ProfileContainer,
  ProfileCard,
} from './ProfilePage.style';
import { Card, CardContent, Typography, CardMedia, Grid, Box, Autocomplete } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ApiGetShopById, ApiUpdateShop } from '../../services/ShopServices';
import { useNavigate } from 'react-router-dom';
import { ApiGetAddressAutoComplete } from '../../services/MapServices';
import { Snackbar, Alert } from '@mui/material';

export default function ShopProfile() {
  const navigate = useNavigate();
  const [shop, setShop] = useState([]);
  const [shopUpdate, setShopUpdate] = useState([]);
  const [roundedRate, setRoundedRate] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [titleAddress, setTitleAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const token = localStorage.getItem('token');

  const fetchAddressSuggestions = async (input) => {
    const result = await ApiGetAddressAutoComplete(input);
    if (result.ok) {
      setAddressSuggestions(result.body.predictions);
    } else {
      alert("Unknow error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopUpdate({
      ...shopUpdate,
      [name]: value,
    });
  };

  const handleAddressChange = (event) => {
    const { value } = event.target;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 1000);
    setTitleAddress("Address");
    setDebounceTimeout(newTimeout);
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopUpdate({
        ...shopUpdate,
        image: file, // Lưu tệp gốc
      });
    }
  };

  const fetchProfileShopData = async () => {
    const shopId = localStorage.getItem('shopId');
    const token = localStorage.getItem('token');
    if (!shopId) {
      alert('ShopId is not found');
      navigate('/login'); // Navigate to add product page
      return;
    }
    const result = await ApiGetShopById(shopId, token);
    if (result.ok) {
      setShop(result.body.data);
      setShopUpdate(result.body.data);
      setRoundedRate(Math.round(result.body.data.rate))
      setTitleAddress(result.body.data.address);
    } else {
      alert(result.message);
    }
  };

  // Fetch user profile data from API
  useEffect(() => {
    fetchProfileShopData();
  }, [token]);

  // Open dialog for editing the profile
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  // Close the edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  // Save the updated data
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    var address = shopUpdate.address;
    if (selectedAddress && selectedAddress.trim().length > 0) {
      address = selectedAddress;
    }
    const result = await ApiUpdateShop(
      shopUpdate.id,
      shopUpdate.image,
      shopUpdate.name,
      shopUpdate.phone,
      address,
      shopUpdate.description,
      token
    );
    if (result.ok) {
      setMessageAlert("Update shop information successfully!");
      setOpenAlert(true);
      fetchProfileShopData();
      handleCloseEditDialog();
    } else {
      alert(result.message);
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <Card className="shadow-sm p-3 mb-5 bg-white rounded">
          <Grid container spacing={2}>
            {/* Hình ảnh shop */}
            <Grid item xs={12} sm={4}>
              <CardContent>
                <CardMedia
                  component="img"
                  height="200"
                  image={shop.image ?? 'https://media.istockphoto.com/id/1425139113/photo/purchasing-goods-with-smartphone-at-grocery-store.jpg?s=612x612&w=0&k=20&c=xMbZgp4BZAWCH_j7UkM9YiYTXcpS4zqg3MW4_jRmriM='} // Đường dẫn hình ảnh mặc định nếu shop.Image là null
                  alt={shop.name}
                />
              </CardContent>
            </Grid>

            {/* Thông tin chi tiết */}
            <Grid item xs={12} sm={8}>
              <CardContent sx={{ textAlign: 'left' }}>
                <Typography variant="h5" component="div" className="mb-2">
                  {shop.name}
                </Typography>
                {/* Hiển thị các ngôi sao đánh giá */}
                <Box className="mb-2">
                  {[...Array(roundedRate)].map((_, index) => (
                    <StarIcon key={index} style={{ color: '#FFD700' }} />
                  ))}
                </Box>
                <Typography variant="body2" color="textSecondary" className="mb-2">
                  {shop.description || "No description available"}
                </Typography>
                <Box className="mb-2">
                  <strong>Code:</strong> {shop.id}
                </Box>
                <Box className="mb-2">
                  <strong>Email:</strong> {shop.email}
                </Box>
                <Box className="mb-2">
                  <strong>Phone:</strong> {shop.phone || "Not provided"}
                </Box>
                <Box className="mb-2">
                  <strong>Address:</strong> {shop.address}
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        <Button variant="contained" color="primary" onClick={handleOpenEditDialog} sx={{
          borderRadius: '15px',
          margin: '20px 0',
          fontSize: '16px',
          background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
          boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
        }}>
          Update Profile
        </Button>

        {/* Dialog for editing profile */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>UPDATE PROFILE</DialogTitle>
          <DialogContent>
            <Grid item xs={12} sm={8}>
              <CardContent>

                {/* Tên Shop */}
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={shopUpdate.name}
                  onChange={handleChange}
                  variant="outlined"
                  className="mb-3"
                />

                {/* Số điện thoại */}
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={shopUpdate.phone}
                  onChange={handleChange}
                  variant="outlined"
                  className="mb-3"
                />

                {/* Địa chỉ */}
                <Grid item xs={12} sm={12} className='mb-3'>
                  <Autocomplete
                    freeSolo
                    options={addressSuggestions}
                    getOptionLabel={(option) => option.description || ""}
                    renderOption={(props, option) => (
                      <li {...props}>
                        {option.description}
                      </li>
                    )}
                    onInputChange={(event, newInputValue) => handleAddressChange(event)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={titleAddress}
                        required
                        fullWidth
                        id="address"
                      />
                    )}
                    onChange={(event, newValue) => setSelectedAddress(newValue.description ?? '')}
                  />
                </Grid>

                {/* Mô tả */}
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={shopUpdate.description}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  className="mb-3"
                />

                {/* Upload ảnh từ máy tính */}
                <Box className="mb-3">
                  <Typography>Upload Image:</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Box>

              </CardContent>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="success">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            {messageAlert}
          </Alert>
        </Snackbar>
      </ProfileCard>
    </ProfileContainer>
  );
}
