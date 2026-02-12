import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import UserAvatar from "../ui/user-avatar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import useAuthStore from "../../store/authStore";
import { motion } from "framer-motion";
import { LogOut, User, Bell, Check } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { notifications, unreadCount, markAllRead } = useNotification();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleNotificationClick = (link) => {
        navigate(link || "/bookings");
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-4 left-0 right-0 z-50 mx-auto w-[95%] max-w-7xl rounded-full border bg-background/80 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container flex h-16 items-center px-6 relative">
                {/* Logo - Absolute Left */}
                <div className="absolute left-6">
                    <Link to="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
                        Rent-A-Boyfriend
                    </Link>
                </div>

                {/* Centered Links */}
                <div className="hidden md:flex items-center justify-center w-full gap-8 text-sm font-medium">
                    <Link to="/boyfriends" className="transition-colors hover:text-primary">
                        Browse
                    </Link>
                    {user && (
                        <Link to="/bookings" className="transition-colors hover:text-primary">
                            Bookings
                        </Link>
                    )}
                    {user && (
                        <Link to="/chats" className="transition-colors hover:text-primary">
                            Chats
                        </Link>
                    )}
                    <Link to="/about" className="transition-colors hover:text-primary">
                        How it works
                    </Link>
                </div>

                {/* Right Side - Absolute Right */}
                <div className="absolute right-6 flex items-center gap-3">
                    <ModeToggle />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Popover onOpenChange={(open) => { if (!open) markAllRead(); }}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0" align="end">
                                    <div className="p-4 border-b flex justify-between items-center bg-muted/20">
                                        <h4 className="font-semibold text-sm">Notifications</h4>
                                        {unreadCount > 0 && (
                                            <Button variant="ghost" size="xs" onClick={markAllRead} className="h-auto px-2 py-1 text-xs text-primary">
                                                Mark all read
                                            </Button>
                                        )}
                                    </div>
                                    <ScrollArea className="h-[300px]">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                                                <Bell className="w-8 h-8 opacity-20" />
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {notifications.map((notif, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-4 hover:bg-muted/50 cursor-pointer transition-colors flex gap-3 items-start"
                                                        onClick={() => handleNotificationClick(notif.link)}
                                                    >
                                                        <div className="mt-1 bg-primary/10 p-1.5 rounded-full shrink-0">
                                                            <Bell className="w-3.5 h-3.5 text-primary" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm leading-tight">{notif.message}</p>
                                                            {/* We could add time here if we stored it in context */}
                                                            <p className="text-[10px] text-muted-foreground">Just now</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </PopoverContent>
                            </Popover>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full" size="icon">
                                        <UserAvatar user={user} className="h-10 w-10 border-2 border-primary/10 transition-all hover:border-primary/50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {user.role === 'boyfriend' ? (
                                        <DropdownMenuItem asChild>
                                            <Link to="/boyfriends/me" className="cursor-pointer font-medium w-full">My Boyfriend Profile</Link>
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem asChild>
                                            <Link to="/profile" className="cursor-pointer font-medium w-full">Profile</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="md:hidden" />
                                    <DropdownMenuItem asChild className="md:hidden">
                                        <Link to="/bookings" className="cursor-pointer font-medium w-full">Bookings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="md:hidden">
                                        <Link to="/chats" className="cursor-pointer font-medium w-full">Chats</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="md:hidden">
                                        <Link to="/boyfriends" className="cursor-pointer font-medium w-full">Browse Boyfriends</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 font-medium cursor-pointer">
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="rounded-full">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm" variant="default" className="rounded-full hover:opacity-90">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
