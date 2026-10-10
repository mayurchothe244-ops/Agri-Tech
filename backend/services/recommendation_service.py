from recommendation_engine import get_fertilizer_recommendation, recommend_best_crops

def generate_fertilizer_advisory(crop_type, soil_ph, soil_type, n_val, p_val, k_val, location, season):
    return get_fertilizer_recommendation(crop_type, soil_ph, soil_type, n_val, p_val, k_val, location, season)

def generate_crop_suitability(soil_ph, soil_type, season):
    return recommend_best_crops(soil_ph, soil_type, season)
