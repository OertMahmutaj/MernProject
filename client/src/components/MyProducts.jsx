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
    axios.delete(`http://localhost:8000/api/product/${productId}`, {withCredentials: true})
      .then(() => {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <div>
      <nav className="nav">
        <Link to="/create-product" className="nav-link">Add Product</Link>
        <br />
        <Link to="/products" className="nav-link">Products</Link>
      </nav>
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              
              <td>
                <button onClick={() => handleViewClick(product._id)}>View</button>
                <button onClick={() => handleDeleteClick(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyProducts;
