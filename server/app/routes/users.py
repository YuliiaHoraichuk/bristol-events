from flask import Blueprint, jsonify, request
from ..models import db, User

users_bp = Blueprint('users', __name__)

# GET ALL USERS
@users_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# GET USER BY ID
@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

# DELETE USER
@users_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    
    # Security: do not delete admain!
    if user.is_admin:
        return jsonify({
            "message": "You cannot delete admin account"
        }), 403

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Cannot delete user if user has existing orders."}), 400

