import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const UserAvatar = ({ user, className }) => {
    // Safety check
    if (!user) return null;

    const name = user.name || "User";
    // Using DiceBear 'notionists' style for a fun, sketch-like vibe
    const diceBearUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}`;

    // Fallback image if profileImage is missing
    const imageUrl = user.profileImage || diceBearUrl;

    return (
        <Avatar className={className}>
            <AvatarImage src={imageUrl} alt={name} className="object-cover" />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
