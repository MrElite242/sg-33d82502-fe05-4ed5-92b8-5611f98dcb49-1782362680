import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { Sprout, Factory, FlaskConical, TrendingUp, Truck, Store, BarChart3, Settings, FileText, Stethoscope, Building2, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
        title="Blaze 360 - Cannabis Seed to Sale Platform"
        description="Complete cannabis tracking solution from cultivation to retail sales with compliance and accounting integration" />
      
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 relative overflow-hidden">
        {/* Background Watermark Leaves */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.02]">
          <CannabisLeaf className="absolute top-10 left-10 text-emerald-600 rotate-12" size={200} />
          <CannabisLeaf className="absolute top-1/4 right-20 text-green-600 -rotate-45" size={300} />
          <CannabisLeaf className="absolute bottom-20 left-1/4 text-emerald-700 rotate-[30deg]" size={250} />
          <CannabisLeaf className="absolute top-1/2 left-1/2 text-green-500 -rotate-12" size={400} />
          <CannabisLeaf className="absolute bottom-1/4 right-1/4 text-emerald-600 rotate-[60deg]" size={180} />
        </div>

        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-2.5 rounded-xl shadow-lg relative">
                <CannabisLeaf className="w-7 h-7 text-white" size={28} />
                <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Canna Blaze 360

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
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
              <CannabisLeaf size={16} className="text-emerald-600 dark:text-emerald-400" />
              Trusted by 500+ Cannabis Businesses
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Complete Seed-to-Sale
              <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Cannabis Tracking
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track every stage of your cannabis operation with full regulatory compliance, 
              real-time analytics, and seamless accounting integration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all">
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
          </div>
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

        {/* Modules Grid */}
        <section className="container mx-auto px-4 py-16 relative z-10">
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
                </Card>);

            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white/90 dark:bg-gray-900/90 py-16 lg:py-24 relative backdrop-blur-sm">
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
                <div className="flex gap-4 bg-emerald-50/50 dark:bg-emerald-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 dark:text-white">Real-Time Analytics</h4>
                    <p className="text-gray-600 dark:text-gray-400">Track KPIs, inventory levels, and compliance metrics in real-time with customizable dashboards</p>
                  </div>
                </div>
                <div className="flex gap-4 bg-blue-50/50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 dark:text-white">QuickBooks Integration</h4>
                    <p className="text-gray-600 dark:text-gray-400">Seamless two-way sync with QuickBooks and other accounting platforms</p>
                  </div>
                </div>
                <div className="flex gap-4 bg-purple-50/50 dark:bg-purple-950/30 p-6 rounded-xl border border-purple-100 dark:border-purple-900">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FlaskConical className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 dark:text-white">Compliance Ready</h4>
                    <p className="text-gray-600 dark:text-gray-400">Built-in compliance checks, automated reporting, and audit trail for all transactions</p>
                  </div>
                </div>
                <div className="flex gap-4 bg-orange-50/50 dark:bg-orange-950/30 p-6 rounded-xl border border-orange-100 dark:border-orange-900">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
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
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white border-0 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <CannabisLeaf className="absolute -top-10 -right-10 text-white rotate-12" size={200} />
                <CannabisLeaf className="absolute -bottom-10 -left-10 text-white -rotate-45" size={220} />
              </div>
              <CardContent className="py-12 px-8 text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <CannabisLeaf size={64} className="text-white drop-shadow-lg" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl mb-8 text-emerald-50">
                  Join hundreds of cannabis businesses streamlining their operations
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-10 py-6 shadow-xl">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/plans">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-emerald-700 text-lg px-10 py-6">
                      View Pricing Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm mt-16 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
            <CannabisLeaf className="absolute bottom-0 left-1/2 -translate-x-1/2 text-emerald-600" size={150} />
          </div>
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <CannabisLeaf size={20} className="text-emerald-600 dark:text-emerald-400" />
                <p className="text-gray-600 dark:text-gray-400">© 2026 Blaze 360. All rights reserved.</p>
              </div>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">Privacy</Link>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">Terms</Link>
                <Link href="/support" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>);

}