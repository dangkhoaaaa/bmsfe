import React, { useState, useEffect } from 'react';
import './UpdateCoupon.scss';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, IconButton, Box, Typography, Grid,
    FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ApiUpdateCoupon } from '../../services/CouponServices';


const UpdateCoupon = ({coupon, onSave, onClose}) => {
    const [successMessage, setSuccessMessage] = useState('');

    // State cho các trường trong form
    const [name, setCouponName] = useState(coupon?.name ?? '');
    const [percentDiscount, setPercentDiscount] = useState(coupon?.percentDiscount ?? '');
    const [isPercentDiscount, setIsPercentDiscount] = useState(coupon?.isPercentDiscount ?? false);
    const [maxDiscount, setMaxDiscount] = useState(coupon?.maxDiscount ?? '');
    const [minPrice, setMinPrice] = useState(coupon?.minPrice ?? '');
    const [minDiscount, setMinDiscount] = useState(coupon?.minDiscount ?? '');
    const [startDate, setStartDate] = useState(coupon?.startDate ?? '');
    const [endDate, setEndDate] = useState(coupon?.endDate ?? '');

    const [errors, setErrors] = useState({});
    const [imageFiles, setImageFiles] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!name) newErrors.name = 'Coupon Name is required';
      //  if (!percentDiscount) newErrors.percentDiscount = 'Percent Discount is required';
        if (!maxDiscount) newErrors.maxDiscount = 'Max Discount is required';
       // if (!minPrice) newErrors.minPrice = 'Price is required';
        if (!minDiscount) newErrors.minDiscount = 'Min Discount is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const result = await ApiUpdateCoupon(name, percentDiscount, isPercentDiscount, maxDiscount, minPrice, minDiscount, coupon.id, startDate, endDate);
        if (result.ok) {
            setSuccessMessage('Coupon update successfully!');
            onSave();
            onClose();
        } else {
            alert(result.message);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Edit Coupon</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>

                            <Typography variant="h4" align="center" gutterBottom>
                                Coupon information
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
                                <FormControlLabel
                                    control={
                                        <input
                                            type='checkbox'
                                            defaultChecked={isPercentDiscount}
                                            className='form-check-input ms-2 mt-3'
                                            style={{ width: 50, height: 56 }}
                                            onChange={(e) => setIsPercentDiscount(e.target.checked)}
                                        />
                                    }
                                    label="Is Percent Discount"
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
                                        onChange={(e) => setPercentDiscount(e.target.value)}
                                        error={Boolean(errors.percentDiscount)}
                                        helperText={errors.percentDiscount}
                                    />
                                ) : (
                                    <TextField
                                        label="Price Discount *"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        type="number"
                                        placeholder="Enter price discount"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        error={Boolean(errors.minPrice)}
                                        helperText={errors.minPrice}
                                    />
                                )}

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

                                {/* Price */}
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
                                />

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

                            </form>
                </DialogContent>

                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">
                        Save
                    </Button>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdateCoupon;