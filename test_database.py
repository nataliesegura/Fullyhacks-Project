from models import db, User, Location, UserLocation, UserCompanion
from run import app

def find_shared_locations(user1_id, user2_id):
    """Helper function to find shared locations between two users"""
    user1 = db.session.get(User, user1_id)
    user2 = db.session.get(User, user2_id)
    
    if not user1 or not user2:
        print(f"\nError: One or both users don't exist")
        return set()
    
    user1_locations = {ul.location.name for ul in user1.preferred_locations}
    user2_locations = {ul.location.name for ul in user2.preferred_locations}
    
    shared = user1_locations & user2_locations
    print(f"Shared between {user1.username} and {user2.username}:")
    print(f"→ {shared if shared else 'No shared locations'}")
    return shared

def test_database():
    with app.app_context():
        print("\n=== Initializing Test ===")
        db.drop_all()
        db.create_all()
        
        # Create test data
        print("Creating test users...")
        users = [
            User(username="alice", password="pass123"),
            User(username="bob", password="pass456"),
            User(username="charlie", password="pass789")
        ]
        db.session.add_all(users)
        db.session.commit()
        
        print("Creating test locations...")
        locations = [
            Location(name="Paris"),
            Location(name="Tokyo"),
            Location(name="New York")
        ]
        db.session.add_all(locations)
        db.session.commit()
        
        print("Creating location preferences...")
        user_locations = [
            UserLocation(user_id=users[0].id, location_id=locations[0].id),
            UserLocation(user_id=users[0].id, location_id=locations[1].id),
            UserLocation(user_id=users[1].id, location_id=locations[0].id),
            UserLocation(user_id=users[1].id, location_id=locations[2].id),
            UserLocation(user_id=users[2].id, location_id=locations[0].id),
            UserLocation(user_id=users[2].id, location_id=locations[1].id)
        ]
        db.session.add_all(user_locations)
        db.session.commit()
        
        # Run tests
        print("\n=== Testing Shared Locations ===")
        find_shared_locations(users[0].id, users[1].id)  # alice & bob (Paris)
        find_shared_locations(users[0].id, users[2].id)  # alice & charlie (Paris, Tokyo)
        find_shared_locations(users[1].id, users[2].id)  # bob & charlie (Paris)
        find_shared_locations(users[0].id, 999)          # Non-existent user
        
        print("\n=== Test Completed ===")

if __name__ == '__main__':
    test_database()