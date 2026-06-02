import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X, Keyboard, ScanLine } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose?: () => void;
  title?: string;
  placeholder?: string;
}

export function BarcodeScanner({ 
  onScan, 
  onClose, 
  title = "Scan Barcode",
  placeholder = "Enter barcode manually..."
}: BarcodeScannerProps) {
  const [scanMode, setScanMode] = useState<"camera" | "manual">("manual");
  const [manualInput, setManualInput] = useState("");
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (scanMode === "camera") {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError("");
    } catch (err) {
      setError("Camera access denied. Please use manual input.");
      setScanMode("manual");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput("");
    }
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would use a barcode detection library
    // For demo purposes, we'll simulate a scan
    const simulatedBarcode = `SCAN-${Date.now()}`;
    onScan(simulatedBarcode);
    stopCamera();
    setScanMode("manual");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-emerald-600" />
            {title}
          </h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 mb-4">
          <Button
            variant={scanMode === "manual" ? "default" : "outline"}
            onClick={() => {
              stopCamera();
              setScanMode("manual");
            }}
            className="flex-1"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Manual
          </Button>
          <Button
            variant={scanMode === "camera" ? "default" : "outline"}
            onClick={() => setScanMode("camera")}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </Button>
        </div>

        {scanMode === "manual" ? (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label htmlFor="barcode">Barcode / SKU</Label>
              <Input
                id="barcode"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className="font-mono"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!manualInput.trim()}>
              <ScanLine className="w-4 h-4 mr-2" />
              Submit Barcode
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-32 border-4 border-emerald-500 rounded-lg"></div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-600">
              Position barcode within the green frame
            </p>
            <Button onClick={handleCameraCapture} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Capture Barcode
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Use a USB barcode scanner or type the code manually for fastest entry.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}