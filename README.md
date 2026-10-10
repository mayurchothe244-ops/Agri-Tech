# ShetSathi – Smart Farming Assistant (शेतीसाथी)

**Tagline:** *"Empowering Farmers with Smarter, Simpler Farming."*

ShetSathi is an all-in-one digital agriculture platform designed specifically for Indian farmers with special focus on Maharashtra. It empowers farmers with AI-driven crop disease detection, soil-based fertilizer recommendations, real-time APMC Mandi prices, 5-day weather forecasts, government scheme guidance, crop insurance details, equipment rental marketplace, farm profit calculator, and a multilingual voice assistant.

---

## 🌟 Key Features & Modules

1. **Multilingual Support (i18n):**
   - **Marathi (मराठी) - Default Language**
   - **Hindi (हिंदी)**
   - **English**

2. **AI Crop Disease Detection (`/disease-detection`):**
   - Leaf photo upload & preview.
   - Crop selection (Tomato, Sugarcane, Onion, Grapes, Cotton, Wheat, Rice, Potato).
   - OpenCV color histogram & spot necrosis texture extraction with AI inference engine fallback.
   - Outputs predicted disease name (in Marathi, Hindi & English), confidence percentage, visible symptoms, chemical/organic treatment recommendations, and preventive steps.

3. **Fertilizer & Crop Advisory (`/fertilizer-recommendation`):**
   - Input soil pH, soil type, and available NPK values (kg/ha).
   - Recommends dosage for Urea, SSP/DAP, MOP, organic manure (FYM, Vermicompost), and micronutrients (Zinc/Ferrous Sulfate).
   - Provides scientific reasoning based on ICAR & MPKV Rahuri rules and safety precautions.

4. **Live Mandi Market Prices (`/market-prices`):**
   - Real-time market prices across APMC mandis in Maharashtra (Lasalgaon, Pimpalgaon, Nashik, Pune, Kolhapur, Sangli, Solapur, Nagpur, Akola).
   - Crop search, district filter, price sorting, mandi price comparison table, and interactive **Chart.js** bar chart.

5. **Local Weather Dashboard (`/weather`):**
   - Village & district search.
   - Current temperature, humidity %, wind speed, rain probability, soil temperature, and severe weather warning alerts.

6. **Government Schemes (`/schemes`):**
   - PM-KISAN, PoChRa (Nanaji Deshmukh Krushi Sanjivani Yojna), Mahatma Jyotirao Phule Karjmukti Yojna, SMAM Equipment Subsidy, etc.
   - Detailed eligibility, required documents, step-by-step application procedure, and official government portal links.

7. **Crop Insurance (`/crop-insurance`):**
   - PMFBY (Pradhan Mantri Fasal Bima Yojana) & Restructured Weather Based Crop Insurance Scheme (RWBCIS).
   - Claim guidelines, 72-hour toll-free helpline, and official application links.

8. **Agricultural Equipment Rental (`/equipment-rental`):**
   - Browse tractors (John Deere 55HP, Mahindra 45HP), harvesters (Kubota), rotavators, and boom sprayers.
   - Daily/Hourly rental pricing, verified owner contact details, and date selection booking form with backend persistence.

9. **Farming Materials Marketplace (`/marketplace`):**
   - Browse Seeds, Fertilizers, Organic Manure, Plant Protection, Farming Tools, and Irrigation Accessories.
   - Interactive Shopping Cart drawer, Cash on Delivery checkout, and Order History.

10. **Smart Farm Profit Calculator (`/profit-calculator`):**
    - Comprehensive input fields: seeds, fertilizers, pesticides, labor, irrigation, machinery, transportation, expected yield, and price.
    - Calculates Total Cost, Expected Revenue, Net Profit/Loss, Profit Margin %, Break-Even Price.
    - Includes interactive **Doughnut Chart** for expense breakdown, price scenario sensitivity matrix (-15% / Base / +15%), and **Export/Print Report** button.

11. **Multilingual Voice Assistant (`/voice-assistant`):**
    - Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
    - Voice-to-text input, text-to-speech spoken answers, suggested questions chips, and backend AI Q&A engine.

12. **Farmer Dashboard (`/dashboard`):**
    - Personalized dashboard with farmer profile, selected crops, local weather summary, recent disease scans history, profit calculator history, rental bookings, and notification center.

---

## 🏗️ Technology Stack

- **Frontend:** React.js (Vite), Tailwind CSS v4, Lucide Icons, Chart.js, React-Chartjs-2, React Router DOM v6.
- **Backend:** Python 3.12, Flask, Flask-CORS, PyJWT, Werkzeug.
- **AI / Computer Vision:** OpenCV (`opencv-python-headless`), NumPy.
- **Database:** SQLite 3 (`shetsathi.db` - automatically created & seeded).

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- **Node.js:** v18+ or v24+
- **Python:** 3.10+ or 3.12+

---

### Step 1: Start the Backend (Flask API)

```bash
cd backend

# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Seed SQLite Database with realistic Maharashtra data
python seed_data.py

# 3. Start Flask REST API Server (runs on http://127.0.0.1:5000)
python app.py
```

---

### Step 2: Start the Frontend (React + Vite)

Open a new terminal window:

```bash
cd frontend

# 1. Install NPM packages
npm install

# 2. Run Vite Development Server (runs on http://localhost:3000)
npm run dev
```

Open your browser at `http://localhost:3000` to interact with ShetSathi!

---

## 🤖 How to Integrate a Trained TensorFlow AI Model

To connect a custom trained TensorFlow leaf disease classification model (`.h5` or SavedModel format):

1. Place your trained `.h5` model file in `backend/models/crop_disease_model.h5`.
2. Open `backend/disease_engine.py` and enable TensorFlow loading:

```python
import tensorflow as tf

MODEL_PATH = 'models/crop_disease_model.h5'
if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
```

3. Inside `analyze_crop_image(image_bytes, crop_type)`, pass the preprocessed OpenCV image array to `model.predict(img)` to retrieve the predicted class index and confidence score.

---

## 🔑 Environment Variables (`.env.example`)

See `backend/.env.example`:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=shetsathi_secret_key_2026_maharashtra_farmers

# Optional Real External APIs
OPENWEATHER_API_KEY=your_openweather_api_key_here
AGRI_MARKET_API_KEY=your_agri_mandi_api_key_here
```

---

## 🌐 Deployment Instructions

- **Frontend:** Deploy to **Vercel** or **Firebase Hosting**.
  - Run `npm run build` inside `frontend/` to generate production assets in `frontend/dist/`.
- **Backend:** Deploy to **Render**, **Railway**, or **AWS EC2** using `gunicorn app:app`.

---

## 🛡️ License & Support

Developed with ❤️ for Indian & Maharashtra Farmers.
For support or questions, contact **help@shetsathi.agri.in** or call Kisan Toll-Free **1800-180-1551**.
