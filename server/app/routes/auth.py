from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400
    
    # Don't allow duplicate usermanes or emails
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(data.get('password')) # hash the pass
    # Create new user
    new_user = User(
        username=data.get('username'),
        email=data.get('email'),
        password_hash=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'User created successfully',
        'username': new_user.username,
        'isAdmin': new_user.is_admin
    }), 201

# Login: check if user exists and password hash matches, return user info for react. If not, return error message (for security measures, don't specify if username or password is wrong)
@auth_bp.route('/login', methods=['POST'])
def login():
    # Get the JSON data from the request (dict)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    # find the user by username (1st row where it matches)
    user = User.query.filter_by(username=data.get('username')).first()
    
    #Success: if user exists and pass hash matches, return user info for react
    if user and check_password_hash(user.password_hash, data.get('password')):
        return jsonify({
            "name": user.username,
            "isAdmin": user.is_admin
        }), 200
    # Failure: if no user OR (for security measures) wrong password, return error message
    return jsonify({'error': 'Invalid username or password'}), 401

# Not much to do, handled by react
@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out"}), 200