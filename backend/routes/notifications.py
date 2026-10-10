from flask import Blueprint, request, jsonify
from routes.auth import get_current_user_from_token
from models import get_db
from services.notification_service import send_sms_alert, subscribe_alert

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notifications_bp.route('', methods=['GET'])
def list_notifications():
    user = get_current_user_from_token(request)
    user_id = user['id'] if user else None

    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT 15", (user_id,))
    else:
        cursor.execute("SELECT * FROM notifications WHERE user_id IS NULL ORDER BY created_at DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "notifications": [dict(r) for r in rows]})

@notifications_bp.route('/read', methods=['POST'])
def mark_read():
    data = request.json or {}
    notification_id = data.get('id')

    if notification_id:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", (notification_id,))
        conn.commit()
        conn.close()

    return jsonify({"success": True})

@notifications_bp.route('/subscribe', methods=['POST'])
def subscribe_user():
    data = request.json or {}
    phone = data.get('phone')
    alert_types = data.get('alert_types', ['weather', 'mandi'])
    district = data.get('district', 'Maharashtra')

    if not phone or len(phone) < 10:
        return jsonify({"success": False, "error": "कृपया 10 अंकी वैध मोबाईल नंबर प्रविष्ट करा."}), 400

    user = get_current_user_from_token(request)
    user_id = user['id'] if user else None

    result = subscribe_alert(user_id, phone, alert_types, district)
    return jsonify(result)

@notifications_bp.route('/send-sms', methods=['POST'])
def trigger_sms():
    data = request.json or {}
    phone = data.get('phone')
    message = data.get('message', 'ShetSathi Alert: Sheti salla and Mandi bhav update.')

    if not phone:
        return jsonify({"success": False, "error": "Phone number required"}), 400

    res = send_sms_alert(phone, message)
    return jsonify(res)
