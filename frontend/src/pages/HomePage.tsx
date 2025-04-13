import { Link } from "react-router";
import { Button } from "@/components/ui/button";
// import { logout } from "@/app/actions/auth"

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b">
                <div className=" flex h-16 items-center justify-between px-4 md:px-6">
                    <Link to="/dashboard" className="font-bold text-xl">
                        Dashboard
                    </Link>
                    <form>
                        {/* <form action={logout}> */}
                        <Button variant="outline" type="submit">
                            Logout
                        </Button>
                    </form>
                </div>
            </header>
            <main className="flex-1  py-12">
                <h1 className="text-3xl font-bold mb-6">
                    Welcome to ChatConcierge
                </h1>
                <p className="text-muted-foreground mb-8">
                    You've successfully logged in. This is where your dashboard
                    content would appear.
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">
                            Find Activities
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Discover new things to do in your favorite areas.
                        </p>
                        <Button>Explore Now</Button>
                    </div>
                    <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">
                            Invite Friends
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Connect with friends to plan activities together.
                        </p>
                        <Button variant="outline">Send Invites</Button>
                    </div>
                    <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">Your Profile</h2>
                        <p className="text-muted-foreground mb-4">
                            Update your preferences and settings.
                        </p>
                        <Button variant="outline">Edit Profile</Button>
                    </div>
                </div>
            </main>
            <footer className="border-t py-6">
                <div className=" px-4 md:px-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} ChatConcierge. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
}
