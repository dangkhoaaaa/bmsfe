import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiGetAllTransactionWallet, ApiCreateLinkUserDeposit, ApiUpdateBalance } from '../../services/WalletServices';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ArrowDownward, ArrowUpward, AttachMoney, AccountBalanceWallet } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWallet } from '../../context/WalletProvider';

export default function ShopWallet() {
  const {wallet, fetchWallet} = useWallet();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [amount, setAmount] = useState(''); // Amount for deposit/withdraw
  const [paymentMethod, setPaymentMethod] = useState('VNPay'); // Payment method selection
  const shopId = localStorage.getItem('shopId');
  const token = localStorage.getItem('token');
  const [openDialog, setOpenDialog] = useState(false);
  const STATUS_WITHDRA = 6;
  const statusMap = {
    1: 'PAID',
    2: 'PAIDTOSHOP',
    3: 'ERROR',
    4: 'REFUND',
    5: 'DEPOSIT',
    6: 'WITHDRAW',
    7: 'PAIDPACKAGE'
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchTransactionByUserToken = async () => {
    const result = await ApiGetAllTransactionWallet(page + 1, rowsPerPage, token);
    if (result.ok) {
      setTransactions(result.body.data.data);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    fetchTransactionByUserToken();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleDeposit = async () => {
    // Call the API to deposit money
    if (amount >= 1000) {
      const result = await ApiCreateLinkUserDeposit(shopId, amount, token);
      if (result.ok) {
        window.location.href = result.body.data;
      } else {
        alert(result.message);
      }
    } else {
      alert("Please enter a valid money more than 1000 VND!");
    }
  };

  const handleWithdraw = () => {
    // Call the API to deposit money
    if (amount >= 1000) {
      handleOpenDialog();
    }
  };

  const handleConfirmWithDraw = async () => {
    const result = await ApiUpdateBalance(amount, STATUS_WITHDRA, token);
    if (result.ok) {
      toast.success(`Successfully withdrew ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}.`);
      fetchWallet();
      fetchTransactionByUserToken();
    } else {
      toast.error(result.message);
    }
  }

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  return (
    <>
      <Box sx={{ padding: 3, backgroundColor: '#f4f4f9', minHeight: '100vh' }}>

        {/* Wallet Deposit Section */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Deposit or Withdraw Money from Your Wallet
          </Typography>
          <TextField
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
            type="number"
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 2 }}>
            {quickAmounts.map((amt) => (
              <Chip
                key={amt}
                label={`${amt.toLocaleString()} VND`}
                onClick={() => setAmount(amt)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select value={paymentMethod} onChange={handlePaymentMethodChange} label="Payment Method">
              <MenuItem value="VNPay">VNPay</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ marginBottom: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
            {/* Deposit Button */}
            <Button
              variant="contained"
              color="success"
              onClick={handleDeposit}
              sx={{ minWidth: 150 }}
              startIcon={<AttachMoney />}
            >
              Deposit
            </Button>

            {/* Withdraw Button */}
            <Button
              variant="outlined"
              color="error"
              onClick={handleWithdraw}
              sx={{ minWidth: 150 }}
              startIcon={<AccountBalanceWallet />}
            >
              Withdraw
            </Button>
          </Box>
        </Box>

        <Typography variant="h4" align="center" gutterBottom>
          Shop Wallet Transaction History
        </Typography>

        {/* Transaction History Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table aria-label="transaction history">
            <TableHead sx={{ backgroundColor: 'green' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Transaction ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Price</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Create Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.walletID} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell align="center">{transaction.walletID}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: transaction.price > 0 ? '#388e3c' : '#d32f2f' }}>
                    {transaction.price.toLocaleString()} VND
                    {transaction.price > 0 ? <ArrowUpward sx={{ color: '#388e3c' }} /> : <ArrowDownward sx={{ color: '#d32f2f' }} />}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={statusMap[transaction.status]} arrow>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: getStatusColor(transaction.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {statusMap[transaction.status]}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">{new Date(transaction.createDate).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={100}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginTop: 2 }}
        />
      </Box>
      <ToastContainer />
      <ConfirmWithdrawDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmWithDraw}
        amount={amount}
      />
    </>
  );
}

// Hàm để xác định màu sắc của status
const getStatusColor = (status) => {
  switch (status) {
    case 1: return '#1976d2'; // PAID
    case 2: return '#388e3c'; // PAIDTOSHOP
    case 3: return '#d32f2f'; // ERROR
    case 4: return '#f57c00'; // REFUND
    case 5: return '#0288d1'; // DEPOSIT
    case 6: return '#f44336'; // WITHDRAW
    case 7: return '#7b1fa2'; // PAIDPACKAGE
    default: return '#9e9e9e'; // Unknown
  }
};

function ConfirmWithdrawDialog({ open, onClose, onConfirm, amount }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to withdraw {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}?</p>
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
