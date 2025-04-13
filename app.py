import os
import random  
from collections import Counter 
import re 

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from thefuzz import process, fuzz 

from models import db, User, Location
from cerebras_api import generate_response


app = Flask(__name__)

# Config (Unchanged)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "sqlite:///hackathon_travel.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)


# --- Helper Functions ---
def get_user_or_404(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    return user


def normalize_location_name(name):
    """Simple normalization: lowercase, remove punctuation, strip common suffixes."""
    if not name:
        return ""
    name = name.lower()
    # Remove punctuation except commas/hyphens which might be part of name
    name = re.sub(r"[^\w\s,-]", "", name)
    # Remove common state/country abbreviations (simple list, can be expanded)
    name = re.sub(r"[,]?\s+(tx|ca|ny|fl|uk|usa)$", "", name).strip()
    # Remove leading/trailing whitespace
    return name.strip()




# --- Auth Routes ---
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password") 

    if not username or not password:
        return jsonify({"message": "Username and password required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "Username already exists"}), 409  

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"id": new_user.id, "username": new_user.username}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")  

    if not username or not password:
        return jsonify({"message": "Username and password required"}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        return jsonify({"id": user.id, "username": user.username}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


# --- Helper to get user or return 404 ---
def get_user_or_404(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    return user


# --- Friend Routes (Require user_id in URL) ---
@app.route("/api/users/<int:user_id>/friends", methods=["GET"])
def get_friends(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    friends = user.friends.all()
    return jsonify([{"id": f.id, "name": f.username} for f in friends]), 200


@app.route("/api/users/<int:user_id>/friends", methods=["POST"])
def add_friend(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    friend_username = data.get("username")  # Add friend by username

    if not friend_username:
        return jsonify({"message": "Friend username required"}), 400

    friend_to_add = User.query.filter_by(username=friend_username).first()

    if not friend_to_add:
        return jsonify({"message": f"User '{friend_username}' not found"}), 404

    if friend_to_add.id == user.id:
        return jsonify({"message": "Cannot add yourself as a friend"}), 400

    if user.is_friend(friend_to_add):
        return jsonify({"message": "Already friends"}), 409

    user.add_friend(friend_to_add)
    db.session.commit()

    return jsonify({"id": friend_to_add.id, "name": friend_to_add.username}), 201


@app.route("/api/users/<int:user_id>/friends/<int:friend_id>", methods=["DELETE"])
def remove_friend(user_id, friend_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    friend_to_remove = User.query.get(friend_id)
    if not friend_to_remove:
        return jsonify({"message": "Friend not found"}), 404

    if not user.is_friend(friend_to_remove):
        return jsonify({"message": "Not friends with this user"}), 404

    user.remove_friend(friend_to_remove)
    db.session.commit()

    return jsonify({"message": "Friend removed successfully"}), 200


# --- Location Routes (Require user_id in URL) ---
@app.route("/api/users/<int:user_id>/locations", methods=["GET"])
def get_locations(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    locations = user.locations.all()  # Access via the backref 'locations'
    return jsonify([{"id": loc.id, "name": loc.name} for loc in locations]), 200


@app.route("/api/users/<int:user_id>/locations", methods=["POST"])
def add_location(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    location_name = data.get("name")

    if not location_name:
        return jsonify({"message": "Location name required"}), 400

    # Optional: Check for duplicate location names for the *same user*
    existing_location = Location.query.filter_by(
        user_id=user_id, name=location_name
    ).first()
    if existing_location:
        return jsonify({"message": "Location already exists for this user"}), 409

    new_location = Location(name=location_name, user_id=user_id)  # Set user_id directly
    db.session.add(new_location)
    db.session.commit()

    return jsonify({"id": new_location.id, "name": new_location.name}), 201


@app.route("/api/users/<int:user_id>/locations/<int:location_id>", methods=["DELETE"])
def remove_location(user_id, location_id):
    # Ensure the location belongs to the current user before deleting
    location_to_delete = Location.query.filter_by(
        id=location_id, user_id=user_id
    ).first()

    if not location_to_delete:
        # Could be location doesn't exist OR it belongs to another user
        return jsonify({"message": "Location not found or access denied"}), 404

    db.session.delete(location_to_delete)
    db.session.commit()

    return jsonify({"message": "Location removed successfully"}), 200


# --- Results Route ---
@app.route("/api/users/<int:user_id>/results", methods=["POST"])
def get_results(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    friend_ids = data.get("friend_ids", [])

    if not friend_ids:
        return jsonify({"message": "Please select at least one friend."}), 400

    # --- Find Common Locations ---
    all_locations = []

    # 1. Get user's locations
    user_locations = user.locations.all()
    all_locations.extend([loc.name for loc in user_locations if loc.name])

    # 2. Get selected friends' locations
    selected_friends = []
    for friend_id in friend_ids:
        friend = User.query.get(friend_id)
        # Ensure friend exists and is actually a friend (optional check)
        if friend and user.is_friend(friend):
            selected_friends.append(friend)  # Keep track of valid friend objects
            friend_locations = friend.locations.all()
            all_locations.extend([loc.name for loc in friend_locations if loc.name])
        else:
            print(
                f"Warning: Friend ID {friend_id} not found or not a friend of user {user_id}."
            )
            # Optionally return an error if a friend ID is invalid

    if not all_locations:
        return jsonify(
            {"message": "No locations saved for you or your selected friends."}
        ), 400

    # 3. Normalize and Count Locations
    normalized_locations = [normalize_location_name(name) for name in all_locations]
    # Filter out empty strings after normalization
    normalized_locations = [name for name in normalized_locations if name]

    if not normalized_locations:
        return jsonify({"message": "Could not process saved location names."}), 400

    # Use fuzzy matching to group similar names
    location_counts = Counter(normalized_locations)
    most_common_normalized = location_counts.most_common(1)

    destination = None
    common_location_found = False

    if most_common_normalized:
        # Check if the most common occurred more than once (i.e., shared)
        top_normalized_name, top_count = most_common_normalized[0]
        if top_count > 1:
            # Find the best original spelling for the most common normalized name
            # Use fuzzy matching against the original list
            best_match = process.extractOne(
                top_normalized_name,
                [
                    loc
                    for loc in all_locations
                    if normalize_location_name(loc) == top_normalized_name
                ],
                scorer=fuzz.token_sort_ratio,
            )
            if best_match:
                destination = best_match[0] 
                common_location_found = True
                print(
                    f"Common location found: '{destination}' (normalized: '{top_normalized_name}', count: {top_count})"
                )

    # 4. Handle Fallback if no common location found
    fallback_message = ""
    if not common_location_found:
        fallback_message = "No common locations found with selected friends. Picking one of your locations."
        print(fallback_message)
        # Fallback: Pick a random location from the *user's* saved list
        user_saved_names = [loc.name for loc in user_locations if loc.name]
        if user_saved_names:
            destination = random.choice(user_saved_names)
        elif all_locations:  # If user has none, pick from any location saved
            destination = random.choice(all_locations)
        else:
            # Should be caught earlier, but as a safeguard
            return jsonify({"message": "Cannot determine a destination."}), 500

    if not destination:
        return jsonify({"message": "Failed to determine a destination location."}), 500

    # --- Generate AI Prompt ---
    friend_names = [f.username for f in selected_friends]
    participants = [user.username] + friend_names
    participants_str = (
        ", ".join(participants[:-1]) + f" and {participants[-1]}"
        if len(participants) > 1
        else participants[0]
    )

    prompt = (
        f"Generate 3 fun and unique activity suggestions for {participants_str} "
        f"for a trip to {destination}. Keep descriptions very brief (1 sentence max each)."
    )
    if fallback_message:
        # Add context to the prompt if it was a fallback
        prompt += f" (Note: {destination} was chosen as a fallback as no common location was found)."

    # --- Call Cerebras API ---
    ai_suggestion = "AI suggestion placeholder."
    try:

        ai_suggestion = generate_response(prompt)
    except ImportError:
        print("Cerebras API module not found, using placeholder.")
        ai_suggestion = "AI suggestion unavailable (module not found)."
    except ConnectionError as e:  # Catch specific connection errors from the API call
        print(f"Error calling Cerebras API: {e}")
        ai_suggestion = f"Could not get AI suggestion at this time ({e})."
    except Exception as e:
        print(f"Unexpected error during Cerebras API call: {e}")
        ai_suggestion = "An unexpected error occurred while getting AI suggestions."

    # --- Mock Attractions - will get rid of stuff later ---
    attractions = [
        {"name": f"Explore downtown {destination}"},
        {"name": f"Visit a landmark near {destination}"},
        {"name": f"Try local food in {destination}"},
    ]

    # --- Prepare Response ---
    result_data = {
        "destination": destination,
        "attractions": attractions, 
        "ai_suggestion": ai_suggestion,
        "common_location_found": common_location_found,  
        "fallback_message": fallback_message
        if not common_location_found
        else None,  
    }

    return jsonify(result_data), 200


if __name__ == "__main__":
    with app.app_context():
        # db.drop_all() # Use if you need to reset the DB quickly
        db.create_all()  # Creates tables if they don't exist
    app.run(debug=True, host="0.0.0.0", port=5000)
