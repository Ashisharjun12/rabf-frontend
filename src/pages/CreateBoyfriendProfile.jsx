import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { MapPin, Upload, Loader2, X } from "lucide-react";

import { createBoyfriend, uploadImage } from "../api/api";
import BoyfriendCard from "../components/molecules/BoyfriendCard";
import useAuthStore from "../store/authStore"; // Import useAuthStore to get user name

const CreateBoyfriendProfile = () => { // Removed images prop from here
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name?.split(" ")[0] || "", // Pre-fill name if available
        age: "",
        bio: "",
        pricePerHour: "",
        address: "",
        latitude: null,
        longitude: null,
        traits: "",
        instagram: "",
        profileImage: null,
        images: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            setLoading(true); // Using loading state for location feedback
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        address: prev.address || "Current Location (Detected)"
                    }));
                    setLoading(false);
                },
                (error) => {
                    console.error("Location error:", error);
                    alert("Could not get location. Please enter manually or enable permissions.");
                    setLoading(false);
                }
            );
        }
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await uploadImage(file);
            const imageUrl = typeof response === 'string' ? response : response.url || response.imageUrl;

            setFormData(prev => ({ ...prev, profileImage: imageUrl }));
        } catch (error) {
            console.error("Profile upload failed", error);
            alert("Profile image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            setUploading(true);
            const uploadPromises = files.map(file => uploadImage(file));
            const responses = await Promise.all(uploadPromises);

            const newImages = responses.map(res => typeof res === 'string' ? res : res.url || res.imageUrl);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } catch (error) {
            console.error("Gallery upload failed", error);
            alert("Gallery upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.profileImage) {
            alert("Please upload a main profile photo.");
            return;
        }
        if (formData.images.length < 3) {
            alert("Please upload at least 3 photos for your gallery.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                location: formData.address,
                traits: formData.traits.split(",").map(t => t.trim()),
                pricePerHour: Number(formData.pricePerHour),
                age: Number(formData.age),
                instagram: formData.instagram
            };

            await createBoyfriend(payload);
            alert("Profile created! Please verify your identity with your new profile photo.");
            navigate("/verify"); // Redirect to verification page
        } catch (error) {
            console.error("Error creating profile", error);
            alert(error.response?.data?.message || "Failed to create profile");
        } finally {
            setLoading(false);
        }
    };

    // Construct a preview object that matches BoyfriendCard's expected prop structure
    const previewBoyfriend = {
        _id: "preview",
        name: formData.name || "Your Name",
        age: formData.age || 25,
        location: formData.address || "Your City",
        pricePerHour: formData.pricePerHour || 500,
        profileImage: formData.profileImage || user?.profileImage || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60",
        images: formData.images.length > 0 ? formData.images : [], // Gallery
        bio: formData.bio || "Your amazing bio will appear here...",
        traits: formData.traits ? formData.traits.split(",").map(t => t.trim()) : ["Charming", "Fun"],
        instagram: formData.instagram,
        rating: 5.0
    };

    return (
        <div className="container py-10 px-4 md:px-8">
            <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">Create Your Partner Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

                {/* Left Side: Form */}
                <Card className="shadow-lg border-muted/40">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input id="name" placeholder="Alex" required value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <div className="relative">
                                        <select
                                            id="age"
                                            className="h-12 w-full rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all px-4 appearance-none outline-none"
                                            value={formData.age}
                                            required
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select Age</option>
                                            {Array.from({ length: 70 - 18 + 1 }, (_, i) => 18 + i).map((age) => (
                                                <option key={age} value={age}>
                                                    {age}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" placeholder="Tell us about yourself..." className="h-24" required value={formData.bio} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pricePerHour">Hourly Rate (₹)</Label>
                                <Input id="pricePerHour" type="number" placeholder="500" required value={formData.pricePerHour} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <Label>Location</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="address"
                                        placeholder="City, Area"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Button type="button" variant="outline" onClick={handleLocation} disabled={loading} className="rounded-2xl">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {loading ? "Detecting..." : "Detect"}
                                    </Button>
                                </div>
                                {formData.latitude && <p className="text-xs text-green-600">✓ Coordinates captured</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="traits">Traits (comma separated)</Label>
                                <Input id="traits" placeholder="Funny, Listener, Tall" value={formData.traits} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram Username (Optional)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                                    <Input id="instagram" placeholder="username" className="pl-8" value={formData.instagram} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Main Profile Image */}
                            <div className="space-y-2">
                                <Label>Main Profile Photo</Label>
                                <div className="flex items-start gap-4">
                                    <div className="relative w-32 h-32 bg-muted rounded-xl overflow-hidden border flex items-center justify-center shrink-0">
                                        {formData.profileImage ? (
                                            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-8 h-8 text-muted-foreground opacity-50" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label htmlFor="profile-upload" className="cursor-pointer inline-flex items-center justify-center rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full sm:w-auto">
                                            <Upload className="w-4 h-4 mr-2" /> Select Main Photo
                                        </label>
                                        <Input id="profile-upload" type="file" accept="image/*" onChange={handleProfileImageUpload} disabled={uploading} className="hidden" />
                                        <p className="text-xs text-muted-foreground">This will be your main card image.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Images */}
                            <div className="space-y-2">
                                <Label>Gallery Photos (Min 3)</Label>
                                <div className="flex items-center gap-4">
                                    <label htmlFor="gallery-upload" className="cursor-pointer inline-flex items-center justify-center rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                        <Upload className="w-4 h-4 mr-2" /> Upload Gallery Photos
                                    </label>
                                    <Input id="gallery-upload" type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} className="hidden" />
                                </div>
                                {uploading && <div className="flex items-center text-xs text-muted-foreground mt-2"><Loader2 className="animate-spin w-3 h-3 mr-1" /> Uploading...</div>}

                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {formData.images.map((img, i) => (
                                        <div key={i} className="relative group aspect-square">
                                            <img src={img} alt="preview" className="w-full h-full object-cover rounded-md border" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(i)}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground text-right">{formData.images.length} / 3 required</p>
                            </div>

                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-full text-lg font-medium shadow-none hover:shadow-md transition-all bg-foreground text-background hover:bg-foreground/90"
                                disabled={loading || uploading}
                            >
                                {loading ? "Creating Profile..." : "Publish Profile"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Right Side: Preview */}
                <div className="sticky top-24 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-muted-foreground">Live Preview</h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Component Preview</span>
                    </div>
                    <div className="max-w-sm mx-auto w-full">
                        <BoyfriendCard boyfriend={previewBoyfriend} />
                    </div>
                    <p className="text-center text-sm text-muted-foreground italic">
                        This is how you will appear to users in the discovery list.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateBoyfriendProfile;
