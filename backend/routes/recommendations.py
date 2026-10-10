from flask import Blueprint, request, jsonify
import json
from services.recommendation_service import generate_fertilizer_advisory, generate_crop_suitability
from routes.auth import get_current_user_from_token
from models import get_db

rec_bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')

@rec_bp.route('/fertilizer', methods=['POST'])
def fertilizer_rec():
    data = request.json or {}
    crop_type = data.get('crop_type', 'Onion')
    soil_ph = data.get('soil_ph', 6.8)
    soil_type = data.get('soil_type', 'Medium Black Soil')
    n_val = data.get('n_val', 120)
    p_val = data.get('p_val', 45)
    k_val = data.get('k_val', 50)
    location = data.get('location', 'Maharashtra')
    season = data.get('season', 'Kharif')

    result = generate_fertilizer_advisory(crop_type, soil_ph, soil_type, n_val, p_val, k_val, location, season)

    user = get_current_user_from_token(request)
    if user:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO fertilizer_records (user_id, crop_type, soil_ph, soil_type, n_val, p_val, k_val, location, season, recommendations, safety_precautions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user['id'], crop_type, soil_ph, soil_type, n_val, p_val, k_val, location, season, json.dumps(result['chemical_fertilizers_per_acre']), json.dumps(result['safety_precautions'])))
        conn.commit()
        conn.close()

    return jsonify({"success": True, "data": result})

@rec_bp.route('/crops', methods=['POST'])
def crop_rec():
    data = request.json or {}
    soil_ph = data.get('soil_ph', 6.8)
    soil_type = data.get('soil_type', 'Black Soil')
    season = data.get('season', 'Kharif')

    crops = generate_crop_suitability(soil_ph, soil_type, season)
    return jsonify({"success": True, "recommended_crops": crops})

@rec_bp.route('/history', methods=['GET'])
def rec_history():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM fertilizer_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", (user['id'],))
    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "records": [dict(r) for r in rows]})
