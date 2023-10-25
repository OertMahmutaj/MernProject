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
        <div className="form-container p-4">
            <nav className="nav mb-4">
                <Link to="/products" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
                    Products
                </Link>
            </nav>
            <form onSubmit={onSubmitHandler}>
                <div className="mb-4">
                    <label className="form-label" htmlFor="name">
                        Product Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                    />
                    {val.name ? (
                        <p className="text-sm text-red-500">{val.name.message}</p>
                    ) : (
                        ""
                    )}
                </div>
                <div className="mb-4">
                    <label className="form-label" htmlFor="description">
                        Product Description:
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="form-input"
                    />
                    {val.description ? (
                        <p className="text-sm text-red-500">{val.description.message}</p>
                    ) : (
                        ""
                    )}
                </div>
                <div className="mb-4">
                    <label className="form-label" htmlFor="price">
                        Price:
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="form-input"
                    />
                    {val.price ? (
                        <p className="text-sm text-red-500">{val.price.message}</p>
                    ) : (
                        ""
                    )}
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
                    Add Product
                </button>
            </form>
        </div>

    );
};

export default CreateProduct;
