from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(80), nullable=False)
    github_url = db.Column(db.String(200))
    bio = db.Column(db.Text)
    skills = db.Column(db.JSON)  # Store as JSON array
    experience_years = db.Column(db.Integer)
    interests = db.Column(db.JSON)  # Store as JSON array
    looking_for = db.Column(db.JSON)  # Store desired teammate skills
    profile_picture = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    likes_given = db.relationship(
        'Match',
        foreign_keys='Match.liker_id',
        backref='liker',
        lazy='dynamic'
    )
    likes_received = db.relationship(
        'Match',
        foreign_keys='Match.liked_id',
        backref='liked',
        lazy='dynamic'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'github_url': self.github_url,
            'bio': self.bio,
            'skills': self.skills,
            'experience_years': self.experience_years,
            'interests': self.interests,
            'looking_for': self.looking_for,
            'profile_picture': self.profile_picture
        }

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    liker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    liked_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_mutual = db.Column(db.Boolean, default=False)