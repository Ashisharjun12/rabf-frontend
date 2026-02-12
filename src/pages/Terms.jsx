import { FileText, Users, AlertCircle, Ban, Scale } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const Terms = () => {
    return (
        <div className="container mx-auto max-w-5xl py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                    Terms of Service
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Please read these terms carefully before using our platform. By accessing or using RentYourDate, you agree to be bound by these terms.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            <div className="grid gap-8">
                {/* Acceptance */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                                <FileText className="w-6 h-6" />
                            </div>
                            <CardTitle>Acceptance of Terms</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                        <p>
                            By creating an account, accessing, or using <strong>RentYourDate</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use our services.
                        </p>
                    </CardContent>
                </Card>

                {/* User Responsibilities */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <CardTitle>User Responsibilities</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 text-muted-foreground">
                        <p>
                            You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                        </p>
                        <p>
                            You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                        </p>
                    </CardContent>
                </Card>

                {/* Prohibited Activities */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                                <Ban className="w-6 h-6" />
                            </div>
                            <CardTitle>Prohibited Activities</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ul className="grid gap-3 md:grid-cols-2">
                            {[
                                "Harassment, hate speech, or offensive behavior.",
                                "Posting false, misleading, or fraudulent content.",
                                "Impersonating any person or entity.",
                                "Using the platform for illegal purposes.",
                                "Interfering with or disrupting the service.",
                                "Attempting to bypass security measures."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 text-muted-foreground items-start">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Disclaimer */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden border-2 border-amber-100 dark:border-amber-900/20">
                    <CardHeader className="bg-amber-50 dark:bg-amber-900/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <CardTitle>Disclaimer</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                        <p>
                            <strong>RentYourDate</strong> is a platform provided "as is" and "as available". We make no representations or warranties of any kind, express or implied, regarding the operation of the platform or the information, content, or services included on it.
                        </p>
                        <p className="mt-4">
                            We do not guarantee that the services will be uninterrupted or error-free. You expressly agree that your use of the platform is at your sole risk.
                        </p>
                    </CardContent>
                </Card>

                {/* Governing Law */}
                <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-600 dark:text-gray-400">
                                <Scale className="w-6 h-6" />
                            </div>
                            <CardTitle>Governing Law</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 text-muted-foreground">
                        <p>
                            These Terms shall be governed by and defined following the laws of India. RentYourDate and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
                <p>
                    If you have any questions about these Terms, please <a href="/contact" className="text-primary hover:underline font-medium">Contact Us</a>.
                </p>
            </div>
        </div>
    );
};

export default Terms;
