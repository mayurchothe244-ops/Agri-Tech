import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import DB_PATH, init_db
from seed_data import seed_all_data

# Import Blueprints
from routes.auth import auth_bp
from routes.weather import weather_bp
from routes.market_prices import market_bp
from routes.disease_detection import disease_bp
from routes.recommendations import rec_bp
from routes.schemes import schemes_bp
from routes.insurance import insurance_bp
from routes.equipment import equipment_bp
from routes.bookings import bookings_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.profit_calculator import profit_bp
from routes.notifications import notifications_bp
from routes.voice import voice_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure database exists and is seeded
    if not os.path.exists(Config.DB_PATH):
        seed_all_data()

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(weather_bp)
    app.register_blueprint(market_bp)
    app.register_blueprint(disease_bp)
    app.register_blueprint(rec_bp)
    app.register_blueprint(schemes_bp)
    app.register_blueprint(insurance_bp)
    app.register_blueprint(equipment_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(profit_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(voice_bp)

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "active",
            "app": "ShetSathi – Smart Farming Assistant API",
            "version": "1.0.0",
            "architecture": "Modular Flask Blueprints Architecture",
            "default_language": "mr (Marathi)"
        })

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
