import subprocess
import multiprocessing
import os
import signal
import time
import smtplib
from playsound import playsound
from whisper_alert import detect_help

SIREN_PATH = os.path.abspath("../my-app/assets/siren.mp3")

yolo_process = None


EMAIL_ADDRESS = "rahulrengan4098@gmail.com"
EMAIL_PASSWORD = "wghdcoatxbrpqqem"


emergency_contacts = [
    "5104748042@vtext.com",  
    "1234567890@txt.att.net" 
]

def send_sms_via_email(message):
    """Send an SMS alert via email."""
    try:
        print(f"📩 Sending SMS: {message}")  
        message = message.encode("ascii", "ignore").decode()  
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            for contact in emergency_contacts:
                server.sendmail(EMAIL_ADDRESS, contact, message)
        print("Emergency SMS sent successfully!")
    except Exception as e:
        print(f"⚠️ Failed to send SMS: {e}")

def start_yolo():
    """Start the YOLO detection script as a subprocess."""
    global yolo_process
    yolo_process = subprocess.Popen(["python", "yolo_live.py"])
    print("🚀 YOLO process started!")

def stop_yolo():
    """Stop the YOLO process."""
    global yolo_process
    if yolo_process:
        print("Stopping YOLO...")
        yolo_process.terminate() 
        yolo_process.wait()  
        print("YOLO stopped!")
        yolo_process = None 

def play_siren():
    """Play siren sound."""
    try:
        if not os.path.exists(SIREN_PATH):
            raise FileNotFoundError(f"Siren file not found: {SIREN_PATH}")

        print("🔊 Playing siren!")
        playsound(SIREN_PATH)
    except Exception as e:
        print(f"Error playing siren: {e}")

def start_whisper():
    """Run Whisper and listen for 'Help'."""
    for text in detect_help():
        if "help" in text.lower():
            print("'Help' detected! Stopping YOLO, sending SMS & playing siren...")
            stop_yolo()
            send_sms_via_email("HELP! Emergency detected!") 
            play_siren()  
            
            break 

if __name__ == "__main__":
    yolo_process = multiprocessing.Process(target=start_yolo)
    whisper_process = multiprocessing.Process(target=start_whisper)

    yolo_process.start()
    whisper_process.start()

    whisper_process.join()

    if yolo_process.is_alive():
        stop_yolo()

    print("Both processes stopped successfully!")
