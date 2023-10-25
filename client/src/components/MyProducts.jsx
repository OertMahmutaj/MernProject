import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const userId = localStorage.getItem('userId');


  useEffect(() => {
    if (!userId) {
      setProducts([]);
      return;
    }
    axios.get('http://localhost:8000/api/products')
      .then((response) => {

        const filteredProducts = response.data.filter((product) => product.createdBy === userId);

        const sortedProducts = filteredProducts.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        setProducts(sortedProducts);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [userId]);
  const handleViewClick = (productId) => {
    navigate(`/product/${productId}/edit`);
  };

  const handleDeleteClick = (productId) => {
    axios.delete(`http://localhost:8000/api/product/${productId}`, { withCredentials: true })
      .then(() => {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <div className="p-4">
      <nav className="nav mb-4">
        <Link to="/create-product" className="nav-link bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-4">
          Add Product
        </Link>
        <Link to="/products" className="nav-link bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Products
        </Link>
      </nav>
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <table className="table-auto w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">${product.price}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleViewClick(product._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteClick(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default MyProducts;
