# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

# class User(db.Model):
#     __tablename__ = 'user'
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True)
#     password = db.Column(db.String(80))
#     preferred_locations = db.relationship('UserLocation', backref='user')
#     companion_preferences = db.relationship('UserCompanion', backref='user')

# class Location(db.Model):
#     __tablename__ = 'location'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(120))

# class UserLocation(db.Model):
#     __tablename__ = 'user_location'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     location_id = db.Column(db.Integer, db.ForeignKey('location.id'))

# class UserCompanion(db.Model):
#     __tablename__ = 'user_companion'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     companion_type = db.Column(db.String(50))
#     specific_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association table for friendships (Many-to-Many)
friendship_table = db.Table('friendship',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    # many-to-many relationship for friends
    friends = db.relationship('User',
                            secondary=friendship_table,
                            primaryjoin=(friendship_table.c.user_id == id),
                            secondaryjoin=(friendship_table.c.friend_id == id),
                            backref=db.backref('friend_of', lazy='dynamic'),
                            lazy='dynamic')

    locations = db.relationship('Location', backref='owner', lazy='dynamic', cascade="all, delete-orphan") 

    def add_friend(self, friend):
        if not self.is_friend(friend):
            self.friends.append(friend)
            friend.friends.append(self) # Make relationship bidirectional

    def remove_friend(self, friend):
        if self.is_friend(friend):
            self.friends.remove(friend)
            friend.friends.remove(self) # Remove bidirectional relationship

    def is_friend(self, friend):
        return self.friends.filter(friendship_table.c.friend_id == friend.id).count() > 0

    def __repr__(self):
        return f'<User {self.username}>'

class Location(db.Model):
    __tablename__ = 'location'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    # Direct link to the user who owns this location
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Location {self.name}>'
