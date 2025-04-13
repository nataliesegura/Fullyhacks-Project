from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))
    
    # Relationships need explicit foreign_keys specification
    preferred_locations = db.relationship('UserLocation', backref='user')
    companion_preferences = db.relationship(
        'UserCompanion', 
        backref='user',
        foreign_keys='UserCompanion.user_id'  # Explicitly specify which FK to use
    )
    
    # Relationship for when this user is someone else's companion
    companion_requests = db.relationship(
        'UserCompanion',
        backref='companion_user',
        foreign_keys='UserCompanion.specific_user_id'
    )

class Location(db.Model):
    __tablename__ = 'location'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    user_associations = db.relationship('UserLocation', backref='location')

class UserLocation(db.Model):
    __tablename__ = 'user_location'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    
    # Optional: Add unique constraint
    __table_args__ = (
        db.UniqueConstraint('user_id', 'location_id', name='_user_location_uc'),
    )

class UserCompanion(db.Model):
    __tablename__ = 'user_companion'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    companion_type = db.Column(db.String(50))
    specific_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))