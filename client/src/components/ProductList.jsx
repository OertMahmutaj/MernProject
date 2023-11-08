import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ProductList = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [userId] = useState(localStorage.getItem('userId'));
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState('name'); 
  const [sortOrder, setSortOrder] = useState('asc');

  setIsLoggedIn(localStorage.getItem('isLogedIn'))


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        let sortedProducts = [...response.data];

        if (sortBy === 'name') {
          sortedProducts.sort((a, b) =>
            sortOrder === 'asc'
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name)
          );
        } else if (sortBy === 'price') {
          sortedProducts.sort((a, b) =>
            sortOrder === 'asc'
              ? a.price - b.price
              : b.price - a.price
          );
        }

        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [sortBy, sortOrder]);

  const handleViewClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc'); 
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6">
  <nav className="flex justify-between mb-4">
    <Link to={`/updateprofile/${userId}`} className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
      Update Profile
    </Link>
    <Link to="/create-product" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
      Add Product
    </Link>
    <Link to={`/my-reviews/${userId}`} className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
      My Reviews
    </Link>
  </nav>
  <h2 className="text-xxl text-center font-bold text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">Product List</h2>
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th
          onClick={() => handleSort('name')}
          scope="col" className="px-6 py-3"
        >
          Name
        </th>
        <th
          onClick={() => handleSort('manufacturer')}
          scope="col" className="px-6 py-3"
        >
          Manufacturer
        </th>
        <th
          onClick={() => handleSort('description')}
          scope="col" className="px-6 py-3"
        >
          Description
        </th>
        <th
          onClick={() => handleSort('price')}
          scope="col" className="px-6 py-3"
        >
          Price
        </th>
        <th
          onClick={() => handleSort('diseaseType')}
          scope="col" className="px-6 py-3"
        >
          Disease Type
        </th>
        <th scope="col" className="px-6 py-3">
                    Actions
                </th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={product._id}>
          <td className="px-6 py-4">{product.name}</td>
          <td className="px-6 py-4">{product.manufacturer}</td>
          <td className="px-6 py-4">{product.description}</td>
          <td className="px-6 py-4">${product.price}</td>
          <td className="px-6 py-4">{product.diseaseType}</td>
          <td>
            <button
              onClick={() => handleViewClick(product._id)}
              className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
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
