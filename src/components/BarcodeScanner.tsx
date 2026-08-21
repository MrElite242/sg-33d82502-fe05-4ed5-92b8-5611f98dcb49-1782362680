import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Scan, Loader2 } from "lucide-react";

interface VerificationResult {
  eligible: boolean;
  jurisdiction?: string;
  credentialNumber?: string;
  reason?: string;
  message?: string;
}

export function BarcodeScanner() {
  const [verificationToken, setVerificationToken] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!verificationToken.trim()) {
      setResult({
        eligible: false,
        reason: "Please enter a verification token"
      });
      return;
    }

    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch("/api/canna-id/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationToken: verificationToken.trim() })
      });

      const data: VerificationResult = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        eligible: false,
        reason: "Verification system error. Please try again."
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setVerificationToken("");
    setResult(null);
  };

  return (
    <Card className="max-w-lg mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Canna ID 360™ Verification</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Scan QR code or enter verification token</p>
        </div>

        {/* Input */}
        {!result && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="token">Verification Token</Label>
              <Input
                id="token"
                placeholder="Enter token from QR code"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                This can be obtained by scanning the customer's Canna ID 360™ QR code
              </p>
            </div>

            <Button 
              onClick={handleVerify} 
              disabled={isScanning || !verificationToken.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              size="lg"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 mr-2" />
                  Verify Credential
                </>
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {result.eligible ? (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">ELIGIBLE ✓</div>
                    <div className="text-green-800 dark:text-green-300">
                      {result.message || "Customer is authorized for cannabis purchase"}
                    </div>
                    {result.jurisdiction && (
                      <div className="text-sm text-green-700 dark:text-green-400 mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                        <strong>Jurisdiction:</strong> {result.jurisdiction}
                      </div>
                    )}
                    {result.credentialNumber && (
                      <div className="text-sm text-green-700 dark:text-green-400">
                        <strong>Credential:</strong> {result.credentialNumber}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
                <XCircle className="h-5 w-5 text-red-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">NOT ELIGIBLE ✗</div>
                    <div className="text-red-800 dark:text-red-300">
                      {result.reason || "Customer is not authorized for cannabis purchase"}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleReset} variant="outline" className="w-full" size="lg">
              Verify Another Credential
            </Button>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong className="text-blue-700 dark:text-blue-400">Privacy Protected:</strong> This verification only reveals eligibility status. No personal information (name, address, medical history, purchase history) is accessed or displayed.
          </p>
        </div>
      </div>
    </Card>
  );
}