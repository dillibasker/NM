import tkinter as tk
from tkinter import ttk
import cv2
from PIL import Image, ImageTk
import base64
import json
import requests
import threading
import io
import numpy as np
from datetime import datetime

class QualityControlGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Quality Control Scanner")
        self.root.geometry("1200x800")
        
        # Configure style
        style = ttk.Style()
        style.configure("Status.TLabel", font=("Inter", 24, "bold"))
        
        # Main container
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Camera frame
        self.camera_frame = ttk.LabelFrame(self.main_frame, text="Camera Feed", padding="5")
        self.camera_frame.grid(row=0, column=0, padx=5, pady=5, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        self.camera_label = ttk.Label(self.camera_frame)
        self.camera_label.grid(row=0, column=0)
        
        # Controls frame
        self.controls_frame = ttk.Frame(self.main_frame, padding="5")
        self.controls_frame.grid(row=1, column=0, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        self.scan_button = ttk.Button(self.controls_frame, text="Scan Product", command=self.scan_product)
        self.scan_button.grid(row=0, column=0, padx=5)
        
        # Results frame
        self.results_frame = ttk.LabelFrame(self.main_frame, text="Scan Results", padding="10")
        self.results_frame.grid(row=0, column=1, rowspan=2, padx=5, pady=5, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        self.status_label = ttk.Label(self.results_frame, text="Ready", style="Status.TLabel")
        self.status_label.grid(row=0, column=0, pady=10)
        
        self.confidence_label = ttk.Label(self.results_frame, text="Confidence: --")
        self.confidence_label.grid(row=1, column=0, pady=5)
        
        self.defects_text = tk.Text(self.results_frame, height=5, width=30)
        self.defects_text.grid(row=2, column=0, pady=10)
        
        # Initialize camera
        self.cap = cv2.VideoCapture(0)
        self.update_camera()
        
        # API endpoint
        self.api_url = "http://localhost:5000/api/scan"
    
    def update_camera(self):
        ret, frame = self.cap.read()
        if ret:
            # Convert frame to RGB for tkinter
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame_rgb)
            img = img.resize((640, 480))
            imgtk = ImageTk.PhotoImage(image=img)
            self.camera_label.imgtk = imgtk
            self.camera_label.configure(image=imgtk)
        self.root.after(10, self.update_camera)
    
    def scan_product(self):
        # Capture frame
        ret, frame = self.cap.read()
        if ret:
            # Convert to base64
            _, buffer = cv2.imencode('.jpg', frame)
            img_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # Send to API
            try:
                response = requests.post(
                    self.api_url,
                    json={"image": f"data:image/jpeg;base64,{img_base64}"}
                )
                result = response.json()
                
                # Update UI
                status = result.get('status', 'unknown').upper()
                self.status_label.configure(
                    text=status,
                    foreground='green' if status == 'APPROVED' else 'red'
                )
                
                self.confidence_label.configure(
                    text=f"Confidence: {result.get('confidence', 0)*100:.1f}%"
                )
                
                defects = result.get('defects', [])
                self.defects_text.delete(1.0, tk.END)
                if defects:
                    self.defects_text.insert(tk.END, "Detected Issues:\n")
                    for defect in defects:
                        self.defects_text.insert(tk.END, f"• {defect}\n")
                else:
                    self.defects_text.insert(tk.END, "No defects detected")
                
            except Exception as e:
                self.status_label.configure(text="ERROR", foreground='red')
                self.defects_text.delete(1.0, tk.END)
                self.defects_text.insert(tk.END, f"Error: {str(e)}")
    
    def __del__(self):
        if self.cap.isOpened():
            self.cap.release()

def main():
    root = tk.Tk()
    app = QualityControlGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()