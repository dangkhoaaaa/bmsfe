import React, { useState } from 'react';
import axios from 'axios';
import './UpdateProduct.scss';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, IconButton, Box, Typography, Grid,
    Tooltip, Avatar, Switch, FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ApiChangeStockOut, ApiGetProductByID, ApiUpdateProduct } from '../../services/ProductServices';

const UpdateProduct = ({ product, onClose, onSave }) => {
    const [showImages, setShowImages] = useState(false);
    const [images, setImages] = useState([]);
    const [updatedProduct, setUpdatedProduct] = useState({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        images: [],
    });
    const token = localStorage.getItem('token');
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        price: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({
            ...updatedProduct,
            [name]: value,
        });

        // Reset lỗi khi người dùng nhập
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const newErrors = {};

        if (!updatedProduct.name.trim()) {
            newErrors.name = "Product Name is required.";
        }

        if (!updatedProduct.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (updatedProduct.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters.";
        }

        if (!updatedProduct.price) {
            newErrors.price = "Price is required.";
        } else if (Number(updatedProduct.price) <= 0) {
            newErrors.price = "Price must be greater than 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Lấy tất cả tệp hình ảnh
        setImageFiles(prev => [...prev, ...files]); // Cập nhật mảng file
        const newImages = files.map(file => URL.createObjectURL(file)); // Tạo URL cho từng tệp
        setUpdatedProduct(prev => ({
            ...prev,
            images: [...prev.images, ...newImages], // Cập nhật hình ảnh với URL mới
        }));
    };

    const handleRemoveImage = (index) => {
        const newFiles = [...imageFiles];
        newFiles.splice(index, 1); // Xóa file tại chỉ số index

        const newImages = [...updatedProduct.images];
        newImages.splice(index, 1); // Xóa URL hình ảnh tương ứng

        setImageFiles(newFiles);
        setUpdatedProduct(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const result = await ApiUpdateProduct(updatedProduct, product.id, imageFiles, token);
        if (result.ok) {
            alert('Dish updated successfully.');
            onSave();
            onClose();
        } else {
            alert(result.message);
        }
    };

    const handleShowImages = async () => {
        if (showImages) {
            setShowImages(false);
        } else {
            const result = await ApiGetProductByID(product.id, token);
            if (result.ok) {
                setImages(result.body.data.images);
                setShowImages(true);
            } else {
                alert(result.message);
            }
        }
    }

    const handleToggleOutOfStock = async (value) => {
        setShowOutOfStock(value);
        const result = await ApiChangeStockOut(product.id, token);
        if (result.ok) {
            alert('Dish updated successfully.');
            onSave();
            onClose();
        } else {
            alert(result.message);
        }
    }

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Edit Product</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Product Name"
                            name="name"
                            value={updatedProduct.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                        />

                        <TextField
                            label="Description"
                            name="description"
                            value={updatedProduct.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            required
                            error={!!errors.description}
                            helperText={errors.description}
                        />

                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={updatedProduct.price}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!errors.price}
                            helperText={errors.price}
                        />
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Current Images *
                            </Typography>
                            {showImages && (
                                <Grid container spacing={2} marginTop={1}>
                                    {images.map((file, index) => (
                                        <Grid item key={index}>
                                            <Box
                                                component="img"
                                                src={file.url}
                                                alt={`image-${index}`}
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: '10px',
                                                    marginBottom: 1,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            <Button
                                variant="contained"
                                component="label"
                                onClick={() => handleShowImages(!showImages)}
                            >
                                {showImages && "Hide" || "Show"}
                            </Button>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Product Images *
                            </Typography>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Images
                                <input
                                    name="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {errors.image && (
                                <Tooltip title={errors.image} arrow>
                                    <Typography color="error" variant="caption">
                                        {errors.image}
                                    </Typography>
                                </Tooltip>
                            )}

                            <Grid container spacing={2} marginTop={1}>
                                {imageFiles.map((file, index) => (
                                    <Grid item key={index}>
                                        <Box display="flex" alignItems="center" flexDirection="column">
                                            <Box
                                                component="img"
                                                src={URL.createObjectURL(file)}
                                                alt={`image-${index}`}
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: '10px',
                                                    marginBottom: 1,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <div className='w-100 d-flex px-3'>
                        <FormControlLabel
                            className='flex-grow-1'
                            control={
                                <Switch
                                    checked={showOutOfStock}
                                    onChange={(e) => handleToggleOutOfStock(e.target.checked)}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#4caf50',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#4caf50',
                                        },
                                    }}
                                />
                            }
                            label={showOutOfStock ? 'Out of Stock' : 'In Stock'}
                            sx={{
                                width: '150px',
                            }}
                        />
                        <Button className='me-2' type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                        <Button onClick={onClose} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdateProduct;

/*
     const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...updatedProduct.images];
    newImages[index] = value;
    setUpdatedProduct((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedProduct);
  };
*/