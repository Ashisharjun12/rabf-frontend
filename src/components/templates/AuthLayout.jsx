import { Outlet, useLocation, Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const AuthLayout = () => {
    const { user } = useAuthStore();
    const location = useLocation();
    const isSignup = location.pathname === "/signup";

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-background p-6 md:p-12">
            <div className="w-full max-w-[400px]">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
