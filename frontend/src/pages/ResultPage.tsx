// pages/ResultPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Users, MapPin, AlertTriangle } from "lucide-react"; // Added icons
import UFO from "@/assets/ufo.svg";
import ReactMarkdown from "react-markdown";

interface Attraction {
    name: string;
    description?: string;
}

// Extend expected data from backend
interface ResultData {
    destination: string;
    attractions: Attraction[];
    ai_suggestion?: string;
    common_location_found: boolean; // Expect this boolean
    fallback_message?: string; // Expect potential fallback message
}

// Structure for selected friends passed in state
interface SelectedFriend {
    id: number;
    name: string;
}

export default function ResultPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [result, setResult] = useState<ResultData | null>(null);
    const [selectedFriends, setSelectedFriends] = useState<SelectedFriend[]>(
        []
    ); // State for friends
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Access data passed via navigation state
        const state = location.state as {
            resultData?: ResultData;
            selectedFriends?: SelectedFriend[];
        };

        if (state?.resultData) {
            setResult(state.resultData);
            setSelectedFriends(state.selectedFriends || []); // Store selected friends
            setIsLoading(false);
        } else {
            console.error("No result data found in navigation state.");
            setError(
                "Could not load trip results. Please go back and plan again."
            );
            setIsLoading(false);
        }
    }, [location.state]);

    const friendNames = selectedFriends.map((f) => f.name).join(", ");

    return (
        <div className="relative min-h-screen w-screen overflow-hidden bg-black">
            {/* Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/landing-page.jpg')", // Ensure path is correct
                    backgroundSize: "cover",
                }}
            />

            {/* Header */}
            <header className="relative z-10 bg-purple-700 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 relative">
                        <img src={UFO} alt="Logo" width={32} height={32} />
                    </div>
                    <h1 className="text-white text-xl font-bold">
                        ChatConcierge
                    </h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/home")} // Navigate back to home
                    className="text-white hover:bg-purple-600"
                >
                    <Home className="h-5 w-5" />
                </Button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-4 flex flex-col items-center">
                <div className="w-full max-w-4xl">
                    <div className="flex items-center mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/home")} // Navigate back to home
                            className="text-white hover:bg-purple-600"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plan
                        </Button>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-10">
                        Your Trip Suggestion!
                    </h1>

                    {/* Display Friends Involved */}
                    {friendNames && (
                        <div className="flex items-center justify-center gap-2 text-purple-300 mb-6 text-lg">
                            <Users className="h-5 w-5" />
                            <span>For: You, {friendNames}</span>
                        </div>
                    )}

                    {/* Conditional Rendering based on state */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-white text-xl">
                                Loading results...
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-pink-300 rounded-lg p-8 text-center max-w-xl mx-auto shadow-lg">
                            <p className="text-black text-xl font-semibold">
                                {error}
                            </p>
                            <Button
                                onClick={() => navigate("/home")}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Back to Planning
                            </Button>
                        </div>
                    ) : (
                        result && ( // Check if result is not null
                            <>
                                {/* Fallback Message */}
                                {!result.common_location_found &&
                                    result.fallback_message && (
                                        <div className="mb-6 p-3 bg-yellow-200 text-yellow-800 rounded-md max-w-2xl mx-auto text-center flex items-center justify-center gap-2">
                                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                            <span>
                                                {result.fallback_message}
                                            </span>
                                        </div>
                                    )}

                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-4">
                                    {/* Destination Bubble */}
                                    <div className="bg-pink-300 rounded-lg p-8 text-center max-w-sm shadow-lg">
                                        <div className="flex justify-center items-center gap-2 mb-3">
                                            <MapPin className="h-7 w-7 text-black" />
                                            <h2 className="text-3xl md:text-4xl font-bold text-black">
                                                {result.destination}!
                                            </h2>
                                        </div>
                                        {result.common_location_found && (
                                            <p className="text-sm text-purple-800 mb-3">
                                                (Based on common locations)
                                            </p>
                                        )}
                                        <p className="text-black text-lg">
                                            Here are some ideas for your trip:
                                        </p>
                                    </div>
                                    {/* Arrow (same as before) */}
                                    <div className="hidden md:block text-white">
                                        <svg
                                            width="100"
                                            height="24"
                                            viewBox="0 0 100 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M99.0607 13.0607C99.6464 12.4749 99.6464 11.5251 99.0607 10.9393L89.5147 1.3934C88.9289 0.807611 87.9792 0.807611 87.3934 1.3934C86.8076 1.97919 86.8076 2.92893 87.3934 3.51472L95.8787 12L87.3934 20.4853C86.8076 21.0711 86.8076 22.0208 87.3934 22.6066C87.9792 23.1924 88.9289 23.1924 89.5147 22.6066L99.0607 13.0607ZM0 13.5H98V10.5H0V13.5Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>
                                    <div className="block md:hidden text-white my-4 transform rotate-90">
                                        {" "}
                                        {/* Vertical arrow for small screens */}
                                        <svg
                                            width="100"
                                            height="24"
                                            viewBox="0 0 100 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M99.0607 13.0607C99.6464 12.4749 99.6464 11.5251 99.0607 10.9393L89.5147 1.3934C88.9289 0.807611 87.9792 0.807611 87.3934 1.3934C86.8076 1.97919 86.8076 2.92893 87.3934 3.51472L95.8787 12L87.3934 20.4853C86.8076 21.0711 86.8076 22.0208 87.3934 22.6066C87.9792 23.1924 88.9289 23.1924 89.5147 22.6066L99.0607 13.0607ZM0 13.5H98V10.5H0V13.5Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>

                                    {/* Attractions Box */}
                                    {/* Attractions/Suggestions Box */}
                                    <div className="bg-pink-300 p-6 rounded-lg max-w-sm w-full shadow-lg">
                                        {/* Display AI Suggestion Directly if available */}
                                        {result.ai_suggestion &&
                                        result.ai_suggestion !==
                                            "AI suggestion placeholder." ? (
                                            <>
                                                <h3 className="text-2xl font-bold text-black mb-3">
                                                    AI Suggestions:
                                                </h3>
                                                {/* Basic parsing assuming newline separation */}
                                                {/* <ul className="space-y-2 text-black text-lg list-disc list-inside">
                                                    {result.ai_suggestion
                                                        .split("\n")
                                                        .map(
                                                            (line, index) =>
                                                                line.trim() && (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {line
                                                                            .trim()
                                                                            .replace(
                                                                                /^- /,
                                                                                ""
                                                                            )}
                                                                    </li>
                                                                )
                                                        )}
                                                </ul> */}
                                                <div className="prose prose-sm text-black text-lg">
                                                    {" "}
                                                    {/* Optional: Add prose class for basic styling */}
                                                    <ReactMarkdown>
                                                        {result.ai_suggestion}
                                                    </ReactMarkdown>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Fallback to mock attractions if AI failed or is placeholder */}
                                                <h3 className="text-2xl font-bold text-black mb-3">
                                                    Fun Attractions:
                                                </h3>
                                                <ul className="space-y-3 text-black text-lg list-disc list-inside">
                                                    {result.attractions.map(
                                                        (attraction, index) => (
                                                            <li key={index}>
                                                                {
                                                                    attraction.name
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                                {/* Show placeholder/error message for AI */}
                                                {result.ai_suggestion && (
                                                    <p className="text-sm text-gray-700 mt-3">
                                                        ({result.ai_suggestion})
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )
                    )}
                    <div className="flex justify-center mt-16">
                        <Button
                            onClick={() => navigate("/home")} // Navigate back to home
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg"
                        >
                            Plan Another Trip
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
