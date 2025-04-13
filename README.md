# ChatConcierge - Plan Yo Twip

## Project Description

ChatConcierge is a web application designed to simplify trip planning among friends. Users can register, log in, manage a list of friends, and save their preferred travel locations. The core functionality allows users to select friends they want to travel with and find common preferred locations among the group using fuzzy matching. If a common location is found, the application suggests it as the destination. If no common location exists, it selects a location from the user's list as a fallback.

Once a destination is determined, ChatConcierge leverages the Cerebras AI API to generate unique and fun activity suggestions tailored to the group and the chosen location. The results, including the destination and AI-powered suggestions, are presented to the user.

This project aims to solve the coordination challenge of group travel by automating the process of finding mutually agreeable destinations and providing initial activity ideas.

## Source Code

The source code for this project is available in this repository.

## Demo Video

[coming soon]

## Team Information

*   [Team Member 1 Name] - [Role]
*   [Team Member 2 Name] - [Role]
*   [Team Member 3 Name] - [Role]
*   Jose Juan Gonzalez Jr - Frontend


## Track Selection

This project is competing in the **Space** track.

## Usage

To run this project locally:

1.  **Backend (Flask):**
    *   Navigate to the root directory.
    *   Ensure you have the required Python packages installed (see [`requirements.txt`](/Users/jj/projects/hackathon/Fullyhacks-Project/requirements.txt)). You might need to create a virtual environment and run `pip install -r requirements.txt`.
    *   Run the Flask dev server:
        ```bash
        python app.py
        ```
    *   The backend API will be running at `http://localhost:5000`.

2.  **Frontend (React + Vite):**
    *   Open a new terminal.
    *   Navigate to the `frontend` directory.
    *   Install the Node.js packages:
        ```bash
        npm install
        ```
    *   Run the Vite development server:
        ```bash
        npm run dev
        ```
    *   The frontend application will be accessible at `http://localhost:5173` (or another port if 5173 is busy).

Open your web browser and navigate to the frontend URL to use the application.