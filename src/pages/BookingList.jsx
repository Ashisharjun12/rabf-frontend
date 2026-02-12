import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../api/api";
import useAuthStore from "../store/authStore";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Clock, CalendarDays, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner"; // Assuming sonner is installed, or use native alert

import { useNavigate } from "react-router-dom";

const BookingList = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const isBoyfriend = user?.role === 'boyfriend';

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

        const handleCardClick = (e) => {
            // Prevent navigation if clicking on buttons
            if (e.target.closest("button")) return;

            // Navigate to chat
            const otherUserId = isBoyfriendView ? booking.user._id : (booking.boyfriend.user || booking.boyfriend._id);
            navigate(`/chats/${otherUserId}`);
        };

        return (
            <Card
                onClick={handleCardClick}
                className="mb-4 shadow-sm hover:shadow-md transition-all rounded-2xl border-0 bg-card/50 backdrop-blur-sm ring-1 ring-border/50 cursor-pointer group"
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
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                            {/* Future: Link to Chat */}
                            <a href={`/chats/${booking.boyfriend.user || booking.boyfriend._id}`}>Chat Now</a>
                        </Button>
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
        </div>
    );
};

export default BookingList;
