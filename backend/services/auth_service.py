from models.user import User, db
from flask_jwt_extended import create_access_token
import bcrypt

class AuthService:
    @staticmethod
    def register_user(data):
        if User.query.filter_by(email=data['email']).first():
            return False
        
        hashed_password = bcrypt.hashpw(
            data['password'].encode('utf-8'),
            bcrypt.gensalt()
        )
        
        new_user = User(
            email=data['email'],
            password_hash=hashed_password,
            name=data['name'],
            github_url=data.get('github_url'),
            bio=data.get('bio'),
            skills=data.get('skills', []),
            experience_years=data.get('experience_years', 0),
            interests=data.get('interests', []),
            looking_for=data.get('looking_for', []),
            profile_picture=data.get('profile_picture')
        )
        
        db.session.add(new_user)
        db.session.commit()
        return True

    @staticmethod
    def login_user(data):
        user = User.query.filter_by(email=data['email']).first()
        if user and bcrypt.checkpw(
            data['password'].encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            return create_access_token(identity=user.id)
        return None