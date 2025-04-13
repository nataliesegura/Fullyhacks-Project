/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";
import { useNavigate } from "react-router"; 
import * as api from "@/lib/api"; 

interface User {
    id: number; 
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean; 
    login: (credentials: api.AuthData) => Promise<void>;
    register: (credentials: api.AuthData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async() => {},
    register: async() => {},
    logout: () => {},
});

// Helper to get/set user from localStorage for persistence across refreshes
const getStoredUser = (): User | null => {
    const stored = localStorage.getItem("hackathonUser");
    try {
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("hackathonUser");
        return null;
    }
};

const setStoredUser = (user: User | null) => {
    if (user) {
        localStorage.setItem("hackathonUser", JSON.stringify(user));
    } else {
        localStorage.removeItem("hackathonUser");
    }
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
    const [user, setUser] = useState<User | null>(getStoredUser); 
    const [isLoading, setIsLoading] = useState(true); 
    const navigate = useNavigate();

    // Function to handle setting user state and storage
    const handleLoginSuccess = (userData: User) => {
        setStoredUser(userData);
        setUser(userData);
        navigate("/home"); 
    };

    const login = async (credentials: api.AuthData) => {
        setIsLoading(true);
        try {
            const response = await api.loginUser(credentials);
            handleLoginSuccess(response.data);
        } catch (error: any) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );
            setStoredUser(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const register = async (credentials: api.AuthData) => {
        setIsLoading(true);
        try {
            const response = await api.registerUser(credentials);
            handleLoginSuccess(response.data);
        } catch (error: any) {
            console.error(
                "Registration failed:",
                error.response?.data || error.message
            );
            setStoredUser(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setStoredUser(null); // Clear storage
        setUser(null);
        navigate("/login"); // Redirect to login page
    };

    // Simulate checking auth on load by just seeing if user exists from storage
    useEffect(() => {
        // If we have a user from storage, we're "authenticated"
        // If not, we're not. No API call needed here for the hackathon version.
        setIsLoading(false); // We know the auth status immediately based on localStorage
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
