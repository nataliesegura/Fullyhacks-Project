from models import db
from run import app

def create_test_data():
    with app.app_context():
        db.create_all()
        
        # Create test users
        users = [
            User(username="alice", password="pass123"),
            User(username="bob", password="pass456"),
            User(username="charlie", password="pass789")
        ]
        db.session.add_all(users)
        
        # Create test locations
        locations = [
            Location(name="Paris"),
            Location(name="Tokyo"),
            Location(name="New York")
        ]
        db.session.add_all(locations)
        db.session.commit()
        
        # Create relationships
        db.session.add_all([
            UserLocation(user_id=users[0].id, location_id=locations[0].id),
            UserLocation(user_id=users[0].id, location_id=locations[1].id),
            UserLocation(user_id=users[1].id, location_id=locations[0].id),
            UserLocation(user_id=users[1].id, location_id=locations[2].id),
            UserLocation(user_id=users[2].id, location_id=locations[0].id),
            UserLocation(user_id=users[2].id, location_id=locations[1].id),
            
            UserCompanion(user_id=users[0].id, companion_type="friends"),
            UserCompanion(user_id=users[0].id, specific_user_id=users[1].id),
            UserCompanion(user_id=users[1].id, companion_type="family")
        ])
        db.session.commit()