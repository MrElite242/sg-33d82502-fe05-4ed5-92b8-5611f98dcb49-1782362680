import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Factory, FlaskConical, TrendingUp, Truck, Store, BarChart3, Settings } from "lucide-react";
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
    }
  ];

  return (
    <>
      <SEO 
        title="Marijuana Bahamas - Seed to Sale Cannabis Tracking"
        description="Complete cannabis tracking solution from cultivation to retail sales with compliance and accounting integration"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marijuana Bahamas</h1>
                <p className="text-xs text-gray-600">Seed to Sale Tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Complete Cannabis Compliance
              <span className="block text-green-600 mt-2">From Seed to Sale</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track every stage of your cannabis operation with full regulatory compliance, 
              real-time analytics, and seamless accounting integration
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                  Get Started
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="gap-2">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Complete Operation Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.href} href={module.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-green-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ${module.color}`}>
                          <Icon className="w-6 h-6" />
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
                </Link>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Enterprise Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Real-Time Analytics</h4>
                  <p className="text-gray-600">Track KPIs, inventory levels, and compliance metrics in real-time</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">QuickBooks Integration</h4>
                  <p className="text-gray-600">Seamless sync with QuickBooks and other accounting platforms</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Compliance Ready</h4>
                  <p className="text-gray-600">Built-in compliance checks and automated reporting</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Full Traceability</h4>
                  <p className="text-gray-600">Track every product from seed to final sale with complete audit trail</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600">© 2026 Marijuana Bahamas. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-gray-600 hover:text-green-600">Privacy</Link>
                <Link href="/terms" className="text-gray-600 hover:text-green-600">Terms</Link>
                <Link href="/support" className="text-gray-600 hover:text-green-600">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}