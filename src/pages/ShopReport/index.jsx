import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ApiGetReportsForShop } from '../../services/ReportServices';

export default function ShopReport() {
  const [reports, setReports] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const shopId = localStorage.getItem('shopId');
  const token = localStorage.getItem('token');

  const fetchReports = async () => {
    const result = await ApiGetReportsForShop(month, year, true, shopId, 1, 1000, token);
    if (result.ok) {
      setReports(result.body.data.data);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [month, year]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // Convert base64 to Blob and trigger download
  const downloadReport = (report) => {
    const byteCharacters = atob(report.report); // Decode base64
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/pdf' }); // Assuming report is a PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    // Format fileName
    const reportDate = new Date(report.dateReport); // Convert ISO date to Date object
    const yyyy = reportDate.getFullYear();
    const MM = String(reportDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(reportDate.getDate()).padStart(2, '0');
    const fileName = `ShopReport_${yyyy}${MM}${dd}.pdf`; // Format as ShopReport_yyyyMMdd
    link.download = fileName;
    link.click();

    // Cleanup the temporary URL
    URL.revokeObjectURL(link.href);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Shop Revenue and Performance Report
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          marginBottom: 3,
          flexWrap: 'wrap',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={handleMonthChange} label="Month">
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={handleYearChange} label="Year">
            {Array.from({ length: 5 }, (_, i) => (
              <MenuItem key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 5,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            No reports available for this month.
          </Typography>
          <Typography variant="body1" align="center" sx={{ marginBottom: 2 }}>
            Try selecting a different month or year to view reports.
          </Typography>
        </Box>

      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.dateReport}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={report.shopImage}
                  alt={report.shopName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {report.shopName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Report Date: {new Date(report.dateReport).toLocaleString()}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadReport(report)}
                  >
                    Download
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
