import React, { useEffect, useState } from 'react';
import StatsCard from '../../components/StatsCard/index';
import TransactionsTable from '../../components/TransactionTable/index';
import UsersChart from '../../components/UsersChart/index';
import { StyledCard, StyledDashBoardContainer } from './DashBoardShop.style';
import { Avatar, Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { ApiGetTotalOrdersInShop } from '../../services/OrderServices';
import { ApiGetTotalRevenuesInShop } from '../../services/TransactionServices';
import { ApiGetTop5DishesPurchase } from '../../services/ProductServices';
import { ApiGetShopById } from '../../services/ShopServices';
import RevenueChart from '../../components/RevenueChart';
const DashboardShop = () => {
  const COMPLETE_STATUS = 8;
  const [totalOrders, setTotalOrders] = useState(0);
  const [lastTotalOrders, setLastTotalOrders] = useState(0);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [lastTotalRevenues, setLastTotalRevenues] = useState(0);
  const [totalNewUsers, setTotalNewUsers] = useState(0);
  const [lastTotalNewUsers, setLastTotalNewUsers] = useState(0);
  const [dishesTop5Purchased, setDishesTop5Purchased] = useState([]);
  const [shop, setShop] = useState([]);
  const currentDate = new Date();
  const thisYear = currentDate.getFullYear(); // Năm hiện tại
  const thisMonth = currentDate.getMonth() + 1; // Tháng hiện tại (getMonth trả về giá trị từ 0-11)
  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1; // Tháng trước
  const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;
  const token = localStorage.getItem('token');
  const shopId = localStorage.getItem('shopId');
  const fetchProfileShopData = async () => {
    const result = await ApiGetShopById(shopId, token);
    if (result.ok) {
      setShop(result.body.data);
    } else {
      alert(result.message);
    }
  };
  const fetchTotalOrders = async () => {
    const resultThisMonth = await ApiGetTotalOrdersInShop(shopId, thisMonth, thisYear, COMPLETE_STATUS, token);
    if (resultThisMonth.ok) {
      setTotalOrders(resultThisMonth.body.data);
    }
    const resultLastMonth = await ApiGetTotalOrdersInShop(shopId, lastMonth, lastMonthYear, COMPLETE_STATUS, token);
    if (resultLastMonth.ok) {
      setLastTotalOrders(resultLastMonth.body.data);
    }
  }
  const fetchTotalRevenues = async () => {
    const resultThisMonth = await ApiGetTotalRevenuesInShop(shopId, thisMonth, thisYear, 1, token);
    if (resultThisMonth.ok) {
      setTotalRevenues(resultThisMonth.body.data);
    }
    const resultLastMonth = await ApiGetTotalRevenuesInShop(shopId, lastMonth, lastMonthYear, 1, token);
    if (resultLastMonth.ok) {
      setLastTotalRevenues(resultLastMonth.body.data);
    }
  }
  const fetchTop5DishesPurchase = async () => {
    const resultThisMonth = await ApiGetTop5DishesPurchase(shopId, thisMonth, thisYear, 5, token);
    if (resultThisMonth.ok) {
      console.log(resultThisMonth.body.data.data);
      setDishesTop5Purchased(resultThisMonth.body.data.data);
    }
  }
  useEffect(() => {
    fetchProfileShopData();
    fetchTotalOrders();
    fetchTotalRevenues();
    fetchTop5DishesPurchase();
  }, []);
  return (
    <StyledDashBoardContainer>
      <StyledCard>
        <div className='row w-100'>
          <div className='col-6 row'>
            <div className='col-4'>
              <div className='h-100 w-100 d-flex justify-content-center align-items-center'>
                <div>
                  <div className='d-flex justify-content-center'>
                    <CardMedia
                      component="img"
                      image={shop.image ?? 'https://media.istockphoto.com/id/1425139113/photo/purchasing-goods-with-smartphone-at-grocery-store.jpg?s=612x612&w=0&k=20&c=xMbZgp4BZAWCH_j7UkM9YiYTXcpS4zqg3MW4_jRmriM='} // Đường dẫn hình ảnh mặc định nếu shop.Image là null
                      alt={shop.name}
                      sx={{ borderRadius: '50%', width: 150, height: 150 }}
                    />
                  </div>
                  <div className='ms-3 text-center my-3 text-success fw-bold'>
                    <Typography
                      variant="h6"
                      sx={{ textTransform: 'uppercase' }}
                    >
                      {shop.name}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-8'>
              <StatsCard title="Orders" thisMonth={totalOrders} lastMonth={lastTotalOrders} />
            </div>
            <div className='col-12'>
              <StatsCard title="Revenue" thisMonth={totalRevenues} lastMonth={lastTotalRevenues} isMoney={true} />
            </div>
          </div>
          <div className="col-6">
            <Typography variant="h4" sx={{ mb: 2 }}>
              Top 5 Best-Selling Dishes of the Month
            </Typography>
            {dishesTop5Purchased && dishesTop5Purchased.map((product, index) => (
              <TopDishesCard key={index} product={product} />
            ))}
          </div>
        </div>
      </StyledCard>
      <Box sx={{ mt: '20px' }}>
        <Typography variant='h4'>The Growth of Revenue Over Each Month</Typography>
        <RevenueChart />
      </Box>
    </StyledDashBoardContainer>
  );
};
const TopDishesCard = ({ product }) => {
  return (
    <Card sx={{ display: "flex", alignItems: "center", mb: 1, p: 1.5, height: 70 }}>
      {/* Avatar with src */}
      <Avatar
        src={product.productImage && product.productImage.length > 0 && product.productImage[0].url || '/user-default.png'}
        sx={{ width: 40, height: 40, mr: 2 }}
        alt={product.productName}
      />
      <CardContent sx={{ p: 0 }}>
        {/* User Name */}
        <Typography variant="subtitle1" fontWeight="bold" className='mt-3' noWrap>
          {product.productName}
        </Typography>
        {/* Total Transaction Amount */}
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {product.totalSold} portion
        </Typography>
      </CardContent>
    </Card>
  );
};
export default DashboardShop;