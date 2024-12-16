import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCoupon.scss';
import { TextField, Button, Typography, Box, Paper, IconButton, FormControlLabel } from '@mui/material';
import { ApiCreateCoupon } from '../../services/CouponServices';
import { CheckBox } from '@mui/icons-material';

const AddCouponPage = () => {
    const navigate = useNavigate();
    const [name, setCouponName] = useState('');
    const [errors, setErrors] = useState({});
    const [shopId, setShopId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

     // State cho các trường trong form
    const [percentDiscount, setPercentDiscount] = useState(0);
    const [isPercentDiscount, setIsPercentDiscount] = useState(false);
    const [maxDiscount, setMaxDiscount] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [minDiscount, setMinDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const storedShopId = localStorage.getItem('shopId');
        if (storedShopId) {
            setShopId(storedShopId);
            console.log('Shop ID:', storedShopId);
        } else {
            alert('No shop ID found. Please log in as a shop.');
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!name) newErrors.name = 'Coupon Name is required';
       // if (!percentDiscount) newErrors.percentDiscount = 'Percent Discount is required';
        if (!maxDiscount) newErrors.maxDiscount = 'Max Discount is required';
        //if (!minPrice) newErrors.minPrice = 'Min Price is required';
        if (!minDiscount) newErrors.minDiscount = 'Min Discount is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const result = await ApiCreateCoupon(name, percentDiscount, isPercentDiscount, maxDiscount, minPrice, minDiscount, shopId, startDate, endDate);
        if (result.ok) {
            setSuccessMessage('Coupon added successfully!');
            setTimeout(() => {
                navigate('/shop/coupon-page');
            }, 2000);
        } else {
            alert(result.message);
        }
    };

    const handleCancel = () => {
        navigate('/shop/coupon-page');
    };

    return (
        <Box className="container py-5">
            <Paper elevation={3} className="p-4">
                <Typography variant="h4" align="center" gutterBottom>
                    Add New Coupon
                </Typography>

                {successMessage && (
                    <Typography variant="body1" color="success" className="text-center mb-3">
                        {successMessage}
                    </Typography>
                )}

                <form className="add-coupon-form" onSubmit={handleSubmit}>
                    {/* Coupon Name */}
                    <TextField
                        label="Coupon Name *"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        placeholder="Enter coupon name"
                        value={name}
                        onChange={(e) => setCouponName(e.target.value)}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />

                    {/* Percent Discount */}
                    <Box display="flex" alignItems="flex-start">
                        <FormControlLabel
                            control={
                                <input
                                    type='checkbox'
                                    className='form-check-input ms-2 mt-3'
                                    style={{ width: 50, height: 56 }}
                                    onChange={(e) => setIsPercentDiscount(e.target.checked)}
                                />
                            }
                            label="%"
                        />

                        {isPercentDiscount ? (
                            <TextField
                                label="Percent Discount *"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                placeholder="Enter percent discount"
                                value={percentDiscount}
                                onChange={(e) => setPercentDiscount(e.target.value ? Number(e.target.value) : 0)}
                                error={Boolean(errors.percentDiscount)}
                                helperText={errors.percentDiscount}
                                inputProps={{ min: 0, max: 100 }}
                            />
                        ) : (
                            <TextField
                                label="Price *"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                placeholder="Enter price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : 0)}
                                error={Boolean(errors.minPrice)}
                                helperText={errors.minPrice}
                            />
                        )}
                    </Box>

                    {/* Max Discount */}
                    <TextField
                        label="Max Discount *"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        placeholder="Enter max discount"
                        value={maxDiscount}
                        onChange={(e) => setMaxDiscount(e.target.value)}
                        error={Boolean(errors.maxDiscount)}
                        helperText={errors.maxDiscount}
                    />

                    {/* Min Price
                    <TextField
                        label="Price *"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        placeholder="Enter price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        error={Boolean(errors.minPrice)}
                        helperText={errors.minPrice}
                    /> */}

                    {/* Min Discount */}
                    <TextField
                        label="Min Discount *"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        placeholder="Enter min discount"
                        value={minDiscount}
                        onChange={(e) => setMinDiscount(e.target.value)}
                        error={Boolean(errors.minDiscount)}
                        helperText={errors.minDiscount}
                    />

                    {/* Start Date */}
                    <Typography variant="body1" sx={{ marginTop: 2 }}>Start Date</Typography>
                    <TextField
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        variant="outlined"
                        sx={{ marginTop: 1 }}
                    />

                    {/* End Date */}
                    <Typography variant="body1" sx={{ marginTop: 2 }}>End Date</Typography>
                    <TextField
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        variant="outlined"
                        sx={{ marginTop: 1 }}
                    />

                    {/* Form Actions */}
                    <Box className="form-actions d-flex justify-content-end mt-4">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="me-2"
                        >
                            Save
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default AddCouponPage;
