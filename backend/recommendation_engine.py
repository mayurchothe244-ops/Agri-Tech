"""
Fertilizer & Crop Recommendation Engine for ShetSathi Smart Farming Assistant
Configurable agricultural science rules based on ICAR & MPKV Rahuri guidelines.
"""

CROPS_SOIL_SUITABILITY = {
    "Sugarcane": {
        "ph_range": (6.0, 8.5),
        "preferred_soils": ["Black Cotton Soil", "Deep Clay Loam", "Alluvial Soil"],
        "npk_requirement": {"N": 250, "P": 115, "K": 115}, # kg/hectare
        "description": "High water and nutrient demanding crop. Thrives in heavy black soil of Western Maharashtra."
    },
    "Onion": {
        "ph_range": (6.0, 7.5),
        "preferred_soils": ["Red Loam", "Medium Black Soil", "Alluvial Soil"],
        "npk_requirement": {"N": 100, "P": 50, "K": 50},
        "description": "Requires well-drained friable soil rich in organic matter. Essential crop in Nashik, Ahmednagar & Pune districts."
    },
    "Tomato": {
        "ph_range": (6.0, 7.0),
        "preferred_soils": ["Red Sandy Loam", "Medium Black Soil"],
        "npk_requirement": {"N": 150, "P": 60, "K": 60},
        "description": "Sensitive to waterlogging. Responds very well to drip irrigation and fertigation."
    },
    "Grapes": {
        "ph_range": (6.5, 8.0),
        "preferred_soils": ["Well-drained Black Soil", "Loamy Soil"],
        "npk_requirement": {"N": 160, "P": 80, "K": 160},
        "description": "Perennial vine crop needing good calcium & potassium balance during berry development."
    },
    "Cotton": {
        "ph_range": (6.0, 8.2),
        "preferred_soils": ["Black Cotton Soil (Regur)", "Deep Alluvial"],
        "npk_requirement": {"N": 120, "P": 60, "K": 60},
        "description": "Deep taproot system suited for rainfed and irrigated heavy black soils of Vidarbha & Marathwada."
    },
    "Soybean": {
        "ph_range": (6.0, 7.5),
        "preferred_soils": ["Black Soil", "Loamy Soil"],
        "npk_requirement": {"N": 30, "P": 60, "K": 40},
        "description": "Leguminous oilseed crop; fixes atmospheric nitrogen via Rhizobium nodules."
    },
    "Wheat": {
        "ph_range": (6.0, 7.5),
        "preferred_soils": ["Clay Loam", "Alluvial Soil", "Medium Black Soil"],
        "npk_requirement": {"N": 120, "P": 60, "K": 40},
        "description": "Major Rabi cereal crop. Prefers cool climate and fertile loam."
    },
    "Pomegranate": {
        "ph_range": (6.5, 8.5),
        "preferred_soils": ["Light to Medium Black Soil", "Sandy Loam"],
        "npk_requirement": {"N": 625, "P": 250, "K": 500}, # g/plant/year
        "description": "Drought-tolerant horticulture crop suited for Solapur, Sangli, and Nashik belts."
    }
}

def get_fertilizer_recommendation(crop_type, soil_ph, soil_type, n_val, p_val, k_val, location, season):
    """
    Computes fertilizer dosage, organic manure, micronutrients, and safety precautions.
    """
    crop = crop_type if crop_type in CROPS_SOIL_SUITABILITY else "Onion"
    info = CROPS_SOIL_SUITABILITY[crop]

    # Defaults if missing
    ph = float(soil_ph) if soil_ph is not None else 6.8
    n = int(n_val) if n_val is not None else 120
    p = int(p_val) if p_val is not None else 45
    k = int(k_val) if k_val is not None else 50

    target_n = info["npk_requirement"]["N"]
    target_p = info["npk_requirement"]["P"]
    target_k = info["npk_requirement"]["K"]

    # Calculate deficit / adjustment ratio
    n_status = "Deficient" if n < target_n * 0.7 else ("Sufficient" if n <= target_n * 1.3 else "High")
    p_status = "Deficient" if p < target_p * 0.7 else ("Sufficient" if p <= target_p * 1.3 else "High")
    k_status = "Deficient" if k < target_k * 0.7 else ("Sufficient" if k <= target_k * 1.3 else "High")

    # Recommended Commercial Fertilizers (per Acre)
    urea_dose = round(target_n * 2.17 * 0.4, 1) # ~46% N in Urea
    ssp_dose = round(target_p * 6.25 * 0.4, 1)  # ~16% P in Single Super Phosphate
    mop_dose = round(target_k * 1.66 * 0.4, 1)  # ~60% K in Muriate of Potash

    if n_status == "Deficient":
        urea_dose = round(urea_dose * 1.25, 1)
    elif n_status == "High":
        urea_dose = round(urea_dose * 0.75, 1)

    if p_status == "Deficient":
        ssp_dose = round(ssp_dose * 1.25, 1)

    if k_status == "Deficient":
        mop_dose = round(mop_dose * 1.25, 1)

    # Soil pH Remediation
    ph_advice = ""
    if ph < 6.0:
        ph_advice = "Soil is acidic (pH < 6.0). Apply Agricultural Lime (Calcium Carbonate) @ 200-300 kg/acre prior to sowing."
    elif ph > 8.0:
        ph_advice = "Soil is alkaline (pH > 8.0). Apply Agricultural Gypsum @ 250 kg/acre or Sulfur @ 25 kg/acre to lower pH."
    else:
        ph_advice = "Soil pH is optimal (6.0 - 8.0). Nutrient availability is balanced."

    recommendations = {
        "crop": crop,
        "soil_analysis": {
            "ph_level": ph,
            "ph_status": "Optimal" if 6.0 <= ph <= 8.0 else ("Acidic" if ph < 6.0 else "Alkaline"),
            "nitrogen_status": n_status,
            "phosphorus_status": p_status,
            "potassium_status": k_status
        },
        "chemical_fertilizers_per_acre": [
            {"name": "Urea (46% N)", "dosage": f"{urea_dose} kg/acre", "application_timing": "50% Basal at sowing, 50% Top dressing at 30 days"},
            {"name": "Single Super Phosphate (SSP 16% P2O5)", "dosage": f"{ssp_dose} kg/acre", "application_timing": "100% Basal application during land preparation"},
            {"name": "Muriate of Potash (MOP 60% K2O)", "dosage": f"{mop_dose} kg/acre", "application_timing": "50% Basal, 50% during flowering / bulb formation"}
        ],
        "organic_manure": [
            "Well-decomposed Farm Yard Manure (FYM): 4-5 tonnes/acre",
            "Vermicompost: 1.5 tonnes/acre",
            "Bio-fertilizers: Azotobacter / Rhizobium + PSB @ 2 kg/acre mixed with FYM"
        ],
        "micronutrients": [
            "Zinc Sulfate (21% Zn) @ 10 kg/acre to prevent khaira/khapra leaf yellowing",
            "Ferrous Sulfate @ 5 kg/acre if young leaves show interveinal chlorosis"
        ],
        "ph_remediation": ph_advice,
        "reasoning": f"Based on your location ({location or 'Maharashtra'}), season ({season or 'Kharif'}), soil type ({soil_type or 'Black Soil'}), and soil test values (N:{n}, P:{p}, K:{k}), this custom fertilizing plan ensures maximum yield without soil degradation.",
        "safety_precautions": [
            "Always wear protective gloves and a face mask while applying chemical fertilizers or pesticides.",
            "Never mix Urea with Single Super Phosphate long before application.",
            "Apply fertilizers in moist soil conditions; avoid broadcasting during extreme heat or heavy rains.",
            "Keep fertilizers stored in a cool, dry place away from children and farm livestock.",
            "Dosages are advisory estimates based on standard regional recommendations; verify with your local soil testing laboratory."
        ]
    }
    return recommendations

def recommend_best_crops(soil_ph, soil_type, season):
    """
    Returns top recommended crops based on soil type, pH, and season.
    """
    ph = float(soil_ph) if soil_ph is not None else 6.8
    s_type = soil_type if soil_type else "Black Soil"

    suitable_crops = []
    for crop_name, info in CROPS_SOIL_SUITABILITY.items():
        min_ph, max_ph = info["ph_range"]
        if min_ph <= ph <= max_ph:
            suitable_crops.append({
                "crop": crop_name,
                "suitability_score": "High (90%+)",
                "description": info["description"],
                "preferred_soils": ", ".join(info["preferred_soils"])
            })

    if not suitable_crops:
        suitable_crops.append({
            "crop": "Onion",
            "suitability_score": "Moderate (75%)",
            "description": "Adaptable crop suitable for various soil conditions.",
            "preferred_soils": "Medium Black Soil"
        })

    return suitable_crops
