import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Building2, Phone, Mail, Video, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function RequestDemoForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    businessType: "",
    numberOfLocations: "1",
    currentSoftware: "",
    challenges: "",
    preferredDate: "",
    preferredTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (marked with *)",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Submit to API endpoint
      const response = await fetch("/api/request-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit demo request");
      }

      // Also store in localStorage for reference
      const demoRequest = {
        ...formData,
        submittedAt: new Date().toISOString(),
        emailId: data.emailId,
      };
      localStorage.setItem("demoRequest", JSON.stringify(demoRequest));

      setSubmitted(true);

      toast({
        title: "Demo Request Submitted! ✓",
        description: "Check your email for confirmation. We'll contact you within 24 hours.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          role: "",
          businessType: "",
          numberOfLocations: "1",
          currentSoftware: "",
          challenges: "",
          preferredDate: "",
          preferredTime: "",
        });
        setSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support&#64;cannablaze360.com",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Card className="border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Demo Request Confirmed!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you, <span className="font-semibold">{formData.fullName}</span>!
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                We've received your demo request for <span className="font-semibold">{formData.company}</span>.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>. 
                Our cannabis industry specialist will reach out within 24 hours to schedule your personalized demo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button 
                onClick={() => setSubmitted(false)}
                variant="outline"
              >
                Schedule Another Demo
              </Button>
              <Button 
                onClick={() => window.location.href = "/signup"}
                className="bg-gradient-to-r from-emerald-600 to-green-600"
              >
                Start Free Trial Instead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-emerald-600" />
          Schedule Your Personalized Demo
        </CardTitle>
        <CardDescription>
          See Canna Blaze 360 in action with a live walkthrough tailored to your business needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Work Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  placeholder="Green Leaf Dispensary"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">
                  Your Role <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner/CEO</SelectItem>
                    <SelectItem value="operations">Operations Manager</SelectItem>
                    <SelectItem value="compliance">Compliance Officer</SelectItem>
                    <SelectItem value="it">IT Director</SelectItem>
                    <SelectItem value="doctor">Medical Director</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">
                  Business Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.businessType} onValueChange={(value) => handleChange("businessType", value)} required>
                  <SelectTrigger id="businessType">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail Dispensary</SelectItem>
                    <SelectItem value="cultivation">Cultivation</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="testing">Testing Lab</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="medical">Medical Clinic</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="multi">Multiple Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfLocations">Number of Locations</Label>
                <Select value={formData.numberOfLocations} onValueChange={(value) => handleChange("numberOfLocations", value)}>
                  <SelectTrigger id="numberOfLocations">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Location</SelectItem>
                    <SelectItem value="2-5">2-5 Locations</SelectItem>
                    <SelectItem value="6-10">6-10 Locations</SelectItem>
                    <SelectItem value="11+">11+ Locations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSoftware">Current Software (if any)</Label>
                <Input
                  id="currentSoftware"
                  placeholder="e.g., MJ Freeway, BioTrack, etc."
                  value={formData.currentSoftware}
                  onChange={(e) => handleChange("currentSoftware", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Scheduling Preferences */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Preferred Demo Schedule
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferredDate}
                  onChange={(e) => handleChange("preferredDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleChange("preferredTime", value)}>
                  <SelectTrigger id="preferredTime">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9-10am">9:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10-11am">10:00 AM - 11:00 AM</SelectItem>
                    <SelectItem value="11-12pm">11:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="1-2pm">1:00 PM - 2:00 PM</SelectItem>
                    <SelectItem value="2-3pm">2:00 PM - 3:00 PM</SelectItem>
                    <SelectItem value="3-4pm">3:00 PM - 4:00 PM</SelectItem>
                    <SelectItem value="4-5pm">4:00 PM - 5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Specific Challenges */}
          <div className="space-y-2">
            <Label htmlFor="challenges">
              What challenges are you looking to solve? (Optional)
            </Label>
            <Textarea
              id="challenges"
              placeholder="e.g., Compliance tracking, inventory management, multi-location coordination..."
              rows={4}
              value={formData.challenges}
              onChange={(e) => handleChange("challenges", e.target.value)}
            />
          </div>

          {/* What to Expect */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What to Expect in Your Demo:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Live walkthrough of features relevant to your business type</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Custom implementation timeline and pricing for your needs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Q&A session with cannabis industry expert (30-45 minutes)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Detailed ROI analysis and migration support overview</span>
              </li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 h-12 text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Request Your Demo
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By requesting a demo, you agree to our Privacy Policy. We'll never share your information.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}