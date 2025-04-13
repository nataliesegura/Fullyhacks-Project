"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import UFO from "@/assets/ufo.svg";

interface Attraction {
    name: string;
    description?: string;
}

interface ResultData {
    destination: string;
    attractions: Attraction[];
}

export default function ResultPage() {
    const navigate = useNavigate();
    const [result, setResult] = useState<ResultData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Get data from sessionStorage
                const tripDataString = sessionStorage.getItem("tripData");
                if (!tripDataString) {
                    throw new Error("No trip data found");
                }

                const tripData = JSON.parse(tripDataString);

                // In a real app, you would fetch results from your backend API
                // For now, we'll simulate a response with mock data
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Pick a random location from the user's selections
                const locations = tripData.locations || [];
                if (locations.length === 0) {
                    throw new Error("No locations selected");
                }

                const randomLocation =
                    locations[Math.floor(Math.random() * locations.length)];
                const destination =
                    randomLocation.name || "Mystery Destination";

                // Generate mock attractions for the selected destination
                const attractions = [
                    { name: `${destination} Adventure Park` },
                    { name: `${destination} Historical Museum` },
                    { name: `${destination} Culinary Tour` },
                ];

                setResult({
                    destination,
                    attractions,
                });
            } catch (error) {
                console.error("Error fetching results:", error);
                setError("Failed to load results. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="relative min-h-screen w-screen overflow-hidden bg-black">
            {/* Space background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/landing-page.jpg')",
                    backgroundSize: "cover",
                }}
            />

            {/* Header */}
            <header className="relative z-10 bg-purple-700 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 relative">
                        <img
                            src={UFO || "/placeholder.svg?height=32&width=32"}
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
                    onClick={() => navigate("/home")}
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
                            onClick={() => navigate("/home")}
                            className="text-white hover:bg-purple-600"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plan
                        </Button>
                    </div>

                    <h1 className="text-5xl font-bold text-white text-center mb-16">
                        Your Vacation Destination
                        <br />
                        Will Be......
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-white text-xl">
                                Finding your perfect destination...
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-pink-300 rounded-full p-8 text-center max-w-xl mx-auto">
                            <p className="text-black text-xl">{error}</p>
                            <Button
                                onClick={() => navigate("/home")}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Back to Planning
                            </Button>
                        </div>
                    ) : (
                        result && (
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
                                {/* Destination Bubble */}
                                <div className="bg-pink-300 rounded-full p-8 text-center max-w-sm">
                                    <h2 className="text-4xl font-bold text-black mb-4">
                                        "{result.destination}"!!!
                                    </h2>
                                    <p className="text-black text-xl">
                                        Here are some attractions there you may
                                        enjoy :)
                                    </p>
                                </div>

                                {/* Arrow */}
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

                                {/* Attractions Box */}
                                <div className="bg-pink-300 p-6 rounded-lg max-w-sm w-full">
                                    <h3 className="text-2xl font-bold text-black mb-4">
                                        Fun Attractions:
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.attractions.map(
                                            (attraction, index) => (
                                                <li
                                                    key={index}
                                                    className="text-black text-lg"
                                                >
                                                    - {attraction.name}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )
                    )}

                    {/* <TestDataButton /> */}

                    <div className="flex justify-center mt-16">
                        <Button
                            onClick={() => navigate("/home")}
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


// // Add this to any component temporarily
// function TestDataButton() {
//     const setTestData = () => {
//       const testData = {
//         locations: [
//           { name: "Paris" },
//           { name: "Tokyo" },
//           { name: "New York" }
//         ]
//       };
//       sessionStorage.setItem("tripData", JSON.stringify(testData));
//       alert("Test data added to sessionStorage!");
//     };
  
//     return (
//       <Button onClick={setTestData}>
//         Add Test Data
//       </Button>
//     );
//   }