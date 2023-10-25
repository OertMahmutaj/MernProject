import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const userId = localStorage.getItem('userId');

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
        <Link to={`/updateprofile/${userId}`} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
          Update Profile
        </Link>
        <Link to="/create-product" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
          Add Product
        </Link>
        <Link to="/my-products" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
          My Products
        </Link>
        <Link to="/logout" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
          Logout
        </Link>
      </nav>
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Product List</h2>
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-indigo-500 text-white">
          <tr>
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">Price</th>
            <th className="py-2 px-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="py-2 px-3 text-gray-800">{product.name}</td>
              <td className="py-2 px-3 text-gray-800">${product.price}</td>
              <td>
                <button
                  onClick={() => handleViewClick(product._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
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
