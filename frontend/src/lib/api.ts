// src/lib/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface AuthData {
    username: string;
    password: string;
}

// --- Auth ---
// Returns { id: number, username: string }
export const registerUser = (data: AuthData) =>
    apiClient.post("/register", data);
// Returns { id: number, username: string }
export const loginUser = (data: AuthData) => apiClient.post("/login", data);

// --- Friends (Requires logged-in user's ID) ---
export const getFriends = (userId: number) =>
    apiClient.get(`/users/${userId}/friends`);
export const addFriend = (userId: number, data: { username: string }) =>
    apiClient.post(`/users/${userId}/friends`, data);
export const removeFriend = (userId: number, friendId: number) =>
    apiClient.delete(`/users/${userId}/friends/${friendId}`);

// --- Locations (Requires logged-in user's ID) ---
export const getLocations = (userId: number) =>
    apiClient.get(`/users/${userId}/locations`);
export const addLocation = (userId: number, data: { name: string }) =>
    apiClient.post(`/users/${userId}/locations`, data);
export const removeLocation = (userId: number, locationId: number) =>
    apiClient.delete(`/users/${userId}/locations/${locationId}`);

export const getTripResults = (
    userId: number,
    data: {
        friend_ids: number[]; 
    }
) => apiClient.post(`/users/${userId}/results`, data);

export default apiClient;
