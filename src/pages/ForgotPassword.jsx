import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            setSubmitted(true);
            toast.success("Reset link sent to your email!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-sm border-0 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    <CardDescription>
                        {!submitted
                            ? "Enter your email address and we'll send you a link to reset your password."
                            : "Check your email for the reset link."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="rounded-xl"
                                />
                            </div>
                            <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
                                <p className="text-green-600 dark:text-green-400 font-medium">
                                    Email sent successfully!
                                </p>
                            </div>
                            <p className="text-sm text-center text-muted-foreground">
                                Didn't receive it? Check your spam folder or{" "}
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-primary hover:underline font-medium"
                                >
                                    try again
                                </button>
                                .
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
