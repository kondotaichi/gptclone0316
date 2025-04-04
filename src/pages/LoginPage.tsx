import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
    const navigate = useNavigate();
    const [, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            navigate("/chat");
        }
    }, [navigate]);

    const handleLogin = async (credentialResponse: any) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/google`, { token: credentialResponse.credential });
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/chat");
        } catch (error) {
            console.error("Googleログインエラー:", error);
        }
    };

    return (
        <div className="login-container">
            <h1>ChatGPT App</h1>
            <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Login Failed")} />
        </div>
    );
};

export default LoginPage;
