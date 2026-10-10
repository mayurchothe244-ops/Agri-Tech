from disease_engine import analyze_crop_image

def predict_crop_disease(image_bytes, crop_type="Tomato"):
    return analyze_crop_image(image_bytes, crop_type=crop_type)
