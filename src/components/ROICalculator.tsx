import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ROIResults {
  annualTimeSaved: number;
  annualCostSavings: number;
  efficiencyGain: number;
  paybackPeriod: number;
  threeYearROI: number;
  adminHoursReduced: number;
}

export function ROICalculator() {
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    clinic: "",
    phone: ""
  });

  // Calculator inputs
  const [patients, setPatients] = useState(500);
  const [staffCount, setStaffCount] = useState(5);
  const [avgWage, setAvgWage] = useState(25);
  const [manualHours, setManualHours] = useState(20);
  const [complianceIssues, setComplianceIssues] = useState(3);

  const calculateROI = (): ROIResults => {
    // Time savings calculations
    const adminHoursReduced = manualHours * 0.75; // 75% reduction in manual tasks
    const weeklySavings = adminHoursReduced * avgWage;
    const annualTimeSaved = adminHoursReduced * 52;
    const annualCostSavings = weeklySavings * 52;

    // Compliance cost savings
    const complianceSavings = complianceIssues * 2500; // Avg cost per compliance issue

    // Efficiency gains
    const patientThroughputIncrease = patients * 0.15; // 15% more patients with same staff
    const revenuePerPatient = 150; // Conservative estimate
    const additionalRevenue = patientThroughputIncrease * revenuePerPatient * 12;

    // Total savings
    const totalAnnualBenefit = annualCostSavings + complianceSavings + additionalRevenue;
    const efficiencyGain = ((annualTimeSaved + patientThroughputIncrease * 12) / (manualHours * 52)) * 100;

    // Platform cost (Professional plan)
    const annualPlatformCost = 249 * 12; // $249/month

    // ROI calculations
    const netBenefit = totalAnnualBenefit - annualPlatformCost;
    const paybackPeriod = annualPlatformCost / (totalAnnualBenefit / 12);
    const threeYearROI = ((netBenefit * 3) / (annualPlatformCost * 3)) * 100;

    return {
      annualTimeSaved,
      annualCostSavings: totalAnnualBenefit,
      efficiencyGain,
      paybackPeriod,
      threeYearROI,
      adminHoursReduced
    };
  };

  const results = calculateROI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactInfo.name || !contactInfo.email || !contactInfo.clinic) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name, email, and clinic name",
        variant: "destructive",
      });
      return;
    }

    // Store lead in localStorage (in production, send to API/CRM)
    const lead = {
      ...contactInfo,
      roiData: results,
      calculatorInputs: {
        patients,
        staffCount,
        avgWage,
        manualHours,
        complianceIssues
      },
      timestamp: new Date().toISOString()
    };

    const existingLeads = JSON.parse(localStorage.getItem("roi_leads") || "[]");
    existingLeads.push(lead);
    localStorage.setItem("roi_leads", JSON.stringify(existingLeads));

    toast({
      title: "Success! 🎉",
      description: "Your personalized ROI report has been generated. We'll contact you shortly!",
    });

    setShowResults(true);

    // TODO: Send to actual CRM/database in production
    console.log("New ROI Lead:", lead);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Calculator Form */}
      <Card className="border-2 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <CardTitle className="text-2xl">Calculate Your ROI</CardTitle>
          </div>
          <CardDescription className="text-base">
            See the exact financial impact of switching to Canna Blaze 360
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Contact Information */}
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Your Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                  placeholder="Dr. Sarah Johnson"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  placeholder="sarah@clinic.com"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic">Clinic/Practice Name *</Label>
                <Input
                  id="clinic"
                  value={contactInfo.clinic}
                  onChange={(e) => setContactInfo({...contactInfo, clinic: e.target.value})}
                  placeholder="Green Health Clinic"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Calculator Inputs */}
          <div className="space-y-6">
            <div>
              <Label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Monthly Patients
                </span>
                <Badge variant="outline">{patients}</Badge>
              </Label>
              <Slider
                value={[patients]}
                onValueChange={(value) => setPatients(value[0])}
                min={50}
                max={5000}
                step={50}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Staff Members
                </span>
                <Badge variant="outline">{staffCount}</Badge>
              </Label>
              <Slider
                value={[staffCount]}
                onValueChange={(value) => setStaffCount(value[0])}
                min={1}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Average Hourly Wage
                </span>
                <Badge variant="outline">${avgWage}</Badge>
              </Label>
              <Slider
                value={[avgWage]}
                onValueChange={(value) => setAvgWage(value[0])}
                min={15}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Weekly Manual Admin Hours
                </span>
                <Badge variant="outline">{manualHours}h</Badge>
              </Label>
              <Slider
                value={[manualHours]}
                onValueChange={(value) => setManualHours(value[0])}
                min={5}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Compliance Issues/Year
                </span>
                <Badge variant="outline">{complianceIssues}</Badge>
              </Label>
              <Slider
                value={[complianceIssues]}
                onValueChange={(value) => setComplianceIssues(value[0])}
                min={0}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 h-12 text-lg"
          >
            Calculate My Savings
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className={`border-2 ${showResults ? 'border-green-500 dark:border-green-600' : 'border-gray-200 dark:border-gray-800'}`}>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <CardTitle className="text-2xl">Your Potential Impact</CardTitle>
          </div>
          <CardDescription className="text-base">
            Based on your clinic's data
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Annual Savings</div>
              </div>
              <div className="text-3xl font-bold text-green-600">
                ${results.annualCostSavings.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Hours Saved</div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(results.annualTimeSaved)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">per year</div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">3-Year ROI</div>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(results.threeYearROI)}%
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Payback Period</div>
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {results.paybackPeriod.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">months</div>
            </div>
          </div>

          {/* Benefits Breakdown */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              What You'll Gain
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Reduce admin time by {Math.round(results.adminHoursReduced)} hours/week</span>
                  <div className="text-gray-600 dark:text-gray-400">Free your staff to focus on patient care</div>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Increase efficiency by {Math.round(results.efficiencyGain)}%</span>
                  <div className="text-gray-600 dark:text-gray-400">Handle more patients with the same staff</div>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Eliminate compliance headaches</span>
                  <div className="text-gray-600 dark:text-gray-400">Automated tracking and reporting</div>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Single integrated platform</span>
                  <div className="text-gray-600 dark:text-gray-400">Replace 5+ disconnected systems</div>
                </div>
              </li>
            </ul>
          </div>

          {showResults && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Report Generated Successfully!
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                    A detailed ROI analysis has been sent to {contactInfo.email}. Our team will contact you within 24 hours to discuss your personalized implementation plan.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/plans">View Pricing Plans</a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}