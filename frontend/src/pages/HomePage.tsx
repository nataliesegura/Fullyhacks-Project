/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/HomePage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, LogOut } from "lucide-react";
import UFO from "@/assets/ufo.svg";
import homeBackground from "@/assets/homebackground.jpg";
import { useAuth } from "@/contexts/authContext";
import * as api from "@/lib/api";

// Interfaces remain the same
interface ApiFriend {
    id: number;
    name: string;
}
interface ApiLocation {
    id: number;
    name: string;
}
interface Friend extends ApiFriend {
    selected: boolean;
}
type Location = ApiLocation;

export default function HomePage() {
    const navigate = useNavigate();
    const { user, logout: authLogout } = useAuth();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [newFriendName, setNewFriendName] = useState("");
    const [newLocationName, setNewLocationName] = useState(""); // <-- State for new location input
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Fetch Initial Data (Unchanged) ---
    const fetchData = useCallback(async () => {
        if (!user?.id) return;
        setIsFetchingData(true);
        setError(null);
        try {
            const [friendsRes, locationsRes] = await Promise.all([
                api.getFriends(user.id),
                api.getLocations(user.id),
            ]);
            setFriends(
                friendsRes.data.map((f: ApiFriend) => ({
                    ...f,
                    selected: false,
                }))
            );
            setLocations(locationsRes.data);
        } catch (err) {
            console.error("Error fetching initial data:", err);
            setError("Failed to load your friends and locations.");
        } finally {
            setIsFetchingData(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Friend Management (Unchanged) ---
    const toggleFriendSelection = (id: number) => {
        setFriends(
            friends.map((friend) =>
                friend.id === id
                    ? { ...friend, selected: !friend.selected }
                    : friend
            )
        );
    };

    const addFriend = async () => {
        if (!newFriendName.trim() || !user?.id) return;
        try {
            const response = await api.addFriend(user.id, {
                username: newFriendName.trim(),
            });
            setFriends([...friends, { ...response.data, selected: false }]);
            setNewFriendName("");
            setError(null);
        } catch (err: any) {
            console.error("Error adding friend:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to add friend. User may not exist or is already a friend."
            );
        }
    };

    const removeFriend = async (id: number) => {
        if (!user?.id) return;
        const originalFriends = [...friends];
        setFriends(friends.filter((friend) => friend.id !== id));
        try {
            await api.removeFriend(user.id, id);
            setError(null);
        } catch (err: any) {
            console.error("Error removing friend:", err);
            setError(err.response?.data?.message || "Failed to remove friend.");
            setFriends(originalFriends);
        }
    };

    // --- Location Management (MODIFIED) ---
    const addLocation = async () => {
        // Now adds the location from the input field
        if (!newLocationName.trim() || !user?.id) return;
        try {
            const response = await api.addLocation(user.id, {
                name: newLocationName.trim(), // Send the name from input
            });
            setLocations([...locations, response.data]); // Add the new location to the list
            setNewLocationName(""); // Clear the input field
            setError(null);
        } catch (err: any) {
            console.error("Error adding location:", err);
            setError(err.response?.data?.message || "Failed to add location.");
        }
    };

    // updateLocation is no longer needed if we don't allow inline editing
    // const updateLocation = (id: number, name: string) => { ... };

    const removeLocation = async (id: number) => {
        if (!user?.id) return;
        const originalLocations = [...locations];
        setLocations(locations.filter((location) => location.id !== id));
        try {
            await api.removeLocation(user.id, id);
            setError(null);
        } catch (err: any) {
            console.error("Error removing location:", err);
            setError(
                err.response?.data?.message || "Failed to remove location."
            );
            setLocations(originalLocations);
        }
    };

    // --- Get Results (MODIFIED) ---
    const handleGetResults = async () => {
        if (!user?.id) {
            setError("You must be logged in to get results.");
            return;
        }

        const selectedFriends = friends.filter((friend) => friend.selected);

        // Require at least one friend to be selected for common location logic
        if (selectedFriends.length === 0) {
            setError(
                "Please select at least one friend to find common locations."
            );
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Send ONLY the selected friend IDs to the backend
            const response = await api.getTripResults(user.id, {
                friend_ids: selectedFriends.map((f) => f.id), // Send selected friend IDs
                // We no longer send locations from here; backend finds common SAVED ones
            });

            // Navigate to results page, passing the data from the backend response
            // Include selected friends info for potential display on results page
            navigate("/results", {
                state: {
                    resultData: response.data,
                    selectedFriends: selectedFriends.map((f) => ({
                        id: f.id,
                        name: f.name,
                    })), // Pass names too
                },
            });
        } catch (error: any) {
            console.error("Error fetching results:", error);
            setError(
                error.response?.data?.message ||
                    "Failed to generate trip results. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // --- Logout (Unchanged) ---
    const handleLogout = () => {
        authLogout();
    };

    // --- Render Logic (MODIFIED Location Section) ---
    if (isFetchingData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-purple-900 text-white">
                Loading your plans...
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-screen overflow-hidden bg-black">
            {/* Background & Header (Unchanged) */}
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
                        ChatConcierge {user && `(Hi, ${user.username}!)`}
                    </h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-white hover:bg-purple-600"
                    aria-label="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </header>
            {/* Main Content */}
            <main className="relative z-10 p-4 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-white mb-8 mt-4">
                    Plan Yo Twip
                </h1>

                {/* Error Display (Unchanged) */}
                {error && (
                    <div className="mb-4 p-3 bg-red-200 text-red-800 rounded-md max-w-4xl w-full text-center">
                        {error}
                    </div>
                )}

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Friends Section (Unchanged) */}
                                         <Card className="bg-purple-200 opacity-95 border-none">
                        <CardHeader className="bg-purple-300 rounded-t-lg">
                            <CardTitle className="text-center text-xl">
                                Contacts:
                            </CardTitle>
                         </CardHeader>
                         <CardContent className="p-4">
                             <div className="space-y-3 min-h-[100px]">
                                 {/* Added min-height */}
                                 {friends.length === 0 && (
                                    <p className="text-center text-gray-600">
                                        No friends added yet.
                                    </p>
                                )}
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
                                                aria-labelledby={`friend-label-${friend.id}`}
                                            />
                                            <Label
                                                id={`friend-label-${friend.id}`}
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
                                            aria-label={`Remove friend ${friend.name}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <Input
                                    placeholder="Add friend by username" // Changed placeholder
                                    value={newFriendName}
                                    onChange={(e) =>
                                        setNewFriendName(e.target.value)
                                    }
                                    className="bg-white"
                                    aria-label="Add new friend by username"
                                />
                                <Button
                                    onClick={addFriend}
                                    className="bg-purple-500 hover:bg-purple-600"
                                    // Add loading state indicator if desired
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Locations Section (MODIFIED) */}
                    <Card className="bg-purple-200 opacity-95 border-none">
                        <CardHeader className="bg-purple-300 rounded-t-lg">
                            <CardTitle className="text-center text-xl">
                                Your Saved Locations:
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {/* List of saved locations */}
                            <div className="space-y-3 min-h-[100px] mb-4">
                                {locations.length === 0 && (
                                    <p className="text-center text-gray-600">
                                        No locations saved yet.
                                    </p>
                                )}
                                {locations.map((location) => (
                                    <div
                                        key={location.id}
                                        className="flex items-center justify-between bg-white/50 p-2 rounded"
                                    >
                                        <span className="text-black font-medium">
                                            {location.name}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeLocation(location.id)
                                            }
                                            className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                                            aria-label={`Remove location ${location.name}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Input to add new locations */}
                            <div className="mt-4 flex space-x-2 border-t pt-4">
                                <Input
                                    placeholder="Add new location"
                                    value={newLocationName}
                                    onChange={(e) =>
                                        setNewLocationName(e.target.value)
                                    }
                                    className="bg-white"
                                    aria-label="Add new location"
                                />
                                <Button
                                    onClick={addLocation}
                                    className="bg-purple-500 hover:bg-purple-600"
                                    disabled={!newLocationName.trim()} // Disable if input is empty
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Button (Unchanged, but behavior relies on friend selection now) */}
                <Button
                    onClick={handleGetResults}
                    disabled={
                        isLoading ||
                        isFetchingData ||
                        friends.filter((f) => f.selected).length === 0
                    } // Also disable if no friends selected
                    className="mt-8 px-8 py-6 text-xl font-bold bg-pink-300 hover:bg-pink-400 text-black rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                    title={
                        friends.filter((f) => f.selected).length === 0
                            ? "Select at least one friend first"
                            : ""
                    } // Tooltip for disabled state
                >
                    {isLoading
                        ? "Generating..."
                        : "Find Common Trip!"}
                </Button>
            </main>
        </div>
    );
}
