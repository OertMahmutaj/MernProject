import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/products')
      .then((response) => {
        const sortedProducts = response.data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setProducts(sortedProducts);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleViewClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-6">
      <nav className="flex justify-between mb-4">
        <Link to="/create-product" className="btn">
          Add Product
        </Link>
        <Link to="/my-products" className="btn">
          My Products
        </Link>
      </nav>
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Price</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <button
                  onClick={() => handleViewClick(product._id)}
                  className="btn"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;