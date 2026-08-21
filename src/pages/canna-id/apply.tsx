import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, CreditCard, CheckCircle2, AlertCircle, Globe2, User, DollarSign } from "lucide-react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { isEligibleByAge } from "@/lib/cannaId";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// Pricing configuration
const PERMIT_PRICING = {
  local: { price: 5.00, label: "Local Resident", duration: "30 days", icon: User },
  tourist: { price: 10.00, label: "Tourist/Foreigner", duration: "30 days", icon: Globe2 }
};

function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/canna-id/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
      >
        {isProcessing ? "Processing..." : "Complete Payment"}
      </Button>
    </form>
  );
}

export default function ApplyCannaId() {
  const [step, setStep] = useState(1);
  const [permitType, setPermitType] = useState<"local" | "tourist">("local");
  const [clientSecret, setClientSecret] = useState("");
  const [credentialNumber, setCredentialNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    email: "",
    jurisdiction: "",
    region: ""
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate age
      if (!isEligibleByAge(formData.dateOfBirth)) {
        setError("You must be 21 or older to apply for a Canna ID 360™");
        setIsSubmitting(false);
        return;
      }

      // Create payment intent
      const response = await fetch("/api/canna-id/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialData: formData,
          permitType: permitType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      setClientSecret(data.clientSecret);
      setCredentialNumber(data.credentialNumber);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Application failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPricing = PERMIT_PRICING[permitType];
  const Icon = selectedPricing.icon;

  return (
    <>
      <SEO
        title="Apply for Canna ID 360™ | Canna Blaze 360"
        description="Apply for your international cannabis access credential"
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-12 h-12 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Apply for Canna ID 360™
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              International cannabis access credential • Valid for 30 days
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-emerald-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>
                  1
                </div>
                <span className="font-medium">Application</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-emerald-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          {/* Step 1: Application Form */}
          {step === 1 && (
            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Complete your application for international cannabis access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApply} className="space-y-6">
                  {/* Permit Type Selection */}
                  <div className="space-y-3">
                    <Label>Select Permit Type</Label>
                    <RadioGroup value={permitType} onValueChange={(value) => setPermitType(value as "local" | "tourist")}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <label className={`relative flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${permitType === "local" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" : "border-gray-200 hover:border-gray-300"}`}>
                          <RadioGroupItem value="local" id="local" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-5 h-5 text-emerald-600" />
                              <span className="font-semibold">Local Resident</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              For residents of the issuing jurisdiction
                            </p>
                            <div className="flex items-baseline gap-1">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              <span className="text-2xl font-bold text-emerald-600">5.00</span>
                              <span className="text-sm text-gray-500">/ 30 days</span>
                            </div>
                          </div>
                        </label>

                        <label className={`relative flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${permitType === "tourist" ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20" : "border-gray-200 hover:border-gray-300"}`}>
                          <RadioGroupItem value="tourist" id="tourist" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Globe2 className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold">Tourist/Foreigner</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              For international visitors and tourists
                            </p>
                            <div className="flex items-baseline gap-1">
                              <DollarSign className="w-4 h-4 text-blue-600" />
                              <span className="text-2xl font-bold text-blue-600">10.00</span>
                              <span className="text-sm text-gray-500">/ 30 days</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Personal Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth * (Must be 21+)</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nationalId">National ID Number *</Label>
                      <Input
                        id="nationalId"
                        required
                        value={formData.nationalId}
                        onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                        placeholder="AB123456789"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction/Country *</Label>
                      <Input
                        id="jurisdiction"
                        required
                        value={formData.jurisdiction}
                        onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                        placeholder="e.g., Thailand, Jamaica"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="region">Region (Optional)</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      placeholder="e.g., Bangkok, Kingston"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Permit Type:</span>
                      <Badge>{selectedPricing.label}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Duration:</span>
                      <span>{selectedPricing.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                      <span>Total Amount:</span>
                      <span className="text-emerald-600">${selectedPricing.price.toFixed(2)} USD</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    {isSubmitting ? "Processing..." : "Continue to Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment */}
          {step === 2 && clientSecret && (
            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                  Complete Payment
                </CardTitle>
                <CardDescription>
                  Credential Number: <strong>{credentialNumber}</strong> • Amount: <strong>${selectedPricing.price.toFixed(2)} USD</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    onSuccess={() => {
                      window.location.href = `/canna-id/verify?credential=${credentialNumber}`;
                    }}
                  />
                </Elements>

                <div className="mt-6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-gray-600"
                  >
                    ← Back to Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}