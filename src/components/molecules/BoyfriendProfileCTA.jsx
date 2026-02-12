import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getMyBoyfriendProfile } from "../../api/api";
import { Button } from "../ui/button";
import { AlertTriangle, ArrowRight, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BoyfriendProfileCTA = () => {
    const { user } = useAuthStore();
    const [promptType, setPromptType] = useState(null); // 'create' | 'verify' | 'activate' | null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            if (user && user.role === "boyfriend") {
                // 1. Check Account Activation First
                if (!user.isAccountVerified) {
                    setPromptType("activate");
                    setLoading(false);
                    return;
                }

                try {
                    await getMyBoyfriendProfile();
                    // Profile exists. Check verification status.
                    if (!user.isVerified) {
                        setPromptType("verify");
                    } else {
                        setPromptType(null);
                    }
                } catch (error) {
                    // If 404, it means profile doesn't exist
                    if (error.response && error.response.status === 404) {
                        setPromptType("create");
                    }
                }
            }
            setLoading(false);
        };

        checkProfile();
    }, [user]);

    if (loading || !promptType) return null;

    const isVerify = promptType === "verify";
    const isActivate = promptType === "activate";

    let content = {};
    if (isActivate) {
        content = {
            theme: "yellow",
            icon: AlertTriangle,
            title: "Activate your Account!",
            description: "Please check your email to verify your account before you can create a profile.",
            buttonText: "Check Email",
            link: "/profile", // Direct to profile where they can see status/resend
            gradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/90 dark:to-amber-950/80 border-yellow-200/50 dark:border-yellow-800/30",
            textMain: "text-yellow-900 dark:text-yellow-100",
            bgIcon: "bg-yellow-100 dark:bg-yellow-900/50",
            iconColor: "text-yellow-600 dark:text-yellow-400",
            textSub: "text-yellow-700 dark:text-yellow-300",
            btnClass: "bg-yellow-500 hover:bg-yellow-600 text-white"
        };
    } else if (isVerify) {
        content = {
            theme: "blue",
            icon: AlertTriangle,
            title: "Verify your Identity!",
            description: "You need to verify your profile photo to get the 'Verified' badge and appear in search.",
            buttonText: "Verify Now",
            link: "/verify",
            gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/90 dark:to-indigo-950/80 border-blue-200/50 dark:border-blue-800/30",
            textMain: "text-blue-900 dark:text-blue-100",
            bgIcon: "bg-blue-100 dark:bg-blue-900/50",
            iconColor: "text-blue-600 dark:text-blue-400",
            textSub: "text-blue-700 dark:text-blue-300",
            btnClass: "bg-blue-500 hover:bg-blue-600 text-white"
        };
    } else {
        // Create
        content = {
            theme: "amber",
            icon: AlertTriangle,
            title: "Your Boyfriend Profile is incomplete!",
            description: "You won't appear in search results until you set up your public profile.",
            buttonText: "Create Profile",
            link: "/boyfriends/me",
            gradient: "from-amber-50 to-orange-50 dark:from-amber-950/90 dark:to-orange-950/80 border-amber-200/50 dark:border-amber-800/30",
            textMain: "text-amber-900 dark:text-amber-100",
            bgIcon: "bg-amber-100 dark:bg-amber-900/50",
            iconColor: "text-amber-600 dark:text-amber-400",
            textSub: "text-amber-700 dark:text-amber-300",
            btnClass: "bg-amber-500 hover:bg-amber-600 text-white"
        };
    }

    const Icon = content.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`sticky top-24 z-40 mx-auto max-w-6xl w-[95%] rounded-2xl shadow-lg backdrop-blur-md mb-6 cursor-pointer px-6 border bg-gradient-to-r ${content.gradient}`}
            >
                <div className="w-full py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className={`flex items-center gap-3 ${content.textMain}`}>
                        <div className={`p-2 rounded-full ${content.bgIcon}`}>
                            <Icon className={`h-5 w-5 ${content.iconColor}`} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="font-semibold text-sm sm:text-base">
                                {content.title}
                            </p>
                            <p className={`text-xs sm:text-sm ${content.textSub}`}>
                                {content.description}
                            </p>
                        </div>
                    </div>

                    <Link to={content.link}>
                        <Button
                            size="sm"
                            className={`border-none shadow-sm gap-2 whitespace-nowrap rounded-full ${content.btnClass}`}
                        >
                            <UserCircle className="h-4 w-4" />
                            {content.buttonText}
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BoyfriendProfileCTA;
