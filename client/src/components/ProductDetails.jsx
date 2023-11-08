import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const [val, setVal] = useState('');
  const [reviewErr, setReviewErr] = useState(0);
  const [loginErr, setLoginErr] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    reviews: [],
  });

  const [userRating, setUserRating] = useState(1);
  const [userComment, setUserComment] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product/${id}`)
      .then((res) => {
        setProductData(res.data);
        setReviewErr(res.data.reviews.length);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  }, [id]);

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/product/${id}/add-review`,
        {
          userId,
          rating: userRating,
          comment: userComment,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log('Review added successfully');
        setUserRating(1);
        setUserComment('');
        setVal('');
        navigate('/products')
      }
    } catch (error) {
      console.log(error);
      error.response.data.verified === false
        ? setVal('Please Log in to submit a review')
        : setVal(
            error.response.data.error.errors[`reviews.${reviewErr}.comment`]
              .message
          );

      console.log('Error submitting review:', error.response.data.errors["reviews.1.comment"].message);
    }
  };

  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="mb-6">
      <div className="container mx-auto py-8">
        <nav className="nav mb-4">
          <Link to="/products" className="w-1/6  text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
            Products
          </Link>
        </nav>
        <div>
          <p className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Product Details</p>
          <div className="flex flex-col space-y-4">
            <img src={productData.productImage} alt={productData.name} width={200} height={100} />
            <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <span className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Name:</span><br />
              <span id="product-name" className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {productData.name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Description:</span><br />
              <span id="product-description" className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {productData.description}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Price:</span><br />
              <span id="product-price" className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                ${productData.price}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Reviews: </span><br />
              <ul>
                {productData.reviews.map((review, index) => (
                  <li className='font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white' key={index}>
                    <strong>User Rating: {review.rating}</strong>
                    <p>{review.comment}</p>
                    <strong>User: {review.user?.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>Add Your Review:</h3>
              <label htmlFor="ratingDropdown" className=" font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Rating:
              </label>
              <select
                id="ratingDropdown"
                value={userRating}
                onChange={(e) => setUserRating(e.target.value)}
                className="w-1/6  text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              >
                {ratingOptions.map((option) => (
                  <option className='font-bold leading-tight tracking-tight text-gray-900 md: dark:text-white' key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {val && <p className="text-sm text-red-500">{val}</p>}
              <textarea
                placeholder="Comment"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                onClick={handleReviewSubmit}
                className="w-1/6  text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
