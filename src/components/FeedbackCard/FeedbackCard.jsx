import React from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Box, IconButton, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const FeedbackCard = ({ feedback }) => {
  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
              {feedback.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6" fontWeight="bold">
              {feedback.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feedback.date}
            </Typography>
          </Grid>
          <Grid item xs={3} textAlign="right">
            <Box display="flex" alignItems="center">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} color={i < feedback.rating ? 'warning' : 'disabled'} />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body1" mt={2} sx={{ bgcolor: '#f0f0f0', p: 2, borderRadius: 2 }}>
          {feedback.comment}
        </Typography>

        <Grid container justifyContent="space-between" mt={2}>
          <Grid item>
            <IconButton>
              <ChatBubbleOutlineIcon />
            <Typography variant="caption" ml={1}>
              Reply
            </Typography>
            </IconButton>
          </Grid>
          <Grid item>
            <Button startIcon={<ShareIcon />} variant="outlined" color="primary" size="small">
              Share
            </Button>
            <Button startIcon={<DeleteIcon />} variant="outlined" color="error" size="small" sx={{ ml: 1 }}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
