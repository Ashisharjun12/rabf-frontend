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
            <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-background to-background dark:from-purple-900/20"></div>
                <div className="container px-4 md:px-6">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col items-center space-y-8 text-center"
                    >
                        <motion.div variants={fadeIn} className="space-y-4 max-w-4xl">
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                Rent a <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">Companion</span>, <br className="hidden sm:inline" />
                                Not a Relationship.
                            </h1>
                            <p className="mx-auto max-w-[800px] text-gray-500 md:text-xl/relaxed lg:text-2xl/relaxed dark:text-gray-400">
                                Platonic companionship tailored to your needs. Whether it's a wedding date, a family dinner, or just a movie buddy—find your verified partner today.
                            </p>
                        </motion.div>
                        <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4">
                            <Link to="/signup">
                                <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-pink-600 to-violet-600 border-0">
                                    Get Started <Sparkles className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/boyfriends">
                                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2 hover:bg-accent transition-all">
                                    Browse Companions
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="w-full py-20 bg-muted/30 relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                <div className="container px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                About Us
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Redefining Modern <span className="text-primary">Companionship</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We provide a safe, secure, and judgment-free platform to connect with verified companions for platonic activities.
                                Our mission is to alleviate loneliness and provide social support for any occasion.
                                No pressure, no strings attached—just genuine human connection.
                            </p>
                            <ul className="grid gap-4 mt-4">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <span className="font-medium">100% Platonic & Professional</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <span className="font-medium">Strict Verification Process</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <span className="font-medium">Transparent Pricing</span>
                                </li>
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-3xl blur-2xl opacity-20 transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=2070&auto=format&fit=crop"
                                alt="Friends having coffee"
                                className="relative mx-auto rounded-3xl shadow-2xl object-cover w-full aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Privacy & Safety Section */}
            <section className="w-full py-20 bg-background relative overflow-hidden">
                <div className="absolute -left-20 top-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -right-20 bottom-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Safety First
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Verified. Safe. Secure.
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            We take your safety seriously. Our rigorous verification process ensures that every profile you see is real and vetted.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Identity Verified",
                                desc: "Every companion undergoes a mandatory face verification process. Look for the Blue Tick.",
                                color: "text-blue-500"
                            },
                            {
                                icon: CheckCircle2,
                                title: "Strictly Platonic",
                                desc: "Our community guidelines strictly prohibit non-platonic behavior. We prioritize your comfort.",
                                color: "text-green-500"
                            },
                            {
                                icon: Heart,
                                title: "Privacy Protection",
                                desc: "Your personal data is encrypted and never shared. Chat securely within our platform.",
                                color: "text-pink-500"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center p-8 rounded-3xl bg-muted/50 border hover:border-primary/50 transition-colors backdrop-blur-sm"
                            >
                                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm mb-6 ${item.color}`}>
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Boyfriends Preview */}
            <section className="w-full py-20 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                Featured Companions
                            </h2>
                            <p className="text-muted-foreground max-w-xl">
                                Meet some of our top-rated companions ready to make your day special.
                            </p>
                        </div>
                        <Link to="/boyfriends">
                            <Button variant="ghost" className="group">
                                View All Companions <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </Button>
                        </Link>
                    </div>

                    <BoyfriendList />
                </div>
            </section>
        </div>
    );
};
export default Home;
