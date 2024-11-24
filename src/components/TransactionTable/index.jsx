import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel,
  TablePagination, TextField, Toolbar, Typography
} from '@mui/material';
import { ApiGetTransactions } from '../../services/TransactionServices';

// Sample data for transactions
const transactionsData = [
  { id: 1, user: 'John Doe', orderID: '1234', date: '2023-09-01', amount: 120 },
  { id: 2, user: 'Jane Smith', orderID: '1235', date: '2023-09-02', amount: 85 },
  { id: 3, user: 'Bob Johnson', orderID: '1236', date: '2023-09-05', amount: 45 },
  { id: 4, user: 'Alice Brown', orderID: '1237', date: '2023-09-10', amount: 210 },
  { id: 5, user: 'Chris Green', orderID: '1238', date: '2023-09-12', amount: 340 },
  { id: 6, user: 'Megan Fox', orderID: '1239', date: '2023-09-14', amount: 50 },
  // Add more data for pagination
];

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState(transactionsData);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('user');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const COMPLETE_STATUS = 1;

  useEffect(()=>{
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      const result = await ApiGetTransactions(COMPLETE_STATUS, searchTerm, true, 1, 1000, token);
      if (result.ok) {
        setTransactions(result.body.data.data)
      } else {
        alert(result.message);
      }
    }
    fetchTransactions();
  },[]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Toolbar sx={{ pb: 3}}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Recent Transactions
        </Typography>
        <TextField
          variant="outlined"
          label="Search by User"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '300px' }}
        />
      </Toolbar>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="transactions table">
          <TableHead sx={{ background: 'linear-gradient(180deg, #3d996c, #00cc69)'}}>
            <TableRow>
              <TableCell sx={{ color: '#fff !important', '& .MuiSvgIcon-root': { color: '#fff', '&:active': {color: '#fff'}} }}>
                  Customer
              </TableCell>
              <TableCell sx={{ color: '#fff !important', '& .MuiSvgIcon-root': { color: '#fff', '&:active': {color: '#fff'}} }}>
                  Shop
              </TableCell>
              <TableCell sx={{ color: '#fff !important', '& .MuiSvgIcon-root': { color: '#fff', '&:active': {color: '#fff'}} }}>
                  Order ID
              </TableCell>
              <TableCell sx={{ color: '#fff !important', '& .MuiSvgIcon-root': { color: '#fff', '&:active': {color: '#fff'}} }}>
                  Date
              </TableCell>
              <TableCell sx={{ color: '#fff !important', '& .MuiSvgIcon-root': { color: '#fff', '&:active': {color: '#fff'}} }}>
                  Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell component="th" scope="row">
                  {transaction.order && transaction.order.firstName + " " + transaction.order.lastName || ''}
                </TableCell>
                <TableCell>{transaction.order?.shopName}</TableCell>
                <TableCell>{transaction.orderId}</TableCell>
                <TableCell>{transaction.order?.orderDate && new Date(transaction.order.orderDate).toLocaleString() || ''}</TableCell>
                <TableCell>{transaction.price && transaction.price.toLocaleString('vi-VN') || 0} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={transactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionsTable;
