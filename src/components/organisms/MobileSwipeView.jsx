import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Info, Undo2 } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import verifyIcon from "../../assets/verify.png";

const MobileSwipeView = ({ boyfriends, userLocation }) => {
    const [index, setIndex] = useState(0);
    const [exitX, setExitX] = useState(0);
    const navigate = useNavigate(); // Added hook

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
        clamp: false,
    });

    const controls = useAnimation();

    const currentProfile = boyfriends[index];

    // Distance Calculation Helper
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;

        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    };

    const handleDragEnd = async (event, info) => {
        const threshold = 100;

        if (info.offset.x < -threshold) {
            // Swipe Left -> Previous
            if (index > 0) {
                setExitX(-200);
                await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
                setIndex(index - 1);
            } else {
                // Bounce back if no previous
                controls.start({ x: 0, opacity: 1, transition: { type: "spring" } });
            }
        } else if (info.offset.x > threshold) {
            // Swipe Right -> Next
            if (index < boyfriends.length - 1) {
                setExitX(200);
                await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
                setIndex(index + 1);
            } else {
                // Bounce back if no next
                controls.start({ x: 0, opacity: 1, transition: { type: "spring" } });
            }
        } else {
            // Bounce back if threshold not met
            controls.start({ x: 0, opacity: 1, transition: { type: "spring" } });
        }
    };

    const swipe = async (direction) => {
        if (direction === "left") {
            if (index > 0) {
                setExitX(-200);
                await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
                setIndex(index - 1);
            }
        } else {
            if (index < boyfriends.length - 1) {
                setExitX(200);
                await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
                setIndex(index + 1);
            }
        }
    };

    const handleTap = (event, info) => {
        // Navigate to profile on tap
        navigate(`/boyfriends/${currentProfile._id}`);
    };

    useEffect(() => {
        // Reset animation state for new card
        x.set(0);
        controls.set({ x: 0, opacity: 1 });
    }, [index, controls, x]);

    if (!currentProfile) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center animate-pulse">
                    <ArrowRight className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold">No profiles found</h3>
                <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full mt-4">
                    Refresh List
                </Button>
            </div>
        );
    }

    // Calculate distance for current profile
    const distanceKm = userLocation && currentProfile.location?.coordinates
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            currentProfile.location.coordinates[1], // Lat
            currentProfile.location.coordinates[0]  // Lng
        )
        : null;

    // Fallback logic
    const displayDistance = distanceKm || (
        userLocation && currentProfile.latitude && currentProfile.longitude
            ? calculateDistance(userLocation.latitude, userLocation.longitude, currentProfile.latitude, currentProfile.longitude)
            : null
    );


    return (
        <div className="relative w-full max-w-sm mx-auto h-[70vh] flex flex-col items-center justify-center">

            {/* Card Stack / Navigation Hint */}
            <div className="absolute top-0 w-full flex justify-between px-4 text-xs text-muted-foreground z-10 uppercase tracking-widest font-semibold opacity-50">
                <span>{index > 0 ? "← Prev" : ""}</span>
                <span>{index < boyfriends.length - 1 ? "Next →" : ""}</span>
            </div>

            <div className="relative w-full h-[500px] perspective-1000">

                {/* Active Card (Foreground) */}
                {/* Active Card (Foreground) */}
                <motion.div
                    style={{ x, rotate }}
                    animate={controls}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="absolute top-0 left-0 w-full h-full bg-background rounded-3xl border shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col"
                >
                    {/* Image Section - Tap to View Profile */}
                    <motion.div
                        onTap={handleTap}
                        className="relative h-[65%] w-full bg-muted cursor-pointer"
                    >
                        <img
                            src={currentProfile.profileImage || currentProfile.images[0]}
                            alt={currentProfile.name}
                            className="w-full h-full object-cover pointer-events-none"
                        />

                        {/* Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

                        {/* Price Tag */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold pointer-events-none">
                            ₹{currentProfile.pricePerHour}/hr
                        </div>

                        {/* Info Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white pointer-events-none">
                            <h2 className="text-3xl font-extrabold flex items-center gap-2 drop-shadow-md">
                                {currentProfile.name}, {currentProfile.age}
                                {currentProfile.user?.isVerified && (
                                    <img src={verifyIcon} className="w-6 h-6" alt="Verified" />
                                )}
                            </h2>
                            <div className="flex items-center gap-1 text-white/90 text-sm mt-1 drop-shadow-md font-medium">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                {displayDistance ? (
                                    <span>{displayDistance} km away</span>
                                ) : (
                                    <span>{currentProfile.location?.address || currentProfile.location}</span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Section */}
                    <div className="flex-1 p-4 bg-background flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {currentProfile.traits?.slice(0, 3).map((trait, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2">{currentProfile.bio}</p>
                        </div>

                        <Link to={`/boyfriends/${currentProfile._id}`} className="w-full">
                            <Button variant="outline" className="w-full rounded-xl gap-2 h-10 mt-2">
                                <Info className="w-4 h-4" /> View Full Profile
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 mt-8">
                <Button
                    size="icon"
                    variant="outline"
                    className="h-14 w-14 rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                    onClick={() => swipe("left")}
                    disabled={index === 0}
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>

                <div className="text-sm font-medium text-muted-foreground/50 tabular-nums">
                    {index + 1} / {boyfriends.length}
                </div>

                <Button
                    size="icon"
                    variant="outline"
                    className="h-14 w-14 rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                    onClick={() => swipe("right")}
                    disabled={index === boyfriends.length - 1}
                >
                    <ArrowRight className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
};

export default MobileSwipeView;
