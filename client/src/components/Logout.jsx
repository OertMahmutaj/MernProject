import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [isLogedIn, setIsLoggedIn] = useState(Boolean);
  // const navigate = useNavigate();

  useEffect(() => {
    const storedIsLogedIn = localStorage.getItem('isLogedIn');
    if (storedIsLogedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:8000/api/logout', { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('isLogedIn');
        // navigate('/products');
        window.location.href = '/register';
      });
  };

  return (
    <div className="text-center">
      <p className="text-gray-800 text-lg my-4">
        {isLogedIn
          ? "You are logged in. Do you want to log out?"
          : "You are already logged out."}
      </p>
      {isLogedIn ? (
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
