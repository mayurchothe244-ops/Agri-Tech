from flask import Blueprint, request, jsonify
from models import get_db

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['GET'])
def list_products():
    category = request.args.get('category', '')
    conn = get_db()
    cursor = conn.cursor()

    if category:
        cursor.execute("SELECT * FROM marketplace_products WHERE category = ?", (category,))
    else:
        cursor.execute("SELECT * FROM marketplace_products")

    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "products": [dict(r) for r in rows]})

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM marketplace_products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Product not found"}), 404

    return jsonify({"success": True, "product": dict(row)})
