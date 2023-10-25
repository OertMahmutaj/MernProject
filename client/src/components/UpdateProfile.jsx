import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons'; 
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const UpdateProfile = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [val, setVal] = useState({})
    const [unique, setUnique] = useState({})
    const [profilePicture, setprofilePicture] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [imgErr, setImgErr] = useState({});
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        // profilePicture: '',
      });

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${id}`, { withCredentials: true })
        .then(res => {
            setUserData(res.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [id]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleImageUpload = (e) => {
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = function () {
            console.log(reader.result);
            setprofilePicture(reader.result);
            console.log(profilePicture);
        };
        reader.onerror = error =>{
            console.log("Error" , error);
        }
    };
    console.log(profilePicture);
    const onSubmitHandler = (e) => {
        console.log(profilePicture);
        e.preventDefault();
        axios.patch(`http://localhost:8000/api/updateprofile/${id}`,{userData, profilePicture}, { withCredentials: true })
            .then(res => {
                setUserData(res.data);
                console.log(res);
                console.log(res.data);
                
                setVal({})
                
                navigate("/products")
            })
            .catch(err => {
                if (err.response && err.response.status === 413) {
                    
                    console.log("Payload Too Large Error:", setImgErr(err.response.statusText));
                } else if (err.response && err.response.data.message) {
                    setUnique(err.response);
                } else if (err.response && err.response.data.errors) {
                    setVal(err.response.data.errors);
                } else {
                    console.log(err.response);
                    console.log(unique.data.message);
                    console.log(err.response);
                }
            });
    }

    return (
        <>
        <Link to="/products" className="btn">
          Products
        </Link>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
                        Pharma
                    </a>
                    <img src={userData.profilePicture} alt="" />
                    <div>
                        <input
                            type="file"
                            id="profile-picture"
                            name="profilePicture"
                            accept="image/jpeg, image/png"
                            onChange={handleImageUpload}
                        />
                        {userData.profilePicture === "" || userData.profilePicture === null ? (
                            ""
                        ) : imgErr === "Payload Too Large" ? (
                            <div>
                                <p className="text-sm text-red-500">Profile picture is too large, maximum allowed 2 Mb</p>
                                <img width={100} height={100} src={userData.profilePicture} alt="Profile Picture" />
                            </div>
                        ) : userData.profilePicture === "" || userData.profilePicture === null ? (
                            ""
                        ) : (
                            <img width={100} height={100} src={userData.profilePicture} alt="Profile Picture" />
                        )}
                        {unique.data?.message === "Invalid base64 format for profilePicture" ? (
                            <p className="text-sm text-red-500">Profile picture must be an image</p>
                        ) : null}
                        {/* <button type="button" onClick={handleImageUploadClick}>
                            Upload Profile Picture
                            </button> */}
                    </div>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Update Your Account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={onSubmitHandler}>
                            <div>
                                    
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" 
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value }, console.log(userData.name))} 
                                    />
                                    {val.name ? <p className="text-sm text-red-500 ">{val.name.message}</p> : ""}
                                </div>
                                <div>
                                    
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
                                    value={userData.email} 
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                                    {val.email && unique.data?.message !== 'Email already in use' ? (
                                    <p className="text-sm text-red-500">{val.email.message}</p>
                                    ) : unique.data?.message === 'Email already in use' ? (
                                    <p className="text-sm text-red-500">{unique.data.message}</p>
                                    ) : null}
                                </div>
                                <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <div className="flex items-center">
                                    <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    />
                                    <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 text-gray-600 cursor-pointer"
                                    >
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                    </button>
                                </div>
                                {val.password ? <p className="text-sm text-red-500 ">{val.password.message}</p> : ""}
                                </div>                                
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}
export default UpdateProfile;

