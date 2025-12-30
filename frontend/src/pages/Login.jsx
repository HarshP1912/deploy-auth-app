import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value);
        const copyloginInfo = { ...loginInfo };
        copyloginInfo[name] = value;
        setLoginInfo(copyloginInfo);
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError("Enter Valid Credentials");
        }
        try {
            const url = "https://deploy-auth-app-api-ten.vercel.app/login";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginInfo),
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem("token", jwtToken);
                localStorage.setItem("loggedInUser", name);
                setTimeout(() => {
                    navigate("/home");
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
    // console.log("login Info -> ",loginInfo)
    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={loginInfo.password}
                    />
                </div>
                <button>Login</button>
                <span>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
