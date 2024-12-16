import React, { useState, useEffect} from 'react';
import axios from 'axios';
import FeedbackPageUI from './FeedBackPageUI'; // Tái sử dụng UI component từ FeedbackPage
import { ApiGetShopById } from '../../services/ShopServices';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
   const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalFeedback, setTotalFeedback] = useState(0); // Tổng số feedback

  // Lấy dữ liệu feedback từ API dựa theo shopId
  const fetchFeedbackData = async (filter, pageIndex, pageSize) => {
    const shopId = localStorage.getItem('shopId'); // Lấy shopId từ local storage
    // console.log ("hi1");
    // if (!shopId) {
    //     setError('Shop ID is not available.');
    //     setLoading(false);
    //     return;
    // }

    setLoading(true);
    try {
        let url = `https://bms-fs-api.azurewebsites.net/api/Feedback?search=%20&isDesc=true&pageIndex=${pageIndex}&pageSize=${pageSize}`;
        if (filter !== "All") {
            url += `&rate=${filter}`;
        }
        console.log ("hi1");
      const response = await axios.get(url);
            console.log ("fb ne"+response.data.data.data );
            const feedback = response.data.data.data || [];
            setFeedbackData(feedback);
            setTotalFeedback(response.data.data.total || 0); // Cập nhật tổng số feedback
            setLoading(false);
        } catch (err) {
            setError(err);
            console.log (err +"hi");
            setLoading(false);
        }
    };

      // Gọi fetchFeedback khi component mount hoặc filter/pagination thay đổi
    useEffect(() => {
      fetchFeedbackData(filter, pageIndex, pageSize);
  }, [filter, pageIndex, pageSize]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    setPageIndex(1); // Reset về trang đầu khi thay đổi bộ lọc
};

   // Xử lý chuyển trang
   const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
};

  // Tính số trang
  const totalPages = Math.ceil(totalFeedback / pageSize);

  return (
    <FeedbackPageUI
        feedbackData={feedbackData}
        loading={loading}
        error={error}
        filter={filter}
        handleFilterChange={handleFilterChange}
        averageRating={null}
        pageIndex={pageIndex}
        totalPages={totalPages}
        onPageChange={handlePageChange}
    />
);
};

export default FeedbackPage;
