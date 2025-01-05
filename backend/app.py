from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models.user import User, Match, db
from services.matching_service import MatchingService
from services.auth_service import AuthService
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
jwt = JWTManager(app)
db.init_app(app)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if AuthService.register_user(data):
        return jsonify({'message': 'User registered successfully'}), 201
    return jsonify({'message': 'Email already registered'}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    token = AuthService.login_user(data)
    if token:
        return jsonify({'token': token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/matches/potential', methods=['GET'])
@jwt_required()
def get_potential_matches():
    user_id = get_jwt_identity()
    matches = MatchingService.get_potential_matches(user_id)
    return jsonify([{
        'user': match[0].to_dict(),
        'score': match[1]
    } for match in matches]), 200

@app.route('/api/matches/swipe', methods=['POST'])
@jwt_required()
def swipe():
    user_id = get_jwt_identity()
    data = request.get_json()
    liked_id = data.get('liked_id')
    is_like = data.get('is_like')
    
    if is_like:
        match, is_mutual = MatchingService.create_match(user_id, liked_id)
        db.session.add(match)
        db.session.commit()
        return jsonify({
            'match_created': True,
            'is_mutual': is_mutual
        }), 201
    
    return jsonify({'match_created': False}), 200

@app.route('/api/matches', methods=['GET'])
@jwt_required()
def get_matches():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    mutual_matches = Match.query.filter(
        Match.is_mutual == True,
        ((Match.liker_id == user_id) | (Match.liked_id == user_id))
    ).all()
    
    matches_data = []
    for match in mutual_matches:
        other_user = match.liked if match.liker_id == user_id else match.liker
        matches_data.append(other_user.to_dict())
    
    return jsonify(matches_data), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)