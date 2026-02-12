import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // We need useNavigate here, but AuthProvider is usually inside Router in App.jsx.
    // So we assume AuthProvider is child of BrowserRouter
    // But App.jsx usually has BrowserRouter inside it or wrapping it.
    // Let's just handle state here.

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
        // Optional: Call logout API to clear cookie
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
