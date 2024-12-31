import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdateProduct.scss';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Autocomplete, TextField, Chip, Button, IconButton, Box, Typography, Grid,
    Tooltip, Avatar, Switch, FormControlLabel,
    DialogContentText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ApiChangeStockOut, ApiGetProductByID, ApiUpdateProduct } from '../../services/ProductServices';
import { ApiGetAllCategory, ApiGetCategoriesByProductId, ApiRegisterProductToCategory, ApiRemoveProductToCategory } from '../../services/CategoryServices';
import { ApiCancelListOrders } from '../../services/OrderServices';
import { io } from 'socket.io-client';
import { HTTP_SOCKET_SERVER } from '../../constants/Constant';

const UpdateProduct = ({ product, onClose, onSave }) => {
    const shopId = localStorage.getItem('shopId');
    const [socket, setSocket] = useState(null);
    const [showImages, setShowImages] = useState(false);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [listOrderId, setListOrderId] = useState([]);
    const [listCustomerId, setListCustomerId] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        images: [],
    });
    const token = localStorage.getItem('token');
    const [showOutOfStock, setShowOutOfStock] = useState(product.isOutOfStock);
    const [imageFiles, setImageFiles] = useState([]);
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        price: "",
    });

    const handleResultMessage = async (result) => {
        if (result.message) {
            setOpenConfirmDialog(true);
        }
    };

    const handleConfirm = async () => {
        setOpenConfirmDialog(false);
        if (!listOrderId || listOrderId.length == 0) {
            return;
        }
        const resultCancel = await ApiCancelListOrders(listOrderId, token);
        if (resultCancel.ok) {
            for (let i = 0; i < listOrderId.length; i++) {
                const orderId = listOrderId[i];
                if (listCustomerId.length > i) {
                    const customerId = listCustomerId[i];
                    await sendNotiToUser(orderId, customerId, shopId);
                }
            }
            // re-change stock after cancel orders
            const resultChangeStock = await ApiChangeStockOut(product.id, token);
            if (resultChangeStock.ok) {
                onSave();
                onClose();
            } else {
                alert(resultChangeStock.message);
            }
        } else {
            alert(resultCancel.message);
        }
    };

    const sendNotiToUser = async (orderId, userId, shopId) => {
        if (socket) {
            socket.emit('join-user-topic', userId);
            const orderData = {
                userId,
                shopId,
                orderId,
            };
            socket.emit('new-order', orderData);
        }
    };

    const handleCancel = () => {
        setOpenConfirmDialog(false);
        onClose();
    };

    const handleCategoryChange = async (event, value, reason) => {
        if (reason === 'selectOption') {
            const addedChip = value.find((item) => !categorySelected.includes(item));
            if (addedChip?.id) {
                const result = await ApiRegisterProductToCategory(product.id, addedChip.id, token);
                if (!result.ok) {
                    alert(result.message);
                }
            }
            console.log('Chip added, ID:', addedChip?.id);
        } else if (reason === 'removeOption') {
            const removedChip = categorySelected.find((item) => !value.includes(item));
            console.log('Chip removed, ID:', removedChip?.id);
            if (removedChip?.id) {
                const result = await ApiRemoveProductToCategory(product.id, removedChip.id, token);
                if (!result.ok) {
                    alert(result.message);
                }
            }
        }
        setCategorySelected(value);
    };
    useEffect(() => {
        fetchCategories();
        fetchCategoriesByProductId();
        const socketConnection = io(HTTP_SOCKET_SERVER);
        setSocket(socketConnection);
        return () => {
            setTimeout(() => {
                socketConnection.disconnect(); // Delay disconnect by 2 seconds
            }, 2000); // 2 seconds delay
        };
    }, []);

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

    const fetchCategories = async () => {
        const result = await ApiGetAllCategory("", true, 1, 100, token);
        if (result.ok) {
            setCategories(result.body.data.data);
        } else {
            alert(result.message);
        }
    }
    const fetchCategoriesByProductId = async () => {
        const result = await ApiGetCategoriesByProductId(product.id, "", true, 1, 100, token);
        if (result.ok) {
            const listCategories = [];
            result.body.data.data.forEach(item => {
                listCategories.push(item.category);
            });
            setCategorySelected(listCategories);
        } else {
            alert(result.message);
        }
    }

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
        setIsProcessing(true);
        e.preventDefault();
        if (!validate()) {
            setIsProcessing(false);
            return;
        }
        const result = await ApiUpdateProduct(updatedProduct, product.id, imageFiles, token);
        if (result.ok) {
            onSave();
            onClose();
        } else {
            alert(result.message);
        }
        setIsProcessing(false);
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
        setListOrderId([]);
        setListCustomerId([]);
        setShowOutOfStock(value);
        const result = await ApiChangeStockOut(product.id, token);
        if (result.ok) {
            onSave();
            onClose();
        } else {
            if (result.body.data && result.body.data.listOrderId && result.body.data.listOrderId.length > 0) {
                setConfirmMessage(result.message);
                setListOrderId(result.body.data.listOrderId);
                setListCustomerId(result.body.data.listCustomerId);
                handleResultMessage(result);
            } else {
                alert(result.message);
            }
        }
    }

    return (
        <>
            <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Edit Product</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                {!openConfirmDialog && (
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
                                <Autocomplete
                                    multiple
                                    options={categories}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={categorySelected}
                                    onChange={handleCategoryChange}
                                    freeSolo
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option.name}
                                                {...getTagProps({ index })}
                                                key={index}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Add Categories"
                                            placeholder="Type and press Enter"
                                        />
                                    )}
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
                                {isProcessing && (
                                    <Button className='me-2' type="submit" variant="contained" color="secondary" disabled>
                                        Processing...
                                    </Button>
                                ) || (
                                    <Button className='me-2' type="submit" variant="contained" color="primary">
                                        Save
                                    </Button>
                                )}
                                <Button onClick={onClose} variant="outlined" color="secondary">
                                    Cancel
                                </Button>
                            </div>
                        </DialogActions>
                    </form>
                ) || (
                        <>
                            <DialogContent>
                                <DialogContentText>{confirmMessage}</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancel} color="secondary">Hủy</Button>
                                <Button onClick={handleConfirm} color="primary">Đồng ý</Button>
                            </DialogActions>
                        </>
                    )}

            </Dialog>
            {/* <Dialog open={openConfirmDialog} onClose={handleCancel}>
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>
                    <DialogContentText>{confirmMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="secondary">Hủy</Button>
                    <Button onClick={handleConfirm} color="primary">Đồng ý</Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
};

export default UpdateProduct;
