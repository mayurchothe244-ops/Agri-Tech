from flask import Blueprint, request, jsonify
import json
from routes.auth import get_current_user_from_token
from models import get_db

profit_bp = Blueprint('profit_calculator', __name__, url_prefix='/api/profit-calculator')

@profit_bp.route('', methods=['POST'])
@profit_bp.route('/calculate', methods=['POST'])
def calculate_profit():
    data = request.json or {}
    crop_name = data.get('crop_name', 'Onion')
    land_area = float(data.get('land_area', 1.0))

    seed_cost = float(data.get('seed_cost', 0))
    fertilizer_cost = float(data.get('fertilizer_cost', 0))
    pesticide_cost = float(data.get('pesticide_cost', 0))
    labor_cost = float(data.get('labor_cost', 0))
    irrigation_cost = float(data.get('irrigation_cost', 0))
    machinery_cost = float(data.get('machinery_cost', 0))
    transport_cost = float(data.get('transport_cost', 0))
    other_cost = float(data.get('other_cost', 0))

    expected_yield = float(data.get('expected_yield', 1))
    expected_price = float(data.get('expected_price', 0))

    total_cost = seed_cost + fertilizer_cost + pesticide_cost + labor_cost + irrigation_cost + machinery_cost + transport_cost + other_cost
    expected_revenue = expected_yield * expected_price
    profit_loss = expected_revenue - total_cost

    profit_margin = (profit_loss / expected_revenue * 100) if expected_revenue > 0 else 0.0
    break_even_price = (total_cost / expected_yield) if expected_yield > 0 else 0.0

    breakdown = {
        "Seed Cost": seed_cost,
        "Fertilizers": fertilizer_cost,
        "Pesticides": pesticide_cost,
        "Labor": labor_cost,
        "Irrigation": irrigation_cost,
        "Machinery": machinery_cost,
        "Transportation": transport_cost,
        "Other Expenses": other_cost
    }

    scenarios = [
        {"scenario": "Pessimistic (-15% Price)", "price": round(expected_price * 0.85, 2), "revenue": round(expected_yield * expected_price * 0.85, 2), "profit": round((expected_yield * expected_price * 0.85) - total_cost, 2)},
        {"scenario": "Expected Base Case", "price": expected_price, "revenue": expected_revenue, "profit": profit_loss},
        {"scenario": "Optimistic (+15% Price)", "price": round(expected_price * 1.15, 2), "revenue": round(expected_yield * expected_price * 1.15, 2), "profit": round((expected_yield * expected_price * 1.15) - total_cost, 2)}
    ]

    res = {
        "success": True,
        "crop_name": crop_name,
        "land_area": land_area,
        "total_cost": round(total_cost, 2),
        "expected_revenue": round(expected_revenue, 2),
        "profit_loss": round(profit_loss, 2),
        "is_profit": profit_loss >= 0,
        "profit_margin_pct": round(profit_margin, 2),
        "break_even_price": round(break_even_price, 2),
        "cost_per_acre": round(total_cost / land_area, 2) if land_area > 0 else total_cost,
        "breakdown": breakdown,
        "scenarios": scenarios
    }

    user = get_current_user_from_token(request)
    if user:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO profit_records (user_id, crop_name, land_area, total_cost, expected_revenue, profit_loss, profit_margin, break_even_price, breakdown_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user['id'], crop_name, land_area, total_cost, expected_revenue, profit_loss, profit_margin, break_even_price, json.dumps(breakdown)))
        conn.commit()
        conn.close()

    return jsonify(res)

@profit_bp.route('/history', methods=['GET'])
def profit_history():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profit_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", (user['id'],))
    rows = cursor.fetchall()
    conn.close()

    return jsonify({"success": True, "records": [dict(r) for r in rows]})
