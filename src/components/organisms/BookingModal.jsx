import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";

const BookingModal = ({ boyfriend, isOpen, onClose }) => {
    const [date, setDate] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBooking = async () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            alert("Booking Request Sent!");
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book a Date with {boyfriend?.name}</DialogTitle>
                    <DialogDescription>
                        Select a date to request a booking. Rate is ${boyfriend?.pricePerHour}/hr.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Select Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Time selection could go here */}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleBooking} disabled={!date || isSubmitting}>
                        {isSubmitting ? "Sending Request..." : "Confirm Booking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
