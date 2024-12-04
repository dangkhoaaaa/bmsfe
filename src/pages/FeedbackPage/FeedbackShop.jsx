import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackPageUI from './FeedBackPageUI'; // Tái sử dụng UI component từ FeedbackPage
import { ApiGetShopById } from '../../services/ShopServices';
import { useNavigate } from 'react-router-dom';

const FeedbackShop = () => {
    const navigate = useNavigate();
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [averageRating, setAverageRating] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [totalFeedback, setTotalFeedback] = useState(0); // Tổng số feedback

    const fetchProfileShopData = async () => {
        const shopId = localStorage.getItem('shopId');
        const token = localStorage.getItem('token');
        if (!shopId) {
            alert('ShopId is not found');
            navigate('/login'); // Navigate to add product page
            return;
        }
        const result = await ApiGetShopById(shopId, token);
        if (result.ok) {
            setAverageRating(Math.round(result.body.data.rate))
        } else {
            alert(result.message);
        }
    };

    // Tính toán rating trung bình
    const calculateAverageRating = (data) => {
        if (!data.length) return 0;
        const totalRating = data.reduce((sum, feedback) => sum + feedback.rate, 0);
        return (totalRating / data.length).toFixed(1);
    };

    // Lấy dữ liệu feedback từ API dựa theo shopId
    const fetchFeedbackData = async (filter, pageIndex, pageSize) => {
        const shopId = localStorage.getItem('shopId'); // Lấy shopId từ local storage
        if (!shopId) {
            setError('Shop ID is not available.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let url = `https://bms-fs-api.azurewebsites.net/api/Feedback/${shopId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
            if (filter !== "All") {
                url += `&rating=${filter}`;
            }

            const response = await axios.get(url);
            const feedback = response.data.data.data || [];
            setFeedbackData(feedback);
            setTotalFeedback(response.data.data.total || 0); // Cập nhật tổng số feedback
            //setAverageRating(calculateAverageRating(feedback));
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    // Gọi fetchFeedback khi component mount hoặc filter/pagination thay đổi
    useEffect(() => {
        fetchFeedbackData(filter, pageIndex, pageSize);
        fetchProfileShopData();
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
            averageRating={averageRating}
            pageIndex={pageIndex}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
};

export default FeedbackShop;
