// index.jsx
import React, { useEffect, useState } from 'react';
import { Button,Select,MenuItem,FormControl,InputLabel,Typography,Toolbar,TableBody,} from '@mui/material';
import {StyledPaper,StyledTableContainer,StyledTable,StyledTableHead,StyledTableRow,StyledTableCell,} from './ManageOrders.style';

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState({});

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await fetch('https://bms-fs-api.azurewebsites.net/api/Order/GetListOrders?pageIndex=2&pageSize=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data.data.data)) {
        setOrders(data.data.data);
      } else {
        console.error('Fetched data is not an array', data.data.data);
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setEditingStatus({
      ...editingStatus,
      [id]: newStatus,
    });
  };

  // Update order status
  const handleUpdateStatus = (id) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: editingStatus[id] || order.status } : order
    );
    setOrders(updatedOrders);
  };

  if (loading) {
    return <Typography variant="h6">Loading orders...</Typography>;
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return <Typography variant="h6">No orders available.</Typography>;
  }

  return (
    <StyledPaper>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Manage Orders
        </Typography>
      </Toolbar>

      <StyledTableContainer>
        <StyledTable aria-label="orders table">
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Customer ID</StyledTableCell>
              <StyledTableCell>Shop ID</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {orders.map((order) => (
              <StyledTableRow key={order.id}>
                <StyledTableCell>{order.id}</StyledTableCell>
                <StyledTableCell>{order.customerId}</StyledTableCell>
                <StyledTableCell>{order.shopId}</StyledTableCell>
                <StyledTableCell>${order.totalPrice.toFixed(2)}</StyledTableCell>
                <StyledTableCell>
                  {/* <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editingStatus[order.id] || order.status}
                      label="Status"
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <MenuItem value="DRAFT">Draft</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="PREPARED">Prepared</MenuItem>
                      <MenuItem value="COMPLETE">Complete</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </FormControl> */}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateStatus(order.id)}
                  >
                    Update
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </StyledPaper>
  );
};

export default ManageOrdersPage;
