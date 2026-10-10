import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models import init_db

class ShetSathiAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_health_endpoint(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'active')

    def test_weather_current_endpoint(self):
        response = self.client.get('/api/weather/current?q=Nashik')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('current', data)

    def test_market_prices_endpoint(self):
        response = self.client.get('/api/market-prices')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])

    def test_schemes_endpoint(self):
        response = self.client.get('/api/schemes')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])

    def test_profit_calculator_endpoint(self):
        payload = {
            "crop_name": "Onion",
            "land_area": 1.0,
            "seed_cost": 8000,
            "fertilizer_cost": 12000,
            "pesticide_cost": 6000,
            "labor_cost": 15000,
            "expected_yield": 80,
            "expected_price": 2150
        }
        response = self.client.post('/api/profit-calculator', json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertGreater(data['profit_loss'], 0)

if __name__ == '__main__':
    unittest.main()
