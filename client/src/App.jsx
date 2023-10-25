import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import LogIn from "./components/Login";
import Logout from "./components/Logout";
import CreateProduct from "./components/CreateProduct";
import ProductList from "./components/ProductList";
import MyProducts from "./components/MyProducts";
import UpdateProduct from "./components/UpdateProduct";
import ProductDetails from "./components/ProductDetails";
import UpdateProfile from "./components/UpdateProfile";
import Map from "./components/Map";
import { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [isLogedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedIsLogedIn = localStorage.getItem("isLogedIn");
    if (storedIsLogedIn === "true") {
      setIsLoggedIn(true);
    }
  }, [isLogedIn]);

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <nav className="bg-blue-500 p-4">
          <div className="flex items-center justify-between">
            <Link to="/products" className="text-white text-2xl font-semibold">
              Pharma
            </Link>
            <ul className="flex space-x-4">
              {isLogedIn ? (
                <li>
                  <Link to="/logout" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
                    Logout
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/register" className="text-white hover:underline">
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-white hover:underline">
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          {isLogedIn ? (
            <>
              <Route path="/logout" element={<Logout isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/create-product" element={<CreateProduct isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/products" element={<ProductList  isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/my-products" element={<MyProducts isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/product/:id/edit" element={<UpdateProduct isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/product/:id" element={<ProductDetails isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/updateprofile/:id" element={<UpdateProfile isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
            </>
          ) : (
            <>
              <Route path="/logout" element={<Logout isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/products" element={<ProductList isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/product/:id" element={<ProductDetails isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/register" element={<Register isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path="/login" element={<LogIn isLogedIn={isLogedIn} setIsLoggedIn={setIsLoggedIn}/>} />
            </>
          )}
        </Routes>
      </BrowserRouter>
  
        <Map />
      </div>
  );
}

export default App;
