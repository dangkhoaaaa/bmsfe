import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductPage.scss';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Switch, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Box, TextField, Checkbox, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ApiDeleteProduct, ApiGetProductsByShopId } from '../../services/ProductServices';
import { io } from 'socket.io-client';
import { HTTP_SOCKET_SERVER } from '../../constants/Constant';
import { ApiCancelListOrders } from '../../services/OrderServices';

const ProductPage = () => {
    const [socket, setSocket] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const shopId = localStorage.getItem('shopId');
    const token = localStorage.getItem('token');
    const [listOrderId, setListOrderId] = useState([]);
    const [listCustomerId, setListCustomerId] = useState([]);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isCombo, setIsCombo] = useState(false); // Checkbox state
    const navigate = useNavigate();

    const fetchProducts = async () => {
        if (!shopId) {
            console.error('No shopId found in local storage');
            return;
        }
        const result = await ApiGetProductsByShopId(shopId, isCombo, searchTerm, true, pageIndex, pageSize, showOutOfStock, token);
        if (result.ok) {
            setProducts(result.body.data.data);
            setTotalPages(result.body.data.lastPage || 0);
        } else {
            alert(result.message);
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
            // re-delete product after cancel orders
            const resultDelete = await ApiDeleteProduct(deleteProductId, token);
            if (resultDelete.ok) {
                onDeleteSuccess();
            } else {
                alert(resultDelete.message);
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
        setOpenDialog(false);
        setOpenConfirmDialog(false);
    };

    const handleResultMessage = async (result) => {
        if (result.message) {
            setOpenConfirmDialog(true);
        }
    };

    const handleDeleteProduct = async () => {
        if (!deleteProductId) return;
        try {
            // await fetch(`${API}/${deleteProductId}`, { method: 'DELETE' });
            const result = await ApiDeleteProduct(deleteProductId, token);
            if (result.ok) {
                onDeleteSuccess();
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
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const onDeleteSuccess = () => {
        setMessageAlert('Dish Deleted Successfully!');
        setOpenAlert(true);
        setOpenDialog(false);
        setOpenConfirmDialog(false);
        fetchProducts(); // Re-fetch products after deletion
    }

    const onEditSuccess = () => {
        setMessageAlert('Dish updated successfully!');
        setOpenAlert(true);
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, [pageIndex, searchTerm, isCombo, showOutOfStock]);

    useEffect(() => {
        const socketConnection = io(HTTP_SOCKET_SERVER);
        setSocket(socketConnection);
        return () => {
            setTimeout(() => {
                socketConnection.disconnect(); // Delay disconnect by 2 seconds
            }, 2000); // 2 seconds delay
        };
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageIndex(newPage);
        }
    };

    const handleAddProduct = () => {
        navigate('/shop/add-product');
    };

    const handleOpenDialog = (productId) => {
        setDeleteProductId(productId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDeleteProductId(null);
    };

    const checkIsCombo = (product) => {
        if (product.isCombo === true) {
            return true;
        }
        return false;
    }

    return (
        <div className="product-page">
            <Box sx={{ my: '20px' }}>
                <Typography align='left' variant='h4'>Product List</Typography>
            </Box>
            <div className="product-controls">
                <div className="flex-grow-1">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isCombo}
                                onChange={(e) => setIsCombo(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Show Combo"
                        style={{ whiteSpace: 'nowrap', marginInlineStart: 20 }}
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showOutOfStock}
                                onChange={(e) => setShowOutOfStock(e.target.checked)}
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
                    <Button
                        variant="contained"
                        className="ms-2"
                        onClick={handleAddProduct}
                        sx={{
                            background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                            color: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #429321, #0f9b0f, #006400)',
                            },
                        }}
                    >
                        <AddIcon className="me-2" /> Add Product
                    </Button>
                </div>
            </div>
            <Grid container spacing={2}>
                {products.map((product) => (
                    product.isOutOfStock === showOutOfStock && isCombo === checkIsCombo(product) && (
                        <Grid item xs={6} sm={6} md={6} lg={4} xl={2} key={product.id}>
                            <ProductCard
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    description: product.description,
                                    price: product.price,
                                    imageUrl: product.images || '', // Safely check for images
                                    isOutOfStock: product.isOutOfStock
                                }}
                                onEdit={onEditSuccess}
                                onDelete={() => handleOpenDialog(product.id)} // Open dialog on delete
                            />
                        </Grid>
                    )
                ))}
            </Grid>
            {products && products.length > 0 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(pageIndex - 1)}
                        disabled={pageIndex <= 1}
                    >
                        Previous
                    </button>
                    <span>Page {pageIndex} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(pageIndex + 1)}
                        disabled={pageIndex >= totalPages}
                    >
                        Next
                    </button>
                </div>
            ) || (
                    <div className="text-center mt-4" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#555' }}>
                        No Products Found
                    </div>
                )}
            <Snackbar
                open={openAlert}
                autoHideDuration={2000}
                onClose={() => setOpenAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: '100%' }}>
                    {messageAlert}
                </Alert>
            </Snackbar>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {!openConfirmDialog && (
                    <>
                        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this product?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                No
                            </Button>
                            <Button onClick={handleDeleteProduct} color="primary" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </>
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


        </div>
    );
};

export default ProductPage;
