import { useState, useEffect } from "react";
import BoyfriendCard from "../components/molecules/BoyfriendCard";
import { Skeleton } from "../components/ui/skeleton";
import { Slider } from "../components/ui/slider";
import { Button } from "../components/ui/button";
import { getBoyfriends } from "../api/api";
import { MapPin, Loader2 } from "lucide-react";

// Mock data until API is integrated
const MOCK_BOYFRIENDS = [
    {
        _id: "1",
        name: "Alex",
        age: 24,
        location: "New York, NY",
        pricePerHour: 50,
        images: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVuJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"],
        bio: "Chill guy who loves coffee and long walks.",
        traits: ["Listener", "Funny", "Tall"],
        rating: 4.8
    },
    {
        _id: "2",
        name: "Jordan",
        age: 26,
        location: "Los Angeles, CA",
        pricePerHour: 75,
        images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym95ZnJpZW5kfGVufDB8fDB8fHww"],
        bio: "Actor and fitness enthusiast. Great plus one for events.",
        traits: ["Confident", "Charming", "Dancer"],
        rating: 4.9
    },
    {
        _id: "3",
        name: "Ryan",
        age: 28,
        location: "Chicago, IL",
        pricePerHour: 60,
        images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym95ZnJpZW5kfGVufDB8fDB8fHww"], // Duplicate image for now
        bio: "Software engineer who can fix your printer and your heart.",
        traits: ["Smart", "Techy", "Patient"],
        rating: 4.7
    }
];

const BoyfriendList = () => {
    const [boyfriends, setBoyfriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [distance, setDistance] = useState(50); // km
    const [location, setLocation] = useState(null);
    const [useLocation, setUseLocation] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBoyfriends = async () => {
        try {
            let params = {
                page: currentPage,
                limit: itemsPerPage
            };
            if (useLocation && location) {
                params = {
                    ...params,
                    lat: location.latitude,
                    lng: location.longitude,
                    dist: distance
                };
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await getBoyfriends(params);
            // API now returns { boyfriends, totalPages, currentPage }
            setBoyfriends(response.data.boyfriends || []);
            setTotalPages(response.data.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching boyfriends:", error);
            setLoading(false);
        }
    };

    // Debounce search
    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchBoyfriends();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [location, useLocation, distance, currentPage, searchTerm]);

    const currentBoyfriends = boyfriends;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [locating, setLocating] = useState(false);

    // ... existing code ...

    const handleEnableLocation = () => {
        if (!useLocation) {
            if (navigator.geolocation) {
                setLocating(true);
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        setUseLocation(true);
                        setLocating(false);
                    },
                    (error) => {
                        console.error("Error getting location", error);
                        alert("Could not get location. please enable location services.");
                        setLocating(false);
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        } else {
            setUseLocation(false);
            setLocation(null);
        }
    };

    return (
        <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Available Boyfriends</h1>
                    <p className="text-muted-foreground max-w-lg">Find the perfect companion for any occasion. Verified, safe, and platonic.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-end">
                    {/* Search Input */}
                    <div className="w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search name, location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant={useLocation ? "secondary" : "outline"}
                            onClick={handleEnableLocation}
                            disabled={locating}
                            className={`rounded-xl whitespace-nowrap gap-2 ${useLocation ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" : ""}`}
                        >
                            {locating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Capturing...
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-4 h-4" />
                                    {useLocation ? "GPS Enabled" : "Enable GPS"}
                                </>
                            )}
                        </Button>

                        {useLocation && (
                            <div className="flex items-center gap-4 bg-secondary/30 px-4 py-2 rounded-xl border border-border/50 animate-in fade-in slide-in-from-left-4 duration-300">
                                <span className="text-sm font-medium whitespace-nowrap min-w-[80px]">
                                    Within {distance} km
                                </span>
                                <div className="w-32 sm:w-48">
                                    <Slider
                                        value={[distance]}
                                        min={1}
                                        max={500}
                                        step={1}
                                        onValueChange={(val) => setDistance(val[0])}
                                        className="py-2"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-[400px] w-full rounded-[2rem]" />
                            <div className="space-y-2 px-2">
                                <Skeleton className="h-6 w-[60%]" />
                                <Skeleton className="h-4 w-[40%]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {boyfriends.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-lg font-medium">No results found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                            {useLocation && <Button variant="link" onClick={() => setDistance(500)}>Increase Range</Button>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px] content-start">
                            {currentBoyfriends.map((boyfriend) => (
                                <BoyfriendCard key={boyfriend._id} boyfriend={boyfriend} />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-full w-24"
                            >
                                Previous
                            </Button>

                            <div className="flex items-center gap-1 mx-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentPage === page
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-full w-24"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BoyfriendList;
