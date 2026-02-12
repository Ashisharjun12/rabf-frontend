import { Shield, Heart, Zap, MapPin, UserCheck, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const About = () => {
    return (
        <div className="container mx-auto py-12 px-4 md:px-8 max-w-6xl">
            {/* Hero Section */}
            <div className="text-center mb-20 space-y-6">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                    The Future of Platonic Companionship
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent pb-2">
                    Safe. Anonymous. Verified.
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Connect with genuine companions for dates, dinners, and events.
                    No strings attached, just quality time with verified people.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Button size="lg" className="rounded-full px-8 h-12 text-base" asChild>
                        <Link to="/boyfriends">Find a Companion</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base" asChild>
                        <Link to="/boyfriends/create">Become a Boyfriend</Link>
                    </Button>
                </div>
            </div>

            {/* How it Works Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold">For Users</h2>
                    <div className="space-y-6">
                        <FeatureItem
                            icon={<Lock className="w-6 h-6 text-primary" />}
                            title="Total Anonymity"
                            description="Chat and book anonymously. Your personal details are never shared until you decide."
                        />
                        <FeatureItem
                            icon={<Shield className="w-6 h-6 text-primary" />}
                            title="User Safety First"
                            description="Every profile is verified manually and via AI face matching technology. We prioritize your safety above all."
                        />
                        <FeatureItem
                            icon={<MapPin className="w-6 h-6 text-primary" />}
                            title="Location Based"
                            description="Find companions near you using our precise GPS filters. Perfect for last-minute plans."
                        />
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <Card className="relative border-0 shadow-2xl bg-card/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Why use our platform?</CardTitle>
                            <CardDescription>We solve loneliness with genuine connection.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Whether you need a plus-one for a wedding, a dinner companion, or just someone to talk to,
                                we provide a safe space to find platonic relationships.
                            </p>
                            <p className="text-muted-foreground">
                                No relationship pressure. Just clear expectations and verified company.
                            </p>
                            <Separator className="my-4" />
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span>Instant Booking Confirmation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <UserCheck className="w-4 h-4 text-green-500" />
                                <span>100% Verified Profiles</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* For Boyfriends Section */}
            <div className="bg-muted/30 rounded-[3rem] p-8 md:p-16 text-center mb-24">
                <h2 className="text-3xl font-bold mb-6">For Boyfriends</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                    Monetize your time and social skills. Set your own rates, choose your schedule, and meet interesting people.
                </p>
                <div className="grid sm:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
                    <Card className="bg-background border-none shadow-lg">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Set Your Rate</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm">
                            You control your earning potential. Charge hourly for your time and companionship.
                        </CardContent>
                    </Card>
                    <Card className="bg-background border-none shadow-lg">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Get Verified</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm">
                            Pass our AI verification checks to earn the "Verified" badge and attract more bookings.
                        </CardContent>
                    </Card>
                    <Card className="bg-background border-none shadow-lg">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Be Yourself</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm">
                            Showcase your personality, hobbies, and traits to find the right match for your vibe.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Tech Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold">Powered by Advanced AI</h2>
                <p className="text-muted-foreground leading-relaxed">
                    We use state-of-the-art **AI Face Matching** technology to ensure that the person in the photos
                    is the person you meet. Our commitment to safety means zero catfishing and complete peace of mind.
                </p>
                <div className="flex justify-center gap-8 pt-8 opacity-70">
                    {/* Logos or Icons could go here */}
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ icon, title, description }) => (
    <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-muted-foreground leading-snug">{description}</p>
        </div>
    </div>
);

export default About;
