import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

// Import your components here
import Register from "./components/Register";
import LogIn from "./components/Login";
import Logout from "./components/Logout";
import UserVerify from "./components/UserVerify";
import UpdateProfile from "./components/UpdateProfile";
import ForgotPassword from "./components/ForgotPassword";
import CreateProduct from "./components/CreateProduct";
import ProductList from "./components/ProductList";
import MyReviews from "./components/MyReviews";
import UpdateProduct from "./components/UpdateProduct";
import ProductDetails from "./components/ProductDetails";
import RatingGraph from "./components/RatingGraph";
import ReviewNumberGraph from "./components/ReviewNumberGraph";
import PriceGraph from "./components/PriceGraph";

function App() {
  const [isLogedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const loggedIn = localStorage.getItem('isLoggedIn');

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <BrowserRouter>
        <nav className="bg-gray-200 dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <Link to="/products" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
              Pharma
            </Link>
            <Link to="/ratinggraph" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
              Graphical Representation
            </Link>
            <ul className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              >
                Toggle Dark Mode
              </button>

              {loggedIn ? (
                <li>
                  <Link to="/logout" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                    Logout
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/register" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/reviewnumbergraph" element={<ReviewNumberGraph isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/pricegraph" element={<PriceGraph isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
          {loggedIn ? (
            <>
              <Route path="/ratinggraph" element={<RatingGraph isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/logout" element={<Logout isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/create-product" element={<CreateProduct isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/products" element={<ProductList isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/my-reviews/:id" element={<MyReviews isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/product/:id/edit" element={<UpdateProduct isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/product/:id" element={<ProductDetails isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/updateprofile/:id" element={<UpdateProfile isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
            </>
          ) : (
            <>
              <Route path="/user/forgotpassword" element={<ForgotPassword isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/ratinggraph" element={<RatingGraph isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/products" element={<ProductList isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/user/verify-email" element={<UserVerify isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/product/:id" element={<ProductDetails isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/login" element={<LogIn isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn} />} />
            </>
          )}
        </Routes>
      </BrowserRouter>

      <footer class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="http://localhost:5173/products" class="hover:underline">Oert™</a>. All Rights Reserved.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">About</a>
          </li>
          <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
          </li>
          <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
          </li>
          <li>
            <a href="#" class="hover:underline">Contact</a>
          </li>
        </ul>
      </footer>
      

    </div>
  );
}

export default App;
