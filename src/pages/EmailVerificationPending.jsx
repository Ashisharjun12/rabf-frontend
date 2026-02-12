import { useState } from "react";
import { resendVerificationEmail } from "../api/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Mail, Loader2, LogOut } from "lucide-react";
import useAuthStore from "../store/authStore";
import { toast } from "sonner";

const EmailVerificationPending = () => {
    const { user, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        try {
            await resendVerificationEmail();
            toast.success("Verification email sent! Check your inbox.");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to resend email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md text-center border-0 shadow-lg">
                <CardHeader>
                    <div className="mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-full">
                        <Mail className="w-12 h-12 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Hi <strong>{user?.name}</strong>,<br />
                        we sent a verification link to <strong>{user?.email}</strong>.
                        Please check your inbox and verify your account to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={handleResend}
                        className="w-full rounded-xl"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Resend Verification Email"
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full rounded-xl text-muted-foreground"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailVerificationPending;
