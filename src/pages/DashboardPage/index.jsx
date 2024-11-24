import React, { useEffect, useState } from 'react';
import StatsCard from '../../components/StatsCard/index';
import TransactionsTable from '../../components/TransactionTable/index';
import UsersChart from '../../components/UsersChart/index';
import { StyledCard, StyledDashBoardContainer } from './DashBoardPage.style';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import { ApiGetTotalOrders } from '../../services/OrderServices';
import { ApiGetTop5UserPurchase, ApiGetTotalRevenues } from '../../services/TransactionServices';
import { ApiGetTotalNewUser } from '../../services/UserServices';

const Dashboard = () => {
  const COMPLETE_STATUS = 8;
  const [totalOrders, setTotalOrders] = useState(0);
  const [lastTotalOrders, setLastTotalOrders] = useState(0);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [lastTotalRevenues, setLastTotalRevenues] = useState(0);
  const [totalNewUsers, setTotalNewUsers] = useState(0);
  const [lastTotalNewUsers, setLastTotalNewUsers] = useState(0);
  const [userTop5Purchased, setUserTop5Purchased] = useState([]);

  const currentDate = new Date();
  const thisYear = currentDate.getFullYear(); // Năm hiện tại
  const thisMonth = currentDate.getMonth() + 1; // Tháng hiện tại (getMonth trả về giá trị từ 0-11)
  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1; // Tháng trước
  const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;
  const token = localStorage.getItem('token');

  const fetchTotalOrders = async () => {
    const resultThisMonth = await ApiGetTotalOrders(thisMonth, thisYear, COMPLETE_STATUS, token);
    if (resultThisMonth.ok) {
      setTotalOrders(resultThisMonth.body.data);
    }
    const resultLastMonth = await ApiGetTotalOrders(lastMonth, lastMonthYear, COMPLETE_STATUS, token);
    if (resultLastMonth.ok) {
      setLastTotalOrders(resultLastMonth.body.data);
    }
  }

  const fetchTotalRevenues = async () => {
    const resultThisMonth = await ApiGetTotalRevenues(thisMonth, thisYear, 1, token);
    if (resultThisMonth.ok) {
      setTotalRevenues(resultThisMonth.body.data);
    }
    const resultLastMonth = await ApiGetTotalRevenues(lastMonth, lastMonthYear, 1, token);
    if (resultLastMonth.ok) {
      setLastTotalRevenues(resultLastMonth.body.data);
    }
  }

  const fetchTotalNewUsers = async () => {
    const resultThisMonth = await ApiGetTotalNewUser(thisMonth, thisYear, 1, token);
    if (resultThisMonth.ok) {
      setTotalNewUsers(resultThisMonth.body.data);
    }
    const resultLastMonth = await ApiGetTotalNewUser(lastMonth, lastMonthYear, 1, token);
    if (resultLastMonth.ok) {
      setLastTotalNewUsers(resultLastMonth.body.data);
    }
  }

  const fetchTop5UserPurchase = async () => {
    const resultThisMonth = await ApiGetTop5UserPurchase(thisMonth, thisYear, 5, token);
    if (resultThisMonth.ok) {
      setUserTop5Purchased(resultThisMonth.body.data.data);
    }
  }

  useEffect(()=>{
    fetchTotalOrders();
    fetchTotalRevenues();
    fetchTotalNewUsers();
    fetchTop5UserPurchase();
  },[]);

  return (
    <StyledDashBoardContainer>
      <StyledCard>
        <div className='row w-100'>
          <div className='col-6 row'>
            <div className='col-6'>
              <StatsCard title="Orders" thisMonth={totalOrders} lastMonth={lastTotalOrders} />
            </div>
            <div className='col-6'>
              <StatsCard title="First-Time Users" thisMonth={totalNewUsers} lastMonth={lastTotalNewUsers} />
            </div>
            <div className='col-12'>
              <StatsCard title="Revenue" thisMonth={totalRevenues} lastMonth={lastTotalRevenues} isMoney={true} />
            </div>
          </div>
          {/* Top Users Card */}
          <div className="col-6">
            <Typography variant="h4" sx={{ mb: 2 }}>
              Top 5 Users by Purchases
            </Typography>
            {userTop5Purchased && userTop5Purchased.map((user) => (
              <TopUserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </StyledCard>

      <Box sx={{ mt: '20px' }}>
        <TransactionsTable />
      </Box>

      <Box sx={{ mt: '20px' }}>
        <Typography variant='h4'>User Growth</Typography>
        <UsersChart />
      </Box>
    </StyledDashBoardContainer>
  );
};
const TopUserCard = ({ user }) => {
  return (
    <Card sx={{ display: "flex", alignItems: "center", mb: 1, p: 1.5, height: 70 }}>
      {/* Avatar with src */}
      <Avatar 
        src={user.image || '/user-default.png'} 
        sx={{ width: 40, height: 40, mr: 2 }} 
        alt={user.name}
      />
      <CardContent sx={{ p: 0 }}>
        {/* User Name */}
        <Typography variant="subtitle1" fontWeight="bold" className='mt-3' noWrap>
          {user.name}
        </Typography>
        {/* Total Transaction Amount */}
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {user.totalTransactionAmount.toLocaleString("vi-VN")} VNĐ
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
