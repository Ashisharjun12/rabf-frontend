import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { MapPin, Star, Heart, ArrowLeft, Instagram, MessageCircle } from "lucide-react";
import verifyIcon from "../assets/verify.png";
import BookingModal from "../components/molecules/BookingModal";
import { Skeleton } from "../components/ui/skeleton";
import { getBoyfriendById, createReview, getReviews } from "../api/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";

const BoyfriendProfile = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [boyfriend, setBoyfriend] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [mainImage, setMainImage] = useState("");

    const [reviews, setReviews] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewTotalPages, setReviewTotalPages] = useState(1);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (id === "preview") return;

        const fetchData = async () => {
            try {
                const [boyfriendRes, reviewsRes] = await Promise.all([
                    getBoyfriendById(id),
                    getReviews(id, 1)
                ]);

                setBoyfriend(boyfriendRes.data);
                if (boyfriendRes.data.images && boyfriendRes.data.images.length > 0) {
                    setMainImage(boyfriendRes.data.images[0]);
                }

                setReviews(reviewsRes.data.reviews || []);
                setReviewTotalPages(reviewsRes.data.pages || 1);
            } catch (err) {
                console.error("Failed to fetch profile data", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleLoadMoreReviews = async () => {
        const nextPage = reviewPage + 1;
        try {
            const { data } = await getReviews(id, nextPage);
            setReviews([...reviews, ...data.reviews]);
            setReviewPage(nextPage);
        } catch (err) {
            console.error("Failed to load more reviews", err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const { data } = await createReview({
                boyfriendId: id,
                rating: newReview.rating,
                comment: newReview.comment
            });

            // Add new review to top of list
            setReviews([data, ...reviews]);
            setNewReview({ rating: 5, comment: "" });
            toast("Review submitted successfully!");
        } catch (err) {
            console.error("Review submission failed", err);
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="container py-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    );

    if (error || !boyfriend) return (
        <div className="container py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Boyfriend not found</h2>
            <Link to="/boyfriends">
                <Button variant="outline">Back to browse</Button>
            </Link>
        </div>
    );


    return (
        <div className="container max-w-6xl py-8 px-4 md:px-8">
            {/* ... (Header and Profile Images - keep as is) ... */}

            <Link to="/boyfriends" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Boyfriends
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Images */}
                <div className="space-y-6">
                    <div className="aspect-[3/4] overflow-hidden rounded-[2rem] border-0 shadow-sm bg-muted/20 relative group">
                        <img
                            src={mainImage || boyfriend.profileImage || boyfriend.images?.[0] || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60"}
                            alt={boyfriend.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    {/* Gallery Grid */}
                    {boyfriend.images && boyfriend.images.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 px-1">Gallery</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {boyfriend.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setMainImage(img)}
                                        className={`relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${mainImage === img ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-90'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 flex items-center gap-2">
                                    {boyfriend.name}, {boyfriend.age}
                                    {boyfriend.user?.isVerified && (
                                        <img src={verifyIcon} alt="Verified" className="w-8 h-8 object-contain" />
                                    )}
                                </h1>
                                <div className="flex items-center text-muted-foreground text-lg">
                                    <MapPin className="w-5 h-5 mr-1" />
                                    {typeof boyfriend.location === 'string' ? boyfriend.location : boyfriend.location?.address || "Location Hidden"}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full text-amber-600 dark:text-amber-400 font-bold mb-2">
                                    <Star className="w-4 h-4 fill-current" />
                                    {boyfriend.rating ? boyfriend.rating.toFixed(1) : "New"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {boyfriend.traits?.map((trait, i) => (
                            <Badge key={i} variant="secondary" className="px-4 py-1.5 text-sm rounded-full bg-secondary/50 font-medium">
                                {trait}
                            </Badge>
                        ))}
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-xl font-semibold mb-3">About Me</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {boyfriend.bio}
                        </p>
                    </div>

                    {/* Booking & Chat Card */}
                    <div className="bg-card border shadow-sm rounded-3xl p-6 sm:p-8 mt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Hourly Rate</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">₹{boyfriend.pricePerHour}</span>
                                    <span className="text-muted-foreground">/ hr</span>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full h-14 w-14 p-0 border-2"
                                    title="Chat with me"
                                >
                                    <Link to={`/chats/${boyfriend.user?._id || ''}`}>
                                        <MessageCircle className="w-6 h-6" />
                                    </Link>
                                </Button>
                                {boyfriend.instagram && (
                                    <a
                                        href={`https://instagram.com/${boyfriend.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-14 w-14 rounded-full border-2 flex items-center justify-center text-muted-foreground hover:text-pink-600 hover:border-pink-600 transition-colors"
                                    >
                                        <Instagram className="w-6 h-6" />
                                    </a>
                                )}
                                <Button
                                    size="lg"
                                    className="flex-1 sm:flex-none rounded-full h-14 px-8 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                    onClick={() => setIsBookingOpen(true)}
                                >
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="pt-8 border-t space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Reviews</h3>

                            {/* Write Review Form - Only if logged in */}
                            {user ? (
                                <form onSubmit={handleSubmitReview} className="bg-muted/30 p-4 rounded-xl mb-6 space-y-3">
                                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Write a Review</h4>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className={`transition-colors ${star <= newReview.rating ? 'text-amber-500' : 'text-muted-foreground/30'}`}
                                            >
                                                <Star className="w-6 h-6 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="Share your experience..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        required
                                    />
                                    <Button type="submit" disabled={submittingReview} size="sm">
                                        {submittingReview ? "Submitting..." : "Post Review"}
                                    </Button>
                                </form>
                            ) : (
                                <div className="bg-muted/30 p-4 rounded-xl mb-6 text-center">
                                    <p className="text-muted-foreground text-sm mb-2">Login to leave a review</p>
                                    <Link to="/login">
                                        <Button variant="outline" size="sm">Login Now</Button>
                                    </Link>
                                </div>
                            )}

                            {/* Reviews List */}
                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
                                                <img
                                                    src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}`}
                                                    alt={review.user?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{review.user?.name || "Anonymous"}</span>
                                                    <div className="flex items-center text-amber-500">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="text-xs ml-1 font-bold">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-sm">{review.comment}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination Button */}
                                    {reviewPage < reviewTotalPages && (
                                        <div className="text-center pt-4">
                                            <Button variant="outline" onClick={handleLoadMoreReviews}>
                                                Load More Reviews
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl">
                                    <p>No reviews yet. Be the first to verify and review!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                boyfriend={boyfriend}
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
            />
        </div>
    );
};

export default BoyfriendProfile;
