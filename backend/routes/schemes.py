from flask import Blueprint, request, jsonify
from models import get_db

schemes_bp = Blueprint('schemes', __name__, url_prefix='/api/schemes')

@schemes_bp.route('', methods=['GET'])
def list_schemes():
    category = request.args.get('category', '')
    search = request.args.get('search', '')

    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM government_schemes WHERE 1=1"
    params = []

    if category:
        query += " AND category LIKE ?"
        params.append(f"%{category}%")
    if search:
        query += " AND (title LIKE ? OR description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "schemes": [dict(r) for r in rows]})

@schemes_bp.route('/<int:scheme_id>', methods=['GET'])
def get_scheme_by_id(scheme_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM government_schemes WHERE id = ?", (scheme_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Scheme not found"}), 404

    return jsonify({"success": True, "scheme": dict(row)})
