import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { ROICalculator } from "@/components/ROICalculator";
import { RequestDemoForm } from "@/components/RequestDemoForm";
import { 
  Sprout, 
  Beaker, 
  Package, 
  Truck, 
  Store, 
  FileText, 
  Pill,
  User,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Clock,
  Target,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Factory,
  FlaskConical,
  Stethoscope,
  Building2,
  Settings,
  Video,
  Sparkles,
  Lock,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const [consultationForm, setConsultationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    position: "",
    organization: "",
    programType: "",
    expectedLicensees: "",
    timeline: "",
    budget: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/government-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultationForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit consultation request");
      }
      
      // Show success message
      alert("Thank you for your consultation request! Our government solutions team will contact you within 24 hours.");
      
      // Reset form
      setConsultationForm({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        position: "",
        organization: "",
        programType: "",
        expectedLicensees: "",
        timeline: "",
        budget: "",
        message: ""
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Consultation submission error:", error);
      alert("There was an error submitting your request. Please try again or contact government@cannablaze360.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = [
  {
    icon: Sprout,
    title: "Cultivation",
    description: "Track plants from seed to harvest with batch management and growth monitoring",
    href: "/cultivation",
    color: "text-green-600"
  },
  {
    icon: FileText,
    title: "E-Prescriptions",
    description: "Secure medical cannabis prescriptions, doctor verification, and pharmacy routing",
    href: "/doctor-signup",
    color: "text-indigo-600"
  },
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Manage extraction, processing, and product creation with full traceability",
    href: "/manufacturing",
    color: "text-purple-600"
  },
  {
    icon: FlaskConical,
    title: "Testing",
    description: "Lab results, compliance testing, and quality assurance documentation",
    href: "/testing",
    color: "text-blue-600"
  },
  {
    icon: TrendingUp,
    title: "Research",
    description: "Data analytics, strain performance, and cultivation insights",
    href: "/research",
    color: "text-orange-600"
  },
  {
    icon: Truck,
    title: "Transport",
    description: "Manage manifests, delivery routes, and compliance documentation",
    href: "/transport",
    color: "text-yellow-600"
  },
  {
    icon: Store,
    title: "Retail",
    description: "Point of sale, inventory management, and customer tracking",
    href: "/retail",
    color: "text-pink-600"
  }];


  return (
    <>
      <SEO
        title="Canna Blaze 360 - Complete Cannabis Seed-to-Sale Platform | Track, Comply, Grow"
        description="Enterprise cannabis management platform with cultivation tracking, manufacturing, testing, retail POS, medical prescriptions, compliance reporting, and QuickBooks integration. 14-day free trial."
        image="/og-image.png"
        url="https://cannablaze360.com"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "Canna Blaze 360",
              "url": "https://cannablaze360.com",
              "logo": "https://cannablaze360.com/canna-blaze-360-logo.png",
              "description": "Complete seed-to-sale cannabis tracking and compliance platform",
              "sameAs": [
                "https://twitter.com/cannablaze360",
                "https://linkedin.com/company/cannablaze360"
              ]
            },
            {
              "@type": "SoftwareApplication",
              "name": "Canna Blaze 360",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "priceValidUntil": "2027-12-31",
                "availability": "https://schema.org/InStock",
                "url": "https://cannablaze360.com/plans"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "500",
                "bestRating": "5"
              },
              "description": "Track every stage of your cannabis operation with full regulatory compliance, real-time analytics, and seamless accounting integration",
              "featureList": [
                "Cultivation Tracking",
                "Manufacturing Management",
                "Testing & Lab Results",
                "Transportation & Manifests",
                "Retail Point of Sale",
                "Medical Prescriptions",
                "Pharmacy Management",
                "Compliance Reporting",
                "QuickBooks Integration",
                "Real-time Analytics"
              ]
            },
            {
              "@type": "WebSite",
              "url": "https://cannablaze360.com",
              "name": "Canna Blaze 360",
              "description": "Complete cannabis seed-to-sale tracking platform",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://cannablaze360.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ]
        }}
      />
      
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-orange-50 to-green-50 dark:from-gray-900 dark:via-orange-950/30 dark:to-gray-900 relative overflow-hidden">
        {/* Background Watermark Leaves */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.02]">
          <CannabisLeaf className="absolute top-10 left-10 text-emerald-600 rotate-12" size={200} />
          <CannabisLeaf className="absolute top-1/4 right-20 text-orange-500 -rotate-45" size={300} />
          <CannabisLeaf className="absolute bottom-20 left-1/4 text-emerald-700 rotate-[30deg]" size={250} />
          <CannabisLeaf className="absolute top-1/2 left-1/2 text-green-500 -rotate-12" size={400} />
          <CannabisLeaf className="absolute bottom-1/4 right-1/4 text-orange-600 rotate-[60deg]" size={180} />
        </div>

        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/canna-blaze-360-logo.png" 
                  alt="Canna Blaze 360 Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                  Canna Blaze 360
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Seed to Sale Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/plans">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-emerald-600 via-orange-500 to-green-600 hover:from-emerald-700 hover:via-orange-600 hover:to-green-700 shadow-md">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24 text-center relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="mb-6 text-base px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Complete Seed to Sale Cannabis Tracking Ecosystem
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Cannabis Compliance &
              <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mt-2">
                Business Management
              </span>
              <span className="block text-4xl md:text-5xl mt-4 text-gray-700 dark:text-gray-300">
                Made Simple
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Enterprise-grade platform offering complete seed-to-sale tracking, cultivation management, 
              retail POS, inventory control, and regulatory compliance for dispensaries, growers, and medical cannabis operations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-emerald-600 via-orange-500 to-green-600 hover:from-emerald-700 hover:via-orange-600 hover:to-green-700 text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all">
                <CannabisLeaf size={20} />
                Start Free Trial
                <TrendingUp className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/plans">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-10 py-7 border-2 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                View Pricing
                <BarChart3 className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </section>

        {/* Portal Access Section - NEW */}
        <section className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Access Your Portal
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Sign in to your account based on your role
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cannabis Business Portal - FEATURED FIRST */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-emerald-500 dark:hover:border-emerald-500 bg-gradient-to-br from-emerald-100/80 to-green-100/80 dark:from-emerald-900/50 dark:to-green-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Store className="text-emerald-600 w-32 h-32 rotate-12" />
                </div>
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Cannabis Business</CardTitle>
                  <CardDescription className="text-base">
                    Seed-to-sale tracking platform for cultivation, manufacturing, and retail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white group-hover:shadow-lg transition-shadow">
                      Sign In to Platform
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                    New? <Link href="/signup?role=business" className="text-emerald-600 hover:underline font-semibold">Register Business</Link>
                  </p>
                </CardContent>
              </Card>

              {/* Doctor Portal */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-emerald-400 dark:hover:border-emerald-600 bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-950/50 dark:to-green-950/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Stethoscope className="text-emerald-600 w-32 h-32 rotate-12" />
                </div>
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Doctor Portal</CardTitle>
                  <CardDescription className="text-base">
                    Create and manage medical cannabis prescriptions for your patients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/prescriptions">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white group-hover:shadow-lg transition-shadow">
                      Sign In as Doctor
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                    New? <Link href="/doctor-signup" className="text-emerald-600 hover:underline font-semibold">Register here</Link>
                  </p>
                </CardContent>
              </Card>

              {/* Pharmacy Portal */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-400 dark:hover:border-blue-600 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Building2 className="text-blue-600 w-32 h-32 rotate-12" />
                </div>
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Pharmacy Portal</CardTitle>
                  <CardDescription className="text-base">
                    View incoming prescriptions and update fulfillment status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/pharmacy-dashboard">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group-hover:shadow-lg transition-shadow">
                      Sign In as Pharmacy
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                    Pharmacy staff login only
                  </p>
                </CardContent>
              </Card>

              {/* Patient Portal */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-400 dark:hover:border-purple-600 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/50 dark:to-pink-950/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <User className="text-purple-600 w-32 h-32 rotate-12" />
                </div>
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Patient Portal</CardTitle>
                  <CardDescription className="text-base">
                    View your prescriptions and track pharmacy fulfillment status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/patient-dashboard">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group-hover:shadow-lg transition-shadow">
                      Sign In as Patient
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                    Secure access to your prescriptions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tabbed Content Section - Overview & Government Solutions */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-900/80 p-1.5 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white px-8 py-2.5 text-base font-semibold">
                  Platform Overview
                </TabsTrigger>
                <TabsTrigger value="government" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white px-8 py-2.5 text-base font-semibold">
                  Government Solutions
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="mt-0">
              {/* Modules Grid */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <CannabisLeaf size={32} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Complete Operation Management
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Everything you need to manage your cannabis business in one platform
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Card key={module.href} className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CannabisLeaf size={120} className="text-emerald-600 rotate-12" />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-md ${module.color}`}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <CardTitle className="text-xl">{module.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {module.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Features Section */}
              <div className="mt-24 bg-white/90 dark:bg-gray-900/90 py-16 lg:py-24 relative backdrop-blur-sm rounded-3xl">
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
                  <CannabisLeaf className="absolute top-20 right-10 text-emerald-600 rotate-45" size={250} />
                  <CannabisLeaf className="absolute bottom-20 left-10 text-green-600 -rotate-12" size={280} />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Enterprise-Grade Features
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Built for compliance, designed for growth
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex gap-4 bg-gradient-to-br from-emerald-50/50 via-orange-50/30 to-green-50/50 dark:from-emerald-950/30 dark:via-orange-950/20 dark:to-green-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 via-orange-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <BarChart3 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2 dark:text-white">Real-Time Analytics</h4>
                          <p className="text-gray-600 dark:text-gray-400">Track KPIs, inventory levels, and compliance metrics in real-time with customizable dashboards</p>
                        </div>
                      </div>
                      <div className="flex gap-4 bg-gradient-to-br from-blue-50/50 via-orange-50/30 to-indigo-50/50 dark:from-blue-950/30 dark:via-orange-950/20 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-orange-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Settings className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2 dark:text-white">QuickBooks Integration</h4>
                          <p className="text-gray-600 dark:text-gray-400">Seamless two-way sync with QuickBooks and other accounting platforms</p>
                        </div>
                      </div>
                      <div className="flex gap-4 bg-gradient-to-br from-purple-50/50 via-orange-50/30 to-pink-50/50 dark:from-purple-950/30 dark:via-orange-950/20 dark:to-pink-950/30 p-6 rounded-xl border border-purple-100 dark:border-purple-900">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FlaskConical className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2 dark:text-white">Compliance Ready</h4>
                          <p className="text-gray-600 dark:text-gray-400">Built-in compliance checks, automated reporting, and audit trail for all transactions</p>
                        </div>
                      </div>
                      <div className="flex gap-4 bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-amber-50/50 dark:from-orange-950/30 dark:via-yellow-950/20 dark:to-amber-950/30 p-6 rounded-xl border border-orange-100 dark:border-orange-900">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Truck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2 dark:text-white">Full Traceability</h4>
                          <p className="text-gray-600 dark:text-gray-400">Track every product from seed to final sale with complete chain of custody</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Government Solutions Tab Content */}
            <TabsContent value="government" className="mt-0">
              <div className="py-12 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden rounded-3xl">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div>
                      <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Government & Regulatory Solutions
                      </Badge>
                      <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        National Cannabis Program Infrastructure
                      </h2>
                      <p className="text-xl text-blue-100 mb-8">
                        Trusted by governments worldwide to launch and manage comprehensive medical and adult-use cannabis programs. From licensing to compliance, we provide the complete regulatory ecosystem.
                      </p>

                      {/* Key Stats */}
                      {/* TODO: Configure with real-time data from government deployments API */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">0</div>
                          <div className="text-sm text-blue-200">Countries Deployed</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">0</div>
                          <div className="text-sm text-blue-200">Transactions Tracked</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">0%</div>
                          <div className="text-sm text-blue-200">System Uptime</div>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Complete Regulatory Dashboard</div>
                            <div className="text-blue-200 text-sm">License management, compliance tracking, and inspection scheduling</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">National Seed-to-Sale Tracking</div>
                            <div className="text-blue-200 text-sm">Real-time monitoring from cultivation to consumer</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Executive Intelligence Suite</div>
                            <div className="text-blue-200 text-sm">AI-powered analytics and national reporting dashboards</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Multi-Region Disaster Recovery</div>
                            <div className="text-blue-200 text-sm">Enterprise-grade security and 24/7 support</div>
                          </div>
                        </div>
                      </div>

                      {/* Government Solutions Modules */}
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 border-2 border-emerald-300 dark:border-emerald-700">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-emerald-900 dark:text-emerald-100">Canna ID 360™</CardTitle>
                                <CardDescription className="text-emerald-700 dark:text-emerald-300">National Cannabis Credential System</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              Privacy-first national cannabis user credential system with secure digital IDs, QR verification, and payment integration.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Issue government-verified digital credentials</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Privacy-preserving QR verification (returns only "Eligible? YES/NO")</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Multi-tier pricing: Local $5/month, Tourist $10/month, Annual $50/year</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Complete audit trail & credential management portal</span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Link href="/canna-id/admin" className="flex-1">
                                <Button variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm">
                                  Government Portal
                                </Button>
                              </Link>
                              <Link href="/canna-id/apply" className="flex-1">
                                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-sm">
                                  Apply Now
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border-2 border-blue-300 dark:border-blue-700">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-blue-900 dark:text-blue-100">Licensing & Compliance</CardTitle>
                                <CardDescription className="text-blue-700 dark:text-blue-300">Regulatory Dashboard</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              Complete license management, compliance tracking, and inspection scheduling for regulatory authorities.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">License application review and approval workflows</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Real-time compliance monitoring and violation tracking</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Automated reporting and analytics dashboards</span>
                              </div>
                            </div>
                            <Link href="/government-licensing">
                              <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 text-sm mt-2">
                                View Licensing Packages
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4">
                        <Link href="/government-licensing">
                          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            View Licensing Packages
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              Schedule Consultation
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">Schedule Government Consultation</DialogTitle>
                              <DialogDescription>
                                Connect with our government solutions team to discuss national cannabis program infrastructure
                              </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleConsultationSubmit} className="space-y-6 mt-4">
                              {/* Contact Information */}
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input
                                      id="fullName"
                                      required
                                      value={consultationForm.fullName}
                                      onChange={(e) => setConsultationForm({...consultationForm, fullName: e.target.value})}
                                      placeholder="Dr. Jane Smith"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="position">Position/Title *</Label>
                                    <Input
                                      id="position"
                                      required
                                      value={consultationForm.position}
                                      onChange={(e) => setConsultationForm({...consultationForm, position: e.target.value})}
                                      placeholder="Director of Cannabis Regulation"
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
                                      value={consultationForm.email}
                                      onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                                      placeholder="jane.smith&#64;government.com"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                      id="phone"
                                      type="tel"
                                      required
                                      value={consultationForm.phone}
                                      onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
                                      placeholder="+1 (555) 123-4567"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Organization & Location */}
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Organization & Location</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="organization">Government Agency/Department *</Label>
                                    <Input
                                      id="organization"
                                      required
                                      value={consultationForm.organization}
                                      onChange={(e) => setConsultationForm({...consultationForm, organization: e.target.value})}
                                      placeholder="Ministry of Health & Cannabis Regulation"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="country">Country/Region *</Label>
                                    <Input
                                      id="country"
                                      required
                                      value={consultationForm.country}
                                      onChange={(e) => setConsultationForm({...consultationForm, country: e.target.value})}
                                      placeholder="e.g., Thailand, Jamaica, Colombia"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Program Details */}
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Program Details</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="programType">Program Type *</Label>
                                    <Select
                                      value={consultationForm.programType}
                                      onValueChange={(value) => setConsultationForm({...consultationForm, programType: value})}
                                      required
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select program type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="medical-only">Medical Cannabis Only</SelectItem>
                                        <SelectItem value="medical-adult-use">Medical + Adult-Use</SelectItem>
                                        <SelectItem value="research-pilot">Research/Pilot Program</SelectItem>
                                        <SelectItem value="full-legalization">Full Legalization</SelectItem>
                                        <SelectItem value="exploring">Still Exploring Options</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="expectedLicensees">Expected Number of Licensees *</Label>
                                    <Select
                                      value={consultationForm.expectedLicensees}
                                      onValueChange={(value) => setConsultationForm({...consultationForm, expectedLicensees: value})}
                                      required
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select range" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="under-100">Under 100</SelectItem>
                                        <SelectItem value="100-500">100-500 (Tier 1)</SelectItem>
                                        <SelectItem value="500-2000">500-2,000 (Tier 2)</SelectItem>
                                        <SelectItem value="2000-10000">2,000-10,000 (Tier 3)</SelectItem>
                                        <SelectItem value="over-10000">Over 10,000 (Tier 4)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="timeline">Implementation Timeline *</Label>
                                    <Select
                                      value={consultationForm.timeline}
                                      onValueChange={(value) => setConsultationForm({...consultationForm, timeline: value})}
                                      required
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select timeline" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="0-3-months">0-3 months (Immediate)</SelectItem>
                                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                                        <SelectItem value="12-24-months">12-24 months</SelectItem>
                                        <SelectItem value="planning">Planning Phase (24+ months)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="budget">Annual Budget Range *</Label>
                                    <Select
                                      value={consultationForm.budget}
                                      onValueChange={(value) => setConsultationForm({...consultationForm, budget: value})}
                                      required
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select budget" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="under-500k">Under $500K (Custom)</SelectItem>
                                        <SelectItem value="350k-850k">$350K-$850K (Tier 1-2)</SelectItem>
                                        <SelectItem value="850k-2.5m">$850K-$2.5M (Tier 2-3)</SelectItem>
                                        <SelectItem value="2.5m-5m">$2.5M-$5M (Tier 3-4)</SelectItem>
                                        <SelectItem value="over-5m">Over $5M (Enterprise)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Information */}
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Additional Information</h3>
                                <div>
                                  <Label htmlFor="message">Tell us about your program goals and challenges</Label>
                                  <Textarea
                                    id="message"
                                    rows={4}
                                    value={consultationForm.message}
                                    onChange={(e) => setConsultationForm({...consultationForm, message: e.target.value})}
                                    placeholder="Please share any specific requirements, regulatory concerns, or questions you have about implementing a national cannabis program..."
                                  />
                                </div>
                              </div>

                              {/* Privacy Notice */}
                              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <strong>Confidentiality Notice:</strong> All consultation requests are handled with strict confidentiality. 
                                  We understand the sensitive nature of government cannabis program planning and will not disclose your inquiry to third parties.
                                </p>
                              </div>

                              {/* Submit Buttons */}
                              <div className="flex gap-3 pt-4">
                                <Button 
                                  type="submit" 
                                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Submitting..." : "Schedule Consultation"}
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setDialogOpen(false)}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Right Column - Tier Cards Preview */}
                    <div className="space-y-4">
                      {/* Tier 1 Card */}
                      <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Tier 1</Badge>
                            <span className="text-2xl font-bold text-white">$350K/year</span>
                          </div>
                          <CardTitle className="text-white">Emerging Program</CardTitle>
                          <CardDescription className="text-blue-200">
                            Best for countries launching medical cannabis programs
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-blue-200">
                            100 Licensees • Regulatory Dashboard • Compliance Management
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tier 2 Card - Featured */}
                      <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-lg border-emerald-400/40 ring-2 ring-emerald-400/40 hover:ring-emerald-400/60 transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-emerald-500 text-white">Tier 2 • Most Popular</Badge>
                            <span className="text-2xl font-bold text-white">$850K/year</span>
                          </div>
                          <CardTitle className="text-white">National Medical Program</CardTitle>
                          <CardDescription className="text-blue-100">
                            Complete medical cannabis infrastructure
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-blue-100">
                            Patient Registry • Physician Portal • Pharmacy Suite • Priority Support
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tier 3 & 4 Compact */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
                          <CardHeader className="pb-3">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-2">Tier 3</Badge>
                            <div className="text-xl font-bold text-white">$2.5M/year</div>
                            <CardDescription className="text-blue-200 text-xs">
                              Medical + Adult-Use
                            </CardDescription>
                          </CardHeader>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
                          <CardHeader className="pb-3">
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-2">Tier 4</Badge>
                            <div className="text-xl font-bold text-white">$5M+/year</div>
                            <CardDescription className="text-blue-200 text-xs">
                              Enterprise Ecosystem
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Canna ID 360™ Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                Privacy-First Identity
              </Badge>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Canna ID 360™
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                National cannabis user credential system with privacy-preserving verification
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Left: For Users */}
              <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>For Cannabis Users</CardTitle>
                      <CardDescription>Secure digital credential</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Digital ID & QR Code</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mobile-friendly credential with secure verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Privacy Protected</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Retailers only see "Eligible? YES" - no personal data shared</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Government Verified</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Official national cannabis credential</p>
                    </div>
                  </div>
                  <Link href="/canna-id/verify">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">
                      View Your Credential
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Right: For Government */}
              <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>For Government Authorities</CardTitle>
                      <CardDescription>Issuance & management portal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Issue Credentials</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Age-verified national cannabis user IDs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Audit Trail</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Complete verification logs and compliance tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Manage Credentials</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Suspend, revoke, or reactivate credentials</p>
                    </div>
                  </div>
                  <Link href="/canna-id/admin">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 mt-4">
                      Government Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Feature Highlight */}
            <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-rose-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Privacy-First Architecture</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Dispensaries verify eligibility without accessing sensitive personal information. No national ID numbers, medical diagnoses, doctor notes, or purchase history is exposed during verification.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm font-semibold text-red-600 mb-1">❌ Dispensaries DON'T See:</div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Full national ID number</li>
                          <li>• Medical diagnosis</li>
                          <li>• Doctor's notes</li>
                          <li>• Purchase history</li>
                        </ul>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3">
                        <div className="text-sm font-semibold text-green-600 mb-1">✓ Dispensaries Only See:</div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Eligible? <strong className="text-green-600">YES</strong> / <strong className="text-red-600">NO</strong></li>
                          <li>• Jurisdiction (region only)</li>
                          <li>• Nothing else</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                ROI Calculator
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Calculate Your Savings in 
                <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mt-2">
                  2 Minutes
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                See exactly how much time and money your clinic will save by switching to an integrated ecosystem. 
                Clinics typically save <span className="font-bold text-emerald-600">$50,000+</span> annually and recoup costs in under <span className="font-bold text-emerald-600">3 months</span>.
              </p>
            </div>

            <ROICalculator />

            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Average Annual Savings</h3>
                  <p className="text-2xl font-bold text-emerald-600">$52,000</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Per clinic location</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Time Saved Weekly</h3>
                  <p className="text-2xl font-bold text-blue-600">15-20 hrs</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">For admin staff</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Payback Period</h3>
                  <p className="text-2xl font-bold text-purple-600">2.5 months</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average across clients</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Request Demo Section */}
        <section id="request-demo" className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Video className="w-3 h-3 mr-1" />
                Schedule a Demo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                See It in Action
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                  Live Demo
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Get a personalized walkthrough of Canna Blaze 360 tailored to your specific business needs. 
                Our cannabis industry experts will show you exactly how the platform solves your challenges.
              </p>
            </div>

            <RequestDemoForm />

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Live Walkthrough</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    30-45 minute personalized demo with Q&A
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Expert Guidance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cannabis industry specialists, not just sales
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Custom Solutions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tailored to your operation's unique needs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-emerald-600 via-orange-500 to-green-600 text-white border-0 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <CannabisLeaf className="absolute -top-10 -right-10 text-white rotate-12" size={200} />
                <CannabisLeaf className="absolute -bottom-10 -left-10 text-white -rotate-45" size={220} />
              </div>
              <CardContent className="py-12 px-8 text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/canna-blaze-360-logo.png" 
                    alt="Canna Blaze 360" 
                    className="h-20 w-auto drop-shadow-2xl brightness-0 invert"
                  />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl mb-8 text-white/90">
                  Join hundreds of cannabis businesses streamlining their operations
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-10 py-6 shadow-xl">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/plans">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6">
                      View Pricing Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white border-t border-gray-800">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="/canna-blaze-360-logo.png" 
                    alt="Canna Blaze 360" 
                    className="h-10 w-auto"
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  The complete seed-to-sale cannabis management platform trusted by clinics, cultivators, and regulators.
                </p>
                {/* Social Media Icons */}
                <div className="flex gap-3">
                  <a 
                    href="https://twitter.com/cannablaze360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://facebook.com/cannablaze360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://instagram.com/cannablaze360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/cannablaze360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://youtube.com/@cannablaze360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Products</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/retail" className="hover:text-emerald-400 transition-colors">Retail POS</Link></li>
                  <li><Link href="/cultivation" className="hover:text-emerald-400 transition-colors">Cultivation Tracking</Link></li>
                  <li><Link href="/manufacturing" className="hover:text-emerald-400 transition-colors">Manufacturing</Link></li>
                  <li><Link href="/testing" className="hover:text-emerald-400 transition-colors">Testing & Labs</Link></li>
                  <li><Link href="/transport" className="hover:text-emerald-400 transition-colors">Transportation</Link></li>
                  <li><Link href="/prescriptions" className="hover:text-emerald-400 transition-colors">Medical Prescriptions</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/plans" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                  <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
                  <li><Link href="/signup" className="hover:text-emerald-400 transition-colors">Get Started</Link></li>
                  <li><a href="#roi-calculator" className="hover:text-emerald-400 transition-colors">ROI Calculator</a></li>
                  <li><Link href="/analytics" className="hover:text-emerald-400 transition-colors">Analytics</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="mailto:support&#64;cannablaze360.com" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                    support&#64;cannablaze360.com
                  </a></li>
                  <li><a href="tel:+1-555-BLAZE-360" className="hover:text-emerald-400 transition-colors">+1 (555) BLAZE-360</a></li>
                  <li><Link href="/tutorial" className="hover:text-emerald-400 transition-colors">Platform Tutorial</Link></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">System Status</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 pt-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Canna Blaze 360. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm text-gray-400">
                  <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Compliance</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}