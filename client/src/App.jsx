import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import LogIn from "./components/Login";
import Logout from "./components/Logout";
import CreateProduct from "./components/CreateProduct";
import ProductList from "./components/ProductList";
import MyProducts from "./components/MyProducts";
import UpdateProduct from "./components/UpdateProduct"
import ProductDetails from "./components/ProductDetails"
import { useState, useEffect } from "react";
import Main from "./components/Main";
import './styles.css'

function App() {
  const [isLogedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedIsLogedIn = localStorage.getItem("isLogedIn");
    if (storedIsLogedIn === "true") {
      setIsLoggedIn(true);
    }
  }, [isLogedIn])

  return (
    <>
    <Main/>
    {isLogedIn ? <Logout /> : null}
      <BrowserRouter>
        <nav>
        <ul>
            {!isLogedIn && (
              <>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          {isLogedIn ? (
            <>
            <Route path="/logout" element={<Logout />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/product/:id/edit" element={<UpdateProduct />}/>
            <Route path="/product/:id" element={<ProductDetails />}/>
            </>
          ) : (
            <>
            <Route path="/logout" element={<Logout />} />
            <Route path="/product/:id/edit" element={<UpdateProduct />}/>
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/my-products" element={<MyProducts />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />}/>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<LogIn />} />
            </>
          )}
        </Routes>
      </BrowserRouter>

      
    </>
  );
}

export default App;
