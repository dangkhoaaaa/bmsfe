import React, { useEffect, useState } from 'react';
import {
  Typography,
  Toolbar,
  Card,
  CardContent,
  CardMedia,
  Box,
  FormLabel,
  RadioGroup,
  Divider,
} from '@mui/material';
import {
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  TextField,
  FormControlLabel,
  Radio
} from '@mui/material';
import { ApiChangeOrderStatus, ApiGetOrderById } from '../../services/OrderServices';
import { useLocation } from 'react-router-dom';
import { StyledPaper } from '../OrderPage/ManageOrders.style';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';
import { io } from 'socket.io-client';
import { HTTP_SOCKET_SERVER } from '../../constants/Constant';
import { Snackbar, Alert } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cancellationReasons = [
  "Customer request",
  "Item no longer available",
  "Kitchen malfunction",
  "Other",
];

const OrderDetailPage = () => {
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');
  const refreshString = searchParams.get('refreshString');
  const shopId = localStorage.getItem('shopId');
  const [status, setStatus] = useState('ORDERED');
  const token = localStorage.getItem('token');
  const [isCompleteScan, setIsCompleteScan] = useState(true);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCloseQR = () => {
    setOpen(false);
    fetchApiGetOrderById();
  };
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const [openDialogReason, setOpenDialogReason] = useState(false);
  const [reason, setReason] = useState("");

  const handleOpenDialogReason = () => {
    setOpenDialogReason(true);
  };

  const handleCloseDialogReason = () => {
    setOpenDialogReason(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmPayment = async () => {
    // Xử lý logic khi xác nhận đã thu tiền
    const result = await ApiChangeOrderStatus(status, orderId, token);
    if (result.ok) {
      toast.success("Updated order status successfully!!!");
      fetchApiGetOrderById();
    } else {
      toast.error(result.message);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdateStatus = () => {
    fetchUpdateOrderStatus();
  };

  const handleOpenQR = async () => {
    setOpen(true);
    setIsCompleteScan(false);
    let statusCurrent = status;
    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await ApiGetOrderById(orderId, token);
        if (result.ok) {
          if (statusCurrent !== result.body.data.status) {
            setIsCompleteScan(true);
            clearInterval(intervalId);
            // Sau 3 giây, đặt lại trạng thái và đóng modal
            setTimeout(() => {
              setIsCompleteScan(false);
              setOpen(false);
              fetchApiGetOrderById();
            }, 3000);
          }
        } else {
          toast.error(result.message);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error checking order status:", error);
        clearInterval(intervalId);
      }
    }, 2000);
  };

  const fetchUpdateOrderStatus = async () => {
    if (status == "CANCEL") {
      // show dialog enter reason
      if (order.status == "CANCEL") {
        toast.error("The status of this order is already cancelled.");
        return;
      }
      handleOpenDialogReason();
      return;
    }
    if (status == "COMPLETE" && !order.isPayed) {
      handleOpenDialog();
      return;
    }
    const result = await ApiChangeOrderStatus(status, orderId, token);
    if (result.ok) {
      toast.success("Updated order status successfully!!!");
      fetchApiGetOrderById();
    } else {
      toast.error(result.message);
    }
  }

  const handleSubmitReason = async () => {
    const reasonToSubmit = selectedReason === "Other" ? customReason : selectedReason;

    // Kiểm tra nếu lý do hủy chưa được nhập
    if (!reasonToSubmit.trim()) {
      toast.error("Please enter a cancellation reason.");
      return;
    }

    // Gửi lý do hủy đơn qua API
    const result = await ApiChangeOrderStatus("CANCEL", orderId, token, reasonToSubmit);
    if (result.ok) {
      toast.success("Order canceled with reason: " + reasonToSubmit);
      fetchApiGetOrderById();
      setCustomReason('');
      setSelectedReason('');
      setOpenDialogReason(false);
    } else {
      toast.error(result.message);
    }
  };

  const sendNotiToUser = async (orderId, userId, shopId) => {
    if (socket) {
      socket.emit('join-user-topic', userId);
      const orderData = {
        userId,
        shopId,
        orderId,
      };
      socket.emit('new-order', orderData); // Send notification to shop
    }
  };

  const fetchApiGetOrderById = async () => {
    if (!orderId) {
      return;
    }
    const result = await ApiGetOrderById(orderId, token);
    if (result.ok) {
      const orderData = result.body.data;
      setOrder(orderData);
      setStatus(orderData.status);
      sendNotiToUser(orderId, orderData.customerId, orderData.shopId);
    } else {
      toast.error(result.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchApiGetOrderById();
    const socketConnection = io(HTTP_SOCKET_SERVER);
    setSocket(socketConnection);
    return () => {
      setTimeout(() => {
        socketConnection.disconnect(); // Delay disconnect by 2 seconds
      }, 2000); // 2 seconds delay
    };
  }, [orderId, refreshString]);

  if (!order) return <Typography>Loading...</Typography>;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <StyledPaper>
      <Toolbar sx={{ justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ORDER DETAILS
        </Typography>
      </Toolbar>

      <Box sx={{ padding: 2 }}>
        {/* Customer Info */}
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <div className='row'>
              <div className='d-flex col-12 col-sm-12 col-md-12 col-lg-6'>
                <div>
                  <CardMedia
                    component="img"
                    alt={order.firstName + ' ' + order.lastName}
                    image={order.avatar}
                    sx={{ borderRadius: '50%', width: 150, height: 150 }}
                  />
                </div>
                <div className='ms-3'>
                  <Typography variant="h6">
                    {order.firstName} {order.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <span className='text-dark fw-bold'>Customer ID:</span> {order.customerId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <span className='text-dark fw-bold'>Order Date:</span> {new Date(order.orderDate).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className='mb-3'>
                    <span className='text-dark fw-bold'>Status:</span> {order.status}
                  </Typography>
                  {order.isPayed && (
                    <Button variant='contained' color='success' >Payment completed</Button>
                  ) || (
                      <Button variant='outlined' color='error' >Outstanding</Button>
                    )}
                </div>
              </div>
              <div className='d-flex col-12 col-sm-12 col-md-12 col-lg-6'>
                <div className='d-flex'>
                  <div>
                    <CardMedia
                      component="img"
                      image={order.shopImage}
                      alt={order.shopName}
                      sx={{ borderRadius: '10px', width: 150, height: 150 }}
                    />
                  </div>
                  <div className='ms-3'>
                    <Typography variant="h6">{order.shopName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span className='text-dark fw-bold'>Shop ID:</span> {order.shopId}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>



        {/* Order Items */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Order Items
          </Typography>
          <Divider />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName || 'Unnamed Product'}</TableCell>
                    <TableCell>
                      <img
                        src={item.productImages[0]?.url || ''}
                        alt={item.productName || 'Product Image'}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>{item.note}</TableCell>
                    <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {shopId && shopId !== "" && (

            <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={handleStatusChange} label="Status">
                  <MenuItem value="ORDERED">Ordered</MenuItem>
                  <MenuItem value="CHECKING">Checking</MenuItem>
                  <MenuItem value="PREPARING">Preparing</MenuItem>
                  <MenuItem value="PREPARED">Prepared</MenuItem>
                  {order && order.status == "TAKENOVER" && (
                    <MenuItem value="TAKENOVER">Taken Over</MenuItem>
                  )}
                  <MenuItem value="CANCEL">Cancel</MenuItem>
                  <MenuItem value="COMPLETE">Complete</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateStatus}
              >
                Update Status
              </Button>
              {order.status != "COMPLETE" && (
                <Button
                  className='ms-2'
                  variant="contained"
                  color="primary"
                  onClick={handleOpenQR}
                >
                  Show QR
                </Button>
              ) || (
                  <p className='fw-bold text-success pt-3'>This order has been completed</p>
                )}

            </Box>
          )}
        </Box>

        <Modal open={open} onClose={handleCloseQR}>
          {isCompleteScan && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <CheckCircleOutline sx={{ fontSize: 60, color: 'green', mb: 2 }} />
              <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
                Scan successful!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseQR}
              >
                Close
              </Button>
            </Box>
          ) || (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 300,
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                }}
              >
                <QRCodeCanvas
                  value={orderId}
                  size={200} // Tăng kích thước QR code
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseQR}
                  sx={{ mt: 2 }}
                >
                  Close
                </Button>
              </Box>
            )}
        </Modal>

        {/* Total Price */}
        <Box sx={{ marginTop: 2, textAlign: 'right' }}>
          <Typography variant="h6">Total: {formatCurrency(order.totalPrice)}</Typography>
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
      <ToastContainer />
      <ConfirmPaymentDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmPayment}
      />
      {/* Dialog để nhập lý do khi hủy đơn */}
      <Dialog open={openDialogReason} onClose={handleCloseDialogReason}>
        <DialogTitle>Enter Reason for Cancellation</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select a Reason</FormLabel>
            <RadioGroup
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              {cancellationReasons.map((reason, index) => (
                <FormControlLabel
                  key={index}
                  value={reason}
                  control={<Radio />}
                  label={reason}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {selectedReason === "Other" && (
            <TextField
              label="Other reason"
              fullWidth
              multiline
              rows={4}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogReason} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReason}
            color="primary"
            disabled={!selectedReason.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
       {/* Dialog hiển thị khi loading */}
       <Dialog open={loading} disableEscapeKeyDown>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions>
          {/* Có thể thêm nút hủy nếu muốn */}
        </DialogActions>
      </Dialog>

    </StyledPaper>
  );
};

function ConfirmPaymentDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm payment received</DialogTitle>
      <DialogContent>
        <p>Have you received the payment from the customer?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => { onConfirm(); onClose(); }} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDetailPage;
