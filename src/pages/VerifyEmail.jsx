import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/api";
import { Button } from "../components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verify = async () => {
            try {
                await verifyEmail(token);
                setStatus("success");
                setMessage("Email verified successfully! You can now log in.");
            } catch (error) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Verification failed. Link may be expired.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-md text-center border-0 shadow-lg">
                <CardHeader>
                    <div className="mx-auto mb-4">
                        {status === "loading" && <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />}
                        {status === "success" && <CheckCircle2 className="w-12 h-12 text-green-500" />}
                        {status === "error" && <XCircle className="w-12 h-12 text-red-500" />}
                    </div>
                    <CardTitle className="text-2xl">Email Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-lg">{message}</p>

                    {status !== "loading" && (
                        <Button
                            onClick={() => navigate("/login")}
                            className="w-full rounded-xl"
                            variant={status === "success" ? "default" : "outline"}
                        >
                            {status === "success" ? "Go to Login" : "Back to Login"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmail;
