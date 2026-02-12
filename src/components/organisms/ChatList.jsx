
import { useEffect, useState, useRef, useCallback } from "react";
import { getChats, getBoyfriends } from "../../api/api";
import { useChat } from "../../context/ChatContext";
import useAuthStore from "../../store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserAvatar from "../ui/user-avatar";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import verifyIcon from "../../assets/verify.png";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const ChatList = ({ className }) => {
    const { user } = useAuthStore();
    const { socket } = useChat();
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [boyfriends, setBoyfriends] = useState([]); // Directory list
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("chats");
    const navigate = useNavigate();
    const { userId } = useParams();

    const observer = useRef();

    // Infinite Scroll Observer for Boyfriends
    const lastBoyfriendRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchChats = async () => {
        try {
            const res = await getChats();
            setChats(res.data);
            setFilteredChats(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching chats:", error);
            setLoading(false);
        }
    };

    const fetchBoyfriends = async () => {
        if (!hasMore && page !== 1) return;
        setLoading(true);
        try {
            const res = await getBoyfriends({ page, limit: 10, search: searchTerm });
            setBoyfriends(prev => page === 1 ? res.data.boyfriends : [...prev, ...res.data.boyfriends]);
            setHasMore(res.data.currentPage < res.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching boyfriends:", error);
            setLoading(false);
        }
    };

    // Debounce Search for Directory & Local Filter for Chats
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (activeTab === "directory") {
                setPage(1);
                setBoyfriends([]);
                setHasMore(true);
                fetchBoyfriends();
            } else {
                // Local filter for chats
                if (searchTerm.trim() === "") {
                    setFilteredChats(chats);
                } else {
                    const filtered = chats.filter(chat =>
                        (chat.otherParticipant?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setFilteredChats(filtered);
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, activeTab, chats]);

    // Fetch on page change for Directory
    useEffect(() => {
        if (activeTab === "directory" && page > 1) {
            fetchBoyfriends();
        }
    }, [page]);

    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user]);

    useEffect(() => {
        if (socket) {
            socket.on("update_chat_list", () => {
                fetchChats();
            });
        }
        return () => {
            socket?.off("update_chat_list");
        };
    }, [socket]);

    const handleUserClick = (id) => {
        navigate(`/chats/${id}`);
    };

    const showDirectory = user?.role === "user";

    return (
        <div className={`flex flex-col h-full bg-background border-r ${className}`}>
            <div className="p-4 border-b font-semibold text-lg bg-muted/10 sticky top-0 z-10 backdrop-blur-sm space-y-3">
                {/* Only Users can browse the directory from here. Boyfriends just see chats. */}
                {user?.role === "user" ? (
                    <Tabs defaultValue="chats" className="w-full" onValueChange={(val) => { setActiveTab(val); if (val === 'directory' && boyfriends.length === 0) fetchBoyfriends(); }}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="chats">Chats</TabsTrigger>
                            <TabsTrigger value="directory">Directory</TabsTrigger>
                        </TabsList>
                    </Tabs>
                ) : (
                    <div className="flex items-center gap-2 py-2">
                        <h2 className="font-semibold px-2">Messages</h2>
                    </div>
                )}

                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={activeTab === 'directory' ? "Search Boyfriends..." : "Search messages..."}
                        className="pl-8 h-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'chats' ? (
                    filteredChats.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <p>No conversations found.</p>
                            {showDirectory && <p className="text-xs mt-1">Check the Directory to find someone!</p>}
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const otherUser = chat.otherParticipant || { name: "User" };
                            const isActive = userId === otherUser._id;
                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => handleUserClick(otherUser._id)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${isActive ? "bg-muted" : ""}`}
                                >
                                    <UserAvatar user={otherUser} className="h-10 w-10 border" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-medium text-sm truncate">{otherUser.name}</h4>
                                            {chat.lastMessageTime && (
                                                <span className="text-[10px] text-muted-foreground shrink-0">
                                                    {format(new Date(chat.lastMessageTime), "p")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {chat.lastMessage || "Start a conversation"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )
                ) : (
                    <div className="space-y-1">
                        {boyfriends.map((bf, index) => {
                            const userObj = bf.user || bf; // Handle if population changes
                            if (userObj._id === user._id) return null; // Don't show self
                            const isVerified = userObj.isVerified || bf.isVerified; // Check populated or direct

                            return (
                                <div
                                    ref={boyfriends.length === index + 1 ? lastBoyfriendRef : null}
                                    key={bf._id}
                                    onClick={() => handleUserClick(userObj._id)}
                                    className="flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50"
                                >
                                    <UserAvatar user={userObj} className="h-10 w-10 border" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <h4 className="font-medium text-sm truncate">{userObj.name}</h4>
                                            {isVerified && <img src={verifyIcon} alt="Verified" className="w-4 h-4 object-contain" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {bf.bio || "Available for booking"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {loading && (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!hasMore && boyfriends.length > 0 && (
                            <div className="text-center p-2 text-xs text-muted-foreground">
                                End of list
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
