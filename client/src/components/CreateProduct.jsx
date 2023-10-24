import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CreateProduct = () => {
    const navigate = useNavigate();
    const isLogedIn = localStorage.getItem('isLogedIn');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        createdBy: localStorage.getItem('userId'),
    });

    console.log(formData);
    const [val, setVal] = useState({});

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (!isLogedIn) {
            navigate('/login');
            return;
        }

        const productData = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            createdBy: formData.createdBy,
        };

        axios
            .post('http://localhost:8000/api/create-product', productData, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                setVal({});
                navigate('/products');
            })
            .catch((err) => {
                err.response.data.errors ? setVal(err.response.data.errors) : console.log(err);
            });
    };

    return (
        <div className="form-container">
            <nav className="nav">
                <Link to="/products" className="nav-link">
                    Products
                </Link>
            </nav>
            <form onSubmit={onSubmitHandler}>
                <div>
                    <label className="form-label">Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
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
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
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
                    value={formData.price}
                    onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                    }
                />
                {val.price ? (
                        <p className="text-sm text-red-500 ">{val.price.message}</p>
                    ) : (
                        ''
                    )}
                </div>
                <button type="submit" className="form-button">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
