import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProductPage.scss';
import { ApiCreateProduct } from '../../services/ProductServices';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [name, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]); // Store multiple images
    const [errors, setErrors] = useState({});
    const [shopId, setShopId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

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
        const token = localStorage.getItem('token');
        const validationErrors = {};
        if (!name) validationErrors.name = 'Product name is required';
        if (!price) {
            validationErrors.price = 'Price is required';
        } else if (price <= 0) {
            validationErrors.price = 'Price must be greater than 0';
        }
        if (!description) validationErrors.description = 'Description is required';
        if (images.length === 0) validationErrors.image = 'At least one product image is required';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!shopId) {
            alert('No shop ID found. Please log in as a shop.');
            return;
        }

        const result = await ApiCreateProduct(name, description, price, shopId, images, token);
        if (result.ok) {
            setSuccessMessage('Create product successfully!');
            setTimeout(() => {
                navigate('/shop/menu');
            }, 2000);
        } else {
            alert(result.message);
        }
    };

    const handleCancel = () => {
        navigate('/Menu');
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...files]); // Append new images
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index)); // Remove selected image
    };

    return (
        <div className="add-product-page">
            <h1 className="form-header">Add New Product</h1>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="productName">Product Name *</label>
                    <input
                        type="text"
                        id="productName"
                        placeholder="Enter product name"
                        value={name}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    {errors.name && <div className="error-tooltip">{errors.name}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price *</label>
                    <input
                        type="number"
                        id="price"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {errors.price && <div className="error-tooltip">{errors.price}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <div className="error-tooltip">{errors.description}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="images">Product Images *</label>
                    <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple // Allow multiple file selection
                        onChange={handleImageChange}
                    />
                    {errors.image && <div className="error-tooltip">{errors.image}</div>}
                    <div className="image-preview">
                        {images.map((image, index) => (
                            <div key={index} className="image-item">
                                <span>{image.name}</span>
                                <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-button">Save</button>
                    <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;
