from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from models import get_db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def get_current_user_from_token(req):
    auth_header = req.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, phone, email, role, location, preferred_language, preferred_crops FROM users WHERE id = ?", (data['user_id'],))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None
    except Exception as e:
        return None

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json or {}
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email', '')
    password = data.get('password')
    location = data.get('location', 'Nashik, Maharashtra')
    language = data.get('preferred_language', 'mr')
    crops = data.get('preferred_crops', 'Onion, Sugarcane')

    if not name or not phone or not password:
        return jsonify({"success": False, "message": "माहिती अपूर्ण आहे! Name, phone number and password are required."}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE phone = ?", (phone,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"success": False, "message": "हा मोबाईल नंबर आधीच नोंदणीकृत आहे."}), 400

    pwd_hash = generate_password_hash(password)
    cursor.execute('''
        INSERT INTO users (name, phone, email, password_hash, location, preferred_language, preferred_crops)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (name, phone, email, pwd_hash, location, language, crops))
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()

    token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        "success": True,
        "message": "नोंदणी यशस्वी झाली!",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "phone": phone,
            "email": email,
            "location": location,
            "preferred_language": language,
            "preferred_crops": crops
        }
    })

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    phone = data.get('phone')
    password = data.get('password')

    if not phone or not password:
        return jsonify({"success": False, "message": "फोन नंबर आणि पासवर्ड आवश्यक आहे."}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, phone, email, password_hash, role, location, preferred_language, preferred_crops FROM users WHERE phone = ?", (phone,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"success": False, "message": "मोबाईल नंबर किंवा पासवर्ड चुकीचा आहे."}), 401

    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.utcnow() + timedelta(days=30)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        "success": True,
        "message": "लॉगिन यशस्वी झाले!",
        "token": token,
        "user": {
            "id": user['id'],
            "name": user['name'],
            "phone": user['phone'],
            "email": user['email'],
            "role": user['role'],
            "location": user['location'],
            "preferred_language": user['preferred_language'],
            "preferred_crops": user['preferred_crops']
        }
    })

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json or {}
    phone = data.get('phone')
    new_password = data.get('new_password')

    if not phone or not new_password:
        return jsonify({"success": False, "message": "फोन नंबर आणि नवीन पासवर्ड प्रविष्ट करा."}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE phone = ?", (phone,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        return jsonify({"success": False, "message": "हा फोन नंबर नोंदणीकृत नाही."}), 404

    pwd_hash = generate_password_hash(new_password)
    cursor.execute("UPDATE users SET password_hash = ? WHERE phone = ?", (pwd_hash, phone))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "पासवर्ड यशस्वीरित्या बदलला गेला!"})

@auth_bp.route('/me', methods=['GET'])
def get_me():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    return jsonify({"success": True, "user": user})

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.json or {}
    name = data.get('name', user['name'])
    email = data.get('email', user['email'])
    location = data.get('location', user['location'])
    language = data.get('preferred_language', user['preferred_language'])
    crops = data.get('preferred_crops', user['preferred_crops'])

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE users
        SET name = ?, email = ?, location = ?, preferred_language = ?, preferred_crops = ?
        WHERE id = ?
    ''', (name, email, location, language, crops, user['id']))
    conn.commit()
    conn.close()

    user['name'] = name
    user['email'] = email
    user['location'] = location
    user['preferred_language'] = language
    user['preferred_crops'] = crops

    return jsonify({"success": True, "message": "प्रोफाइल अद्यतनित केले!", "user": user})
