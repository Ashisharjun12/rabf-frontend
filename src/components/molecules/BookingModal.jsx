import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createBooking } from "../../api/api";
import { MapPin, Clock, Calendar, CheckCircle2 } from "lucide-react";

const BookingModal = ({ boyfriend, isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState(2); // Default 2 hours
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSuccess(false);
            setLoading(false);
        }
    }, [isOpen]);

    const totalPrice = duration * (boyfriend?.pricePerHour || 0);

    const handleBooking = async () => {
        if (!date || !startTime || !location) return;

        try {
            setLoading(true);

            // Construct start/end timestamps
            const startDateTime = new Date(`${date}T${startTime}`);
            const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);

            await createBooking({
                boyfriendId: boyfriend._id,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                meetingLocation: location,
                totalPrice
            });

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error(error);
            alert("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">

                {/* Header with Image Background effect or simple clean header */}
                <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 p-6 text-center border-b border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-light text-foreground">
                            Book <span className="font-bold">{boyfriend?.name}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                        ₹{boyfriend?.pricePerHour} / hour
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-lg font-medium">Request Sent!</h3>
                            <p className="text-sm text-center text-muted-foreground">
                                {boyfriend?.name} will receive your request shortly.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Inputs */}
                            <div className="space-y-4">
                                {/* Location */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground ml-1">WHERE</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            placeholder="City center, Cafe, etc."
                                            className="pl-9 rounded-xl bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Date & Time Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground ml-1">WHEN</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                type="date"
                                                className="pl-9 rounded-xl bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all" // native date picker
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground ml-1">TIME</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                type="time"
                                                className="pl-9 rounded-xl bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Duration Selection */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground ml-1">DURATION</Label>
                                    <div className="flex gap-2">
                                        {[1, 2, 4, 8].map((hr) => (
                                            <button
                                                key={hr}
                                                onClick={() => setDuration(hr)}
                                                className={`flex-1 py-2 text-sm rounded-xl border transition-all ${duration === hr
                                                        ? "bg-foreground text-background border-foreground font-medium shadow-sm"
                                                        : "bg-background text-muted-foreground border-border hover:border-foreground/50"
                                                    }`}
                                            >
                                                {hr}h
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Footer */}
                            <div className="pt-2">
                                <div className="flex justify-between items-end mb-4 px-1">
                                    <div className="text-sm text-muted-foreground">
                                        Total Amount
                                    </div>
                                    <div className="text-2xl font-light">
                                        ₹{totalPrice}
                                    </div>
                                </div>
                                <Button
                                    onClick={handleBooking}
                                    disabled={loading || !date || !startTime || !location}
                                    className="w-full rounded-full h-12 text-base shadow-lg hover:shadow-xl transition-all"
                                >
                                    {loading ? "Processing..." : "Confirm Booking"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
