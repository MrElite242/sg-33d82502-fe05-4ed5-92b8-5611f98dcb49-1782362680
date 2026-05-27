import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, PenTool, ShieldCheck, CreditCard, FileText, Upload, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function DoctorSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Professional Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    licenseState: "",
    npiNumber: "",
    deaNumber: "",
    
    // Step 2: Practice Info
    practiceName: "",
    practiceAddress: "",
    practiceCity: "",
    practiceState: "",
    practiceZip: "",
    practicePhone: "",
    
    // Step 3: Credentials
    medicalSchool: "",
    graduationYear: "",
    boardCertified: "",
    
    // Step 4: Plan Selection
    selectedPlan: "professional"
  });

  const [signature, setSignature] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [deaFile, setDeaFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 99,
      interval: "month",
      features: [
        "Up to 50 prescriptions/month",
        "Basic e-prescription system",
        "Email support",
        "Standard pharmacy network",
        "Basic analytics"
      ]
    },
    {
      id: "professional",
      name: "Professional",
      price: 249,
      interval: "month",
      popular: true,
      features: [
        "Unlimited prescriptions",
        "Full e-prescription suite",
        "Priority support",
        "Extended pharmacy network",
        "Advanced analytics & reporting",
        "Patient portal access",
        "Automatic refill management"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 599,
      interval: "month",
      features: [
        "Everything in Professional",
        "Multi-provider support",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "White-label option",
        "API access"
      ]
    }
  ];

  // E-signature canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'dea') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'license') {
        setLicenseFile(file);
      } else {
        setDeaFile(file);
      }
    }
  };

  const handleSubmit = () => {
    // Would send to backend in production
    console.log("Doctor signup data:", formData, signature, licenseFile, deaFile);
    // Redirect to payment
    window.location.href = "/payment";
  };

  return (
    <>
      <SEO title="Doctor Sign Up - E-Prescription Platform" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                  </div>
                  {step < 5 && (
                    <div className={`h-1 w-16 md:w-24 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Professional Info</span>
              <span>Practice Details</span>
              <span>Credentials</span>
              <span>E-Signature</span>
              <span>Select Plan</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Professional Information"}
                {currentStep === 2 && "Practice Details"}
                {currentStep === 3 && "Credentials & Verification"}
                {currentStep === 4 && "Electronic Signature"}
                {currentStep === 5 && "Choose Your Plan"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Enter your professional details"}
                {currentStep === 2 && "Tell us about your practice"}
                {currentStep === 3 && "Upload verification documents"}
                {currentStep === 4 && "Create your electronic signature"}
                {currentStep === 5 && "Select the plan that fits your practice"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Professional Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty *</Label>
                    <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Practice</SelectItem>
                        <SelectItem value="pain">Pain Management</SelectItem>
                        <SelectItem value="oncology">Oncology</SelectItem>
                        <SelectItem value="psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Medical License Number *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseState">License State *</Label>
                      <Select value={formData.licenseState} onValueChange={(value) => setFormData({...formData, licenseState: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          <SelectItem value="OR">Oregon</SelectItem>
                          <SelectItem value="NV">Nevada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="npiNumber">NPI Number *</Label>
                      <Input
                        id="npiNumber"
                        value={formData.npiNumber}
                        onChange={(e) => setFormData({...formData, npiNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deaNumber">DEA Number (if applicable)</Label>
                      <Input
                        id="deaNumber"
                        value={formData.deaNumber}
                        onChange={(e) => setFormData({...formData, deaNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Practice Info */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="practiceName">Practice Name *</Label>
                    <Input
                      id="practiceName"
                      value={formData.practiceName}
                      onChange={(e) => setFormData({...formData, practiceName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practiceAddress">Address *</Label>
                    <Input
                      id="practiceAddress"
                      value={formData.practiceAddress}
                      onChange={(e) => setFormData({...formData, practiceAddress: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="practiceCity">City *</Label>
                      <Input
                        id="practiceCity"
                        value={formData.practiceCity}
                        onChange={(e) => setFormData({...formData, practiceCity: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practiceState">State *</Label>
                      <Select value={formData.practiceState} onValueChange={(value) => setFormData({...formData, practiceState: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CO">CO</SelectItem>
                          <SelectItem value="CA">CA</SelectItem>
                          <SelectItem value="WA">WA</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practiceZip">ZIP Code *</Label>
                      <Input
                        id="practiceZip"
                        value={formData.practiceZip}
                        onChange={(e) => setFormData({...formData, practiceZip: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practicePhone">Practice Phone *</Label>
                    <Input
                      id="practicePhone"
                      type="tel"
                      value={formData.practicePhone}
                      onChange={(e) => setFormData({...formData, practicePhone: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Credentials */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalSchool">Medical School *</Label>
                      <Input
                        id="medicalSchool"
                        value={formData.medicalSchool}
                        onChange={(e) => setFormData({...formData, medicalSchool: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boardCertified">Board Certification *</Label>
                    <Input
                      id="boardCertified"
                      placeholder="e.g., American Board of Internal Medicine"
                      value={formData.boardCertified}
                      onChange={(e) => setFormData({...formData, boardCertified: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Verification Documents
                    </h4>
                    <Card className="border-2 border-dashed">
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <Label htmlFor="licenseUpload">Medical License (PDF) *</Label>
                          <Input
                            id="licenseUpload"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'license')}
                            className="mt-2"
                          />
                          {licenseFile && (
                            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {licenseFile.name} uploaded
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="deaUpload">DEA Certificate (PDF, if applicable)</Label>
                          <Input
                            id="deaUpload"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'dea')}
                            className="mt-2"
                          />
                          {deaFile && (
                            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {deaFile.name} uploaded
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 4: E-Signature */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">
                        <ShieldCheck className="w-4 h-4 inline mr-1" />
                        Electronic Signature Requirements
                      </p>
                      <p className="text-sm text-gray-600">
                        Your electronic signature will be used to authorize prescriptions. 
                        It must be unique and consistent. This signature will be legally binding 
                        and comply with ESIGN Act requirements.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <Label>Draw Your Signature *</Label>
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full bg-white cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={clearSignature}>
                        Clear Signature
                      </Button>
                    </div>

                    {signature && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-4">
                          <p className="text-sm font-medium mb-2 text-green-800">
                            <CheckCircle2 className="w-4 h-4 inline mr-1" />
                            Signature Captured
                          </p>
                          <p className="text-sm text-gray-600">Preview:</p>
                          <img src={signature} alt="Signature preview" className="mt-2 border rounded" />
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-4 border rounded-lg">
                    <input type="checkbox" id="signatureAgree" className="mt-1" required />
                    <Label htmlFor="signatureAgree" className="text-sm cursor-pointer">
                      I certify that this is my legal signature and I understand that it will be used 
                      to electronically sign prescriptions. I agree that my electronic signature has 
                      the same legal effect as a handwritten signature.
                    </Label>
                  </div>
                </div>
              )}

              {/* Step 5: Plan Selection */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <Card 
                        key={plan.id}
                        className={`cursor-pointer transition-all ${
                          formData.selectedPlan === plan.id
                            ? 'border-blue-500 border-2 shadow-lg'
                            : 'hover:border-blue-300'
                        } ${plan.popular ? 'border-blue-400' : ''}`}
                        onClick={() => setFormData({...formData, selectedPlan: plan.id})}
                      >
                        {plan.popular && (
                          <div className="bg-blue-600 text-white text-center py-1 text-sm font-semibold">
                            Most Popular
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <div className="text-3xl font-bold mt-2">
                            ${plan.price}
                            <span className="text-sm font-normal text-gray-600">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">
                        <CreditCard className="w-4 h-4 inline mr-1" />
                        Payment Information
                      </p>
                      <p className="text-sm text-gray-600">
                        You'll be redirected to our secure payment page to complete your subscription. 
                        Your account will be activated immediately upon successful payment.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Complete Registration & Pay
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}