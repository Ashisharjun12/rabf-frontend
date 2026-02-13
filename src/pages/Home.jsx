import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Heart, Sparkles } from "lucide-react";
import BoyfriendList from "./BoyfriendList";
import { motion } from "framer-motion";


const Home = () => {
    // ... existing variants ...
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
            {/* Hero Section */}
            <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden bg-background">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100 via-background to-background dark:from-pink-900/20"></div>

                <div className="container px-4 md:px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col items-center space-y-10 text-center max-w-5xl mx-auto"
                    >
                        <motion.div variants={fadeIn} className="space-y-6">
                            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-300 mb-4">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                User Safety First Platform
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-tight">
                                Companionship on <br />
                                <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Your Terms.</span>
                            </h1>

                            <p className="mx-auto max-w-[800px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                                A safe, verified, and user-first platform for platonic companionship.
                                <br className="hidden sm:inline" /> You are in control: <strong>You message first.</strong> No unsolicited DMs.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Link to="/boyfriends">
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl w-full sm:w-auto">
                                    Browse Verified Companions
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 w-full sm:w-auto">
                                    How it Works
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Quick Trust Indicators */}
                        <motion.div variants={fadeIn} className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                <span>100% Face Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                <span>Strictly Platonic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-pink-500" />
                                <span>Ladies First Messaging</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Boyfriends Preview */}
            <section className="w-full py-20 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <BoyfriendList />
                </div>
            </section>

            {/* Safety & Rules Section */}
            <section className="w-full py-24 bg-muted/30">
                <div className="container px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            How We Keep You Safe
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            We've built this platform with a "Safety First" approach. Here is how we ensure a secure environment for everyone.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-background p-8 rounded-3xl shadow-sm border border-border/50 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldCheck className="w-24 h-24 text-pink-500" />
                            </div>
                            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Ladies First Messaging</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                You are in complete control. Companions <strong>cannot</strong> message you first. You initiate the conversation only when you feel comfortable.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-background p-8 rounded-3xl shadow-sm border border-border/50 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle2 className="w-24 h-24 text-blue-500" />
                            </div>
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Face Verified Only</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Every companion on our platform has undergone a mandatory <strong>AI Face Verification</strong> process. No catfishing, no fake profiles.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-background p-8 rounded-3xl shadow-sm border border-border/50 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Heart className="w-24 h-24 text-purple-500" />
                            </div>
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Zero Tolerance</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We have a zero-tolerance policy for non-platonic behavior. Report any misconduct, and our team takes immediate action.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Home;
