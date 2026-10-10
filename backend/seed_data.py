import sqlite3
import os
from werkzeug.security import generate_password_hash
from models import DB_PATH, init_db

def seed_all_data():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Seed Demo User
    cursor.execute("SELECT id FROM users WHERE phone = ?", ("9876543210",))
    if not cursor.fetchone():
        pwd_hash = generate_password_hash("password123")
        cursor.execute('''
            INSERT INTO users (name, phone, email, password_hash, role, location, preferred_language, preferred_crops)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', ("रमेश पाटील (Ramesh Patil)", "9876543210", "ramesh.patil@example.com", pwd_hash, "farmer", "Nashik, Maharashtra", "mr", "Onion, Sugarcane, Grapes, Tomato"))

    # 2. Seed Mandi Prices (Realistic Maharashtra Data)
    cursor.execute("DELETE FROM mandi_prices")
    mandi_data = [
        ("Onion (कांदा)", "Lasalgaon (लासलगाव)", "Maharashtra", "Nashik", 1400, 2600, 2150, "₹/Quintal", "2026-10-09"),
        ("Onion (कांदा)", "Pimpalgaon (पिंपळगाव)", "Maharashtra", "Nashik", 1500, 2750, 2200, "₹/Quintal", "2026-10-09"),
        ("Onion (कांदा)", "Pune APMC (पुणे)", "Maharashtra", "Pune", 1350, 2500, 2000, "₹/Quintal", "2026-10-09"),
        ("Sugarcane (ऊस)", "Kolhapur APMC (कोल्हापूर)", "Maharashtra", "Kolhapur", 3100, 3500, 3350, "₹/Tonne", "2026-10-09"),
        ("Sugarcane (ऊस)", "Sangli APMC (सांगली)", "Maharashtra", "Sangli", 3050, 3450, 3300, "₹/Tonne", "2026-10-09"),
        ("Tomato (टोमॅटो)", "Narayangaon (नारायणगाव)", "Maharashtra", "Pune", 1200, 2400, 1850, "₹/Quintal", "2026-10-09"),
        ("Tomato (टोमॅटो)", "Nashik APMC (नाशिक)", "Maharashtra", "Nashik", 1100, 2300, 1750, "₹/Quintal", "2026-10-09"),
        ("Grapes (द्राक्ष)", "Nashik APMC (नाशिक)", "Maharashtra", "Nashik", 4500, 8500, 6800, "₹/Quintal", "2026-10-09"),
        ("Grapes (द्राक्ष)", "Tasgaon (तासगाव)", "Maharashtra", "Sangli", 4800, 9000, 7200, "₹/Quintal", "2026-10-09"),
        ("Cotton (कापूस)", "Akola APMC (अकोला)", "Maharashtra", "Akola", 6800, 7600, 7250, "₹/Quintal", "2026-10-09"),
        ("Cotton (कापूस)", "Nagpur APMC (नागपूर)", "Maharashtra", "Nagpur", 6700, 7500, 7150, "₹/Quintal", "2026-10-09"),
        ("Soybean (सोयाबीन)", "Latur APMC (लातूर)", "Maharashtra", "Latur", 4200, 4900, 4650, "₹/Quintal", "2026-10-09"),
        ("Soybean (सोयाबीन)", "Amravati APMC (अमरावती)", "Maharashtra", "Amravati", 4150, 4850, 4600, "₹/Quintal", "2026-10-09"),
        ("Pomegranate (डाळिंब)", "Solapur APMC (सोलापूर)", "Maharashtra", "Solapur", 6000, 14000, 9500, "₹/Quintal", "2026-10-09"),
        ("Wheat (गहू)", "Nagpur APMC (नागपूर)", "Maharashtra", "Nagpur", 2400, 2900, 2650, "₹/Quintal", "2026-10-09")
    ]
    cursor.executemany('''
        INSERT INTO mandi_prices (crop_name, mandi_name, state, district, min_price, max_price, modal_price, unit, price_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', mandi_data)

    # 3. Seed Government Schemes
    cursor.execute("DELETE FROM government_schemes")
    scheme_data = [
        (
            "PM-KISAN (प्रधानमंत्री किसान सन्मान निधी योजना)",
            "Financial Support",
            "Under PM-KISAN scheme, eligible farmer families receive direct income support of ₹6,000 per year in three equal instalments of ₹2,000 every 4 months directly into DB-linked bank accounts.",
            "Landholding farmer families with cultivable land in their names. Excludes institutional landholders, high-income individuals, and government employees.",
            "Aadhaar Card, Land Record Details (7/12 & 8A extract), Active Bank Account Passbook linked to Aadhaar.",
            "1. Visit the official PM-KISAN portal (pmkisan.gov.in).\n2. Click on 'New Farmer Registration'.\n3. Enter Aadhaar number and state, verify OTP, and submit land details.",
            "https://pmkisan.gov.in",
            "2026-09-15"
        ),
        (
            "Mahatma Jyotirao Phule Shetkari Karjmukti Yojna (महात्मा महात्मा जोतीराव फुले शेतकरी कर्जमुक्ती योजना)",
            "Farmer Assistance & Debt Relief",
            "Maharashtra State scheme offering crop loan waiver up to ₹2 Lakh for farmers who have taken short-term crop loans and are unable to repay due to natural calamities.",
            "Small and marginal farmers of Maharashtra with crop loans up to ₹2 Lakh disbursed between April 1, 2015 and March 31, 2019.",
            "Aadhaar Card, Loan Account Passbook, 7/12 Extract, Ration Card.",
            "1. Contact your primary agricultural credit society (PACS) or bank branch.\n2. Verify your name in the beneficiary list at your Gram Panchayat.\n3. Complete biometric authentication at your local CSC center.",
            "https://mjpsky.maharashtra.gov.in",
            "2026-08-20"
        ),
        (
            "PoChRa / Nanaji Deshmukh Krushi Sanjivani Yojna (नानाजी देशमुख कृषी संजीवनी प्रकल्प - पोकरा)",
            "Irrigation & Climate Resilience",
            "World Bank funded scheme in Maharashtra providing 50% to 100% subsidy for farm ponds, shade net houses, polyhouses, drip/sprinkler irrigation, and drip automation.",
            "Farmers in drought-prone & climate vulnerable villages across 15 districts of Marathwada & Vidarbha and drought pockets of Nashik & Jalgaon.",
            "7/12 Extract, 8A Extract, Aadhaar Card, Bank Passbook, Caste Certificate (if applicable).",
            "1. Download the DBT Mahadbt portal / Mahadbt Farmer app.\n2. Register using Aadhaar and select PoChRa components.\n3. Submit geo-tagged photos and land documents.",
            "https://dbt.mahacet.org",
            "2026-09-01"
        ),
        (
            "Sub-Mission on Agricultural Mechanization - SMAM (कृषी यांत्रिकीकरण उपअभियान)",
            "Agricultural Equipment & Subsidy",
            "Provides 40% to 50% financial subsidy to farmers for purchasing farm machinery like tractors, rotavators, power tillers, sprayers, and combine harvesters.",
            "All categories of farmers. Priority given to women farmers, SC/ST farmers, and small/marginal farmers.",
            "Aadhaar Card, Quotation of Machinery from authorized dealer, Bank Passbook, 7/12 Land Extract.",
            "1. Register on Mahadbt Farmer Portal.\n2. Choose 'Agricultural Machinery Subsidy'.\n3. Upload machinery quotation and wait for online lottery / pre-sanction letter.",
            "https://agrimachinery.nic.in",
            "2026-07-10"
        ),
        (
            "Dr. Punjabrao Deshmukh Interest Concession Scheme (डॉ. पंजाबराव देशमुख व्याज सवलत योजना)",
            "Financial Support",
            "Provides 100% interest subsidy on crop loans up to ₹3 Lakh repaid promptly within the due date by Maharashtra farmers.",
            "Farmers who take crop loan up to ₹3 Lakh from Cooperative or Nationalized Banks and repay on or before due date.",
            "Crop loan passbook, Aadhaar card, Bank NOC certificate.",
            "Claimed automatically through the lending bank upon timely loan repayment.",
            "https://mahabhulekh.maharashtra.gov.in",
            "2026-06-12"
        )
    ]
    cursor.executemany('''
        INSERT INTO government_schemes (title, category, description, eligibility, documents, steps, link, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', scheme_data)

    # 4. Seed Crop Insurance
    cursor.execute("DELETE FROM crop_insurance")
    insurance_data = [
        (
            "Pradhan Mantri Fasal Bima Yojana - PMFBY (प्रधानमंत्री पीक विमा योजना)",
            "All Kharif & Rabi Crops (Sugarcane, Onion, Cotton, Soybean, Paddy, Wheat)",
            "All Districts of Maharashtra",
            "Owner farmers, tenant farmers, and sharecroppers growing notified crops in notified areas. Premium rates: 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.",
            "7/12 Land Record Extract, 8A Extract, Crop Sowing Certificate from Talathi/Gram Sevak, Bank Passbook, Aadhaar Card.",
            "1. Visit nearest Common Service Centre (CSC) or bank branch.\n2. Or apply online at pmfby.gov.in before the cutoff date (usually July 31 for Kharif, Dec 31 for Rabi).\n3. Pay nominal farmer share premium.",
            "https://pmfby.gov.in",
            "Losses due to unseasonal rain, hailstorm, drought, flood, pests, and post-harvest losses up to 14 days covered. Intimate loss within 72 hours via PMFBY app or toll-free number 1800-180-1551."
        ),
        (
            "Restructured Weather Based Crop Insurance Scheme - RWBCIS (हवामान आधारित फळपिक विमा योजना)",
            "Fruit Crops (Grapes, Pomegranate, Banana, Mango, Citrus, Guava)",
            "Nashik, Sangli, Solapur, Ahmednagar, Jalgaon, Pune, Aurangabad",
            "Farmers cultivating notified fruit crops with registered orchards. Protects against adverse weather parameters like unseasonal rain, high wind speed, low temperature, and humidity spikes.",
            "Orchard Land Record, Geo-tagged Orchard Photographs, Bank Passbook, Aadhaar Card, Water Source Proof.",
            "Apply through Mahadbt portal or nearest insurance company agent before notified cutoff date.",
            "https://krishi.maharashtra.gov.in",
            "Claims are settled automatically based on automated weather stations (AWS) data installed at revenue circle level. No individual loss assessment mandatory."
        )
    ]
    cursor.executemany('''
        INSERT INTO crop_insurance (scheme_name, eligible_crops, regions, eligibility, documents, steps, apply_link, claim_info)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', insurance_data)

    # 5. Seed Equipment Listings
    cursor.execute("DELETE FROM equipment_listings")
    equipment_data = [
        ("सुभाष भोसले (Subhash Bhosale)", "9822114455", "Nashik (पिंपळगाव)", "John Deere 5310 Tractor (55 HP 4WD)", "Tractor & Heavy Machinery", 1800.0, 300.0, "Available", "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=600&q=80", "55 HP 4WD Tractor with rotavator attachment. Heavy duty performance for deep ploughing and tillage."),
        ("संजय गायकवाड (Sanjay Gaikwad)", "9890123456", "Pune (नारायणगाव)", "Mahindra 575 DI Tractor with Trolley", "Tractor & Heavy Machinery", 1400.0, 250.0, "Available", "https://images.unsplash.com/photo-1544985397-28d8d32f05a9?auto=format&fit=crop&w=600&q=80", "45 HP Mahindra tractor with 5-tonne hydraulic trolley for agricultural crop transport."),
        ("प्रकाश मोरे (Prakash More)", "9765432109", "Solapur (पंढरपूर)", "Kubota Multi-Crop Combine Harvester", "Harvester", 3500.0, 600.0, "Available", "https://images.unsplash.com/photo-1595186884020-f5655767b43a?auto=format&fit=crop&w=600&q=80", "Track-type combine harvester ideal for paddy, soybean, and wheat harvesting with zero grain damage."),
        ("ज्ञानेश्वर जगताप (Dnyaneshwar Jagtap)", "9823001122", "Ahmednagar (राहुरी)", "Heavy Rotavator 7 Feet (Shaktiman)", "Soil Tillage", 800.0, 150.0, "Available", "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80", "7 feet heavy duty rotavator suitable for fine seedbed preparation in sugarcane and cotton fields."),
        ("विठ्ठल शिंदे (Vitthal Shinde)", "9970887766", "Sangli (तासगाव)", "High Pressure Boom Sprayer (500L Tank)", "Sprayers & Plant Protection", 1000.0, 180.0, "Available", "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80", "Tractor-drawn 500 liter boom sprayer for vineyard and pomegranate orchard chemical spraying.")
    ]
    cursor.executemany('''
        INSERT INTO equipment_listings (owner_name, contact, location, name, category, price_per_day, price_per_hour, availability, image_url, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', equipment_data)

    # 6. Seed Marketplace Products
    cursor.execute("DELETE FROM marketplace_products")
    product_data = [
        ("N-53 Hybrid Onion Seeds (कांदा बी बियाणे 1kg)", "Seeds", 1450.0, "1 kg Pack", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80", "High yield Kharif onion seeds. Uniform bright red bulbs with high disease tolerance and long shelf storage life.", 4.8, 120),
        ("IFFCO DAP Fertilizer (18-46-0) 50kg Bag", "Fertilizers", 1350.0, "50 kg Bag", "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80", "Standard Di-Ammonium Phosphate fertilizer rich in Water Soluble Phosphorus and Nitrogen for robust root growth.", 4.9, 200),
        ("Trichoderma Viride Bio-Fungicide (1kg)", "Plant Protection", 280.0, "1 kg Pack", "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80", "Eco-friendly bio-control agent for soil-borne fungal diseases like wilt, root rot, and damping off.", 4.7, 85),
        ("2-in-1 Battery Operated Knapsack Sprayer (20L)", "Farming Tools", 2850.0, "1 Unit", "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80", "Dual mode (battery + manual hand pump) 12V 12Ah heavy duty sprayer with 4 stainless steel nozzle set.", 4.6, 45),
        ("16mm Drip Irrigation Inline Pipe (100m Roll, 40cm Spacing)", "Irrigation Accessories", 1150.0, "100 Meter Roll", "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80", "UV stabilized Class-1 drip tape with 2 LPH discharge rate per dripper. Ideal for row crops like tomato and chili.", 4.8, 150),
        ("Organic Vermicompost 100% Pure (50kg Bag)", "Organic Manure", 450.0, "50 kg Bag", "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80", "Enriched organic earthworm compost loaded with beneficial soil microbes, humic acid, and micronutrients.", 4.9, 300)
    ]
    cursor.executemany('''
        INSERT INTO marketplace_products (name, category, price, unit, image_url, description, rating, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', product_data)

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic Maharashtra agricultural data!")

if __name__ == "__main__":
    seed_all_data()
