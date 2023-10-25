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
        <div className="form-container bg-gray-100 p-6 rounded-lg shadow-lg">
            <nav className="nav mb-4">
                <Link to="/products" className="nav-link text-indigo-600 hover:underline">
                    Products
                </Link>
            </nav>
            <div>
                <p className="text-2xl text-gray-800 mb-2">Product Details</p>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                        <span className="font-semibold text-gray-600 w-32">Name:</span>
                        <span id="pet-id" className="text-gray-800">{productData.name}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold text-gray-600 w-32">Description:</span>
                        <span id="pet-id" className="text-gray-800">{productData.description}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold text-gray-600 w-32">Price:</span>
                        <span id="pet-id" className="text-gray-800">${productData.price}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProductDetails;
