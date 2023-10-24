import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProductDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        
    });

    useEffect(() => {
        axios
          .get(`http://localhost:8000/api/product/${id}`)
          .then((res) => {
            setProductData(res.data);
          })
          .catch((error) => {
            console.error('Error fetching product details:', error);
          });
      }, [id]);;


    return (
        <div className="form-container">
            <nav className="nav">
                <Link to="/products" className="nav-link">
                    Products
                </Link>
            </nav>
            <div>
            <p id='details-id'>Name: <span id='pet-id'>{productData.name}</span></p>
            <p id='details-id'>Description: <span id='pet-id'>{productData.description}</span></p>
            <p id='details-id'>Price: <span id='pet-id'>{productData.price}</span></p>
            </div>
        </div>
    );
};

export default ProductDetails;
