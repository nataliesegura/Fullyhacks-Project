"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, LogOut } from "lucide-react";
import UFO from "@/assets/ufo.svg";
import homeBackground from "@/assets/homebackground.jpg";

interface Friend {
    id: string;
    name: string;
    selected: boolean;
}

interface Location {
    id: string;
    name: string;
}

export default function HomePage() {
    const navigate = useNavigate();
    const [friends, setFriends] = useState<Friend[]>([
        { id: "1", name: "Friend 1", selected: false },
        { id: "2", name: "Friend 2", selected: false },
        { id: "3", name: "Friend 3", selected: false },
        { id: "4", name: "Friend 4", selected: false },
        { id: "5", name: "Friend 5", selected: false },
    ]);
    const [locations, setLocations] = useState<Location[]>([
        { id: "1", name: "" },
        { id: "2", name: "" },
        { id: "3", name: "" },
        { id: "4", name: "" },
        { id: "5", name: "" },
    ]);
    const [newFriendName, setNewFriendName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toggleFriendSelection = (id: string) => {
        setFriends(
            friends.map((friend) =>
                friend.id === id
                    ? { ...friend, selected: !friend.selected }
                    : friend
            )
        );
    };

    const addFriend = () => {
        if (newFriendName.trim()) {
            const newId = (friends.length + 1).toString();
            setFriends([
                ...friends,
                { id: newId, name: newFriendName, selected: false },
            ]);
            setNewFriendName("");
        }
    };

    const removeFriend = (id: string) => {
        setFriends(friends.filter((friend) => friend.id !== id));
    };

    const updateLocation = (id: string, name: string) => {
        setLocations(
            locations.map((location) =>
                location.id === id ? { ...location, name } : location
            )
        );
    };

    const addLocation = () => {
        const newId = (locations.length + 1).toString();
        setLocations([...locations, { id: newId, name: "" }]);
    };

    const removeLocation = (id: string) => {
        setLocations(locations.filter((location) => location.id !== id));
    };

    const handleGetResults = async () => {
        setIsLoading(true);
        try {
            // In a real app, you would send the selected friends and locations to your backend
            const selectedFriends = friends.filter((friend) => friend.selected);
            const filledLocations = locations.filter(
                (loc) => loc.name.trim() !== ""
            );

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Store data in sessionStorage to access it on the results page
            sessionStorage.setItem(
                "tripData",
                JSON.stringify({
                    friends: selectedFriends,
                    locations: filledLocations,
                })
            );

            // Navigate to results page
            navigate("/results");
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // In a real app, you would clear auth tokens here
        navigate("/login");
    };

    return (
        <div className="relative min-h-screen w-screen overflow-hidden bg-black">
            {/* Space background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${homeBackground})`,
                    backgroundSize: "cover",
                }}
            />

            {/* Header */}
            <header className="relative z-10 bg-purple-700 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 relative">
                        <img
                            src={UFO || "/placeholder.svg"}
                            alt="ChatConcierge Logo"
                            width={32}
                            height={32}
                        />
                    </div>
                    <h1 className="text-white text-xl font-bold">
                        ChatConcierge
                    </h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-white hover:bg-purple-600"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-4 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-white mb-8 mt-4">
                    Plan Yo Twip
                </h1>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Friends Section */}
                    <Card className="bg-purple-200 opacity-95 border-none">
                        <CardHeader className="bg-purple-300 rounded-t-lg">
                            <CardTitle className="text-center text-xl">
                                Contacts:
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {friends.map((friend) => (
                                    <div
                                        key={friend.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`friend-${friend.id}`}
                                                checked={friend.selected}
                                                onCheckedChange={() =>
                                                    toggleFriendSelection(
                                                        friend.id
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`friend-${friend.id}`}
                                                className="text-black font-medium"
                                            >
                                                {friend.name}
                                            </Label>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeFriend(friend.id)
                                            }
                                            className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <Input
                                    placeholder="Add new friend"
                                    value={newFriendName}
                                    onChange={(e) =>
                                        setNewFriendName(e.target.value)
                                    }
                                    className="bg-white"
                                />
                                <Button
                                    onClick={addFriend}
                                    className="bg-purple-500 hover:bg-purple-600"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Locations Section */}
                    <Card className="bg-purple-200 opacity-95 border-none">
                        <CardHeader className="bg-purple-300 rounded-t-lg">
                            <CardTitle className="text-center text-xl">
                                Locations:
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {locations.map((location, index) => (
                                    <div
                                        key={location.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Label
                                            htmlFor={`location-${location.id}`}
                                            className="text-black font-medium w-8"
                                        >
                                            L{index + 1}:
                                        </Label>
                                        <Input
                                            id={`location-${location.id}`}
                                            placeholder="Enter location"
                                            value={location.name}
                                            onChange={(e) =>
                                                updateLocation(
                                                    location.id,
                                                    e.target.value
                                                )
                                            }
                                            className="bg-white flex-1"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeLocation(location.id)
                                            }
                                            className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {locations.length < 10 && (
                                <Button
                                    onClick={addLocation}
                                    className="mt-4 bg-purple-500 hover:bg-purple-600 w-full"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                    Location
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Results Button */}
                <Button
                    onClick={handleGetResults}
                    disabled={isLoading}
                    className="mt-8 px-8 py-6 text-xl font-bold bg-pink-300 hover:bg-pink-400 text-black rounded-md"
                    size="lg"
                >
                    {isLoading ? "Loading..." : "Click for Results!"}
                </Button>
            </main>
        </div>
    );
}
