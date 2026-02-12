import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/api'; // Import your configured axios instance

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isCheckingAuth: true,

            checkAuth: async () => {
                set({ isCheckingAuth: true });
                try {
                    const response = await api.get("/auth/check");
                    set({ user: response.data, isCheckingAuth: false });
                } catch (error) {
                    console.log("Auth check failed:", error);
                    set({ user: null, isCheckingAuth: false });
                }
            },

            login: async (userData) => {
                set({ user: userData });
            },

            logout: async () => {
                try {
                    await api.post("/auth/logout");
                    set({ user: null });
                } catch (error) {
                    console.error("Logout error", error);
                    set({ user: null });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);

export default useAuthStore;
