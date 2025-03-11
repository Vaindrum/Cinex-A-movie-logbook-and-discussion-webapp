import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token); 
            navigate("/"); // Redirect to home
        } else {
            navigate("/"); // placeholder - will set something here later on
        }
    }, [navigate]);

    return <p>Logging in...</p>;
};

export default AuthSuccess;
