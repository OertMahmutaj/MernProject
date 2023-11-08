import axios from "axios";
import { useEffect, useState } from "react";

const Logout = ({setIsLoggedIn}) => {

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  const handleLogout = () => {
    axios.post('http://localhost:8000/api/logout', {},{ withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/register';
      });
      
  };

  const handleLogoutAll = () => {
    axios.post('http://localhost:8000/api/logout/all', {},{ withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('storedEmail');
        
        window.location.href = '/register';
      });
      
  };

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <p className="block mb-2 text-xxl font-medium text-gray-900 dark:text-white">
        {isLoggedIn
          ? "You are logged in. Do you want to log out?"
          : "You are already logged out."}
      </p>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
        >
          Log me Out
        </button>
      ) : null}
      {isLoggedIn ? (
      <button
        onClick={handleLogoutAll}
        className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
      >
        Logout/Dont remember
      </button>
    ) : null}
    </div>
    
  );
};

export default Logout;
