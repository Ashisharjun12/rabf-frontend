import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import UserAvatar from "../components/ui/user-avatar";
import { Send, ArrowLeft, Loader2, MessageCircleQuestion } from "lucide-react";
import { getChatDetails, getUserById, getChats } from "../api/api";
import ChatList from "../components/organisms/ChatList";
import { Link } from "react-router-dom";

const ChatWindow = () => {
    const { userId } = useParams(); // ID of the person we are chatting with
    const { user } = useAuthStore();
    const { socket, messages, setMessages, joinChat, sendMessage } = useChat();
    const [newMessage, setNewMessage] = useState("");
    const [chatDetails, setChatDetails] = useState(null);
    const [recentChats, setRecentChats] = useState([]);
    const [loading, setLoading] = useState(false); // Only for chat content loading
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const topSentinalRef = useRef(null);
    const [fetchingMore, setFetchingMore] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll on initial load or new message (if near bottom)
    useEffect(() => {
        if (page === 1 && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length, page]);

    // Fetch Chat Details & Messages
    const fetchChat = async (pageNum = 1) => {
        if (!userId || !user) return;
        if (pageNum === 1) setLoading(true);
        else setFetchingMore(true);

        try {
            const res = await getChatDetails(userId, pageNum);
            const chatData = res.data;

            setChatDetails(chatData);

            const newMessages = chatData.messages || [];

            if (pageNum === 1) {
                setMessages(newMessages);
                if (chatData._id) joinChat(chatData._id);
            } else {
                // Prepend older messages
                setMessages(prev => [...newMessages, ...prev]);
            }

            // If we received fewer than limit (20), no more to load
            if (newMessages.length < 20) {
                setHasMoreMessages(false);
            }

            setLoading(false);
            setFetchingMore(false);
        } catch (error) {
            console.error("Error fetching chat:", error);
            // Fallback for new chat: Fetch user details directly
            if (pageNum === 1) {
                try {
                    const userRes = await getUserById(userId);
                    setChatDetails({
                        participants: [userRes.data, user] // Mock participants for display
                    });
                    setMessages([]);
                } catch (userError) {
                    console.error("Error fetching user details:", userError);
                }
            }
            setLoading(false);
            setFetchingMore(false);
        }
    };

    // Reset when userId changes
    useEffect(() => {
        setPage(1);
        setHasMoreMessages(true);
        setMessages([]);
        fetchChat(1);
    }, [userId, user]);

    // Fetch Recent Chats for Empty State
    useEffect(() => {
        const fetchRecentChats = async () => {
            if (!userId) {
                try {
                    const res = await getChats();
                    setRecentChats(res.data);
                } catch (err) {
                    console.error("Error fetching recent chats", err);
                }
            }
        };
        fetchRecentChats();
    }, [userId, user]);

    // Observer for loading previous messages
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreMessages && !loading && !fetchingMore) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchChat(nextPage);
                    return nextPage;
                });
            }
        }, { threshold: 1 });

        if (topSentinalRef.current) observer.observe(topSentinalRef.current);

        return () => observer.disconnect();
    }, [hasMoreMessages, loading, fetchingMore]);

    const [error, setError] = useState(null);

    // Limit Handling
    useEffect(() => {
        if (socket) {
            socket.on("error", (err) => {
                if (err.code === "LIMIT_REACHED") {
                    setError("You have reached your free message limit. Please book a date to continue chatting.");
                }
            });
        }
        return () => {
            socket?.off("error");
        };
    }, [socket]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (error) return;

        // Prevent 'boyfriend' role from starting a new chat if they somehow get here
        if (!chatDetails?._id && user?.role === 'boyfriend') {
            alert("Boyfriends cannot initiate new chats.");
            return;
        }

        if (!chatDetails?._id) {
            // New Chat: Send via REST API to create chat
            try {
                // Import sendMessage from api at the top if not already imported
                const { sendMessage: sendApiMessage } = await import("../api/api");
                const res = await sendApiMessage({ receiverId: userId, content: newMessage });

                // Update local state with the new chat details
                const newChat = res.data;
                setChatDetails(newChat);

                // Join the new socket room
                joinChat(newChat._id);

                // IMPORTANT: The backend returns the populated chat with the message.
                // We need to set messages to that array.
                // Also ensuring the message structure matches what UI expects.
                setMessages(newChat.messages || []);
                setNewMessage("");
            } catch (err) {
                console.error("Error creating chat:", err);
            }
        } else {
            // Existing Chat: Send via Socket
            sendMessage(chatDetails._id, newMessage, userId);
            setNewMessage("");
        }
    };

    // Responsive Logic
    // If no userId selected, show placeholder (Desktop) or ChatList (Mobile)
    // If userId selected, show Chat (Desktop & Mobile) with Back button on Mobile

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
            {/* Sidebar (ChatList) */}
            {/* Hidden on mobile if userId is selected (showing chat) */}
            <div className={`w-full md:w-1/3 lg:w-[30%] border-r flex-col ${userId ? "hidden md:flex" : "flex"}`}>
                <ChatList className="h-full" />
            </div>

            {/* Chat Area */}
            {/* Hidden on mobile if NO userId is selected (showing list) */}
            <div className={`flex-1 flex flex-col relative ${!userId ? "hidden md:flex" : "flex"}`}>
                {!userId ? (
                    <div className="flex flex-col h-full bg-muted/10 overflow-y-auto">
                        {/* Header Area */}
                        <div className="p-6 md:p-10 flex flex-col items-center text-center space-y-4">
                            {user?.role === 'user' ? (
                                <div className="bg-background p-4 rounded-full shadow-sm mb-2">
                                    <MessageCircleQuestion className="w-12 h-12 text-primary" />
                                </div>
                            ) : null}
                            <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
                            <p className="text-muted-foreground max-w-sm">
                                Pick up where you left off.
                            </p>
                        </div>

                        {/* Recent Chats Section */}
                        <div className="px-6 pb-6 space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recent Chats</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {recentChats.map(chat => {
                                    const otherUser = chat.otherParticipant || { name: "User" };
                                    return (
                                        <div key={chat._id} className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group" onClick={() => navigate(`/chats/${otherUser._id}`)}>
                                            <div className="relative">
                                                <UserAvatar user={otherUser} className="w-14 h-14 border-2 border-background group-hover:border-primary transition-colors" />
                                                {/* Status indicator can be added here if available in user object */}
                                            </div>
                                            <span className="text-xs font-medium truncate w-full text-center">{otherUser.name.split(' ')[0]}</span>
                                        </div>
                                    );
                                })}
                                {recentChats.length === 0 && <p className="text-sm text-muted-foreground italic">No recent chats.</p>}
                            </div>
                        </div>

                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 p-3 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate("/chats")}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>

                            {chatDetails && (
                                (() => {
                                    // Robustly find the other participant. 
                                    // If chatDetails is from getUserById (fallback), participants might be [userRes.data, user]
                                    // If from getChatDetails, it is standard.
                                    // We need to filter out the CURRENT user.
                                    let otherParticipant = chatDetails.participants?.find(p => p._id !== user._id);

                                    // Fallback if filtering failed (e.g. both have same ID? unlikely) 
                                    // or if array is malformed.
                                    if (!otherParticipant && chatDetails.participants?.length > 0) {
                                        otherParticipant = chatDetails.participants[0];
                                    }

                                    // Final fallback
                                    if (!otherParticipant) otherParticipant = { name: "User", profileImage: null };

                                    return (
                                        <>
                                            <UserAvatar
                                                user={otherParticipant}
                                                className="h-9 w-9 border"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h2 className="font-semibold text-sm truncate">
                                                    {otherParticipant.name}
                                                </h2>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
                                                </p>
                                            </div>
                                        </>
                                    );
                                })()
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 flex flex-col">
                            {/* Sentinel for infinite scroll */}
                            <div ref={topSentinalRef} className="h-1" />

                            {fetchingMore && (
                                <div className="flex justify-center p-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center py-10">Loading...</div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                                    <p>No messages yet.</p>
                                    <p className="text-sm">Say hello! 👋</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.sender._id === user._id || msg.sender === user._id;
                                    return (
                                        <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm break-words ${isMe
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-card border rounded-bl-none"
                                                }`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Error Overlay */}
                        {error && (
                            <div className="absolute bottom-20 left-4 right-4 bg-destructive/90 text-destructive-foreground p-3 rounded-xl text-center shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 z-20">
                                <p className="font-semibold text-sm">{error}</p>
                                <Button variant="secondary" size="sm" className="mt-2 h-8" asChild>
                                    <Link to="/boyfriends">Book Now</Link>
                                </Button>
                            </div>
                        )}

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 border-t bg-background flex items-center gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={
                                    error ? "Limit reached."
                                        : (!chatDetails?._id && user?.role === 'boyfriend') ? "Waiting for user to start..."
                                            : "Type a message..."
                                }
                                className="rounded-full shadow-inner bg-muted/30 border-muted focus-visible:ring-1"
                                disabled={!!error || (!chatDetails?._id && user?.role === 'boyfriend')}
                            />
                            <Button type="submit" size="icon" className="rounded-full h-10 w-10 shrink-0 shadow-md transition-transform active:scale-95" disabled={!!error}>
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
