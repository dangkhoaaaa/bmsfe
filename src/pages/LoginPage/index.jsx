import React, { useContext, useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, IconButton, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Import icon Visibility
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../../auth/AuthContext';
import { ApiLoginByAccount } from '../../services/AuthServices';
import { ApiGetProfile } from '../../services/AccountServices';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import { Snackbar, Alert } from '@mui/material';
import { useWallet } from '../../context/WalletProvider';
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

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const { wallet, fetchWallet } = useWallet();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // Thêm state để theo dõi trạng thái hiển thị mật khẩu
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      toast.error('Please enter both email and password');
      return;
    }
    const result = await ApiLoginByAccount(data);
    if (result.ok) {
      localStorage.setItem('token', result.body.data.token); // Lưu token vào localStorage
      const decoded = jwtDecode(result.body.data.token);
      setUser(decoded);
      navigateAfterLogin(decoded, result.body.data.token);
    } else {
      toast.error(result.message); // Replace alert with toast notification
    }
  };

  const navigateAfterLogin = (decoded, token) => {
    if (decoded.role.toLowerCase() == "admin" || decoded.role.includes('Admin')) {
      navigate('/admin');
    } else if (decoded.role.toLowerCase() == "staff" || decoded.role.includes('Staff')) {
      navigate('/shop-application');
    } else if (decoded.role.toLowerCase() == "shop" || decoded.role.includes('Shop')) {
      setShopLocalInfo(token);
      fetchWallet(token);
    } else {
      toast.error('Unauthorized role');
    }
  }

  const setShopLocalInfo = async (token) => {
    const result = await ApiGetProfile(token);
    if (result.ok) {
      localStorage.setItem("shopId", result.body.data.shopId);
      localStorage.setItem("shopName", result.body.data.shopName);
    }
    navigate('/shop/menu');
  }

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setError('');
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev); // Thay đổi trạng thái hiển thị mật khẩu
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            maxWidth: '900px',
            backdropFilter: 'blur(100px)', // Thêm hiệu ứng làm mờ phía sau
          }}
        >
          <Box>
          <style>{`
    @keyframes glossyEffect {
      0% {
        background-position: -150% 0;
      }
      50% {
        background-position: 150% 0;
      }
      100% {
        background-position: -150% 0;
      }
    }

    .glossy-avatar {
      position: relative;
      overflow: hidden;
    }

    .glossy-avatar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.4) 100%);
      background-size: 200% 200%;
      animation: glossyEffect 3s infinite;
      pointer-events: none;
    }
  `}</style>

  <Avatar
    className="glossy-avatar"
    src="/LOGO.png"
    sx={{ width: 300, height: 300, bgcolor: '#088A08', marginBottom: 2 }}
  />
          </Box>

          <Box component="form" onSubmit={handleSubmitLogin} sx={{ mt: 1, width: '100%', maxWidth: '400px' }}>
          <Typography
    component="h1"
    variant="h5"
    sx={{
      textAlign: 'center',
      marginBottom: 2,
      fontWeight: 'bold',
      color: '#088A08',
      animation: 'gradientAnimation 3s ease infinite', // Thêm hiệu ứng animation
    }}
  >
    WELCOME TO BMS !
  </Typography>

            {error && (
              <Typography color="error" variant="body2" align="center" sx={{ marginBottom: 2 }}>
                {error}
              </Typography>
            )}
<style>
  {`
    @keyframes colorChange {
      0% {
        color: #088A08; // Màu ban đầu
      }
      100% {
        color: #1abc9c; // Màu cuối
      }
    }
  `}
</style>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
              <EmailIcon sx={{ mr: 1, color: '#088A08' }} />
              <TextField
                variant="outlined"
                placeholder="Email *"
                name="email"
                type={'email'}
                fullWidth
                onChange={handleChange}
                InputProps={{
                  style: { borderRadius: '30px' },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
              <LockIcon sx={{ mr: 1, color: '#088A08' }} />
              <TextField
                variant="outlined"
                placeholder="Password *"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                onChange={handleChange}
                InputProps={{
                  style: { borderRadius: '30px' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                borderRadius: '30px',
                padding: '10px 0',
                margin: '20px 0',
                fontSize: '18px',
                background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
              }}
            >
              LOGIN
            </Button>

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}
            >
              <Typography variant="body2">
                <RouterLink to="/forgot-password" style={{ textDecoration: 'none', color: '#088A08' }}>
                  Forgot Password
                </RouterLink>
              </Typography>

              <Typography variant="body2">
                <RouterLink to="/join-shop" style={{ textDecoration: 'none', color: '#088A08' }}>
                  Join as a Shop Owner
                </RouterLink>
              </Typography>
            </Box>

            {/* <Typography variant="body2" align="center" sx={{ marginBottom: 2 }}>
              <RouterLink to="/register" style={{ textDecoration: 'none', color: '#088A08' }}>
                Create your Account →
              </RouterLink>
            </Typography> */}
            <Snackbar
              open={openAlert}
              autoHideDuration={2000}
              onClose={handleCloseAlert}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                {messageAlert}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
     
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </ThemeProvider>
  );
}
