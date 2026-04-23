from flask import Flask
from flask_cors import CORS
from .models import db

#  Application facrtory pattern: create+initialise app instance

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:RoseTea!2026@localhost/bristol_events'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # warning

    CORS(app) # IMPORTANT: browser will block requests from react to flask without, port issue
    
    db.init_app(app)

    with app.app_context():
        from .routes.events import events_bp
        app.register_blueprint(events_bp, url_prefix='/api')

        # auth routes for signup and login
        from .routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api')

        # user routes for user management
        from .routes.users import users_bp
        app.register_blueprint(users_bp, url_prefix='/api')

        from .routes.orders import orders_bp
        app.register_blueprint(orders_bp, url_prefix='/api')

        from . import models
        db.create_all()

    return app