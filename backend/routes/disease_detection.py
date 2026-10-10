from flask import Blueprint, request, jsonify
import json
from services.disease_service import predict_crop_disease
from routes.auth import get_current_user_from_token
from models import get_db

disease_bp = Blueprint('disease', __name__, url_prefix='/api/disease')

@disease_bp.route('/predict', methods=['POST'])
@disease_bp.route('/analyze', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image file provided."}), 400

    file = request.files['image']
    crop_type = request.form.get('crop_type', 'Tomato')

    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file."}), 400

    allowed_exts = {'jpg', 'jpeg', 'png', 'webp'}
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in allowed_exts:
        return jsonify({"success": False, "error": f"Invalid file format '.{ext}'. Supported formats: JPG, PNG, WEBP."}), 400

    image_bytes = file.read()
    res = predict_crop_disease(image_bytes, crop_type=crop_type)

    if res.get("success"):
        user = get_current_user_from_token(request)
        user_id = user['id'] if user else None

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO disease_records (user_id, crop_type, predicted_disease, confidence, symptoms, recommendations, preventive_measures)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, res['crop_type'], res['predicted_disease'], res['confidence'], json.dumps(res['symptoms']), json.dumps(res['recommendations']), json.dumps(res['preventive_measures'])))
        conn.commit()
        conn.close()

    return jsonify(res)

@disease_bp.route('/history', methods=['GET'])
def disease_history():
    user = get_current_user_from_token(request)
    user_id = user['id'] if user else None

    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT * FROM disease_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", (user_id,))
    else:
        cursor.execute("SELECT * FROM disease_records ORDER BY created_at DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()

    history = []
    for r in rows:
        item = dict(r)
        item['symptoms'] = json.loads(item['symptoms']) if item.get('symptoms') else []
        item['recommendations'] = json.loads(item['recommendations']) if item.get('recommendations') else []
        history.append(item)

    return jsonify({"success": True, "history": history})
