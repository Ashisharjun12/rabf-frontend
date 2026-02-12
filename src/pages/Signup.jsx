import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Loader2, MapPin } from "lucide-react";
import { signupUser, uploadImage } from "../api/api";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("user");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await uploadImage(file);
            setImage(data);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const [locating, setLocating] = useState(false);

    const getLocation = () => {
        if (navigator.geolocation) {
            setLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setLocation(locData);
                    localStorage.setItem("userLocation", JSON.stringify(locData));
                    setLocating(false);
                    // Optional: You could show a toast here instead of alert
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Could not get location. Please enable location services.");
                    setLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const [success, setSuccess] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            name,
            email,
            password,
            role,
        };

        if (role === "boyfriend") {
            if (!image || !location) {
                alert("Please upload a profile image and enable location for Boyfriend profile.");
                setLoading(false);
                return;
            }
            userData.phoneNumber = phoneNumber;
            userData.profileImage = image;
        }

        // Include location for regular users seamlessly if captured
        if (location && role === "user") {
            // Backend can handle this if we send it, or we rely on localStorage
            // For now, let's keep it simple as per previous logic
        }

        try {
            await signupUser(userData);
            // Don't auto-login. Show success message.
            setSuccess(true);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-[400px] mx-auto space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-green-600">Account Created!</h1>
                    <p className="text-muted-foreground text-lg">
                        Please check your email <strong>{email}</strong> to verify your account before logging in.
                    </p>
                </div>
                <div className="pt-4">
                    <Button onClick={() => navigate("/login")} className="w-full rounded-xl">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[400px] mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Create an Account</h1>
                <p className="text-muted-foreground">Join our community today</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                    <Label>I want to register as:</Label>
                    <div className="grid grid-cols-2 gap-4 p-1 bg-muted rounded-xl">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            className={`p-2.5 rounded-lg text-sm font-medium transition-all ${role === "user"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("boyfriend")}
                            className={`p-2.5 rounded-lg text-sm font-medium transition-all ${role === "boyfriend"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Boyfriend
                        </button>
                    </div>
                </div>

                {/* Common Fields */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                        className="rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="rounded-xl pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Location Detection */}
                <div className="pt-2">
                    <Button
                        type="button"
                        variant={location ? "secondary" : "outline"}
                        onClick={getLocation}
                        disabled={loading || locating}
                        className={`w-full rounded-xl gap-2 ${location ? "text-green-600 bg-green-50 border-green-200" : "border-dashed"}`}
                    >
                        {locating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Capturing Location...
                            </>
                        ) : (
                            <>
                                <MapPin size={16} />
                                {location ? "Location Captured" : "Enable Location for Matches"}
                            </>
                        )}
                    </Button>
                </div>

                {/* Boyfriend Specific Fields */}
                {role === "boyfriend" && (
                    <div className="space-y-4 pt-2 animate-in slide-in-from-top-4 fade-in duration-300">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1234567890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                disabled={loading}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Profile Photo</Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-2xl p-6 text-center cursor-pointer relative bg-muted/5 hover:bg-muted/10">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={loading || uploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    {image ? (
                                        <>
                                            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
                                                <img src={image} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                            <p className="text-sm text-green-600 font-medium">Photo Uploaded!</p>
                                            <p className="text-xs text-muted-foreground">Click to change</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                                                <Loader2 size={20} className={uploading ? "animate-spin" : "hidden"} />
                                                {!uploading && <span className="text-xl">+</span>}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Click to upload photo</p>
                                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full rounded-xl h-11 text-base font-medium mt-6"
                    disabled={loading || uploading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="underline font-medium text-primary hover:text-primary/90">
                    Log in
                </Link>
            </div>
        </div>
    );
};

export default Signup;
