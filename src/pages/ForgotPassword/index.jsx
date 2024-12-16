import React, { useEffect, useContext, useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, IconButton, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Import icon Visibility
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../auth/AuthContext';
import { DIGIT_CODE_EXPIRED } from '../../constants/Constant';
import { ApiChangePassword, ApiConfirmDigitCode, ApiResetPassword, ApiSendOTP } from '../../services/AuthServices';
import { Snackbar, Alert } from '@mui/material';

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
export default function ForgotPassword() {
  const { setUser } = useContext(AuthContext)
  // 1.Enter email 2.Enter code 3.New password 
  const [step, setStep] = useState(1);
  const [buttonText, setButtonText] = useState("SEND DITGIT CODE");
  const [oldEmail, setOldEmail] = useState('');
  const [digitCode, setDigitCode] = useState('');
  const [newPassword, setNewPassword] = useState({
    password: '',
    passwordConfirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(DIGIT_CODE_EXPIRED);
  const [isCounting, setIsCounting] = useState(false);
  const startCountdown = () => {
    setCountdown(DIGIT_CODE_EXPIRED);
    setIsCounting(true);
  };
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  useEffect(() => {
    if (isCounting && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Clear interval khi component unmount hoặc countdown thay đổi
    } else {
      setIsCounting(false); // Dừng đếm ngược
    }
  }, [isCounting, countdown]);
  const nextStep = () => {
    setStep(step + 1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { // 1. Enter email
      startCountdown();
      const result = await ApiSendOTP(oldEmail);
      if (result.ok) {
        setButtonText("VERIFY");
        nextStep();
      } else {
        alert(result.message);
      }
    } else if (step === 2) { // 2. Enter Digit code
      if (isCounting) {
        const result = await ApiConfirmDigitCode(oldEmail, digitCode);
        if (result.ok) {
          setIsCounting(false);
          setButtonText("CHANGE PASSWORD");
          nextStep();
        } else {
          alert(result.message);
        }
      } else {
        // re send email
        startCountdown();
      }
    } else { // 3. Enter new password
      if (newPassword.password !== newPassword.passwordConfirm) {
        alert("Password confirm is not match");
        return;
      }
      const result = await ApiResetPassword(oldEmail, newPassword.password);
      if (result.ok) {
        setMessageAlert("Recover password successfully!");
        setOpenAlert(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        alert("Recover password successfully!!!");
        navigate('/login');
      } else {
        alert(result.message);
      }
    }
  };
  const handleChangeEmail = (event) => {
    setOldEmail(event.target.value);
  };
  const handleChangeDigit = (event) => {
    setDigitCode(event.target.value);
  };
  const handleChangePassword = (event) => {
    setNewPassword({
      password: event.target.value,
      passwordConfirm: newPassword.passwordConfirm
    });
  };
  const handleChangePasswordConfirm = (event) => {
    setNewPassword({
      password: newPassword.password,
      passwordConfirm: event.target.value
    });
  };
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev); // Thay đổi trạng thái hiển thị mật khẩu
  };
  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm((prev) => !prev); // Thay đổi trạng thái hiển thị mật khẩu
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            maxWidth: '900px',
          }}
        >
          <Box>
            <Avatar
              src="/LOGO.png"
              sx={{ width: 300, height: 300, bgcolor: '#088A08', marginBottom: 2 }}
            />
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: '400px' }}>
            <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: '#088A08' }}>
              RECOVER YOUR PASSWORD
            </Typography>
            {step === 1 && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }} className="mt-5">
                <EmailIcon sx={{ mr: 1, color: '#088A08' }} />
                <TextField
                  value={oldEmail}
                  variant="outlined"
                  placeholder="Enter your email *"
                  name="email"
                  type={'email'}
                  required
                  fullWidth
                  onChange={handleChangeEmail}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Box>
            ) || step === 2 && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }} className="mt-5">
                <EmailIcon sx={{ mr: 1, color: '#088A08' }} />
                <TextField
                  value={digitCode}
                  variant="outlined"
                  placeholder="Enter digit code"
                  name="digitCode"
                  type={'text'}
                  fullWidth
                  onChange={handleChangeDigit}
                  InputProps={{
                    style: { borderRadius: '30px' },
                  }}
                />
              </Box>
            ) || (
                <div>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <LockIcon sx={{ mr: 1, color: '#088A08' }} />
                    <TextField
                      value={newPassword.password}
                      variant="outlined"
                      placeholder="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      fullWidth
                      onChange={handleChangePassword}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <LockIcon sx={{ mr: 1, color: '#088A08' }} />
                    <TextField
                      value={newPassword.passwordConfirm}
                      variant="outlined"
                      placeholder="Enter password confirm"
                      name="confirmPassword"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      required
                      fullWidth
                      onChange={handleChangePasswordConfirm}
                      InputProps={{
                        style: { borderRadius: '30px' },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPasswordConfirm}
                              edge="end"
                            >
                              {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </div>
              )}

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
              {isCounting
                ? `${buttonText} (${countdown})`
                : step === 2
                  ? 'Re-send (Expired)'
                  : buttonText}
            </Button>
            <Typography variant="body2" align="center" sx={{ marginBottom: 2 }}>
              <RouterLink to="/login" style={{ textDecoration: 'none', color: '#088A08' }}>
                Back to Login Page
              </RouterLink>
            </Typography>
          </Box>
        </Box>
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
      </Box>
    </ThemeProvider>
  );
}