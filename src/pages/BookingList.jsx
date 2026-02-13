import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus, createReview } from "../api/api";
import useAuthStore from "../store/authStore";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Clock, CalendarDays, MapPin, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

const BookingList = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const isBoyfriend = user?.role === 'boyfriend';

    // Review Modal State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchBookings = async () => {
        try {
            const res = await getBookings();
            setBookings(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateBookingStatus(id, { status });
            toast.success(`Booking ${status}`);
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error("Error updating booking:", error);
            toast.error("Failed to update booking status");
        }
    };

    const openReviewModal = (booking) => {
        setSelectedBooking(booking);
        setReviewRating(5);
        setReviewComment("");
        setReviewModalOpen(true);
    };

    const handleReviewSubmit = async () => {
        if (!selectedBooking) return;
        setSubmittingReview(true);
        try {
            // Check if backend supports creating review from booking or just generic createReview
            // User requested: "review show ...of that date"
            // Usually review is for a boyfriend.
            // createReview(boyfriendId, rating, comment)

            const boyfriendId = selectedBooking.boyfriend.user || selectedBooking.boyfriend._id; // Handle populated/unpopulated
            // Wait, `selectedBooking.boyfriend` in `getBookings` response.
            // If `isReceived` (boyfriend view), they don't review user? Usually users review boyfriends.
            // `isBoyfriend` check: Only USERS review BOYFRIENDS.

            await createReview({
                boyfriendId: selectedBooking.boyfriend._id, // Assuming this is the ID needed
                rating: reviewRating,
                comment: reviewComment
            });

            toast.success("Review submitted successfully!");
            setReviewModalOpen(false);
            // Optionally mark booking as reviewed if backend supports it
        } catch (error) {
            console.error("Error submitting review:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit review";

            if (errorMessage.includes("You can only review after a completed booking")) {
                toast.error("You can give review after booking complete or date finished");
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Segregate Bookings
    const myBookings = bookings.filter(b => b.user._id === user._id);
    const receivedRequests = bookings.filter(b => b.boyfriend.user === user._id || (b.boyfriend._id && b.user._id !== user._id));
    // Note: Ideally backend should flag if I am the boyfriend for this booking. 
    // For now assuming if I am not the user, I am the boyfriend.

    const BookingCard = ({ booking, isReceived = false }) => {
        const isBoyfriendView = isReceived;

        // Review button visible for all accepted bookings, but action restricted by time
        const isPast = new Date(booking.endTime) < new Date();
        const canReview = !isBoyfriendView && booking.status === 'accepted';

        return (
            <Card
                className="mb-4 shadow-sm hover:shadow-md transition-all rounded-2xl border-0 bg-card/50 backdrop-blur-sm ring-1 ring-border/50 group"
            >
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg font-bold">
                                {isBoyfriendView ? `Request from ${booking.user.name}` : `Booking with ${booking.boyfriend.name}`}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <CalendarDays className="w-3 h-3" />
                                {format(new Date(booking.startTime), "PPP")}
                            </CardDescription>
                        </div>
                        <Badge variant={
                            booking.status === "accepted" ? "success" :
                                booking.status === "rejected" || booking.status === "cancelled" ? "destructive" : "secondary"
                        } className="capitalize rounded-full px-3">
                            {booking.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground bg-muted/20 p-2 rounded-lg">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Time</span>
                        <span className="font-medium text-foreground">{format(new Date(booking.startTime), "p")} - {format(new Date(booking.endTime), "p")}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground bg-muted/20 p-2 rounded-lg">
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Location</span>
                        <span className="font-medium text-foreground">{booking.meetingLocation}</span>
                    </div>
                    <div className="flex items-center justify-between font-medium mt-2 pt-2 border-t">
                        <span>Total Price</span>
                        <span className="text-primary text-xl font-bold">₹{booking.totalPrice}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2 pb-4 px-4">
                    {booking.status === "pending" && (
                        <>
                            {isBoyfriendView ? (
                                <>
                                    <Button size="sm" variant="outline" className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleStatusUpdate(booking._id, "rejected")}>
                                        Reject
                                    </Button>
                                    <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusUpdate(booking._id, "accepted")}>
                                        Accept
                                    </Button>
                                </>
                            ) : (
                                <Button size="sm" variant="destructive" className="rounded-full" onClick={() => handleStatusUpdate(booking._id, "cancelled")}>
                                    Cancel Request
                                </Button>
                            )}
                        </>
                    )}
                    {booking.status === "accepted" && !isBoyfriendView && (
                        <>
                            {canReview && (
                                <Button size="sm" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isPast) {
                                        toast.error("You can give review after booking complete or date finished");
                                        return;
                                    }
                                    openReviewModal(booking);
                                }}>
                                    <Star className="w-3 h-3 mr-1 fill-current" /> Review Date
                                </Button>
                            )}

                            <Button size="sm" variant="outline" className="rounded-full" asChild onClick={(e) => e.stopPropagation()}>
                                {/* Link to Chat with correct User ID (Avoid falling back to boyfriend profile ID) */}
                                <a href={`/chats/${booking.boyfriend?.user?._id || booking.boyfriend?.user}`}>Chat Now</a>
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="container max-w-4xl mx-auto p-4 py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Bookings</h1>
                <p className="text-muted-foreground">Manage your dates and requests.</p>
            </div>

            <Tabs defaultValue="my-bookings" className="w-full">
                {isBoyfriend && (
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-full h-auto">
                        <TabsTrigger value="my-bookings" className="rounded-full py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">My Bookings</TabsTrigger>
                        <TabsTrigger value="requests" className="rounded-full py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Client Requests</TabsTrigger>
                    </TabsList>
                )}

                <TabsContent value="my-bookings" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    {!isBoyfriend && <h2 className="text-xl font-semibold mb-4 hidden">My Bookings</h2>}
                    {myBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/10 rounded-3xl border border-dashed">
                            <CalendarDays className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No active bookings found.</p>
                            <Button variant="link" className="text-primary mt-2" asChild><a href="/boyfriends">Find a Boyfriend</a></Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-1">
                            {myBookings.map(booking => (
                                <BookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {isBoyfriend && (
                    <TabsContent value="requests" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                        {receivedRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/10 rounded-3xl border border-dashed">
                                <Clock className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No booking requests received yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-1">
                                {receivedRequests.map(booking => (
                                    <BookingCard key={booking._id} booking={booking} isReceived={true} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                )}
            </Tabs>
            {/* Review Modal */}
            <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review your Date</DialogTitle>
                        <DialogDescription>
                            How was your experience with {selectedBooking?.boyfriend?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className={`transition-colors p-1 ${star <= reviewRating ? 'text-amber-500' : 'text-muted-foreground/30'}`}
                                >
                                    <Star className="w-8 h-8 fill-current" />
                                </button>
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="comment">Your Comment</Label>
                            <Textarea
                                id="comment"
                                placeholder="Tell us about your date..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleReviewSubmit} disabled={submittingReview}>
                            {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingList;
