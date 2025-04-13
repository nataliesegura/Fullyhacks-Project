"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate, Link } from "react-router"; 
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import UFO from "@/assets/ufo.svg";
import planet from "@/assets/planet.svg";
import back from "@/assets/back.svg";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Here you would typically handle authentication with your backend
        // For now, we'll just simulate a successful login/registration

        console.log(isLogin ? "Logging in..." : "Registering...", {
            username,
            password,
        });

        // Redirect to home page after successful login/registration
        navigate("/home");
    };

    return (
        // Added relative positioning to the main container for absolute positioning of the back button
        <div className="relative min-h-screen flex flex-col w-screen">
            {/* Back Button - Positioned Top Left */}
            <Link
                to="/"
                className="absolute top-4 left-4 z-10 p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center gap-1 text-sm"
                aria-label="Back to Home" // Added aria-label for accessibility
            >
                {/* Optional: Add an icon like a back arrow */}
                {/* <span>Back</span> */}
                <div className="relative">
                        <img
                            src={back}
                            alt="ChatConcierge Logo"
                            width={12}
                            height={12}
                        />
                </div>
            </Link>

            {/* Header */}
            <header className="bg-purple-500 p-4 flex justify-center items-center">
                <div className="flex items-center gap-2">
                    <div className="h-12 w-12 relative">
                        <img
                            src={UFO}
                            alt="ChatConcierge Logo"
                            width={48}
                            height={48}
                        />
                    </div>
                    <h1 className="text-white text-2xl font-bold">
                        ChatConcierge
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 bg-purple-100">
                <Card className="w-full max-w-md bg-black text-white border-none shadow-xl">
                    <CardHeader className="text-center">
                        <h2 className="text-2xl font-semibold">
                            Login or Register
                        </h2>
                    </CardHeader>

                    <div className="flex justify-center my-4">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 bg-black rounded-full flex items-center justify-center">
                                <img
                                    src={planet}
                                    alt="Planet Icon" // More descriptive alt text
                                    width={72}
                                    height={72}
                                />
                            </div>
                        </div>
                    </div>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="username"
                                    className="text-white text-xl"
                                >
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className="bg-gray-200 text-black h-12"
                                    required // Added required attribute
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-white text-xl"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="bg-gray-200 text-black h-12"
                                    required // Added required attribute
                                />
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="confirmPassword"
                                        className="text-white text-xl"
                                    >
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="bg-gray-200 text-black h-12"
                                        required={!isLogin} // Required only when registering
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-purple-500 hover:bg-purple-600 text-white h-12"
                                >
                                    {isLogin ? "Login" : "Register"}
                                </Button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-purple-300 hover:text-purple-200 text-sm"
                                >
                                    {isLogin
                                        ? "Need an account? Register"
                                        : "Already have an account? Login"}
                                </button>
                            </div>

                            {/* Removed the Back to Home link from here */}
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
