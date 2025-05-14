import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Camera, Check, X, Eye, EyeOff } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { v4 as uuidv4 } from '../utils/uuid';
import ModelVisualizer from './three/ModelVisualizer';

interface ScannerViewProps {
  setLoading: (loading: boolean) => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({ setLoading }) => {
  const webcamRef = useRef<Webcam>(null);
  const { addProduct } = useProducts();
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<'approved' | 'rejected' | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [defects, setDefects] = useState<string[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const processingRef = useRef(false);
  const frameCheckRef = useRef<number>();
  const lastScanTimeRef = useRef(Date.now());
  const SCAN_DELAY = 5000; // 5 seconds delay between scans

  // Function to detect objects in the video feed
  const detectObject = useCallback((imageSrc: string) => {
    if (processingRef.current) return false;
    
    // Simulate object detection (in real implementation, this would use computer vision)
    const hasObject = Math.random() > 0.7; // Lower probability to reduce false positives
    return hasObject;
  }, []);

  // Auto-scanning functionality
  useEffect(() => {
    if (!autoScanEnabled || showResult) return;

    const checkFrame = () => {
      if (webcamRef.current && !processingRef.current) {
        const currentTime = Date.now();
        if (currentTime - lastScanTimeRef.current >= SCAN_DELAY) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc && detectObject(imageSrc)) {
            lastScanTimeRef.current = currentTime;
            scanProduct(imageSrc);
          }
        }
        frameCheckRef.current = requestAnimationFrame(checkFrame);
      }
    };

    frameCheckRef.current = requestAnimationFrame(checkFrame);
    return () => {
      if (frameCheckRef.current) {
        cancelAnimationFrame(frameCheckRef.current);
      }
    };
  }, [autoScanEnabled, showResult]);

  const scanProduct = useCallback((imageSrc: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setLoading(true);
    
    setCapturedImage(imageSrc);

    // Process the image
    requestAnimationFrame(() => {
      const random = Math.random();
      const isApproved = random > 0.3;
      
      const simulatedConfidence = isApproved 
        ? 0.85 + (Math.random() * 0.14) 
        : 0.5 + (Math.random() * 0.3);
      
      const possibleDefects = [
        'Scratched surface',
        'Button damage',
        'Missing certification mark',
        'Color inconsistency',
        'Structural damage'
      ];
      
      const simulatedDefects = isApproved 
        ? [] 
        : [possibleDefects[Math.floor(Math.random() * possibleDefects.length)]];
      
      setResult(isApproved ? 'approved' : 'rejected');
      setConfidence(simulatedConfidence);
      setDefects(simulatedDefects);
      setShowResult(true);
      
      addProduct({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        status: isApproved ? 'approved' : 'rejected',
        image: imageSrc,
        model: 'Gaming Mouse X1',
        certificationPresent: random > 0.1,
        defects: simulatedDefects,
        confidence: simulatedConfidence
      });
      
      setLoading(false);
    });
  }, [addProduct, setLoading]);

  const handleManualScan = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      scanProduct(imageSrc);
    }
  };

  const resetScan = () => {
    setShowResult(false);
    setResult(null);
    setCapturedImage(null);
    processingRef.current = false;
    lastScanTimeRef.current = Date.now(); // Reset the timer when starting a new scan
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Product Scanner</h2>
          <button
            onClick={() => setAutoScanEnabled(!autoScanEnabled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoScanEnabled 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {autoScanEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{autoScanEnabled ? 'Auto Scan On' : 'Auto Scan Off'}</span>
          </button>
        </div>
        
        <div className="relative rounded-lg overflow-hidden border-2 border-slate-700 bg-black">
          {!showResult ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user",
                  width: 1280,
                  height: 720
                }}
                className="w-full h-auto"
              />
              {!autoScanEnabled && (
                <button
                  onClick={handleManualScan}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors flex items-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Scan Product</span>
                </button>
              )}
            </>
          ) : (
            <div className="aspect-video relative">
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Captured product" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className={`absolute inset-0 ${
                result === 'approved' 
                  ? 'bg-green-500/20 border-green-500/50' 
                  : 'bg-red-500/20 border-red-500/50'
              } border-4`}></div>
              <button
                onClick={resetScan}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
              >
                Next Scan
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-6">Scan Results</h2>
        
        {!showResult ? (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400 text-center p-6">
            <Camera className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-1">Ready to Scan</p>
            <p className="text-sm">
              {autoScanEnabled 
                ? 'Auto-scanning enabled - Place product in view'
                : 'Click Scan when ready'}
            </p>
          </div>
        ) : (
          <div className="flex-grow flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  result === 'approved' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {result === 'approved' ? (
                    <Check className="w-8 h-8" />
                  ) : (
                    <X className="w-8 h-8" />
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-center">
                Product {result === 'approved' ? 'Approved' : 'Rejected'}
              </h3>
              
              <div className="mt-4 bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="font-medium">{(confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      result === 'approved' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {defects.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-400 mb-2">Detected Issues:</h4>
                  <ul className="bg-slate-800 rounded-lg p-3">
                    {defects.map((defect, index) => (
                      <li key={index} className="text-sm py-1 border-b border-slate-700 last:border-0 flex items-center">
                        <X className="w-4 h-4 text-red-500 mr-2" />
                        {defect}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-auto aspect-square bg-slate-800 rounded-lg overflow-hidden relative">
              <ModelVisualizer status={result || 'pending'} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScannerView;