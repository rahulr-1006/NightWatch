import whisper
import pyaudio
import numpy as np
import torch
import time
import smtplib
import pygame
import tempfile
import wave
import os

SIREN_PATH = os.path.abspath("../my-app/assets/siren.mp3") 
EMAIL_ADDRESS = "rahulrengan4098@gmail.com"

emergency_contacts = [
    "5104748042@vtext.com",  
]

model = whisper.load_model("base")  


FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000 
CHUNK = 1024 
RECORD_SECONDS = 3  


audio = pyaudio.PyAudio()
stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
pygame.mixer.init()

print("Listening for 'Help'...")

def send_sms_via_email(message):
    """Send an SMS alert via email."""
    try:
        print(f"Attempting to send SMS: {message}") 
        message = message.encode("ascii", "ignore").decode() 

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            print("Connecting to SMTP server...") 
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            print("Logged into email server")  

            for contact in emergency_contacts:
                print(f"Sending SMS to {contact}")
                server.sendmail(EMAIL_ADDRESS, contact, message)

        print("Emergency SMS sent successfully!")
    except Exception as e:
        print(f"⚠️ Failed to send SMS: {e}") 


def play_siren():
    try:
        print("🔊 Playing siren!")
        sound = pygame.mixer.Sound(SIREN_PATH)
        sound.play()
    except Exception as e:
        print(f"Error playing siren: {e}")

def detect_help():
    while True:
        frames = []
        for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK, exception_on_overflow=False)
            frames.append(data)

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav:
            with wave.open(temp_wav.name, "wb") as wf:
                wf.setnchannels(CHANNELS)
                wf.setsampwidth(audio.get_sample_size(FORMAT))
                wf.setframerate(RATE)
                wf.writeframes(b"".join(frames))

            print("🎙️ Processing audio...")
            result = model.transcribe(temp_wav.name)

        text = result["text"].strip().lower()
        print(f"Recognized: {text}")

        yield text 

        text = result["text"].strip().lower()
        print(f"Recognized: {text}")

        if "help" in text:
            print("HELP I AM IN DANGER")
            send_sms_via_email("HELP! Emergency detected!") 
            play_siren()
            time.sleep(5)

try:
    detect_help()
except KeyboardInterrupt:
    print("\nStopping...")
    stream.stop_stream()
    stream.close()
    audio.terminate()
