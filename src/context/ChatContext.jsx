import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuthStore();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);

    const socketRef = useRef();

    useEffect(() => {
        if (user && !socketRef.current) {
            // Initialize Socket
            // Replace with your backend URL
            const newSocket = io("http://localhost:3000", {
                withCredentials: true,
            });

            socketRef.current = newSocket;
            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("Connected to Socket.IO server");
            });

            newSocket.on("receive_message", (message) => {
                setMessages((prev) => [...prev, message]);
            });

            newSocket.on("disconnect", () => {
                console.log("Disconnected from Socket.IO server");
            });

            return () => {
                newSocket.disconnect();
                socketRef.current = null;
                setSocket(null);
            };
        }
    }, [user]);

    const joinChat = useCallback((roomId) => {
        if (socket) {
            socket.emit("join_chat", roomId);
            setActiveChat(roomId);
        }
    }, [socket]);

    const sendMessage = useCallback((roomId, content, receiverId) => {
        if (socket) {
            socket.emit("send_message", { roomId, content, receiverId });
        }
    }, [socket]);

    return (
        <ChatContext.Provider value={{ socket, messages, setMessages, chats, setChats, activeChat, setActiveChat, joinChat, sendMessage, loading }}>
            {children}
        </ChatContext.Provider>
    );
};
