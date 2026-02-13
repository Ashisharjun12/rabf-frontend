import { createContext, useContext, useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { toast } from "sonner";
import notificationSound from "../assets/instagram.mp3";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState([]); // Store recent notifications
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let eventSource;

        if (user) {
            // Adjust port/url if needed based on environment
            // Getting base URL from window location or hardcoded if separate
            // Ideally import API_BASE_URL from api.js but it might not be exported as string cleanly or might be relative
            // For now assuming localhost:3000 as per api.js
            const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

            // We need to pass token? 
            // EventSource doesn't support headers easily. 
            // We usually pass token in query param or rely on cookie.
            // Our backend uses cookie-parser, so if cookie is set, it should work.
            // If we need token, we might need a library like 'event-source-polyfill' or native if cookies work.
            // Let's assume cookies work since we use { withCredentials: true } in axios.

            eventSource = new EventSource(`${API_URL}/notifications/stream`, { withCredentials: true });

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === "connected") {
                        console.log("SSE Connected");
                        return;
                    }

                    // Handle Notification
                    setNotifications(prev => [data, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Play Sound
                    const audio = new Audio(notificationSound);
                    audio.play().catch(err => console.error("Audio play failed", err));

                    // Show Toast
                    toast(data.message, {
                        description: new Date().toLocaleTimeString(),
                        action: {
                            label: "View",
                            onClick: () => window.location.href = data.link || "/bookings",
                        },
                    });

                } catch (error) {
                    console.error("Error parsing SSE data", error);
                }
            };

            eventSource.onerror = (err) => {
                console.error("SSE Error:", err);
                eventSource.close();
                // Retry logic could be added here
            };
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [user]);

    const markAllRead = () => {
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
