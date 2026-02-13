import useAuthStore from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { Lock, MapPin, Star } from "lucide-react";
import verifyIcon from "../../assets/verify.png";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const BoyfriendCard = ({ boyfriend }) => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (!user) {
            navigate("/login");
        } else {
            navigate(`/boyfriends/${boyfriend._id}`);
        }
    };

    return (
        <Card
            onClick={handleCardClick}
            className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 shadow-sm rounded-[2rem] bg-card h-full flex flex-col cursor-pointer"
        >
            <div className="aspect-[4/3] overflow-hidden relative">
                <img
                    src={boyfriend.profileImage || boyfriend.images?.[0] || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym95ZnJpZW5kfGVufDB8fDB8fHww"}
                    alt={boyfriend.name}
                    className={`object-cover w-full h-full transition-transform duration-700 ${user ? 'group-hover:scale-105' : 'blur-md scale-110'}`}
                />
                {!user && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 backdrop-blur-[2px]">
                        <Lock className="w-8 h-8 text-white mb-2 dropdown-shadow" />
                        <span className="text-white font-bold text-sm bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">Login to View</span>
                    </div>
                )}
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md text-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-sm z-20">
                    ₹{boyfriend.pricePerHour}/hr
                </div>
            </div>

            <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="font-bold text-2xl tracking-tight flex items-center gap-1.5">
                            {boyfriend.name}, {boyfriend.age}
                            {boyfriend.user?.isVerified && (
                                <img src={verifyIcon} alt="Verified" className="w-5 h-5 object-contain" />
                            )}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                            <span className="truncate max-w-[200px]">
                                {typeof boyfriend.location === 'string' ? boyfriend.location : boyfriend.location?.address || "Unknown Location"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full text-amber-700 dark:text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                        {boyfriend.rating || 4.5}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed break-words line-clamp-2">
                    {boyfriend.bio}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                    {boyfriend.traits?.slice(0, 3).map((trait, index) => (
                        <div key={index} className="px-3 py-1 rounded-full bg-secondary/60 text-secondary-foreground text-[11px] font-semibold tracking-wide">
                            {trait}
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button className="w-full rounded-full h-11 text-sm font-medium shadow-none hover:shadow-md transition-all cursor-pointer" variant="default">
                    View Profile
                </Button>
            </CardFooter>
        </Card>
    );
};

export default BoyfriendCard;
