import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Factory, FlaskConical, TrendingUp, Truck, Store, BarChart3, Settings, Leaf } from "lucide-react";
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
        title="Cannabis Tracking System - Seed to Sale Platform"
        description="Complete cannabis tracking solution from cultivation to retail sales with compliance and accounting integration"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cannabis Track</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Seed to Sale Platform</p>
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
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
              Trusted by 500+ Cannabis Businesses
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Seed-to-Sale
              <span className="block text-emerald-600 mt-2">Cannabis Tracking</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Track every stage of your cannabis operation with full regulatory compliance, 
              real-time analytics, and seamless accounting integration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
                  Start Free Trial
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/plans">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                  View Pricing
                  <BarChart3 className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
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
                <Card key={module.href} className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-emerald-200 dark:hover:border-emerald-800">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center ${module.color}`}>
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
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-gray-900 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Enterprise-Grade Features
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Built for compliance, designed for growth
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 dark:text-white">Real-Time Analytics</h4>
                    <p className="text-gray-600 dark:text-gray-400">Track KPIs, inventory levels, and compliance metrics in real-time with customizable dashboards</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 dark:text-white">QuickBooks Integration</h4>
                    <p className="text-gray-600 dark:text-gray-400">Seamless two-way sync with QuickBooks and other accounting platforms</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 dark:text-white">Compliance Ready</h4>
                    <p className="text-gray-600 dark:text-gray-400">Built-in compliance checks, automated reporting, and audit trail for all transactions</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 dark:text-white">Full Traceability</h4>
                    <p className="text-gray-600 dark:text-gray-400">Track every product from seed to final sale with complete chain of custody</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-2xl">
              <CardContent className="py-12 px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl mb-8 text-emerald-50">
                  Join hundreds of cannabis businesses streamlining their operations
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/plans">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-emerald-700 text-lg px-8 py-6">
                      View Pricing Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400">© 2026 Cannabis Track. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600">Privacy</Link>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600">Terms</Link>
                <Link href="/support" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}