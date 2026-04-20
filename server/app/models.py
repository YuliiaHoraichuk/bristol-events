from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import enum

db = SQLAlchemy()

# Order status options
class OrderStatus(enum.Enum):
    PENDING = "pending"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class DiscountTier(enum.Enum):
    TIER1 = "tier1"  # < 14 days
    TIER2 = "tier2"  # < 30 days
    TIER3 = "tier3"  # < 60 days
    STUDENT = "student"  # Student discount
    STANDARD = "standard"  # DEFAULT; for ease of python logic

# Venue: id, name, location, capacity
class Venue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    events = db.relationship('Event', backref='venue', lazy=True)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    events = db.relationship('Event', backref='category', lazy=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_price = db.Column(db.Numeric(10, 2), nullable=False) # not float!
    order_timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING) # pending, completed, cancelled; when pay button pressed change to completed

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    price_paid = db.Column(db.Numeric(10, 2), nullable=False)
    date_attend = db.Column(db.Date, nullable=False) # Mult days functionalty
    is_full_pass = db.Column(db.Boolean, nullable=False, default=False)

    # Foreign keys
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

# Discount: id, tier, min_days (calculate logic), discount_percent, event_id fk
class Discount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tier = db.Column(db.Enum(DiscountTier), nullable=False, default=DiscountTier.STANDARD) # tier1, tier2, tier3, student, standard
    discount_percent = db.Column(db.Numeric(5, 2), nullable=False) # e.g. 20.00 for 20% off
    min_days = db.Column(db.Integer, nullable=True) # Calculate logic based on the number of days before the event

    # Foreign keys
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

class Waitlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    notified = db.Column(db.Boolean, nullable=False, default=False) # track if user has been notified that a ticket is available

    # Foreign keys
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)   

# Cancellation id, order_id FK, cancellation_timestamp, refund_amount, type
class Cancellation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cancellation_timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    refund_amount = db.Column(db.Numeric(10, 2), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    order = db.relationship('Order', backref=db.backref('cancellation', uselist=False))

    # Foreign keys
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)

# Event: id, name, start_dayte, end_date, img_filename, description, price_base, venue_id(FK), category_id(FK), c_policy_id(FK)
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    # venue = db.Column(db.String(100), nullable=False) FK to Venue table
    description = db.Column(db.Text, nullable=True)
    img_filename = db.Column(db.String(255), nullable=True)
    price_base = db.Column(db.Numeric(10, 2), nullable=False) # not float!

    # Foreign keys
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

# User: id, username, email, password_hash, is_student, is_admin
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    orders = db.relationship('Order', backref='customer', lazy=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)