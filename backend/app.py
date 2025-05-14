from flask import Flask, request, jsonify
import cv2
import numpy as np
from datetime import datetime
import uuid
import base64
from flask_cors import CORS
import json
import os
from ultralytics import YOLO
from database import Database

app = Flask(__name__)
CORS(app)

# Initialize YOLO model and database
model = YOLO('yolov5s.pt')
db = Database()

class ProductDetector:
    def analyze_image(self, image):
        """
        Analyze the product image using YOLOv5 and return results
        """
        # Convert base64 to image
        img_data = base64.b64decode(image.split(',')[1])
        img_np = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        
        # Run YOLOv5 detection
        results = model(img)
        
        # Process results
        mouse_detected = False
        confidence = 0
        defects = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Check if detected object is a mouse (class 74 in COCO dataset)
                if box.cls == 74:  # Mouse class
                    mouse_detected = True
                    confidence = float(box.conf)
                    
                    # Get the region of interest (ROI)
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    roi = img[y1:y2, x1:x2]
                    
                    # Analyze ROI for defects
                    hsv_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
                    
                    # Check for scratches (looking for significant color variations)
                    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
                    edges = cv2.Canny(gray_roi, 100, 200)
                    if np.sum(edges) > 10000:  # Threshold for scratch detection
                        defects.append("Scratched surface")
                    
                    # Check for color inconsistency
                    color_std = np.std(hsv_roi[:,:,0])
                    if color_std > 30:  # Threshold for color consistency
                        defects.append("Color inconsistency")
                    
                    break
        
        is_damaged = len(defects) > 0
        
        result = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "status": "rejected" if is_damaged else "approved",
            "model": "Gaming Mouse X1",
            "certificationPresent": mouse_detected,
            "defects": defects,
            "confidence": confidence,
            "image": image
        }
        
        # Store result in database
        db.add_scan_result(result)
        
        return result

detector = ProductDetector()

@app.route('/api/scan', methods=['POST'])
def scan_product():
    """
    Endpoint to scan a product image and return analysis results
    """
    if 'image' not in request.json:
        return jsonify({"error": "No image provided"}), 400
    
    image_data = request.json['image']
    
    try:
        # Process the image
        result = detector.analyze_image(image_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    """
    Return a list of previously scanned products
    """
    try:
        products = db.get_scan_history()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """
    Return scanning statistics
    """
    try:
        stats = db.get_statistics()
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)