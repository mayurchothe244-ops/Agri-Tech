from flask import Blueprint, request, jsonify

voice_bp = Blueprint('voice', __name__, url_prefix='/api/voice-assistant')

@voice_bp.route('/chat', methods=['POST'])
def voice_chat():
    data = request.json or {}
    message = data.get('message', '').strip()
    language = data.get('language', 'mr')

    if not message:
        return jsonify({"success": False, "reply": "कृपया तुमचा शेतीविषयक प्रश्न विचार."}), 400

    msg_lower = message.lower()

    if "कांदा" in msg_lower or "onion" in msg_lower or "प्याज" in msg_lower:
        reply_mr = "कांदा पिकातील जांभळा करपा (Purple Blotch) रोगासाठी ट्रायसायक्लाझोल किंवा मँकोझेब २.५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा. लासलगाव बाजारात कांद्याचा सरासरी भाव ₹२,१५०/क्विंटल आहे."
        reply_hi = "प्याज की फसल में बैगनी धब्बा रोग के लिए मैनकोजेब 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें। लासलगांव मंडी में प्याज का भाव ₹2,150/क्विंटल है।"
        reply_en = "For Purple Blotch disease in Onion, spray Mancozeb @ 2.5g/liter of water. The current modal onion market price at Lasalgaon Mandi is ₹2,150/Quintal."
    elif "ऊस" in msg_lower or "sugarcane" in msg_lower or "गन्ना" in msg_lower:
        reply_mr = "ऊस पिकासाठी हेक्टरी २५० किलो नत्र, ११५ किलो स्फुरद आणि ११५ किलो पालाश आवश्यक असते."
        reply_hi = "गन्ने की फसल के लिए 250 किग्रा नाइट्रोजन और 115 किग्रा फॉस्फोरस प्रति हेक्टेयर आवश्यक है।"
        reply_en = "Sugarcane requires 250 kg N, 115 kg P, and 115 kg K per hectare."
    else:
        reply_mr = f"शेतीसाथी AI सहाय्यक: तुमच्या '{message}' या प्रश्नाबाबत - योग्य खत व्यवस्थापन, कीड नियंत्रण आणि शासकीय अनुदानासाठी आमच्या विविध विभागांना भेट द्या."
        reply_hi = f"शेतसाथी AI सहायक: आपके सवाल '{message}' के लिए जानकारी उपलब्ध है।"
        reply_en = f"ShetSathi AI Assistant: Regarding your query '{message}' - explore our Fertilizer Recommendation and Mandi Prices tabs."

    reply = reply_mr if language == 'mr' else (reply_hi if language == 'hi' else reply_en)

    return jsonify({
        "success": True,
        "query": message,
        "language": language,
        "reply": reply
    })
