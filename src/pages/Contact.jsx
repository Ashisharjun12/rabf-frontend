import { Mail, Phone, Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Contact = () => {
    return (
        <div className="container mx-auto max-w-5xl py-12 px-4">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
                Contact Developer
            </h1>

            <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                    <img
                        src="https://ik.imagekit.io/apo3bb1ur/image-1770786608698_emprtbthr.jpg"
                        alt="Ashish - Developer"
                        className="relative w-40 h-40 rounded-full border-4 border-background object-cover shadow-xl"
                    />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Ashish</h2>
                    <p className="text-muted-foreground font-medium">Developer of this Platform</p>
                </div>
            </div>

            <Card className="rounded-[2rem] border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-center text-muted-foreground mb-6">
                        If you encounter any bugs or have suggestions, please feel free to reach out directly.
                    </p>

                    <div className="grid gap-4">
                        <a href="mailto:ashishrahul748@gmail.com" className="group">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border">
                                <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Email</p>
                                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">ashishrahul748@gmail.com</p>
                                </div>
                            </div>
                        </a>

                        <a href="tel:8757641329" className="group">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border">
                                <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Phone</p>
                                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">8757641329</p>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 flex gap-3 items-start mt-4">
                        <Bug className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            <strong>Found a bug?</strong> Please include screenshots and details in your email to help us fix it faster!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Contact;
