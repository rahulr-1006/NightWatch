#pip install fastapi uvicorn pydantic

# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import smtplib

app = FastAPI()

# --- Messaging (SMS via Email) Configuration ---
# WARNING: Do not hardcode sensitive credentials in production.
EMAIL_ADDRESS = "rahulrengan4098@gmail.com"
EMAIL_PASSWORD = "wghdcoatxbrpqqem"

recipient_number = "5104748042"
carrier_gateway = "@vtext.com"  # e.g., Verizon's gateway. Adjust as needed.
to_number = recipient_number + carrier_gateway

def send_sms_via_email(to_number: str, message: str):
    """
    Sends an SMS via email using Gmail's SMTP server.
    """
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, to_number, message)
        print(f"SMS sent successfully to {to_number}")
    except Exception as e:
        print(f"Failed to send SMS: {e}")

# --- Request Models ---
class DetectRequest(BaseModel):
    transcript: str

class EmergencyRequest(BaseModel):
    action: str

# Define the emergency phrase to watch for.
EMERGENCY_PHRASE = "nightview help"

@app.post("/detect")
async def detect_keyword(data: DetectRequest):
    transcript_lower = data.transcript.lower()
    print(f"Received transcript: {transcript_lower}")
    if EMERGENCY_PHRASE in transcript_lower:
        # If the emergency phrase is detected, return a positive response.
        return {"keyword_detected": True, "transcript": data.transcript}
    else:
        return {"keyword_detected": False, "transcript": data.transcript}

@app.post("/emergency")
async def trigger_emergency(data: EmergencyRequest):
    if data.action == "siren_sms":
        send_sms_via_email(to_number, "HELP I AM IN DANGER")
        return {"status": "SMS sent"}
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
