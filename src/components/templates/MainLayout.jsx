import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

import BoyfriendProfileCTA from "../molecules/BoyfriendProfileCTA";

const MainLayout = () => {
    const location = useLocation();
    const showFooter = location.pathname === "/" || location.pathname === "/about";

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1 pt-24">
                <BoyfriendProfileCTA />
                <Outlet />
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
