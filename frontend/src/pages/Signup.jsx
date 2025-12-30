import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
function Signup() {
    const [signupInfo, setsignupInfo] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value);
        const copysignupInfo = { ...signupInfo };
        copysignupInfo[name] = value;
        setsignupInfo(copysignupInfo);
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError("Enter Valid Credentials");
        }
        try {
            const url = "http://localhost:8080/auth/signup";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupInfo),
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else if (error) {
                const detail = error?.details[0].message;
                handleError(detail);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (error) {
            handleError(err);
        }
    };
    // console.log("login Info -> ",signupInfo)
    return (
        <div className="container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Name"
                        name="name"
                        value={signupInfo.name}
                        autoFocus
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={signupInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={signupInfo.password}
                    />
                </div>
                <button>Sign Up</button>
                <span>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
