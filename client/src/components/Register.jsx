import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons'; 
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [terms, setTerms] = useState(false)
    const [val, setVal] = useState({})
    const [loged, setStateLoged] = useState(false);
    const [unique, setUnique] = useState({})
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePicture, setprofilePicture] = useState("");
    const [imgErr, setImgErr] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleImageUpload = (e) => {
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = function () {
            console.log(reader.result);
            setprofilePicture(reader.result);
        };
        reader.onerror = error =>{
            console.log("Error" , error);
        }
    };
    const handleImageUploadClick = () => {
        const fileInput = document.getElementById('profile-picture');
        if (fileInput) {
          fileInput.click();
        }
      };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/register', {
            name,
            email,
            password,
            confirmPassword,
            terms,
            profilePicture,
        }, { withCredentials: true })
            .then(res => {
                console.log(res);
                console.log(res.data);

                setVal({})
                localStorage.setItem('isLogedIn', true);
                localStorage.setItem('userId', res.data.userId);
                setStateLoged(true)
                navigate("/products")
            })
            .catch((err) => {
                if (err.response && err.response.status === 413) {
                  console.log("Payload Too Large Error:", err.response.statusText);
                  setImgErr(err.response.statusText);
                } else {
                  const errorMessage = err.response?.data?.message || "An error occurred.";
                  console.log(errorMessage);
                  setUnique(err.response);
                  
                  const validationErrors = err.response?.data?.errors;
                  if (validationErrors) {
                    console.log(validationErrors);
                    setVal(validationErrors);
                  }
                }
              });
            // .catch(err => { err.response.data.message ? setUnique(err.response) : err.response.data.errors; err.response.data.errors ? setVal(err.response.data.errors) : console.log(err.response) & console.log(unique.data.message) & console.log(err.response) })
    }

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
                        Pharma
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create an Account
                            </h1>
                            

                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={onSubmitHandler}>
                            <div>
                            <label htmlFor="profile-picture" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Profile Picture
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                type="file"
                                id="profile-picture"
                                name="profilePicture"
                                accept="image/jpeg, image/png"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }} // Hide the file input
                                />
                                <label htmlFor="profile-picture" className="cursor-pointer text-primary-600">
                                Upload Profile Picture
                                </label>
                                {profilePicture && (
                                <img
                                    width={70}
                                    height={70}
                                    src={profilePicture}
                                    alt="Profile Picture"
                                    className="rounded-full"
                                />
                                )}
                            </div>
                            {profilePicture === "" || profilePicture === null ? (
                            ""
                        ) : imgErr === "Payload Too Large" ? (
                            <div>
                                <p className="text-sm text-red-500">Profile picture is too large, maximum allowed 2 Mb</p>
                                <img width={100} height={100} src={profilePicture} alt="Profile Picture" />
                            </div>
                        ) : profilePicture === "" || profilePicture === null ? (
                            ""
                        ) : (
                            <img width={100} height={100} src={profilePicture} alt="Profile Picture" />
                        )}
                        {unique.data?.message === "Invalid base64 format for profilePicture" ? (
                            <p className="text-sm text-red-500">Profile picture must be an image</p>
                        ) : null}
                            </div>
                                <div>

                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                    <input type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" onChange={(e) => setName(e.target.value)} />
                                    {val.name ? <p className="text-sm text-red-500 ">{val.name.message}</p> : ""}
                                </div>
                                <div>

                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
                                    onChange={(e) => setEmail(e.target.value)} />
                                    {val.email && unique.data?.message !== 'Email already in use' ? (
                                    <p className="text-sm text-red-500">{val.email.message}</p>
                                    ) : unique.data?.message === 'Email already in use' ? (
                                    <p className="text-sm text-red-500">{unique.data.message}</p>
                                    ) : null}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={(e) => setPassword(e.target.value)}
                                        
                                    />
                                    {val.password ? <p className="text-sm text-red-500 ">{val.password.message}</p> : ""}
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirm-passwor"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {val.confirmPassword ? <p className="text-sm text-red-500 ">{val.confirmPassword.message}</p> : ""}
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                    </button>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" onChange={(e) => setTerms(e.target.checked)} />
                                        {val.terms ? <p className="text-sm text-red-500 ">{val.terms.message}</p> : ""}
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                    </div>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Link
                                        to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}
export default Register;

