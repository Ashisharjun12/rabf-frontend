
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import AuthLayout from "./components/templates/AuthLayout";
import Home from "./pages/Home";
import BoyfriendList from "./pages/BoyfriendList";
import BoyfriendProfile from "./pages/BoyfriendProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail"; // Import VerifyEmail
import ForgotPassword from "./pages/ForgotPassword"; // Import ForgotPassword
import ResetPassword from "./pages/ResetPassword"; // Import ResetPassword
import MobileHandover from "./pages/MobileHandover";

import Verification from "./pages/Verification";
import { ChatProvider } from "./context/ChatContext";
import { NotificationProvider } from "./context/NotificationContext"; // Import NotificationProvider
import ChatWindow from "./pages/ChatWindow";
import BookingList from "./pages/BookingList"; // Import BookingList
import About from "./pages/About"; // Import About Page
import Contact from "./pages/Contact"; // Import Contact Page
import Privacy from "./pages/Privacy"; // Import Privacy Page
import Terms from "./pages/Terms"; // Import Terms Page
import Profile from "./pages/Profile"; // Import Profile Page
import MyBoyfriendProfile from "./pages/MyBoyfriendProfile"; // Import MyBoyfriendProfile
import ProtectedRoute from "./components/templates/ProtectedRoute";
import useAuthStore from "./store/authStore";
import { Toaster } from "sonner"; // Import Toaster
import { useEffect } from "react";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <NotificationProvider>
      <ChatProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="boyfriends" element={<BoyfriendList />} />

            {/* Auth Pages within MainLayout if header/footer needed, otherwise move to AuthLayout or standalone */}
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="handover" element={<MobileHandover />} />

            {/* Protected Routes */}
            <Route path="boyfriends/create" element={
              <ProtectedRoute>
                <MyBoyfriendProfile />
              </ProtectedRoute>
            } />
            <Route path="boyfriends/me" element={
              <ProtectedRoute>
                <MyBoyfriendProfile />
              </ProtectedRoute>
            } />
            <Route path="boyfriends/:id" element={
              <ProtectedRoute>
                <BoyfriendProfile />
              </ProtectedRoute>
            } />
            <Route path="verify" element={
              <ProtectedRoute>
                <Verification />
              </ProtectedRoute>
            } />
            <Route path="chats" element={
              <ProtectedRoute>
                <ChatWindow />
              </ProtectedRoute>
            } />
            <Route path="chats/:userId" element={
              <ProtectedRoute>
                <ChatWindow />
              </ProtectedRoute>
            } />
            <Route path="bookings" element={
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="*" element={<div className="p-10 text-center">404 - Not Found</div>} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </ChatProvider>
    </NotificationProvider>
  );
}

export default App;