from flask import Blueprint, jsonify
from models import get_db

insurance_bp = Blueprint('insurance', __name__, url_prefix='/api/insurance')

@insurance_bp.route('', methods=['GET'])
@insurance_bp.route('/programs', methods=['GET'])
def list_insurance_programs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM crop_insurance")
    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "programs": [dict(r) for r in rows]})

@insurance_bp.route('/programs/<int:program_id>', methods=['GET'])
def get_insurance_program(program_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM crop_insurance WHERE id = ?", (program_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Insurance program not found"}), 404

    return jsonify({"success": True, "program": dict(row)})
