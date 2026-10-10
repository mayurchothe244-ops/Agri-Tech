from flask import Blueprint, request, jsonify
from routes.auth import get_current_user_from_token
from models import get_db

equipment_bp = Blueprint('equipment', __name__, url_prefix='/api/equipment')

@equipment_bp.route('', methods=['GET'])
def list_equipment():
    category = request.args.get('category', '')
    location = request.args.get('location', '')

    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM equipment_listings WHERE 1=1"
    params = []

    if category:
        query += " AND category LIKE ?"
        params.append(f"%{category}%")
    if location:
        query += " AND location LIKE ?"
        params.append(f"%{location}%")

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "equipment": [dict(r) for r in rows]})

@equipment_bp.route('/<int:equip_id>', methods=['GET'])
def get_equipment_by_id(equip_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM equipment_listings WHERE id = ?", (equip_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Equipment listing not found"}), 404

    return jsonify({"success": True, "equipment": dict(row)})

@equipment_bp.route('', methods=['POST'])
def add_equipment():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.json or {}
    name = data.get('name')
    category = data.get('category', 'Tractor')
    price_per_day = float(data.get('price_per_day', 1500))
    price_per_hour = float(data.get('price_per_hour', 250))
    location = data.get('location', user['location'])
    contact = data.get('contact', user['phone'])
    description = data.get('description', '')
    image_url = data.get('image_url', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=600&q=80')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO equipment_listings (owner_name, contact, location, name, category, price_per_day, price_per_hour, availability, image_url, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user['name'], contact, location, name, category, price_per_day, price_per_hour, 'Available', image_url, description))
    conn.commit()
    equip_id = cursor.lastrowid
    conn.close()

    return jsonify({"success": True, "message": "Equipment listing added successfully!", "equipment_id": equip_id})
