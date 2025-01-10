import React, { useEffect, useState } from 'react';
import { TextField, Grid, Button, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ApiGetOperationHoursForShop, ApiUpdateOperationHoursByAdmin } from '../../services/OpeningHoursService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

export default function EditShopOperatingHours() {
  const { shopId } = useParams(); // Get shopId from URL parameters
  const token = localStorage.getItem("token");

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '', close: '', closed: false },
    tuesday: { open: '', close: '', closed: false },
    wednesday: { open: '', close: '', closed: false },
    thursday: { open: '', close: '', closed: false },
    friday: { open: '', close: '', closed: false },
    saturday: { open: '', close: '', closed: false },
    sunday: { open: '', close: '', closed: false },
  });

  const fetchOperationHoursForShop = async () => {
    if (!shopId || !token) {
      return;
    }
    const result = await ApiGetOperationHoursForShop(shopId, token);
    if (result.ok) {
      const listOperationHours = result.body.data.data;
      let updatedOperatingHours = { ...operatingHours };
      listOperationHours.forEach((row) => {
        const dayIndex = row.day;
        const dayName = getDayName(dayIndex);
        const openTime = new Date();
        openTime.setHours(row.from_hour, row.from_minute, 0, 0);
        const closeTime = new Date();
        closeTime.setHours(row.to_hour, row.to_minute, 0, 0);
        updatedOperatingHours[dayName] = {
          open: openTime,
          close: closeTime,
          closed: !row.isOpenToday ?? false,
        };
      });
      setOperatingHours(updatedOperatingHours);
    } else {
      toast.error(result.message);
    }
  }

  const getDayName = (dayIndex) => {
    switch (dayIndex) {
      case 2: return 'monday';
      case 3: return 'tuesday';
      case 4: return 'wednesday';
      case 5: return 'thursday';
      case 6: return 'friday';
      case 7: return 'saturday';
      case 1: return 'sunday';
      default: return '';
    }
  };

  useEffect(() => {
    fetchOperationHoursForShop();
  }, [shopId]);

  const handleTimeChange = (day, timeType, value) => {
    setOperatingHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        [timeType]: value,
      },
    }));
  };

  const handleClosedChange = (day, event) => {
    setOperatingHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        closed: event.target.checked,
        open: '',
        close: '',
      },
    }));
  };

  const handleSave = async () => {
    const result = await ApiUpdateOperationHoursByAdmin(shopId, convertToListOpeningHours(operatingHours), token);
    if (result.ok) {
      fetchOperationHoursForShop();
      toast.success("Update Operation hours successfully!");
    } else {
      toast.error(result.message);
    }
  };

  const convertToListOpeningHours = (operatingHours) => {
    const daysMapping = {
      monday: 2,
      tuesday: 3,
      wednesday: 4,
      thursday: 5,
      friday: 6,
      saturday: 7,
      sunday: 1,
    };

    return Object.keys(operatingHours).map((day) => {
      const dayData = operatingHours[day];
      const { open, close, closed } = dayData;

      if (closed) {
        return {
          day: daysMapping[day],
          from_hour: 5,
          from_minute: 0,
          to_hour: 12,
          to_minute: 0,
          isOpenToday: false
        };
      }

      const openDate = open ? new Date(open) : null;
      const closeDate = close ? new Date(close) : null;

      return {
        day: daysMapping[day],
        from_hour: openDate ? openDate.getHours() : 0,
        from_minute: openDate ? openDate.getMinutes() : 0,
        to_hour: closeDate ? closeDate.getHours() : 0,
        to_minute: closeDate ? closeDate.getMinutes() : 0,
        isOpenToday: !closed ?? false
      };
    });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Adjust Shop Operating Hours
      </Typography>
      <Grid container spacing={3}>
        {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
          <Grid item xs={12} md={6} key={day}>
            <Typography variant="h6" color='success'>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={operatingHours[day].closed}
                  onChange={(e) => handleClosedChange(day, e)}
                  name={`${day}-closed`}
                />
              }
              label="Closed"
            />
            {!operatingHours[day].closed && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TimePicker
                      label="Opening Time"
                      value={operatingHours[day].open}
                      onChange={(newValue) => handleTimeChange(day, 'open', newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TimePicker
                      label="Closing Time"
                      value={operatingHours[day].close}
                      onChange={(newValue) => handleTimeChange(day, 'close', newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            )}
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: 4 }}>
        Save Operating Hours
      </Button>
      <ToastContainer />
    </Box>
  );
} 