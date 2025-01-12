import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ApiGetOrdersInTimeForShop } from '../../services/OrderServices';
import { ApiGetOperationHoursForShop } from '../../services/OpeningHoursService';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { format } from 'date-fns';

export default function ShopPrepList() {
  const shopId = localStorage.getItem('shopId');
  const token = localStorage.getItem('token');
  const STATUS_ORDERED = 2;
  const [selectedDay, setSelectedDay] = useState('today');
  const [listDataPrep, setListDataPrep] = useState([]);

  const handleDayChange = (event, newDay) => {
    setSelectedDay(newDay);
    fetchOperationHoursForShop(newDay === 'today' ? false : true);
  };

  const fetchOperationHoursForShop = async (isTomorrow) => {
    if (!shopId || !token) {
      return;
    }
    const result = await ApiGetOperationHoursForShop(shopId, token);
    if (result.ok) {
      const listOperationHours = result.body.data.data;
      const tomorrow = new Date();
      if (isTomorrow) {
        console.log("hi"+tomorrow);
        tomorrow.setDate(tomorrow.getDate() + 2);
      } else {
        tomorrow.setDate(tomorrow.getDate()+1);
      }

      listOperationHours.forEach((row) => {
        const dayIndex = row.day;
        const openTime = new Date();
        openTime.setHours(row.from_hour, row.from_minute, 0, 0);
        const closeTime = new Date();
        closeTime.setHours(row.to_hour, row.to_minute, 0, 0); 
        const currentDayIndex = tomorrow.getDay() === 0 ? 7 : tomorrow.getDay(); // Lấy thứ của ngày mai, chuyển 0 -> 7 (Chủ nhật)
        if (dayIndex === currentDayIndex) {
          fetchOrdersInTime(openTime, closeTime, isTomorrow);
        }
      });
    } else {
      alert(result.message);
    }
  }

  useEffect(() => {
    fetchOperationHoursForShop(false);
  }, []);

  const fetchOrdersInTime = async (dateFrom, dateTo, isTomorrow) => {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo); 

    const addHours = isTomorrow ? 31 : 7;
    startDate.setHours(startDate.getHours() + addHours);
    endDate.setHours(endDate.getHours() + addHours);

    // Lấy định dạng 'yyyy-MM-ddTHH:mm:ss' từ đối tượng Date
    const startDateTime = startDate.toISOString().slice(0, 19); // Loại bỏ phần milliseconds và 'Z'
    const endDateTime = endDate.toISOString().slice(0, 19);

    const result = await ApiGetOrdersInTimeForShop(shopId, STATUS_ORDERED, startDateTime, endDateTime, false, 1, 1000, token);

    if (result.ok) {
      const listData = result.body.data.data;

      // Khởi tạo beginStep là startDate và endStep là endDate
      let beginStep = new Date(startDate);
      beginStep.setHours(beginStep.getHours() - 7);
      let endStep = new Date(beginStep); // sao chép beginStep cho endStep
      endStep.setHours(endStep.getHours() + 1);

      let endDateBreak = new Date(endDate);
      endDateBreak.setHours(endDateBreak.getHours() - 7);
      // Tạo vòng lặp và thay đổi giờ từng bước
      const listDataItem = [];
      while (beginStep < endDateBreak) {
        var listItem = [];
        for (let i = 0; i < listData.length; i++) {
          const item = listData[i];
          const orderDate = new Date(item.orderDate);
          if (beginStep <= orderDate && orderDate < endStep) {
            addToListitem(listItem, item.orderItems);
          }
        }
        listDataItem.push({
          beginStep,
          endStep,
          data: listItem
        })
        // Di chuyển beginStep và endStep từng bước 1 giờ
        beginStep = new Date(endStep);
        endStep = new Date(beginStep);
        endStep.setHours(endStep.getHours() + 1);
      }
      setListDataPrep(listDataItem);
    } else {
      alert(result.message);
    }
  }

  const addToListitem = (listItem, items) => {
    if (listItem.length === 0) {
      for (let k = 0; k < items.length; k++) {
        listItem.push(items[k]);
      }
      return;
    }
    for (let k = 0; k < items.length; k++) {
      const item = items[k];
      for (let j = 0; j < listItem.length; j++) {
        if (item.productId === listItem[j].productId) {
          listItem[j].quantity += item.quantity;
          break;
        } else if (j === listItem.length - 1) {
          listItem.push(item);
        }
      }
    }
  }

  const formatDate = (dateString) => format(new Date(dateString), 'HH:mm');

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Food and Meal Schedule Plan
      </Typography>

      {/* Toggle Button to select Today or Tomorrow */}
      <ToggleButtonGroup
        value={selectedDay}
        exclusive
        onChange={handleDayChange}
        aria-label="day selection"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="today" aria-label="today">
          Today
        </ToggleButton>
        <ToggleButton value="tomorrow" aria-label="tomorrow">
          Tomorrow
        </ToggleButton>
      </ToggleButtonGroup>

      {listDataPrep.map((step, index) => (
        <Paper key={index} sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {formatDate(step.beginStep)} - {formatDate(step.endStep)}
          </Typography>

          {step.data.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No meals in this time period.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {step.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Avatar alt={item.productName} src={item.productImages[0]?.url} />
                      </TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      ))}
    </Container>
  );
}
