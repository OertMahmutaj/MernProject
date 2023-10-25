import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UpdateProduct = () => {
    // const navigate = useNavigate();
    const { id } = useParams();
    const [val, setVal] = useState({})

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .patch(`http://localhost:8000/api/product/${id}/edit`, productData, { withCredentials: true })
            .then((res) => {
                if (res.status === 200) {
                    window.location.href = `/products`;
                }
            })
            .catch(err => { console.log(err.response), err.response.data.errors ? setVal(err.response.data.errors) : console.log(err.response) });
    };

    return (
        <div className="form-container">
            <nav className="nav">
                <Link to="/products" className="nav-link">
                    Products
                </Link>
            </nav>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                    />
                    {val.name ? (
                        <p className="text-sm text-red-500 ">{val.name.message}</p>
                    ) : (
                        ''
                    )}
                </div>
                <div>
                    <label className="form-label">Product Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                    />
                    {val.description ? (
                        <p className="text-sm text-red-500 ">{val.description.message}</p>
                    ) : (
                        ''
                    )}
                </div>
                <div>
                    <label className="form-label">Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                    />
                    {val.price ? (
                        <p className="text-sm text-red-500 ">{val.price.message}</p>
                    ) : (
                        ''
                    )}
                </div>
                <button type="submit" className="form-button">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
