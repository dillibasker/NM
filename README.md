# Quality Control Vision System

A modern quality control system for manufacturing that uses computer vision to detect product defects. The system scans mouse products and their boxes with ISI certification through a laptop camera and automatically determines if a product is good (approved) or damaged (rejected).

## Features

- Real-time product scanning through laptop camera
- Automated quality assessment (approve/reject)
- 3D product visualization with animations
- Product tracking dashboard with statistics
- Detailed product inspection reports
- History log of all scanned products

## Technology Stack

### Frontend
- React with TypeScript
- Vite for fast development
- Three.js for 3D visualizations
- Framer Motion for animations
- Tailwind CSS for styling
- React Webcam for camera access

### Backend
- Python with Flask
- OpenCV for image processing
- Simple demonstration of defect detection

## Setup Instructions

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```
   python app.py
   ```

## Usage

1. Open the application in your browser
2. Navigate to the Scanner tab
3. Position the product (mouse or box) in front of your camera
4. Click "Scan Product" to analyze
5. View the results and 3D visualization
6. Check the Dashboard for historical data and statistics

## Development Notes

For a real production environment:
- Implement a proper machine learning model for accurate defect detection
- Set up a database for storing scan history
- Add user authentication and access controls
- Implement more comprehensive error handling