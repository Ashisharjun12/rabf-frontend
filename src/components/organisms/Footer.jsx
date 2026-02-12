import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:px-8 px-4">
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <span className="text-lg font-bold">Rent-A-Boyfriend</span>
                    <p className="text-sm text-muted-foreground">
                        Find your perfect companion for any occasion.
                    </p>
                </div>
                <div className="flex gap-4 text-sm font-medium text-muted-foreground">
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/privacy" className="hover:underline">Privacy</Link>
                    <Link to="/terms" className="hover:underline">Terms</Link>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                </div>
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} RentYourDate. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
