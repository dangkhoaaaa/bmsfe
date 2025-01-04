import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiGetAllTransactionWallet } from '../../services/WalletServices';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper, Box, Typography, Tooltip } from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

export default function ShopWallet() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const shopId = localStorage.getItem('shopId');
  const token = localStorage.getItem('token');

  const statusMap = {
    1: 'PAID',
    2: 'PAIDTOSHOP',
    3: 'ERROR',
    4: 'REFUND',
    5: 'DEPOSIT',
    6: 'WITHDRAW',
    7: 'PAIDPACKAGE'
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

  return (
    <>
      <Box sx={{ padding: 3, backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Shop Wallet Transaction History
        </Typography>
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
