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

  return (
    <div className="text-center">
      <p className="text-gray-800 text-lg my-4">
        {isLoggedIn
          ? "You are logged in. Do you want to log out?"
          : "You are already logged out."}
      </p>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Log me Out
        </button>
      ) : null}
    </div>
  );
};

export default Logout;
