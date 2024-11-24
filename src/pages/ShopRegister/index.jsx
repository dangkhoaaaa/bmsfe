import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, Grid, Link, Autocomplete } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ApiCreateShop } from '../../services/ShopServices';
import { ApiGetAddressAutoComplete } from '../../services/MapServices';

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
  email: "",
  name: "",
  address: "",
  phone: "",
  description: "",
};

export default function ShopRegister() {
  const [data, setData] = useState(emptyUserData);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmitRegister = async () => {
    if (!isValidateForm()) {
      return;
    }
    const result = await ApiCreateShop(data.email, data.name, data.phone, selectedAddress, data.description);
    if (result.ok) {
      setData(emptyUserData);
      alert("Shop registration successful, the password has been sent to your email.");
      navigate('/login');
    } else {
      alert(result.message);
    }
  };

  const isValidateForm = () => {
    if (data.email === "" || data.email === "undefined") {
      alert("Please provide a valid email address.");
      return false;
    }
    if (data.phone === "") {
      alert("Please provide a valid phone.");
      return false;
    }
    if (selectedAddress === "") {
      alert("Please provide a valid address.");
      return false;
    }
    return true;
  }

  const fetchAddressSuggestions = async (input) => {
    const result = await ApiGetAddressAutoComplete(input);
    if (result.ok) {
      setAddressSuggestions(result.body.predictions);
    } else {
      alert("Unknow error");
    }
  };

  const handleAddressChange = (event) => {
    const { value } = event.target;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 1000);

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
          padding: '0',
          margin: '0',
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
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: '#088A08' }}>
            SHOP REGISTRATION
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Shop Name"
                  autoFocus
                  onChange={handleChange}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
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
                      label="Address"
                      required
                      fullWidth
                      id="address"
                      autoFocus
                      InputProps={{
                        ...params.InputProps,
                        style: { borderRadius: '30px' },
                      }}
                    />
                  )}
                  onChange={(event, newValue) => setSelectedAddress(newValue.description)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Shop Email"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  multiline
                  rows={5}
                  name="description"
                  fullWidth
                  id="description"
                  label="Description"
                  autoFocus
                  onChange={handleChange}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
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
              <Link href="/login" variant="body2" underline="none" sx={{ color: '#088A08' }}>
                Already have an account? Sign in →
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
