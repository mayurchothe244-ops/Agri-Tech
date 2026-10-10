import os
import requests
from models import get_db

def send_sms_alert(phone_number, message):
    """
    Dispatches SMS alert via Fast2SMS / Twilio API if keys exist in environment.
    Stores dispatch record in SQLite database log.
    """
    fast2sms_key = os.getenv("FAST2SMS_API_KEY")
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
    twilio_auth = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")

    sent_status = "LOGGED"
    api_provider = "Internal Simulator Log"

    if fast2sms_key:
        try:
            url = "https://www.fast2sms.com/dev/bulkV2"
            payload = {
                "route": "q",
                "message": message,
                "language": "english",
                "flash": 0,
                "numbers": phone_number
            }
            headers = {"authorization": fast2sms_key}
            res = requests.post(url, data=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                sent_status = "DELIVERED"
                api_provider = "Fast2SMS API"
        except Exception as e:
            sent_status = f"ERROR: {str(e)}"

    elif twilio_sid and twilio_auth and twilio_phone:
        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"
            res = requests.post(
                url,
                data={"From": twilio_phone, "To": phone_number, "Body": message},
                auth=(twilio_sid, twilio_auth),
                timeout=5
            )
            if res.status_code in [200, 201]:
                sent_status = "DELIVERED"
                api_provider = "Twilio API"
        except Exception as e:
            sent_status = f"ERROR: {str(e)}"

    # Record notification in database
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO notifications (title, title_mr, title_hi, message, type, is_read) 
           VALUES (?, ?, ?, ?, ?, 0)""",
        (f"SMS Alert sent to {phone_number}", f"{phone_number} वर एसएमएस पाठवला", f"{phone_number} पर एसएमएस भेजा", message, "SMS")
    )
    conn.commit()
    conn.close()

    return {
        "success": True,
        "phone_number": phone_number,
        "message": message,
        "status": sent_status,
        "provider": api_provider,
        "info": "SMS alert logged and queued successfully."
    }

def subscribe_alert(user_id, phone_number, alert_types, district):
    """
    Subscribes a farmer for weather and mandi SMS/WhatsApp alerts.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    # Store alert subscription notification
    types_str = ", ".join(alert_types) if isinstance(alert_types, list) else alert_types
    msg = f"Subscription activated for {phone_number} ({district}) - Alerts: {types_str}"
    
    cursor.execute(
        """INSERT INTO notifications (user_id, title, title_mr, title_hi, message, type, is_read) 
           VALUES (?, ?, ?, ?, ?, ?, 0)""",
        (
            user_id,
            "Alert Subscription Activated",
            "हवामान व दर अलर्ट सदस्यता सुरू झाली",
            "मौसम और मंडी भाव अलर्ट सदस्यता शुरू हुई",
            msg,
            "ALERT_SUBSCRIPTION"
        )
    )
    conn.commit()
    conn.close()

    return {
        "success": True,
        "phone": phone_number,
        "district": district,
        "alert_types": alert_types,
        "message": "तुम्ही हवामान आणि बाजारभावाच्या अलर्टसाठी यशस्वीरित्या नोंदणी केली आहे!"
    }
