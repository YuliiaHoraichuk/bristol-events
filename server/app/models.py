from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from datetime import datetime # handle discount (calculate days)
import enum

# TO-DO: 
# 1. TICKETS AVAILABILITY: Check if works when having orders
# Changed customer to user attr in my User table for consistency; if something breaks look here

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
    # add FK to event

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_price = db.Column(db.Numeric(10, 2), nullable=False) # not float!
    order_timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
    status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING) # pending, completed, cancelled; when pay button pressed change to completed

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.user.username, # backref to user
            'event_name': self.event.name, # backref to event
            'total_price': float(self.total_price),
            'status': self.status.value,
            'order_timestamp': self.order_timestamp.isoformat()
        }

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

    # Foreign keys; Technically I don't need event id
    #event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

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
    # Safeguard: Price cannot be lower than 0
    __table_args__ = (db.CheckConstraint('price_base >= 0', name='check_price_non_negative'),)
    # need both for waitlist logic and processing orders
    orders = db.relationship('Order', backref='event', lazy=True)
    waitlist_entries = db.relationship('Waitlist', backref='event', lazy=True)

    # Foreign keys
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

    # Decorator to calc available ticketts. Allows to access as attribute
    @property
    def available_tickets(self):
        capacity = self.venue.capacity
        booked_tickets = sum(1 for order in self.orders if order.status in [OrderStatus.PENDING, OrderStatus.FULFILLED]) 
        return capacity - booked_tickets

    # convert object to dict for json response
    def to_dict(self):
        time_discount = self.get_discount(is_student=False) # disc tiers based on order time
        student_discount = self.get_discount(is_student=True) # student disc

        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_date': self.start_date.strftime('%Y-%m-%d'),
            'end_date': self.end_date.strftime('%Y-%m-%d'),
            'price_base': float(self.price_base),
            'discounts': {
                'time_percent': float(time_discount.discount_percent) if time_discount else 0,
                'student_percent': float(student_discount.discount_percent) if student_discount else 0,
                'time_name': time_discount.tier.value if time_discount else "Standard"
            },
            'img_filename': self.img_filename,
            'venue': self.venue.name,
            'venue_id': self.venue_id,
            'category': self.category.name,
            'availability': self.get_availability(), # capacity reahed or not
            'tickets_left': self.available_tickets
        }
    
    def get_availability(self):
        # Start a counted and add fullfilled and pending orders (ig fulfilled only would work? might rewrite later)
        booked_tickets = 0;

        for order in self.orders:
            if order.status == OrderStatus.PENDING or order.status == OrderStatus.FULFILLED:
                booked_tickets += 1
        if booked_tickets < self.venue.capacity:
            return 'Available'
        else:
            return 'Waitlist Availability'
    
    # Discount logic: User must explicitly say they're a student
    def get_discount(self, is_student=False):
        # Check for Student disc first
        if is_student:
            student_disc = Discount.query.filter_by(tier=DiscountTier.STUDENT).first()
            if student_disc:
                return student_disc

        # Event start date - now to calc time ltft until event
        days_until_event = (self.start_date - datetime.now().date()).days

        # sql where
        best_discount = Discount.query.filter(
            Discount.min_days <= days_until_event, # filter out dates
            Discount.tier != DiscountTier.STUDENT
        ).order_by(Discount.min_days.desc()).first() # chooses the best disc from the list

        return best_discount


# User: id, username, email, password_hash, is_student, is_admin
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)

    # Calculate total spent by user (for admin dashboard)
    @property
    def total_spent(self):
        return sum(order.total_price for order in self.orders if order.status == OrderStatus.FULFILLED)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'total_spent': float(self.total_spent),
            'order_count': len(self.orders)
        }
