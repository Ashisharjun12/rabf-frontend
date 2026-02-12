import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginUser({ email, password });
            login(response.data); // Update global auth state
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl"
                    />
                </div>
                <div className="grid gap-2 relative">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            to="/forgot-password"
                            className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-xl pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline font-medium text-primary">
                    Sign up
                </Link>
            </div>
        </div>
    );
};

export default Login;
