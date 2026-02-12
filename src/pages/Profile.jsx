import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Loader2, Upload, Dice5, Save, User as UserIcon, Mail, Shield, Edit2, X } from "lucide-react";
import verifyIcon from "../assets/verify.png";
import { uploadImage, updateUserProfile } from "../api/api";
import { toast } from "sonner";
import UserAvatar from "../components/ui/user-avatar";



const Profile = () => {
    const { user, login } = useAuthStore();
    const navigate = useNavigate(); // Hook for navigation
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user && user.role === 'boyfriend') {
            navigate("/boyfriends/me");
        }
    }, [user, navigate]);

    // Form States
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [profileImage, setProfileImage] = useState(user?.profileImage || "");

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setProfileImage(user.profileImage);
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await uploadImage(file);
            setProfileImage(data);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleRandomizeAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
        setProfileImage(randomAvatar);
        toast.info("Random avatar generated!");
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const updatedData = {
                name,
                profileImage
            };
            const response = await updateUserProfile(updatedData);
            login(response.data); // Update global store
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || "");
        setProfileImage(user?.profileImage || "");
        setIsEditing(false);
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-2xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-full gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Profile
                    </Button>
                )}
            </div>

            <Card className="rounded-[2rem] border-0 shadow-lg overflow-hidden bg-card/60 backdrop-blur-sm ring-1 ring-border/50 transition-all">
                {/* Header / Banner area could go here if we wanted one */}
                <div className="h-32 bg-gradient-to-r from-pink-500/10 to-purple-500/10 w-full"></div>

                <CardContent className="px-8 pb-8 -mt-16">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <Avatar className="w-32 h-32 border-[6px] border-background shadow-xl rounded-2xl">
                                <AvatarImage src={profileImage} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-primary/10 text-primary rounded-2xl">
                                    {name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <div className="absolute -bottom-2 -right-2 flex gap-1">
                                    <div className="relative">
                                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" disabled={uploading}>
                                            <Upload className="w-4 h-4" />
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                                            title="Upload Image"
                                        />
                                    </div>
                                    <Button size="icon" variant="secondary" onClick={handleRandomizeAvatar} className="h-8 w-8 rounded-full shadow-md" title="Randomize" disabled={uploading}>
                                        <Dice5 className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Name & Role (View Mode) */}
                        {!isEditing && (
                            <div className="mb-2 space-y-1">
                                <h2 className="text-2xl font-bold">{name}</h2>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Shield className="w-4 h-4" />
                                    <span className="capitalize text-sm font-medium">{user?.role}</span>
                                    {user?.isVerified && (
                                        <span className="flex items-center gap-1 text-green-600 text-xs bg-green-500/10 px-2 py-0.5 rounded-full font-bold ml-2">
                                            <img src={verifyIcon} alt="Verified" className="w-3 h-3 object-contain" /> Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={email}
                                        disabled
                                        className="pl-10 rounded-xl bg-muted/50 text-muted-foreground"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button onClick={handleSaveChanges} disabled={loading} className="flex-1 rounded-xl">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} disabled={loading} className="rounded-xl">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Email Address</p>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Mail className="w-4 h-4 text-primary" />
                                        {email}
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Account ID</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <span className="font-mono text-xs">{user?._id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
