import torch
import cv2
import numpy as np
import base64
from flask import Flask, request, jsonify
import pygame
from threading import Thread
import time
import signal
import sys

pygame.mixer.init()
beep_channel = pygame.mixer.Channel(1)

try:
    beep_sound = pygame.mixer.Sound("../my-app/assets/beep.mp3") 
except pygame.error:
    print("WARNING: Beep sound file not found or cannot be played.")
    beep_sound = None  

model = torch.hub.load("ultralytics/yolov5", "yolov5s")

app = Flask(__name__)

FAR_DISTANCE = 200
CLOSE_DISTANCE = 100

cap = None
running = True 


def initialize_camera():
    """ Try different camera indexes until one works. """
    global cap
    for i in range(3): 
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            print(f"✅ Using Camera Index: {i}")
            return
        cap.release()
    print("ERROR: Could not open any camera.")
    exit()


def start_camera():
    """ Continuously capture frames and process YOLOv5 detections. """
    global cap, running
    while running and cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame is None or frame.size == 0:
            print("ERROR: Failed to capture a frame")
            time.sleep(0.1)
            continue
        results = model(frame)
        person_detected = False
        max_box_width = 0

        for det in results.xyxy[0]:
            x_min, y_min, x_max, y_max, conf, cls = map(int, det[:6])
            label = model.names[cls]

            if label == "person":
                person_detected = True
                box_width = x_max - x_min
                max_box_width = max(max_box_width, box_width)

        cv2.imwrite("debug_frame.jpg", frame)

        if person_detected and beep_sound:
            if max_box_width >= CLOSE_DISTANCE:
                print("🚨 Person is VERY close! Fast beeping!")
                beep_channel.play(beep_sound)
            elif max_box_width >= FAR_DISTANCE:
                print("🔔 Person is near. Slow beeping.")
                beep_channel.play(beep_sound)

        time.sleep(0.5) 

    print("🔄 Stopping camera thread...")
    cap.release()


@app.route("/detect", methods=["POST"])
def detect():
    """Processes an image sent from the Expo React Native app and returns YOLOv5 detections."""
    try:
        data = request.json
        image_data = base64.b64decode(data["image"])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        results = model(frame)
        detected_objects = []

        for det in results.xyxy[0]:
            x_min, y_min, x_max, y_max, conf, cls = map(int, det[:6])
            label = model.names[cls]
            detected_objects.append({"label": label, "confidence": float(conf)})

        return jsonify({"detections": detected_objects})

    except Exception as e:
        return jsonify({"error": str(e)})


def shutdown_handler(signal_received, frame):
    """ Gracefully shuts down the program on CTRL+C """
    global running
    print("\nShutting down YOLO and Flask server...")
    running = False
    cap.release()
    sys.exit(0)


if __name__ == "__main__":
    print("🚀 Starting Flask YOLOv5 API...")

    signal.signal(signal.SIGINT, shutdown_handler)

    initialize_camera()

    Thread(target=start_camera, daemon=True).start()

    app.run(host="0.0.0.0", port=5002, debug=False, use_reloader=False)
