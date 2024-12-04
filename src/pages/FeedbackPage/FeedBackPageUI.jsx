import React from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Avatar, Button, Rating, IconButton } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';

const FeedbackPageUI = ({
  feedbackData,
  loading,
  error,
  filter,
  handleFilterChange,
  averageRating,
  pageIndex,
  totalPages,
  onPageChange
}) => {
  return (
    <Container>
      {/* Average Rating Section */}
      {averageRating && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Average Rating: {averageRating} / 5
          </Typography>
          <Rating value={parseFloat(averageRating)} readOnly precision={0.5} />
        </Box>
      )}

      {/* Filter Bar */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button variant={filter === 'All' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('All')}>
            All
          </Button>
          <Button variant={filter === '5' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('5')}>
            5 Stars
          </Button>
          <Button variant={filter === '4' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('4')}>
            4 Stars
          </Button>
          <Button variant={filter === '3' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('3')}>
            3 Stars
          </Button>
          <Button variant={filter === '2' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('2')}>
            2 Stars
          </Button>
          <Button variant={filter === '1' ? 'contained' : 'outlined'} onClick={() => handleFilterChange('1')}>
            1 Star
          </Button>
        </Box>
      </Paper>

      {/* Feedback Section */}
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Customer Feedback
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load feedback: {error.message}</Alert>
        ) : feedbackData.length > 0 ? (
          <Box>
            {feedbackData.map((feedback) => (
              <Paper
                key={feedback.id}
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: '#f9f9f9',
                  position: 'relative',
                }}
              >
                {/* Customer Avatar and Info */}
                <Box display="flex" alignItems="center">
                  <Avatar src={feedback.userPic || feedback.shoppic} alt={feedback.userName} sx={{ width: 60, height: 60, mr: 2 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{feedback.userName}</Typography>
                    <Typography variant="body2" color="textSecondary">{feedback.shopName} - {new Date(feedback.createDate).toLocaleDateString()}</Typography>
                  </Box>
                </Box>

                {/* Feedback Rating */}
                <Box mt={2}>
                  <Rating value={feedback.rate} readOnly precision={0.5} />
                </Box>

                {/* Feedback Description */}
                <Box mt={1}>
                  <Typography variant="body1">{feedback.description}</Typography>
                </Box>

                {/* Feedback Images */}
                {feedback.shoppic && (
                  <Box mt={2} display="flex">
                    <img src={feedback.shoppic} alt="feedback" style={{ width: '150px', marginRight: '8px' }} />
                  </Box>
                )}

                {/* Reply Button
                <IconButton sx={{ position: 'absolute', bottom: 10, right: 10 }} color="primary" onClick={() => console.log(`Reply to feedback ID: ${feedback.id}`)}>
                  <ReplyIcon />
                </IconButton> */}
              </Paper>
            ))}

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                disabled={pageIndex === 1}
                onClick={() => onPageChange(pageIndex - 1)}
              >
                Previous
              </Button>
              <Typography variant="body1" sx={{ mx: 2 }}>
                Page {pageIndex} of {totalPages}
              </Typography>
              <Button
                variant="contained"
                disabled={pageIndex === totalPages}
                onClick={() => onPageChange(pageIndex + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>No feedback available.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default FeedbackPageUI;
