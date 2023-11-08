import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CreateProduct = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    const userId = localStorage.getItem('userId');
    const [name, setName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [diseaseType, setDiseaseType] = useState('');
    const [productImage, setProductImage] = useState(null);

    const [validationErrors, setValidationErrors] = useState({});
    const [darkMode, setDarkMode] = useState(false);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleManufacturerChange = (e) => {
        setManufacturer(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleDiseaseTypeChange = (e) => {
        setDiseaseType(e.target.value);
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setProductImage(imageFile);
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('manufacturer', manufacturer);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('diseaseType', diseaseType);
        formData.append('userId', userId);
        formData.append('productImage', productImage);

        try {
            const response = await axios.post('http://localhost:8000/api/create-product', formData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                const result = response.data;
                console.log('Product created:', result);
                setName('');
                setDescription('');
                setPrice('');
                setManufacturer('');
                setDiseaseType('');
                setProductImage(null);
                navigate('/products');
                setValidationErrors({});
            } else {
                const errorData = response.data;
                console.error('Error creating product:', errorData);
                if (errorData.errors) {
                    setValidationErrors(errorData.errors);
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setValidationErrors(error.response.data.errors);
        }
    };

    return (
        <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new product</h2>
                <form encType="multipart/form-data" onSubmit={handleCreateProduct}>
                    <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="name">
                            Product Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name"
                        />
                        {validationErrors.name && (
                            <p className="text-sm text-red-500">{validationErrors.name.message}</p>
                        )}
                    <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="manufacturer">
                            Manufacturer:
                        </label>
                        <input
                            type="text"
                            id="manufacturer"
                            name="manufacturer"
                            value={manufacturer}
                            onChange={handleManufacturerChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Manufacturer"
                        />
                        {validationErrors.manufacturer && (
                            <p className="text-sm text-red-500">{validationErrors.manufacturer.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="description">
                            Product Description:
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Description"
                        />
                        {validationErrors.description && (
                            <p className="text-sm text-red-500">{validationErrors.description.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="price">
                            Price:
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={price}
                            min="1"
                            onChange={handlePriceChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                        {validationErrors.price && (
                            <p className="text-sm text-red-500">{validationErrors.price.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="diseaseType">
                            Disease Type:
                        </label>
                        <input
                            type="text"
                            id="diseaseType"
                            name="diseaseType"
                            value={diseaseType}
                            onChange={handleDiseaseTypeChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder='Disease Type'
                        />
                        {validationErrors.diseaseType && (
                            <p className="text-sm text-red-500">{validationErrors.diseaseType.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="productImage">
                            Image:
                        </label>
                        <input
                            type="file"                          
                            id="productImage"
                            name="productImage"
                            onChange={handleImageChange}
                            className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        />
                        {validationErrors.productImage && (
                            <p className="text-sm text-red-500">{validationErrors.productImage.message}</p>
                        )}
                    </div>
                    </div>
                    <button
                        type="submit"
                        className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                    >
                        Add Product
                    </button>
                </form>
                
            </div>
        </section>
    );
};

export default CreateProduct;
