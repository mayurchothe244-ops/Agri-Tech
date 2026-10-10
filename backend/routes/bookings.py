from flask import Blueprint, request, jsonify
from routes.auth import get_current_user_from_token
from models import get_db

bookings_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')

@bookings_bp.route('', methods=['POST'])
def create_booking():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "भाड्याने घेण्यासाठी कृपया प्रथम लॉगिन करा."}), 401

    data = request.json or {}
    equipment_id = data.get('equipment_id')
    equipment_name = data.get('equipment_name', 'Agricultural Equipment')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    total_price = data.get('total_price', 1500)

    if not equipment_id or not start_date or not end_date:
        return jsonify({"success": False, "message": "तारीख आणि उपकरणाची माहिती आवश्यक आहे."}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO rental_requests (user_id, equipment_id, equipment_name, start_date, end_date, total_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user['id'], equipment_id, equipment_name, start_date, end_date, total_price, 'Confirmed'))

    rental_id = cursor.lastrowid

    cursor.execute('''
        INSERT INTO notifications (user_id, title, message, category)
        VALUES (?, ?, ?, ?)
    ''', (user['id'], 'उपकरण बुकिंग निश्चित झाले!', f"You have booked {equipment_name} from {start_date} to {end_date}. Total: ₹{total_price}", 'equipment'))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "उपकरण बुकिंग यशस्वीरित्या पूर्ण झाले!",
        "booking_id": rental_id,
        "status": "Confirmed"
    })

@bookings_bp.route('/my', methods=['GET'])
def my_bookings():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rental_requests WHERE user_id = ? ORDER BY created_at DESC", (user['id'],))
    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "rentals": [dict(r) for r in rows]})

@bookings_bp.route('/<int:booking_id>/cancel', methods=['PATCH'])
def cancel_booking(booking_id):
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rental_requests WHERE id = ? AND user_id = ?", (booking_id, user['id']))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Booking not found"}), 404

    cursor.execute("UPDATE rental_requests SET status = 'Cancelled' WHERE id = ?", (booking_id,))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "बुकिंग यशस्वीरित्या रद्द केले गेले (Booking cancelled)."})
