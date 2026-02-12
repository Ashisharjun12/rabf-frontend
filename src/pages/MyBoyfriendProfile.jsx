import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Upload, Loader2, X, Edit2, Save, ArrowLeft, Star, PlusCircle } from "lucide-react";
import verifyIcon from "../assets/verify.png";
import { getMyBoyfriendProfile, updateBoyfriend, createBoyfriend, uploadImage } from "../api/api";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";

const MyBoyfriendProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // Track if we are creating a new profile
    const [boyfriend, setBoyfriend] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name?.split(" ")[0] || "",
        age: "",
        bio: "",
        pricePerHour: "",
        address: "",
        latitude: null,
        longitude: null,
        traits: "",
        instagram: "",
        profileImage: "",
        images: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await getMyBoyfriendProfile();
            setBoyfriend(data);
            setFormData({
                name: data.name || "",
                age: data.age || "",
                bio: data.bio || "",
                pricePerHour: data.pricePerHour || "",
                address: data.location?.address || (typeof data.location === 'string' ? data.location : ""),
                latitude: data.location?.coordinates?.[1] || null,
                longitude: data.location?.coordinates?.[0] || null,
                traits: data.traits?.join(", ") || "",
                instagram: data.instagram || "",
                profileImage: data.profileImage || "",
                images: data.images || []
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            // If 404, it means user has no boyfriend profile yet -> Switch to Create Mode
            if (error.response && error.response.status === 404) {
                setIsCreating(true);
                setIsEditing(true);
            } else {
                toast.error("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            setUploading(true); // Reuse uploading spinner for location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        address: prev.address || "Current Location (Detected)"
                    }));
                    setUploading(false);
                    toast.success("Location detected");
                },
                (error) => {
                    console.error("Location error:", error);
                    toast.error("Could not get location");
                    setUploading(false);
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
            toast.success("Image uploaded");
        } catch (error) {
            console.error("Profile upload failed", error);
            toast.error("Upload failed");
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
            toast.success("Gallery updated");
        } catch (error) {
            console.error("Gallery upload failed", error);
            toast.error("Upload failed");
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
        setSaving(true);
        try {
            const payload = {
                ...formData,
                location: formData.address,
                traits: formData.traits.split(",").map(t => t.trim()),
                pricePerHour: Number(formData.pricePerHour),
                age: Number(formData.age),
            };

            let data;
            if (isCreating) {
                const response = await createBoyfriend(payload);
                data = response.data;
                setIsCreating(false);
                toast.success("Profile created successfully!");
            } else {
                const response = await updateBoyfriend(payload);
                data = response.data;
                toast.success("Profile updated successfully!");
            }

            setBoyfriend(data);
            setIsEditing(false);
        } catch (error) {
            console.error("Save failed", error);
            toast.error(error.response?.data?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="container mx-auto max-w-6xl py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <Link to="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to User Settings
                </Link>
                {!isEditing && !isCreating && (
                    <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-full">
                        <Edit2 className="w-4 h-4" /> Edit Content
                    </Button>
                )}
            </div>

            {isEditing || isCreating ? (
                /* EDIT/CREATE FORM */
                <Card className="rounded-[2rem] border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle>{isCreating ? "Create Public Profile" : "Edit Public Profile"}</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 pt-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input id="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" type="number" value={formData.age} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" value={formData.bio} onChange={handleChange} className="h-32" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pricePerHour">Hourly Rate (₹)</Label>
                                    <Input id="pricePerHour" type="number" value={formData.pricePerHour} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <div className="flex gap-2">
                                        <Input id="address" value={formData.address} onChange={handleChange} required />
                                        <Button type="button" variant="outline" onClick={handleLocation} disabled={uploading}>
                                            <MapPin className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="traits">Traits (comma separated)</Label>
                                <Input id="traits" value={formData.traits} onChange={handleChange} placeholder="Funny, Listener, Tall" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input id="instagram" value={formData.instagram} onChange={handleChange} placeholder="@username" />
                            </div>

                            {/* Images */}
                            <div className="space-y-4 pt-4 border-t">
                                <div>
                                    <Label className="mb-2 block">Main Profile Photo</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted border">
                                            {formData.profileImage ? (
                                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                                                    <Upload className="w-8 h-8 opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                        <Input type="file" accept="image/*" onChange={handleProfileImageUpload} disabled={uploading} className="w-full max-w-xs" />
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2 block">Gallery</Label>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
                                        {formData.images.map((img, i) => (
                                            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border">
                                                <img src={img} alt="gallery" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-destructive/90 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <Input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-4 justify-end bg-muted/30 py-4">
                            {!isCreating && <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}
                            <Button type="submit" disabled={saving || uploading} className="rounded-full px-8">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                {isCreating ? "Create Profile" : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            ) : (
                /* VIEW MODE */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Panel */}
                    <Card className="md:col-span-1 border-0 shadow-lg overflow-hidden rounded-[2rem] h-fit">
                        <div className="aspect-[3/4] relative">
                            <img src={boyfriend.profileImage} alt={boyfriend.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    {boyfriend.name}, {boyfriend.age}
                                    {user?.isVerified && <img src={verifyIcon} alt="Verified" className="w-5 h-5 object-contain" />}
                                </h2>
                                <p className="text-white/80 flex items-center gap-1 text-sm mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {typeof boyfriend.location === 'string' ? boyfriend.location : boyfriend.location?.address}
                                </p>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-muted-foreground text-sm font-medium uppercase">Rating</span>
                                <div className="flex items-center gap-1 font-bold text-amber-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    {boyfriend.rating || "New"}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-muted-foreground text-sm font-medium uppercase">Rate</span>
                                <span className="font-bold text-lg">₹{boyfriend.pricePerHour}<span className="text-sm font-normal text-muted-foreground">/hr</span></span>
                            </div>
                            {boyfriend.instagram && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm font-medium uppercase">Instagram</span>
                                    <span className="font-medium text-pink-600">{boyfriend.instagram}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Panel */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="rounded-[2rem] border-0 shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-3">About Me</h3>
                            <p className="text-muted-foreground leading-relaxed">{boyfriend.bio}</p>
                        </Card>

                        <Card className="rounded-[2rem] border-0 shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-3">My Traits</h3>
                            <div className="flex flex-wrap gap-2">
                                {boyfriend.traits?.map((trait, i) => (
                                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">{trait}</Badge>
                                ))}
                            </div>
                        </Card>

                        <Card className="rounded-[2rem] border-0 shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-3">My Gallery</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {boyfriend.images?.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted">
                                        <img src={img} alt="" className="w-full h-full object-cover transition-transform hover:scale-105" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBoyfriendProfile;
