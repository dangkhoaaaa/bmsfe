import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductPage.scss';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Switch, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ApiGetProductsByShopId } from '../../services/ProductServices';

const API = 'https://bms-fs-api.azurewebsites.net/api/Product';

const ProductPage = () => {
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

    const navigate = useNavigate();

    const fetchProducts = async () => {
        const shopId = localStorage.getItem('shopId');
        const token = localStorage.getItem('token');
        if (!shopId) {
            console.error('No shopId found in local storage');
            return;
        }
        const result = await ApiGetProductsByShopId(shopId, searchTerm, true, pageIndex, pageSize, showOutOfStock, token);
        if (result.ok) {
            setProducts(result.body.data.data);
            setTotalPages(result.body.data.lastPage || 0);
        } else {
            alert(result.message);
        }
    };

    const handleDeleteProduct = async () => {
        if (!deleteProductId) return;
        try {
            await fetch(`${API}/${deleteProductId}`, { method: 'DELETE' });
            setMessageAlert('Dish Deleted');
            setOpenAlert(true);
            setOpenDialog(false);
            fetchProducts(); // Re-fetch products after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const onEditSuccess = () => {
        setMessageAlert('Dish updated successfully!');
        setOpenAlert(true);
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, [pageIndex, searchTerm, showOutOfStock]);

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

    return (
        <div className="product-page">
            <h1>Product List</h1>
            <div className="product-controls">
                <div className="flex-grow-1">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
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
                    product.isOutOfStock === showOutOfStock && (
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
            </Dialog>
        </div>
    );
};

export default ProductPage;
