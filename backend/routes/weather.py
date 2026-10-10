from flask import Blueprint, request, jsonify
from services.weather_service import fetch_current_weather, fetch_weather_forecast

weather_bp = Blueprint('weather', __name__, url_prefix='/api/weather')

@weather_bp.route('', methods=['GET'])
def get_weather():
    location = request.args.get('q', 'Nashik')
    curr = fetch_current_weather(location)
    fore = fetch_weather_forecast(location)
    curr['forecast'] = fore.get('forecast', [])
    return jsonify(curr)

@weather_bp.route('/current', methods=['GET'])
def get_weather_current():
    location = request.args.get('q', 'Nashik')
    data = fetch_current_weather(location)
    return jsonify(data)

@weather_bp.route('/forecast', methods=['GET'])
def get_weather_forecast():
    location = request.args.get('q', 'Nashik')
    data = fetch_weather_forecast(location)
    return jsonify(data)
