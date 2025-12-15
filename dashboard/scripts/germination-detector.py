"""
Real Python implementation for germination detection
This would need to run as a separate Python service
"""
import cv2
import numpy as np
from ultralytics import YOLO
import base64
from io import BytesIO
from PIL import Image

class GerminationDetector:
    def __init__(self, model_path='yolov8n.pt'):
        """Initialize the detector with YOLO model"""
        self.model = YOLO(model_path)
        self.green_threshold = 7.0
        
    def detect_red_markers(self, image):
        """Detect red marker tapes in the image"""
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Red color ranges in HSV
        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([160, 50, 50])
        upper_red2 = np.array([180, 255, 255])
        
        # Create masks
        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        red_mask = cv2.bitwise_or(mask1, mask2)
        
        # Morphological operations
        kernel = np.ones((5, 5), np.uint8)
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_CLOSE, kernel)
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_OPEN, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(red_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        markers = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 100:  # Minimum area threshold
                M = cv2.moments(contour)
                if M["m00"] != 0:
                    cx = int(M["m10"] / M["m00"])
                    cy = int(M["m01"] / M["m00"])
                    markers.append((cx, cy))
        
        return sorted(markers, key=lambda x: x[0])[:2]  # Return two leftmost markers
    
    def mask_area_above_line(self, image, markers):
        """Mask the area above the line formed by two markers"""
        if len(markers) < 2:
            return image
        
        h, w = image.shape[:2]
        mask = np.ones((h, w), dtype=np.uint8) * 255
        
        x1, y1 = markers[0]
        x2, y2 = markers[1]
        
        if x2 - x1 != 0:
            slope = (y2 - y1) / (x2 - x1)
            intercept = y1 - slope * x1
            
            for x in range(w):
                line_y = int(slope * x + intercept)
                if 0 <= line_y < h:
                    mask[:line_y, x] = 0
        
        masked_image = cv2.bitwise_and(image, image, mask=mask)
        return masked_image
    
    def detect_trays(self, image):
        """Detect trays using YOLO"""
        results = self.model.predict(
            image,
            conf=0.5,
            iou=0.45,
            verbose=False
        )
        
        trays = []
        if len(results) > 0:
            boxes = results[0].boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = float(box.conf[0])
                trays.append({
                    'bbox': [int(x1), int(y1), int(x2), int(y2)],
                    'confidence': confidence
                })
        
        return trays
    
    def analyze_green_pixels(self, tray_crop):
        """Analyze percentage of green pixels in tray crop"""
        hsv = cv2.cvtColor(tray_crop, cv2.COLOR_BGR2HSV)
        
        # Green color range
        lower_green = np.array([30, 20, 30])
        upper_green = np.array([100, 255, 255])
        
        green_mask = cv2.inRange(hsv, lower_green, upper_green)
        
        total_pixels = tray_crop.shape[0] * tray_crop.shape[1]
        green_pixels = np.sum(green_mask > 0)
        green_percentage = (green_pixels / total_pixels) * 100
        
        return green_percentage
    
    def classify_germination(self, green_percentage):
        """Classify if tray is germinated based on green percentage"""
        return green_percentage >= self.green_threshold
    
    def process_image(self, image_data):
        """Main processing pipeline"""
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(BytesIO(image_bytes))
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Step 1: Detect red markers
        markers = self.detect_red_markers(image)
        red_markers_found = len(markers) >= 2
        
        # Step 2: Mask area if markers found
        if red_markers_found:
            processed_image = self.mask_area_above_line(image, markers)
        else:
            processed_image = image
        
        # Step 3: Detect trays with YOLO
        trays = self.detect_trays(processed_image)
        
        # Step 4: Analyze each tray
        results = []
        for idx, tray in enumerate(trays):
            x1, y1, x2, y2 = tray['bbox']
            tray_crop = processed_image[y1:y2, x1:x2]
            
            green_percentage = self.analyze_green_pixels(tray_crop)
            germinated = self.classify_germination(green_percentage)
            
            results.append({
                'trayIndex': idx,
                'germinated': germinated,
                'greenPercentage': float(green_percentage),
                'confidence': tray['confidence'],
                'bbox': tray['bbox']
            })
        
        germinated_count = sum(1 for r in results if r['germinated'])
        
        return {
            'success': True,
            'totalTrays': len(results),
            'germinatedTrays': germinated_count,
            'notGerminatedTrays': len(results) - germinated_count,
            'germinationRate': (germinated_count / len(results) * 100) if results else 0,
            'trays': results,
            'redMarkersFound': red_markers_found
        }

# Example usage
if __name__ == '__main__':
    detector = GerminationDetector('path/to/your/yolov8_model.pt')
    
    # Load test image
    with open('test_image.jpg', 'rb') as f:
        image_data = base64.b64encode(f.read()).decode()
        image_data = f'data:image/jpeg;base64,{image_data}'
    
    result = detector.process_image(image_data)
    print(result)
