import os
import requests
import sqlite3
from models import get_db

# Official Government of India Agmarknet / Data.gov.in API Endpoint
DATA_GOV_IN_MANDI_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

def fetch_mandi_prices(crop=None, district=None, search=None):
    """
    Fetches mandi prices.
    Attempts live Agmarknet / Data.gov.in API fetch if API key is provided or reachable.
    Falls back to verified SQLite MSAMB dataset.
    """
    api_key = os.getenv("DATA_GOV_IN_API_KEY")
    
    if api_key:
        try:
            params = {
                "api-key": api_key,
                "format": "json",
                "limit": 50,
                "filters[state]": "Maharashtra"
            }
            if crop:
                params["filters[commodity]"] = crop
            if district:
                params["filters[district]"] = district

            response = requests.get(DATA_GOV_IN_MANDI_URL, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                records = data.get("records", [])
                if records:
                    results = []
                    for r in records:
                        results.append({
                            "crop_name": r.get("commodity", crop or "Crop"),
                            "variety": r.get("variety", "FAQ"),
                            "mandi_name": r.get("market", "Mandi"),
                            "district": r.get("district", district or "Maharashtra"),
                            "min_price": float(r.get("min_price", 0)),
                            "max_price": float(r.get("max_price", 0)),
                            "modal_price": float(r.get("modal_price", 0)),
                            "price_date": r.get("arrival_date", "Today"),
                            "source": "Agmarknet Live API (Data.gov.in)"
                        })
                    return results
        except Exception as e:
            print(f"Agmarknet API fetch warning: {e}. Falling back to SQLite database.")

    # Fallback / Default: SQLite MSAMB Verified Dataset
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM mandi_prices WHERE 1=1"
    params = []

    if crop:
        query += " AND crop_name LIKE ?"
        params.append(f"%{crop}%")
    if district:
        query += " AND district LIKE ?"
        params.append(f"%{district}%")
    if search:
        query += " AND (crop_name LIKE ? OR mandi_name LIKE ? OR district LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    query += " ORDER BY modal_price DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(r) for r in rows]

def fetch_distinct_crops():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT crop_name FROM mandi_prices")
    rows = cursor.fetchall()
    conn.close()
    return [r['crop_name'] for r in rows]

def compare_crop_prices(crop_name):
    prices = fetch_mandi_prices(crop=crop_name)
    return prices
