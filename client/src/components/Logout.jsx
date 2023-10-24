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
        window.location.href = '/';
      });
  };

  return (
    <div>
      <p>{isLogedIn ? "You are logged in." : "You are already logged out."}</p>
      {isLogedIn ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : null}
    </div>
  );
};

export default Logout;
