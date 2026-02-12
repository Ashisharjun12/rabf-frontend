import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { mobileLogin } from "../api/api";
import { Loader2 } from "lucide-react";

const MobileHandover = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("Authenticating...");
    const { login } = useAuthStore();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("t");

        if (!token) {
            setMessage("Invalid or missing token.");
            setTimeout(() => navigate("/login"), 3000);
            return;
        }

        const handleMobileLogin = async () => {
            try {
                setMessage("Verifying secure link...");
                const { data } = await mobileLogin(token);

                // Login successful
                login(data);
                setMessage("Login successful! Redirecting to verification...");

                // Small delay for UX
                setTimeout(() => {
                    navigate("/verify");
                }, 1000);

            } catch (error) {
                console.error("Mobile login failed", error);
                setMessage(error.response?.data?.message || "Authentication failed. Please login manually.");
                setTimeout(() => navigate("/login"), 3000);
            }
        };

        handleMobileLogin();
    }, [navigate, login]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <p className="text-muted-foreground text-sm">Please do not close this window.</p>
        </div>
    );
};

export default MobileHandover;
