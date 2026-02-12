import { Shield, Lock, Eye, Database, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const Privacy = () => {
    return (
        <div className="container mx-auto max-w-5xl py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Your privacy is our top priority. We are committed to protecting your personal information and being transparent about how we use it.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            <div className="grid gap-8">
                {/* Introduction Section */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <CardTitle>Introduction</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                        <p>
                            At <strong>Rent-A-Boyfriend</strong>, we value the trust you place in us. This Privacy Policy explains what data we collect, why we collect it, and how we safeguard your information. By using our platform, you agree to the practices described in this policy.
                        </p>
                    </CardContent>
                </Card>

                {/* Data Collection */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <Database className="w-6 h-6" />
                            </div>
                            <CardTitle>Information We Collect</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-muted/30 p-5 rounded-2xl">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    Personal Information
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    We collect information you provide directly to us, such as your name, email address, profile photo, and bio when you create an account.
                                </p>
                            </div>
                            <div className="bg-muted/30 p-5 rounded-2xl">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                                    Usage Data
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    We automatically collect certain information about your device and how you interact with our platform to improve our services.
                                </p>
                            </div>
                            <div className="bg-muted/30 p-5 rounded-2xl">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                    Verification Data
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    For safety, we may collect facial recognition data during the verification process. This data is used solely for identity verification and is securely stored.
                                </p>
                            </div>
                            <div className="bg-muted/30 p-5 rounded-2xl">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Communications
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    We process messages sent through our chat system to ensure user safety and prevent harassment.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* How We Use Information */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                <Eye className="w-6 h-6" />
                            </div>
                            <CardTitle>How We Use Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ul className="grid gap-3 md:grid-cols-2">
                            {[
                                "To provide, maintain, and improve our services.",
                                "To personalize your experience and show relevant content.",
                                "To verify your identity and maintain platform safety.",
                                "To communicate with you about updates and security alerts.",
                                "To prevent fraud and enforce our Terms of Servce.",
                                "To analyze usage trends and optimize performance."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 text-muted-foreground items-start">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden bg-gradient-to-br from-background to-muted/50">
                    <CardHeader className="border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                                <Lock className="w-6 h-6" />
                            </div>
                            <CardTitle>Data Security</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                        <p className="mb-4">
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                        <p>
                            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
                <p>
                    If you have any questions about this Privacy Policy, please <a href="/contact" className="text-primary hover:underline font-medium">Contact Us</a>.
                </p>
            </div>
        </div>
    );
};

export default Privacy;
