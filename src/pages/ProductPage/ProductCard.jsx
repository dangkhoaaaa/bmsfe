import React, { useState } from 'react';
import './ProductCard.scss';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UpdateProduct from './UpdateProduct';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const ProductCard = ({ product, onDelete, onEdit }) => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(product.imageUrl?.[0]?.url || '');
    console.log("Hi", JSON.stringify(product, null, 2));
    const handleEdit = () => {
        setPopupOpen(true);
    };

    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="product-card" style={{ height: 450 }}>
            <img
                style={{ width: '100%', height: 170, objectFit: 'cover' }}
                src={selectedImage || 'default-image-url.jpg'}
                alt={product.name}
                className="product-image"
            />
            <div className="thumbnail-gallery">
                {product.imageUrl?.length > 0 ? (
                    product.imageUrl.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => handleThumbnailClick(image.url)}
                            className="thumbnail"
                        />
                    ))
                ) : (
                    <p>No images available</p>
                )}
            </div>
            <div style={{ height: 150 }}>
                <h3>{product.name}</h3>
                <p>Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                <p>{product.description}</p>
            </div>
            
            <div className="card-actions">
                <button onClick={handleEdit} className="edit-button">
                    <BorderColorIcon />
                </button>
                <button onClick={onDelete} className="delete-button">
                    <DeleteOutlineIcon />
                </button>
            </div>
            {isPopupOpen && 
                <UpdateProduct 
                    product={product} 
                    onClose={() => setPopupOpen(false)} 
                    onSave={onEdit} 
                />
            }
        </div>
    );
};

export default ProductCard;
