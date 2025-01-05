import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiCreateProduct, ApiSendProductToStaff } from '../../services/ProductServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [name, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]); // Store multiple images
    const [isCombo, setIsCombo] = useState(false); // Checkbox state
    const [errors, setErrors] = useState({});
    const [shopId, setShopId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [saveFailCount, setSaveFailCount] = useState(0); // Track save button failures
    const [isSendToStaffVisible, setSendToStaffVisible] = useState(false); // Toggle visibility of the Send to Staff button
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const storedShopId = localStorage.getItem('shopId');
        if (storedShopId) {
            setShopId(storedShopId);
        } else {
            alert('No shop ID found. Please log in as a shop.');
            navigate('/login');
        }
    }, [navigate]);

    const validateFields = () => {
        const validationErrors = {};
        if (!name) validationErrors.name = 'Product name is required';
        if (!price) {
            validationErrors.price = 'Price is required';
        } else if (price <= 0) {
            validationErrors.price = 'Price must be greater than 0';
        }
        if (!description) validationErrors.description = 'Description is required';
        if (images.length === 0) validationErrors.images = 'At least one product image is required';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        setIsProcessing(true);
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!validateFields()) {
            setIsProcessing(false);
            return;
        }

        if (!shopId) {
            setIsProcessing(false);
            alert('No shop ID found. Please log in as a shop.');
            return;
        }

        const result = await ApiCreateProduct(name, isCombo, description, price, shopId, images, token);
        if (result.ok) {
            setSuccessMessage('Create product successfully!');
            setTimeout(() => {
                navigate('/shop/menu');
            }, 2000);
        } else {
            // Increment the fail count and check if the button should become visible
            setSaveFailCount((prevCount) => {
                const newCount = prevCount + 1;
                if (newCount >= 3) {
                    setSendToStaffVisible(true);
                    toast.error('You have encountered multiple issues while saving the product. Please send the information to the staff for further assistance.');
                }
                setIsProcessing(false);
                return newCount;
            });
            toast.error(result.message);
            setIsProcessing(false);
        }
    };

    const handleSendToStaff = async () => {
        const token = localStorage.getItem('token');
        if (!validateFields()) {
            return;
        }

        const result = await ApiSendProductToStaff(name, description, price, shopId, images, token);
        if (result.ok) {
            setSuccessMessage('Product sent to staff successfully!');
            setTimeout(() => {
                navigate('/shop/menu');
            }, 2000);
        } else {
            alert(result.message);
        }
    };

    const handleCancel = () => {
        navigate('/shop/menu');
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]); // Append new images
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <ToastContainer />
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        New Product Entry
                    </Typography>
                    {successMessage && (
                        <Typography color="success.main" gutterBottom>
                            {successMessage}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            value={name}
                            onChange={(e) => setProductName(e.target.value)}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            error={Boolean(errors.price)}
                            helperText={errors.price}
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isCombo}
                                    onChange={(e) => setIsCombo(e.target.checked)}
                                />
                            }
                            label="Combo Package"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                            margin="normal"
                        />
                        <Box sx={{ marginTop: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                            >
                                Upload Images
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {errors.images && (
                                <Typography color="error" variant="body2">
                                    {errors.images}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
                                {images.map((image, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2">{image.name}</Typography>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                    </form>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>

                    {isSendToStaffVisible && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleSendToStaff}
                        >
                            Send to Staff
                        </Button>
                    ) || <div></div>}
                    <div>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            style={{
                                width: 150,
                                background: isProcessing && 'gray' || 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                                color: 'white',
                            }}
                            disabled={isProcessing}
                        >
                            {isProcessing && 'Processing...' || 'Save'}
                        </Button>
                        <Button
                            className='ms-2'
                            variant="outlined"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardActions>
            </Card>
        </Box>
    );
};

export default AddProductPage;
