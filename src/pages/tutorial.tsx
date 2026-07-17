import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen,
  Play,
  CheckCircle2,
  ArrowRight,
  Sprout,
  Factory,
  FlaskConical,
  Truck,
  Store,
  Stethoscope,
  Pill,
  BarChart3,
  ShieldCheck,
  Users,
  Settings,
  FileText,
  Video,
  Download,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function Tutorial() {
  const modules = [
    {
      id: "cultivation",
      icon: Sprout,
      name: "Cultivation Tracking",
      description: "Track plants from seed to harvest with complete compliance",
      color: "emerald",
      topics: [
        { title: "Getting Started: Creating Your First Batch", duration: "5 min", link: "#cultivation-batch" },
        { title: "Plant Lifecycle Management", duration: "8 min", link: "#cultivation-lifecycle" },
        { title: "Environmental Controls & Monitoring", duration: "6 min", link: "#cultivation-environment" },
        { title: "Harvest & Batch Processing", duration: "7 min", link: "#cultivation-harvest" },
        { title: "Compliance Reporting & Tagging", duration: "10 min", link: "#cultivation-compliance" },
      ]
    },
    {
      id: "manufacturing",
      icon: Factory,
      name: "Manufacturing",
      description: "Manage extraction, infusion, and production workflows",
      color: "orange",
      topics: [
        { title: "Setting Up Production Recipes", duration: "6 min", link: "#manufacturing-recipes" },
        { title: "Batch Manufacturing Process", duration: "8 min", link: "#manufacturing-batch" },
        { title: "Quality Control & Testing Integration", duration: "7 min", link: "#manufacturing-qc" },
        { title: "Packaging & Labeling Compliance", duration: "9 min", link: "#manufacturing-packaging" },
        { title: "Waste Tracking & Disposal", duration: "5 min", link: "#manufacturing-waste" },
      ]
    },
    {
      id: "testing",
      icon: FlaskConical,
      name: "Testing & Labs",
      description: "Manage lab results, COAs, and compliance testing",
      color: "blue",
      topics: [
        { title: "Sample Intake & Chain of Custody", duration: "6 min", link: "#testing-intake" },
        { title: "Running Tests & Recording Results", duration: "8 min", link: "#testing-results" },
        { title: "Generating Certificates of Analysis (COA)", duration: "7 min", link: "#testing-coa" },
        { title: "Failed Test Management & Quarantine", duration: "6 min", link: "#testing-quarantine" },
        { title: "Lab Equipment Calibration Tracking", duration: "5 min", link: "#testing-calibration" },
      ]
    },
    {
      id: "transport",
      icon: Truck,
      name: "Transportation",
      description: "Track manifests, routes, and delivery compliance",
      color: "purple",
      topics: [
        { title: "Creating Transport Manifests", duration: "7 min", link: "#transport-manifests" },
        { title: "Route Planning & Driver Assignment", duration: "6 min", link: "#transport-routes" },
        { title: "Real-Time GPS Tracking", duration: "5 min", link: "#transport-tracking" },
        { title: "Delivery Confirmation & Signatures", duration: "6 min", link: "#transport-delivery" },
        { title: "State Reporting & Compliance", duration: "8 min", link: "#transport-compliance" },
      ]
    },
    {
      id: "retail",
      icon: Store,
      name: "Retail POS",
      description: "Point-of-sale, inventory, and customer management",
      color: "green",
      topics: [
        { title: "POS System Overview & Quick Sale", duration: "5 min", link: "#retail-pos" },
        { title: "Customer Profiles & Loyalty Programs", duration: "7 min", link: "#retail-customers" },
        { title: "Inventory Management & Receiving", duration: "8 min", link: "#retail-inventory" },
        { title: "Age Verification & Compliance Checks", duration: "6 min", link: "#retail-compliance" },
        { title: "Reports & End-of-Day Reconciliation", duration: "9 min", link: "#retail-reports" },
      ]
    },
    {
      id: "medical",
      icon: Stethoscope,
      name: "Medical Prescriptions",
      description: "E-prescribing for healthcare providers",
      color: "teal",
      topics: [
        { title: "Patient Registration & Medical History", duration: "6 min", link: "#medical-patients" },
        { title: "Writing & Sending E-Prescriptions", duration: "8 min", link: "#medical-prescriptions" },
        { title: "Prescription Renewal & Dosage Adjustments", duration: "7 min", link: "#medical-renewals" },
        { title: "Patient Communication Portal", duration: "5 min", link: "#medical-communication" },
        { title: "HIPAA Compliance & Security", duration: "10 min", link: "#medical-hipaa" },
      ]
    },
    {
      id: "pharmacy",
      icon: Pill,
      name: "Pharmacy Management",
      description: "Fulfill prescriptions and manage patient care",
      color: "pink",
      topics: [
        { title: "Receiving & Processing Prescriptions", duration: "6 min", link: "#pharmacy-receiving" },
        { title: "Inventory & Stock Management", duration: "7 min", link: "#pharmacy-inventory" },
        { title: "Insurance Claims Processing", duration: "8 min", link: "#pharmacy-insurance" },
        { title: "Patient Counseling & Compliance", duration: "6 min", link: "#pharmacy-counseling" },
        { title: "Refill Automation & Notifications", duration: "5 min", link: "#pharmacy-refills" },
      ]
    },
    {
      id: "analytics",
      icon: BarChart3,
      name: "Analytics & Reporting",
      description: "Business intelligence and compliance reporting",
      color: "indigo",
      topics: [
        { title: "Dashboard Overview & Key Metrics", duration: "6 min", link: "#analytics-dashboard" },
        { title: "Sales & Revenue Analytics", duration: "8 min", link: "#analytics-sales" },
        { title: "Inventory & Supply Chain Reports", duration: "7 min", link: "#analytics-inventory" },
        { title: "Custom Report Builder", duration: "9 min", link: "#analytics-custom" },
        { title: "Automated Compliance Reporting", duration: "10 min", link: "#analytics-compliance" },
      ]
    },
    {
      id: "admin",
      icon: Settings,
      name: "Administration",
      description: "User management, permissions, and system settings",
      color: "gray",
      topics: [
        { title: "User Roles & Permissions Setup", duration: "7 min", link: "#admin-users" },
        { title: "Multi-Location Configuration", duration: "8 min", link: "#admin-locations" },
        { title: "Integration Settings (QuickBooks, etc.)", duration: "10 min", link: "#admin-integrations" },
        { title: "Compliance & Licensing Management", duration: "9 min", link: "#admin-compliance" },
        { title: "System Backup & Data Security", duration: "6 min", link: "#admin-security" },
      ]
    },
  ];

  return (
    <>
      <SEO 
        title="Platform Tutorial - Canna Blaze 360"
        description="Complete guide to navigating all Canna Blaze 360 modules. Learn cultivation tracking, retail POS, medical prescriptions, and more."
      />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
            <div className="flex gap-2">
              <Link href="/signup">
                <Button variant="outline">Start Free Trial</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <BookOpen className="w-3 h-3 mr-1" />
            Complete Platform Guide
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Canna Blaze 360
            <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mt-2">
              Tutorial Library
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Master every module with step-by-step video tutorials, interactive guides, and best practices 
            from cannabis industry experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600">
              <Play className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button size="lg" variant="outline">
              <Download className="w-5 h-5 mr-2" />
              Download PDF Guide
            </Button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">45+</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Video Tutorials</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">9</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Core Modules</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">~4 hrs</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Content</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Module Tutorials */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Module-by-Module Training</h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Card key={module.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-${module.color}-100 dark:bg-${module.color}-950 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 text-${module.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="mb-1">{module.name}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="topics" className="border-0">
                          <AccordionTrigger className="hover:no-underline">
                            <span className="flex items-center gap-2 text-sm">
                              <Play className="w-4 h-4" />
                              {module.topics.length} Topics
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {module.topics.map((topic, idx) => (
                                <li key={idx}>
                                  <a 
                                    href={topic.link}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                  >
                                    <span className="flex items-center gap-2 text-sm">
                                      <CheckCircle2 className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                                      {topic.title}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {topic.duration}
                                    </Badge>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Recommended Learning Paths</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-emerald-600" />
                    Dispensary Owner
                  </CardTitle>
                  <CardDescription>Perfect for retail cannabis operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Retail POS</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Inventory</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Analytics</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Administration</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Estimated completion: 1.5 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-600" />
                    Cultivator
                  </CardTitle>
                  <CardDescription>For grow operations and cultivation facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Cultivation Tracking</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Testing</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Transportation</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Compliance</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Estimated completion: 2 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    Medical Provider
                  </CardTitle>
                  <CardDescription>For doctors and healthcare facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Medical Prescriptions</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Patient Management</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>HIPAA Compliance</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    <Badge>Analytics</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Estimated completion: 1.5 hours
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Additional Resources</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm">API Reference</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm">Integration Guides</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm">Best Practices</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Live Training
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm">Weekly Webinars</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm">Onboarding Sessions</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <span className="text-sm">Q&A Office Hours</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Start your 14-day free trial and get instant access to all tutorials
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}