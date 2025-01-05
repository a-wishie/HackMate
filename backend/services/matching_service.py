from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from ..models.user import User, Match
from . import db

class MatchingService:
    @staticmethod
    def get_skill_vector(skills, all_skills):
        """Convert skills list to binary vector"""
        return [1 if skill in skills else 0 for skill in all_skills]

    @staticmethod
    def calculate_match_score(user1, user2):
        # Get all unique skills
        all_skills = list(set(user1.skills + user2.skills))
        
        # Convert skills to vectors
        user1_vector = np.array(MatchingService.get_skill_vector(user1.skills, all_skills)).reshape(1, -1)
        user2_vector = np.array(MatchingService.get_skill_vector(user2.skills, all_skills)).reshape(1, -1)
        
        # Calculate skill compatibility (looking for complementary skills)
        skill_score = cosine_similarity(user1_vector, user2_vector)[0][0]
        
        # Calculate interest compatibility
        common_interests = len(set(user1.interests) & set(user2.interests))
        interest_score = common_interests / max(len(user1.interests), len(user2.interests))
        
        # Check if user2 has skills that user1 is looking for
        desired_skills_match = len(set(user2.skills) & set(user1.looking_for)) / len(user1.looking_for)
        
        # Weighted average of different factors
        final_score = (0.4 * skill_score + 
                      0.3 * interest_score + 
                      0.3 * desired_skills_match)
        
        return final_score

    @staticmethod
    def get_potential_matches(user_id, limit=10):
        """Get potential matches for a user"""
        user = User.query.get(user_id)
        
        # Get users who haven't been liked/disliked yet
        already_seen = [match.liked_id for match in user.likes_given.all()]
        potential_matches = User.query.filter(
            User.id != user_id,
            ~User.id.in_(already_seen)
        ).all()
        
        # Calculate match scores
        scored_matches = [
            (other_user, MatchingService.calculate_match_score(user, other_user))
            for other_user in potential_matches
        ]
        
        # Sort by score and return top matches
        scored_matches.sort(key=lambda x: x[1], reverse=True)
        return scored_matches[:limit]

    @staticmethod
    def create_match(liker_id, liked_id):
        """Create a new match and check if it's mutual"""
        # Check if reverse match exists
        existing_match = Match.query.filter_by(
            liker_id=liked_id,
            liked_id=liker_id
        ).first()
        
        new_match = Match(liker_id=liker_id, liked_id=liked_id)
        
        if existing_match:
            # Make both matches mutual
            existing_match.is_mutual = True
            new_match.is_mutual = True
            
        return new_match, bool(existing_match)
