import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Toolbar,
  TableBody,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  StyledPaper,
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
} from './ManageOrders.style';
import { ApiGetOrderByShopId } from '../../services/OrderServices';
import { useNavigate } from 'react-router-dom';

const OrderShop = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ORDERED');
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const navigate = useNavigate();

  // Fetch orders from the API
  const fetchOrdersByShopId = async () => {
    const shopId = localStorage.getItem('shopId');
    const token = localStorage.getItem('token');
    const result = await ApiGetOrderByShopId(shopId, status, searchTerm, null, 1, 10, token);
    if (result.ok) {
      setOrders(result.body.data.data);
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrdersByShopId();
  }, [searchTerm, status]);

  // Filter orders based on the search term
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(searchLower) ||
      order.firstName.toLowerCase().includes(searchLower) ||
      order.lastName.toLowerCase().includes(searchLower) ||
      order.shopName.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <Typography variant="h6">Loading orders...</Typography>;
  }

  // if (!Array.isArray(orders) || orders.length === 0) {
  //   return <Typography variant="h6">No orders available.</Typography>;
  // }

  const handleNavigateToDetail = (id) => {
    navigate(`/shop/orders/detail?orderId=${id}`);
  }

  return (
    <StyledPaper>
      <Toolbar sx={{ justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SHOP ORDERS
        </Typography>
        <div>
          {/* SELECT BOX */}
          <FormControl size="small" sx={{ minWidth: 150 }} className='me-2'>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="ORDERED">Ordered</MenuItem>
              <MenuItem value="PREPARING">Preparing</MenuItem>
              <MenuItem value="PREPARED">Prepared</MenuItem>
              <MenuItem value="TAKENOVER">Taken Over</MenuItem>
              <MenuItem value="CANCEL">Cancel</MenuItem>
              <MenuItem value="COMPLETE">Complete</MenuItem>
            </Select>
          </FormControl>
          {/* Search Bar */}
          <TextField
            label="Search Orders"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Customer, or Shop"
            size="small"
          />
        </div>

      </Toolbar>

      <StyledTableContainer>
        <StyledTable aria-label="orders table">
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Shop</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Order Date</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell>{order.id}</StyledTableCell>
                  <StyledTableCell>
                    <img
                      src={order.avatar ?? '/user-default.png'}
                      alt={`${order.firstName} ${order.lastName}`}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        marginRight: 8,
                      }}
                    />
                    {order.firstName} {order.lastName}
                  </StyledTableCell>
                  <StyledTableCell>
                    <img
                      src={order.shopImage}
                      alt={order.shopName}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '5%',
                        marginRight: 8,
                      }}
                    />
                    {order.shopName}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.totalPrice)}
                  </StyledTableCell>
                  <StyledTableCell>{order.status}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(order.orderDate).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNavigateToDetail(order.id)}
                    >
                      View Details
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  Not Found Any Order
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </StyledPaper>
  );
};

export default OrderShop;
