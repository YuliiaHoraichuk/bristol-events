from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models import db, Order, OrderStatus, Ticket, Event, User

# RETURN all orders, a single order
# UPDATE an order

orders_bp = Blueprint('orders', __name__)

# RETURN ALL ORDERS
@orders_bp.route('/orders', methods=['GET']) # blueprint registered at /api, so route should be /orders
def get_orders():
    orders = Order.query.all()

    return jsonify([order.to_dict() for order in orders])

# RETURN SINGLE ORDER
@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id) # SELECT * FROM events WHERE id=event_id
    
    order_data = {
        'id': order.id,
        'total_price': float(order.total_price),
        'order_timestamp': order.order_timestamp.isoformat() if order.order_timestamp else None,
        'status': order.status.value,
        'user_name': order.user.username,
        'event_name': order.event.name
    }
    
    return jsonify(order_data)

# RETURN ORDER FOR USER PURPOSES
@orders_bp.route('/users/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    # Filter orders by the user_id
    # Show by date
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_timestamp.desc()).all()
    
    return jsonify([order.to_dict() for order in orders])

# UPDATE ORDER
@orders_bp.route('/api/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.json
    
    new_status = data.get('status')
    if new_status in OrderStatus.__members__:
        order.status = OrderStatus[new_status]
        db.session.commit()
        return jsonify({"message": "Status updated", "order": order.to_dict()})
    
    return jsonify({"error": "Invalid status"}), 400

# PLACE ORDER
@orders_bp.route('/orders', methods=['POST'])
def place_order():
    data = request.json

    user_id = data.get('user_id')
    
    event_id = data.get('event_id')
    quantity = int(data.get('quantity'))
    total_price = float(data.get('total_price_frontend')) 
    
    price_per_ticket = total_price / quantity if quantity > 0 else 0

    # 2Create the order
    new_order = Order(
        user_id=user_id, # Placeholder for now
        event_id=event_id,
        total_price=total_price,
        status=OrderStatus.FULFILLED 
    )

    db.session.add(new_order)
    db.session.flush() # Get the new_order.id

    # Create the Ticket
    for _ in range(quantity):
        ticket = Ticket(
            order_id=new_order.id,
            event_id=event_id,
            price_paid=price_per_ticket,
            date_attend=datetime.now().date(), 
            is_full_pass=False
        )
        db.session.add(ticket)

    db.session.commit()
    return jsonify({"message": "Order created!", "id": new_order.id}), 201

# CANCEL ORDER
@orders_bp.route('/orders/<int:order_id>/cancel', methods=['PATCH'])
def cancel_order(order_id):
    order = Order.query.get_or_404(order_id)

    order.status = OrderStatus.CANCELLED
    db.session.commit()
    
    return jsonify({"message": "Order cancelled successfully", "status": "cancelled"})