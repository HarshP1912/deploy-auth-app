import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Home() {
    const [loggedInUser, setLoggedInUser] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const handleLogout = (e) => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        handleSuccess("Logged Out Successfully");
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    };
    useEffect(() => {
        setLoggedInUser(localStorage.getItem("loggedInUser"));
    }, []);
    const fetchProducts = async () => {
        try {
            const url = "https://deploy-auth-app-api-ten.vercel.app/products";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const result = await response.json();
            console.log(result);
            setProducts(result);
        } catch (error) {
            handleError(error);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <div>
            <h1>{loggedInUser}</h1>
            <div>
                {products && products?.map((item,index) => (
                    <ul key={index}>
                        <li>
                            {item.name} : {item.price}
                        </li>
                    </ul>
                ))}
            </div>
            <button onClick={handleLogout}>Logout</button>
            <ToastContainer />
        </div>
    );
}

export default Home;
