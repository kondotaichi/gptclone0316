import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem("user");
        navigate("/"); // ログアウト後にログインページへ遷移
    };

    return (
        <nav className="navbar">
            <h1>ChatGPT App</h1>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
    );
};

export default Navbar;
