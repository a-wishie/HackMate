from . import db
from datetime import datetime

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    liker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    liked_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_mutual = db.Column(db.Boolean, default=False)
