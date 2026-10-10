from flask import Blueprint, request, jsonify
import json
from routes.auth import get_current_user_from_token
from models import get_db

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@orders_bp.route('', methods=['POST'])
def place_order():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "ऑर्डर करण्यासाठी कृपया प्रथम लॉगिन करा."}), 401

    data = request.json or {}
    items = data.get('items', [])
    total_amount = data.get('total_amount', 0)
    address = data.get('shipping_address', user['location'])
    payment_method = data.get('payment_method', 'Cash on Delivery')

    if not items or total_amount <= 0:
        return jsonify({"success": False, "message": "तुमचे कार्ट रिकामे आहे."}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO orders (user_id, items_json, total_amount, shipping_address, payment_method, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user['id'], json.dumps(items), total_amount, address, payment_method, 'Confirmed'))
    order_id = cursor.lastrowid

    cursor.execute('''
        INSERT INTO notifications (user_id, title, message, category)
        VALUES (?, ?, ?, ?)
    ''', (user['id'], 'ऑर्डर निश्चित झाली!', f"Order #{order_id} for ₹{total_amount} confirmed. Delivery to {address}.", 'order'))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "ऑर्डर यशस्वीरित्या नोंदवली गेली!",
        "order_id": order_id,
        "total_amount": total_amount,
        "status": "Confirmed"
    })

@orders_bp.route('/my', methods=['GET'])
@orders_bp.route('/history', methods=['GET'])
def order_history():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", (user['id'],))
    rows = cursor.fetchall()
    conn.close()

    orders = []
    for r in rows:
        item = dict(r)
        item['items'] = json.loads(item['items_json'])
        orders.append(item)

    return jsonify({"success": True, "orders": orders})
