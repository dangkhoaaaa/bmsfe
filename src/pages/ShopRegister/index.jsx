import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, Grid, Link, Autocomplete } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ApiCreateShop } from '../../services/ShopServices';
import { ApiGetAddressAutoComplete } from '../../services/MapServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2ecc71',
    },
  },
});

const emptyUserData = {
  email: '',
  name: '',
  address: '',
  phone: '',
  description: '',
  avatar: null,
};

export default function ShopRegister() {
  const [data, setData] = useState(emptyUserData);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' }); // Clear error for the field on change
  };

  const handleAvatarChange = (file) => {
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setData((prevData) => ({
        ...prevData,
        avatar: file,
        previewURL,
      }));
    }
  };

  const handleSubmitRegister = async () => {
    if (!isValidateForm()) {
      return;
    }
    const result = await ApiCreateShop(data.email, data.name, data.phone, selectedAddress, data.description, data.avatar);
    if (result.ok) {
      setData(emptyUserData);
      toast.success('Your shop registration request successful, the Application has been submitted. Please wait for staff verification.');
      navigate('/login');
    } else {
      toast.error(result.message);
    }
  };

  const isValidateForm = () => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Shop name is required.';
    if (!data.email.trim()) newErrors.email = 'Email is required.';
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!selectedAddress.trim()) newErrors.address = 'Address is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAddressSuggestions = async (input) => {
    const result = await ApiGetAddressAutoComplete(input);
    if (result.ok) {
      setAddressSuggestions(result.body.predictions);
    } else {
      alert('Unknown error occurred while fetching address suggestions.');
    }
  };

  const handleAddressChange = (event) => {
    const { value } = event.target;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);

    setDebounceTimeout(newTimeout);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
          width: '100%',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#088A08' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: '#088A08' }}
          >
            SHOP REGISTRATION
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  label="Shop Name"
                  autoFocus
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{ style: { borderRadius: '30px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleAvatarChange(e.target.files[0])}
                />
                <div className="d-flex align-items-center">
                  <Typography className="mx-2">Shop Avatar:</Typography>
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="avatar-upload"
                    sx={{
                      background: 'linear-gradient(135deg, #b4ec51, #429321)',
                      color: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #429321, #0f9b0f)',
                      },
                      textTransform: 'none',
                    }}
                  >
                    Upload Avatar
                  </Button>
                </div>
                {data.previewURL && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                      src={data.previewURL}
                      alt="Avatar Preview"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  required
                  fullWidth
                  label="Phone Number"
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{ style: { borderRadius: '30px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={addressSuggestions}
                  getOptionLabel={(option) => option.description || ''}
                  renderOption={(props, option) => (
                    <li {...props}>{option.description || 'No description available'}</li>
                  )}
                  onInputChange={(event, newInputValue) => handleAddressChange(event)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Address"
                      required
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address}
                      InputProps={{
                        ...params.InputProps,
                        style: { borderRadius: '30px' },
                      }}
                    />
                  )}
                  onChange={(event, newValue) => setSelectedAddress(newValue ? newValue.description : '')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  required
                  fullWidth
                  label="Shop Email"
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{ style: { borderRadius: '30px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  multiline
                  rows={5}
                  fullWidth
                  label="Description"
                  onChange={handleChange}
                  InputProps={{ style: { borderRadius: '30px' } }}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 5,
                mb: 2,
                borderRadius: '30px',
                padding: '10px 0',
                fontSize: '18px',
                background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
              }}
              onClick={handleSubmitRegister}
            >
              Sign Up Your Shop
            </Button>
            <Typography variant="body2" align="center">
              <Link href="/login" underline="none" sx={{ color: '#088A08' }}>
                Already have an account? Sign in →
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}
