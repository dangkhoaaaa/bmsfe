import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, Grid, Link, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledSelect } from './RegisterPage.style';
import { ApiRegisterAccount } from '../../services/AuthServices';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2ecc71',
    },
  }
});

const emptyUserData = {
  email: "",
  firstName: "",
  lastName: "",
  password: ""
};

export default function Register() {
  const [data, setData] = useState(emptyUserData);
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmitRegister = async () => {
    if (!isValidateForm()) return;

    const result = await ApiRegisterAccount(data, selectedRole);
    if (result.ok) {
      setSnackbar({ open: true, message: 'Your account is successfully registered.', severity: 'success' });
      setTimeout(() => navigate('/login'), 2000);
      setData(emptyUserData);
      setSelectedRole('');
    } else {
      setSnackbar({ open: true, message: result.message, severity: 'error' });
    }
  };

  const isValidateForm = () => {
    const newErrors = {};
    if (!data.email) newErrors.email = "Please provide a valid email address.";
    if (!data.firstName) newErrors.firstName = "Please provide your first name.";
    if (!data.lastName) newErrors.lastName = "Please provide your last name.";
    if (!data.password) newErrors.password = "Please provide a password.";
    if (!selectedRole) newErrors.role = "Please choose a role.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <ThemeProvider theme={theme}>
     <Box
  sx={{
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
    backgroundSize: '300% 300%',
    animation: 'gradientAnimation 8s ease infinite',
    overflow: 'hidden',
  }}
>
  <style>{`
    @keyframes gradientAnimation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes animateSquare {
      0% {
        transform: scale(0) translateY(0) rotate(0);
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        transform: scale(1.3) translateY(-90px) rotate(360deg);
        opacity: 0;
      }
    }

    .square {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      background-color: transparent;
      animation: animateSquare 8s linear infinite;
    }
    
    .square:nth-of-type(1) {
      top: 10%;
      left: 15%;
      animation-delay: 0s;
    }

    .square:nth-of-type(2) {
      top: 40%;
      left: 60%;
      animation-delay: 2s;
    }

    .square:nth-of-type(3) {
      top: 70%;
      left: 30%;
      animation-delay: 4s;
    }

    .square:nth-of-type(4) {
      top: 20%;
      left: 80%;
      animation-delay: 6s;
    }
  `}</style>
  <div className="square" style={{ top: '10%', left: '15%' }}></div>
  <div className="square" style={{ top: '20%', left: '40%' }}></div>
  <div className="square" style={{ top: '50%', left: '70%' }}></div>
  <div className="square" style={{ top: '30%', left: '25%' }}></div>
  <div className="square" style={{ top: '80%', left: '10%' }}></div>
  <div className="square" style={{ top: '70%', left: '60%' }}></div>
  <div className="square" style={{ top: '40%', left: '85%' }}></div>
  <div className="square" style={{ top: '15%', left: '5%' }}></div>
  <div className="square" style={{ top: '25%', left: '75%' }}></div>
  <div className="square" style={{ top: '35%', left: '55%' }}></div>
  <div className="square" style={{ top: '45%', left: '20%' }}></div>
  <div className="square" style={{ top: '50%', left: '90%' }}></div>
  <div className="square" style={{ top: '60%', left: '30%' }}></div>
  <div className="square" style={{ top: '10%', left: '50%' }}></div>
  <div className="square" style={{ top: '5%', left: '80%' }}></div>
  <div className="square" style={{ top: '75%', left: '25%' }}></div>
  <div className="square" style={{ top: '85%', left: '40%' }}></div>
  <div className="square" style={{ top: '65%', left: '70%' }}></div>
  <div className="square" style={{ top: '95%', left: '15%' }}></div>
  <div className="square" style={{ top: '20%', left: '10%' }}></div>
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
            Sign Up
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    style: { borderRadius: '30px' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <select
                  id="roles"
                  value={selectedRole}
                  onChange={handleSelectChange}
                  className="select-dropdown"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '30px',
                    borderColor: errors.role ? 'red' : undefined,
                  }}
                >
                  <option value="">--Please choose an option--</option>
                  <option value="1">Admin</option>
                  <option value="2">Shop</option>
                  <option value="3">Staff</option>
                </select>
                {errors.role && (
                  <Typography variant="caption" color="error">
                    {errors.role}
                  </Typography>
                )}
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
              Sign Up
            </Button>

            <Typography variant="body2" align="center">
              <Link href="/login" variant="body2" underline="none" sx={{ color: '#088A08' }}>
                Already have an account? Sign in →
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity } sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
