import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Scan } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  title?: string;
  placeholder?: string;
}

export function BarcodeScanner({ onScan, onClose, title = "Scan Barcode", placeholder = "Enter barcode manually" }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState("");

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Input
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleManualSubmit()}
            placeholder={placeholder}
          />
          <Button onClick={handleManualSubmit}>
            <Scan className="w-4 h-4 mr-2" />
            Scan
          </Button>
        </div>
        <Button variant="outline" onClick={onClose} className="w-full">
          Cancel
        </Button>
      </div>
    </Card>
  );
}