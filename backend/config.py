import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'shetsathi_secret_key_2026_maharashtra_farmers')
    DB_PATH = os.path.join(os.path.dirname(__file__), 'shetsathi.db')
    OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', '')
    AGRI_MARKET_API_KEY = os.environ.get('AGRI_MARKET_API_KEY', '')
    TENSORFLOW_MODEL_PATH = os.environ.get('TENSORFLOW_MODEL_PATH', 'models/crop_disease_model.h5')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max image upload size
