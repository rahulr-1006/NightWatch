import cv2
import torch
from ultralytics import YOLO

# Load YOLOv8 model
model = YOLO("yolov8n.pt")  # Use "yolov8s.pt" for more accuracy

# Open webcam
cap = cv2.VideoCapture(0)

# Define threshold for proximity (adjust as needed)
THRESHOLD_HEIGHT = 300

def is_person_close(results, frame):
    """Check if any detected person is close and draw bounding boxes."""
    person_close = False

    for detection in results[0].boxes:
        class_id = int(detection.cls)  # Get class ID
        if model.names[class_id] == "person":
            x1, y1, x2, y2 = map(int, detection.xyxy[0])  # Bounding box
            h = y2 - y1  # Height of bounding box

            # Draw bounding box around each detected person
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            if h > THRESHOLD_HEIGHT:
                person_close = True  # At least one person is close

    return person_close

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Run YOLO detection
    results = model(frame)

    # Process detections and draw boxes
    person_close = is_person_close(results, frame)

    # Print simplified output
    print("Yes" if person_close else "No")

    # Display frame
    cv2.imshow("Live Person Detection", frame)

    # Exit on 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()