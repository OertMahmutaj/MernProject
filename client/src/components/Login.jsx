import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha"


const LogIn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState('');
  const captchaRef = useRef()

  const [validationErrors, setValidationErrors] = useState({});

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const newRecaptchaValue = captchaRef.current.getValue();
    setRecaptchaValue(newRecaptchaValue);
    captchaRef.current.reset();

    axios
      .post('http://localhost:8000/api/login', {
        email,
        password,
        recaptchaValue: newRecaptchaValue,
      }, {
        withCredentials: true
      })
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setValidationErrors({});
          setIsLoggedIn(true)
          localStorage.setItem('isLoggedIn', true);
          localStorage.setItem('userId', res.data.userId);
          navigate('/products');
        } else {
          console.error('Response no data:', response);
        }
      })
      .catch((error) => {
        console.error(error);

        if (error.response && error.response.data.errors) {
          setValidationErrors(error.response.data.errors);
        } else {
          console.error('No errors', error.response);
        }
      });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#" onSubmit={onSubmitHandler}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  
                />
                {validationErrors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{validationErrors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  
                />
                {validationErrors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{validationErrors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="/user/forgotpassword" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">Forgot password?</a>
              </div>
              <ReCAPTCHA
                sitekey={sitekey}
                ref={captchaRef}
                // width={30}
              />
              {validationErrors.reCaptcha ? <p className="mt-2 text-sm text-red-600 dark:text-red-500">{validationErrors.reCaptcha.message}</p> : ""}
              <button
                type="submit"
                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogIn;
