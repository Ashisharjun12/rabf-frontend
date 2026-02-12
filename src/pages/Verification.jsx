import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { verifyUser, getUserProfile, getMobileHandoverToken, mobileLogin, getMyBoyfriendProfile } from "../api/api";
import { QRCodeSVG } from "qrcode.react";
import useAuthStore from "../store/authStore";

const Verification = () => {
    const webcamRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState("Loading models...");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [profileDescriptor, setProfileDescriptor] = useState(null);
    const navigate = useNavigate();

    const [publicUrl, setPublicUrl] = useState(import.meta.env.VITE_PUBLIC_URL || "");
    const [handoverToken, setHandoverToken] = useState("");

    console.log("VITE_PUBLIC_URL:", import.meta.env.VITE_PUBLIC_URL);
    console.log("Public URL State:", publicUrl);
    console.log("Handover Token:", handoverToken);

    // Check for mobile resize & Verification Status
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);

        // Redirect if already verified
        // We might need to fetch fresh profile to be sure, but store is faster for immediate check
        // Assuming user object in store has isVerified updated
        getUserProfile().then(({ data }) => {
            if (data.isVerified) {
                navigate("/");
            }
        }).catch(err => console.error(err));

        return () => window.removeEventListener("resize", handleResize);
    }, [navigate]);

    // Polling for verification status (Desktop only)
    useEffect(() => {
        let interval;
        if (!isMobile) {
            interval = setInterval(async () => {
                try {
                    const { data } = await getUserProfile();
                    if (data.isVerified) {
                        setMessage("Verified on mobile! Redirecting...");
                        clearInterval(interval);
                        setTimeout(() => navigate("/"), 2000);
                    }
                } catch (error) {
                    console.error("Polling error", error);
                }
            }, 3000); // Check every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isMobile, navigate]);

    // Load AI Models (Once on mount)
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
            try {
                setMessage("Loading AI models...");
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                ]);
                setLoading(false); // Models loaded, but still need profile
            } catch (err) {
                console.error("Model loading error", err);
                setMessage("Error loading AI models.");
            }
        };
        loadModels();
    }, []);

    // Check for magic link login (Mobile) - REMOVED (Handled by /handover)

    // Fetch Profile & Prepare for Verification (Runs when user is available)
    const { user } = useAuthStore();

    useEffect(() => {
        const prepareVerification = async () => {
            // Wait for models to be loaded first if they are not
            // But here we can assume models are loading in parallel or already loaded by the time user is logged in
            // If models are strictly required before profile fetch logic that depends on faceapi, we might need to check loading state

            if (!user) return; // Wait for user login

            try {
                setMessage("Fetching profile...");
                // Fetch fresh profile data
                const { data: userProfile } = await getUserProfile();

                let profileImageUrl = userProfile.profileImage;

                if (userProfile.role === 'boyfriend') {
                    try {
                        const { data: bfProfile } = await getMyBoyfriendProfile();
                        if (bfProfile.profileImage) {
                            profileImageUrl = bfProfile.profileImage;
                        }
                    } catch (err) {
                        console.error("Could not fetch boyfriend profile", err);
                    }
                }

                if (!profileImageUrl) {
                    throw new Error("No profile image found. Please upload one first.");
                }

                setMessage("Processing profile photo...");
                const profileImg = await faceapi.fetchImage(profileImageUrl);
                const profileDetection = await faceapi.detectSingleFace(profileImg, new faceapi.SsdMobilenetv1Options())
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (!profileDetection) {
                    throw new Error("Could not detect a face in your profile photo.");
                }

                setProfileDescriptor(profileDetection.descriptor);
                setMessage("Ready for Verification");

            } catch (err) {
                console.error("Preparation error", err);
                setMessage(err.message || "Error preparing verification.");
            }
        };

        if (user && !loading) { // Run only when user is logged in and models *should* be loading/loaded. 
            // actually 'loading' state currently tracks everything. We should split it.
            // For now, let's just run this.
            prepareVerification();
        }
    }, [user, loading]); // Dependent on user state

    const verifyFace = async () => {
        if (!webcamRef.current || !profileDescriptor) return;
        setVerifying(true);
        setMessage("Verifying...");

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                throw new Error("Could not capture image from webcam.");
            }

            const img = await faceapi.fetchImage(imageSrc);

            // Detect face in webcam using TinyFaceDetector (faster for webcam)
            const detection = await faceapi.detectSingleFace(
                img,
                new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })
            ).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                setMessage("No face detected. Please ensure your face is clearly visible.");
                setVerifying(false);
                return;
            }

            // Compare Faces
            const distance = faceapi.euclideanDistance(detection.descriptor, profileDescriptor);
            console.log("Face Distance:", distance); // Debugging

            // Threshold: 0.6 is standard. Lower is stricter.
            if (distance < 0.6) {
                await verifyUser();
                setMessage("Verified! Redirecting...");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setMessage("Face does not match profile photo. Please try again.");
                setVerifying(false);
            }

        } catch (error) {
            console.error(error);
            setMessage("Verification failed.");
            setVerifying(false);
        }
    };

    const [tokenError, setTokenError] = useState("");

    // Fetch handover token on mount (Desktop only)
    useEffect(() => {
        if (!isMobile) {
            console.log("Attempting to fetch handover token...");
            getMobileHandoverToken()
                .then(({ data }) => {
                    console.log("Token fetched successfully:", data.token);
                    setHandoverToken(data.token);
                })
                .catch(err => {
                    console.error("Failed to get handover token", err);
                    setTokenError(err.response?.data?.message || err.message || "Failed to fetch token");
                });
        }
    }, [isMobile]);

    const qrValue = publicUrl && handoverToken
        ? `${publicUrl.replace(/\/$/, "")}/handover?t=${handoverToken}`
        : null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-5xl grid md:grid-cols-2 gap-8 p-6 md:p-10 shadow-2xl rounded-[2.5rem] border-0 bg-card/50 backdrop-blur-xl">

                {/* Left Side: Webcam */}
                <div className="flex flex-col items-center gap-6 justify-center">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Face Verification</h2>
                        <p className="text-muted-foreground text-base max-w-md">
                            Please position your face clearly in the frame to verify your identity against your profile photo.
                        </p>
                    </div>

                    <div className="w-full aspect-[4/3] bg-black/5 rounded-3xl overflow-hidden relative flex items-center justify-center shadow-inner border-4 border-white dark:border-zinc-800">
                        {loading ? (
                            <div className="flex flex-col items-center gap-3">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p className="text-muted-foreground font-medium animate-pulse">{message}</p>
                            </div>
                        ) : (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                                mirrored={true}
                                videoConstraints={{ facingMode: "user" }}
                            />
                        )}
                        {/* Overlay Frame */}
                        <div className="absolute inset-0 border-[3px] border-primary/30 rounded-3xl pointer-events-none"></div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-full opacity-50"></div>
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <div className={`text-center font-medium min-h-[24px] transition-colors ${message.includes("Verified") ? "text-green-500" : "text-primary"}`}>
                            {message}
                        </div>

                        <Button
                            onClick={verifyFace}
                            disabled={verifying || loading}
                            className="w-full h-14 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all bg-foreground text-background hover:bg-foreground/90"
                        >
                            {verifying ? "Verifying..." : "Verify Identity"}
                        </Button>
                    </div>
                </div>

                {/* Right Side: QR Code (Desktop Only) */}
                <div className={`flex flex-col items-center justify-center gap-8 border-l border-border/50 pl-8 ${isMobile ? 'hidden' : 'flex'}`}>
                    <div className="text-center space-y-3">
                        <Badge variant="outline" className="px-3 py-1 text-sm rounded-full mb-2">Mobile Preferred</Badge>
                        <h3 className="text-2xl font-semibold">Use Your Phone</h3>
                        <p className="text-muted-foreground text-base max-w-[280px] mx-auto leading-relaxed">
                            For the best camera quality, scan this code to continue verification on your mobile device.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border flex items-center justify-center min-h-[250px] min-w-[250px]">
                        {qrValue ? (
                            <QRCodeSVG value={qrValue} size={200} />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-center">
                                {tokenError ? (
                                    <>
                                        <p className="text-sm font-bold text-red-500">Error</p>
                                        <p className="text-xs text-red-400 max-w-[200px]">{tokenError}</p>
                                        <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="mt-2 text-xs h-7">Retry</Button>
                                    </>
                                ) : (
                                    <>
                                        <span className="loading loading-spinner loading-md text-primary"></span>
                                        <p className="text-sm text-muted-foreground">Generating QR Code...</p>
                                        {!publicUrl && <p className="text-xs text-red-500">Public URL Missing</p>}
                                        {!handoverToken && publicUrl && <p className="text-xs text-amber-500">Fetching Token...</p>}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center text-sm text-muted-foreground w-full max-w-xs">
                        <div className="bg-muted/30 p-3 rounded-xl">
                            <span className="block font-bold text-foreground mb-1">1. Scan</span>
                            Use camera app
                        </div>
                        <div className="bg-muted/30 p-3 rounded-xl">
                            <span className="block font-bold text-foreground mb-1">2. Verify</span>
                            Face match
                        </div>
                    </div>
                </div>

            </Card>
        </div>
    );
};

export default Verification;
