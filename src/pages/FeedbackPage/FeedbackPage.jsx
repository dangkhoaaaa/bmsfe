import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FeedBackPageUI from './FeedBackPageUI';
import AuthContext from '../../auth/AuthContext';

const FeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [averageRating, setAverageRating] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { user: { token, role } } = useContext(AuthContext);

  // Function to calculate average rating
  const calculateAverageRating = (data) => {
    if (!data.length) return 0;
    const totalRating = data.reduce((sum, feedback) => sum + feedback.rate, 0);
    return (totalRating / data.length).toFixed(1);
  };

  // Function to fetch feedback based on the selected filter and page index
  const fetchFeedback = async (filter, page) => {
    setLoading(true);
    try {
      let url = `https://bms-fs-api.azurewebsites.net/api/Feedback?search=%20&isDesc=true&pageIndex=${page}&pageSize=6`;

      // Adjust the query params based on the selected filter
      if (filter === '5') {
        url += '&minRate=5&maxRate=5'; // Only 5-star feedback
      } else if (filter === '4') {
        url += '&minRate=4&maxRate=5'; // 4-star feedback
      } else if (filter === '3') {
        url += '&minRate=3&maxRate=4'; // 3-star feedback
      } else if (filter === '2') {
        url += '&minRate=2&maxRate=3'; // 2-star feedback
      } else if (filter === '1') {
        url += '&minRate=1&maxRate=2'; // 1-star feedback
      }

      const response = await axios.get(url);
      const feedback = response.data.data.data || [];
      setFeedbackData(feedback);
      setAverageRating(calculateAverageRating(feedback));
      setTotalPages(response.data.data.lastPage); // Get the total pages
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Fetch feedback data when the component mounts or when the filter or page index changes
  useEffect(() => {
    if (role === 'Admin') { // Check if the user is Admin
      fetchFeedback(filter, pageIndex);
    }
  }, [filter, pageIndex]);

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    setPageIndex(1); // Reset to the first page when filter changes
  };

  // Handle page change
  const onPageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  // Access control
  if (role !== 'Admin') {
    return <div>Access Denied: You do not have permission to view this page.</div>;
  }

  return (
    <FeedBackPageUI 
      feedbackData={feedbackData}
      loading={loading}
      error={error}
      filter={filter}
      handleFilterChange={handleFilterChange}
      averageRating={averageRating}
      pageIndex={pageIndex}
      totalPages={totalPages}
      onPageChange={onPageChange} // Pass the onPageChange function
    />
  );
};

export default FeedbackPage;
