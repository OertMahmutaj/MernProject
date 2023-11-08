import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyReviews = () => {
  const [userReviews, setUserReviews] = useState([]);
  const userId = localStorage.getItem('userId');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/my-reviews/${userId}`, {
      withCredentials: true,
    })
      .then((response) => {
        setUserReviews(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user reviews:', error);
      });
  }, [userId]);

  return (
    <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'dark' : ''}`}>
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">Your Reviews</h2>
      <div className="grid gap-4">
        {userReviews.map((review) => (
          <div key={review._id} className={`border p-4 rounded-md ${darkMode ? 'dark' : ''}`}>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">Product: {review.product.name}</h3>
            <p className="text-blue-900 dark:text-blue-400">Rating: {review.rating}</p>
            <p className="text-gray-700 dark:text-gray-300">Comment: {review.comment}</p>
            <img src={review.product.image} alt='' width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviews;
