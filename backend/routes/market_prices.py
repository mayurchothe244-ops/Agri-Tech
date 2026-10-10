from flask import Blueprint, request, jsonify
from services.market_service import fetch_mandi_prices, fetch_distinct_crops, compare_crop_prices

market_bp = Blueprint('market_prices', __name__, url_prefix='/api/market-prices')

@market_bp.route('', methods=['GET'])
def get_market_prices():
    crop = request.args.get('crop', '')
    district = request.args.get('district', '')
    search = request.args.get('search', '')

    prices = fetch_mandi_prices(crop=crop, district=district, search=search)
    return jsonify({
        "success": True,
        "count": len(prices),
        "data": prices,
        "verified_source": "Maharashtra State Agricultural Marketing Board (MSAMB) Verified Data"
    })

@market_bp.route('/crops', methods=['GET'])
def get_crops_list():
    crops = fetch_distinct_crops()
    return jsonify({"success": True, "crops": crops})

@market_bp.route('/compare', methods=['GET'])
def compare_prices():
    crop = request.args.get('crop', 'Onion')
    prices = compare_crop_prices(crop)
    return jsonify({"success": True, "crop": crop, "comparison": prices})
