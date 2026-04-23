from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models import db, Event, Venue, Category, Waitlist, Discount

# Return all events, return single event, create new event, subscribe to waitlist


events_bp = Blueprint('events', __name__) #bp to hanndle event routed

# Get venues and categories to edit events
@events_bp.route('/venues', methods=['GET'])
def get_venues():
    venues = Venue.query.all()
    return jsonify([{'id': v.id, 'name': v.name} for v in venues])

@events_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])

# RETURN ALL EVENTS
@events_bp.route('/events', methods=['GET']) # blueprint registered at /api, so route should be /events
def get_events():
    events = Event.query.all() # basically SELECT * FROM events
    
    return jsonify([event.to_dict() for event in events])

    '''
        # DELETED: redundant, event_id is not Discount FK anymore
        # collect discounts for the event (student and the best time-based percent)
        discounts = Discount.query.filter_by(event_id=event.id).all()
        student_pct = 0
        time_pct = 0
        for d in discounts:
            if d.tier.value == 'student':
                student_pct = float(d.discount_percent)
            else:
                time_pct = max(time_pct, float(d.discount_percent))

        ev['discounts'] = {'student_percent': student_pct, 'time_percent': time_pct}
        events_list.append(ev)
    '''

# RETURN SINGLE EVENT
@events_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id) # SELECT * FROM events WHERE id=event_id
    return jsonify(event.to_dict())

''' 
# Deprecated, causes Attribute error (event_id in discount). 
# All the logic below is handled in models.py 
    event_data = {
        'id': event.id,
        'name': event.name,
        'description': event.description,
        'start_date': event.start_date.strftime('%Y-%m-%d'),
        'end_date': event.end_date.strftime('%Y-%m-%d'),
        'price_base': float(event.price_base),
        'img_filename': event.img_filename,
        'venue': event.venue.name,
        'category': event.category.name,
        'tickets_left': event.available_tickets
    }
    # include discounts for single event
    discounts = Discount.query.filter_by(event_id=event.id).all()
    student_pct = 0
    time_pct = 0
    for d in discounts:
        if d.tier.value == 'student':
            student_pct = float(d.discount_percent)
        else:
            time_pct = max(time_pct, float(d.discount_percent))

    event_data['discounts'] = {'student_percent': student_pct, 'time_percent': time_pct}

    return jsonify(event_data)
'''

# CREATE NEW EVENT
@events_bp.route('/events', methods=['POST'])
def create_event():
    data = request.get_json() # retrieve json from front request

    try:
        # Map json data to event model fields
        new_event = Event(
            name=data.get('name'),
            description=data.get('description'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            price_base=data.get('price_base'),
            img_filename=data.get('img_filename'),
            venue_id=data.get('venue_id'),
            category_id=data.get('category_id')
        )

        # stage and commit to db
        db.session.add(new_event)
        db.session.commit()

        # if success -> return success message and new event id
        return jsonify({'message': 'Event created successfully', 'event': new_event.to_dict()}), 201
    
    # if error -> rollback and return error message
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# DELETE EVENT
@events_bp.route('/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted'}), 200

# UPDATE EVENT
@events_bp.route('/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json()

    # Update name, desc, price, date
    event.name = data.get('name', event.name)
    event.description = data.get('description', event.description)
    event.price_base = data.get('price_base', event.price_base)
    if data.get('start_date'):
        # Conver to string (Flask->React) => Convert back to date (React->Flask) otherwise TypeError: Object of type date is not JSON serializable. Mb find better way 
        event.start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
    if data.get('end_date'):
        event.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()
    
    # Foreign Keys: venue and category
    if data.get('venue_id'):
        event.venue_id = data.get('venue_id')
    if data.get('category_id'):
        event.category_id = data.get('category_id')

    db.session.commit()
    return jsonify({'message': 'Event updated', 'event': event.to_dict()}), 200

# SUBSCRIBE TO WAITLIST
@events_bp.route('/events/<int:event_id>/waitlist', methods=['POST'])
def join_waitlist(event_id):
    # Get the event by ID or return 404 if not found
    event = Event.query.get_or_404(event_id)

    all_data = request.get_json()
    user_id = all_data.get('user_id')

    # don't allow joining waitlist if tickets are still available
    if event.get_availability() == 'Available':
        return jsonify({'message': 'Tickets are still available, no need to join waitlist!'}), 400
    
    try:
        # Create a new waitlist entry
        waitlist_entry = Waitlist(event_id=event_id, user_id=user_id)
        db.session.add(waitlist_entry)
        db.session.commit()

        return jsonify({'message': f'You have signed up for the {event.name} waitlist!', 'waitlist_id': waitlist_entry.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
# TO-DO: add option to leave waitlist