import sqlite3
import os
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), 'shetsathi.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            email TEXT,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'farmer',
            location TEXT DEFAULT 'Nashik, Maharashtra',
            preferred_language TEXT DEFAULT 'mr',
            preferred_crops TEXT DEFAULT 'Sugarcane, Onion, Tomato, Grapes',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Disease records
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS disease_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            crop_type TEXT NOT NULL,
            image_url TEXT,
            predicted_disease TEXT NOT NULL,
            confidence REAL NOT NULL,
            symptoms TEXT,
            recommendations TEXT,
            preventive_measures TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # 3. Fertilizer records
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fertilizer_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            crop_type TEXT NOT NULL,
            soil_ph REAL,
            soil_type TEXT,
            n_val INTEGER,
            p_val INTEGER,
            k_val INTEGER,
            location TEXT,
            season TEXT,
            recommendations TEXT,
            safety_precautions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 4. Profit calculator records
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profit_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            crop_name TEXT NOT NULL,
            land_area REAL NOT NULL,
            total_cost REAL NOT NULL,
            expected_revenue REAL NOT NULL,
            profit_loss REAL NOT NULL,
            profit_margin REAL NOT NULL,
            break_even_price REAL NOT NULL,
            breakdown_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 5. Equipment listings
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS equipment_listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_name TEXT NOT NULL,
            contact TEXT NOT NULL,
            location TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price_per_day REAL NOT NULL,
            price_per_hour REAL,
            availability TEXT DEFAULT 'Available',
            image_url TEXT,
            description TEXT
        )
    ''')

    # 6. Rental requests
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rental_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            equipment_id INTEGER NOT NULL,
            equipment_name TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (equipment_id) REFERENCES equipment_listings(id)
        )
    ''')

    # 7. Marketplace products
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS marketplace_products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            unit TEXT NOT NULL,
            image_url TEXT,
            description TEXT,
            rating REAL DEFAULT 4.5,
            stock INTEGER DEFAULT 50
        )
    ''')

    # 8. Orders
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            items_json TEXT NOT NULL,
            total_amount REAL NOT NULL,
            shipping_address TEXT NOT NULL,
            status TEXT DEFAULT 'Confirmed',
            payment_method TEXT DEFAULT 'Cash on Delivery',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 9. Mandi prices
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mandi_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT NOT NULL,
            mandi_name TEXT NOT NULL,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            min_price REAL NOT NULL,
            max_price REAL NOT NULL,
            modal_price REAL NOT NULL,
            unit TEXT DEFAULT '₹/Quintal',
            price_date TEXT NOT NULL
        )
    ''')

    # 10. Government schemes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS government_schemes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            eligibility TEXT NOT NULL,
            documents TEXT NOT NULL,
            steps TEXT NOT NULL,
            link TEXT NOT NULL,
            last_updated TEXT NOT NULL
        )
    ''')

    # 11. Crop insurance
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS crop_insurance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scheme_name TEXT NOT NULL,
            eligible_crops TEXT NOT NULL,
            regions TEXT NOT NULL,
            eligibility TEXT NOT NULL,
            documents TEXT NOT NULL,
            steps TEXT,
            apply_link TEXT NOT NULL,
            claim_info TEXT NOT NULL
        )
    ''')

    # 12. Notifications
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            category TEXT DEFAULT 'general',
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
