import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Loader2 } from "lucide-react";

import EmailVerificationPending from "../../pages/EmailVerificationPending";

const ProtectedRoute = ({ children }) => {
    const { user, isCheckingAuth } = useAuthStore();
    const location = useLocation();

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user.isAccountVerified) {
        return <EmailVerificationPending />;
    }

    return children;
};

export default ProtectedRoute;
