import axios from "axios";

// Direct Localhost Connection
// const API_BASE_URL = "http://localhost:3000/api";
// Use VITE_BACKEND_URL or fallback to localhost
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Auth API
export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);
export const getMobileHandoverToken = () => api.get("/auth/mobile-handover");
export const mobileLogin = (token) => api.post("/auth/mobile-login", { token });
export const verifyEmail = (token) => api.get(`/auth/verify-email?token=${token}`);
export const resendVerificationEmail = () => api.post("/auth/resend-verification");
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (data) => api.post("/auth/reset-password", data);

// Upload API
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// User API
export const verifyUser = () => api.post("/users/verify");
export const getUserProfile = () => api.get("/users/profile");
export const updateUserProfile = (userData) => api.put("/users/profile", userData);
export const getUserById = (id) => api.get(`/users/${id}`);

// Boyfriend API
export const createBoyfriend = (data) => api.post("/boyfriends", data);
export const getMyBoyfriendProfile = () => api.get("/boyfriends/me");
export const updateBoyfriend = (data) => api.put("/boyfriends", data);
export const getBoyfriends = (params) => {
    // params can be { lat, lng, dist, page, limit, search }
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/boyfriends?${queryString}`);
};
export const getBoyfriendById = (id) => api.get(`/boyfriends/${id}`);

// Booking API
export const createBooking = (data) => api.post("/bookings", data);
export const getBookings = () => api.get("/bookings");
export const updateBookingStatus = (id, data) => api.put(`/bookings/${id}`, data);

// Chat API
export const getChats = () => api.get("/chats");
export const getChatDetails = (userId, page = 1) => api.get(`/chats/${userId}?page=${page}&limit=20`);
export const getChatMessages = (id) => api.get(`/chats/${id}`); // Potentially redundant if getChatDetails covers it, but keeping for now
export const sendMessage = (data) => api.post("/chats", data);

// Review API
export const createReview = (data) => api.post("/reviews", data);
export const getReviews = (boyfriendId, page = 1) => api.get(`/reviews/${boyfriendId}?page=${page}`);

export default api;