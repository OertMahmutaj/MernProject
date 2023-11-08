import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserVerify({ isLogedIn, setIsLoggedIn }) {
    const [otp, setUserToken] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId')

    const handleVerify = () => {

        axios.post('http://localhost:8000/api/user/verify-email', { userId, otp }
        ,{ withCredentials: true })
        
            .then((response) => {
                if (response.data.msg === "Email verified") {
                    console.log(response.data);
                    console.log(userId);
                    console.log(otp);
                    localStorage.setItem('isLogedIn', true);
                    setIsLoggedIn(true);
                    setVerificationStatus('Verification successful.');
                    navigate(`/products`)
                } else {
                    console.log(response.data);
                    console.log(userId);
                    console.log(otp);
                }
            })
            .catch((err) => {
                console.log(err);
                err.response.data.msg ? setError(err.response.data.msg) : console.log(err);
              });
    };

    return (
        <div>
            <h2>User Verification</h2>
            <div>
                <label>User Token:</label>
                <input type="text" value={otp} onChange={(e) => setUserToken(e.target.value)} />
            </div>
            <button onClick={handleVerify}>Verify</button>
            {verificationStatus && <p>{verificationStatus}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}
