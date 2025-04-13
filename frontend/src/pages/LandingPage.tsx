import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import LandingPageBackground from "@/assets/landing-page.jpg";
import RandomFeedPic from "@/assets/randomfeed.jpg";
import UFO from '@/assets/ufo.svg';

export default function LandingPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-black w-screen">
            {/* Space background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={LandingPageBackground}
                    alt="Space background with planets"
                    className="w-full h-full object-cover"
                />{" "}
            </div>

            {/* Content container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="flex items-center justify-between py-6">
                    <div className="flex items-center">
                        <div className="h-12 w-12 relative">
                            <img
                                src={UFO}
                                alt="ChatConcierge Logo"
                                width={48}
                                height={48}
                            />
                        </div>
                        <h1 className="ml-2 text-4xl font-bold text-[#71c9ff]">
                            ChatConcierge
                        </h1>
                    </div>
                    <nav className="flex items-center space-x-8">
                        <Link
                            to="/contact"
                            className="text-white text-xl hover:text-[#71c9ff] transition-colors"
                        >
                            Contact us
                        </Link>
                        <Link
                            to="/login"
                            className="text-white text-xl hover:text-[#71c9ff] transition-colors"
                        >
                            Login
                        </Link>
                    </nav>
                </header>

                {/* Main content */}
                <main className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="pt-10">
                        <h2 className="text-5xl font-bold leading-tight text-[#ff6d1c] mb-6">
                            Connect, Talk, and Journey
                            <br />
                            with us - anywhere, anytime
                        </h2>
                        <div className="mt-10">
                            <Button
                                asChild
                                className="px-8 py-6 text-xl font-semibold bg-[#ffdbc0] text-black hover:bg-[#f79854] rounded-full"
                            >
                                <Link to="/login">Sign Up Now!</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative mt-10 lg:mt-0">
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                            <img
                                src={RandomFeedPic}
                                alt="ChatConcierge App Interface"
                                width={600}
                                height={500}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
