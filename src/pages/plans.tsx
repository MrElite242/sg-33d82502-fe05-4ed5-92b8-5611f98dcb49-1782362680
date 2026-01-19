import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { CannabisLeaf } from "@/components/CannabisLeaf";

const plans = [
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: "$499",
    period: "per 3 months",
    description: "Perfect for small operations testing the waters",
    features: [
      "Full seed-to-sale tracking",
      "Cultivation management",
      "Manufacturing & testing modules",
      "Transport & logistics",
      "Retail POS system",
      "Email support",
      "Basic analytics & reporting",
      "Up to 5 users",
    ],
    cta: "Start Quarterly",
    popular: false,
  },
  {
    id: "semi-annually",
    name: "Semi-Annual Plan",
    price: "$899",
    period: "per 6 months",
    savings: "Save 10%",
    description: "Best value for growing businesses",
    features: [
      "Everything in Quarterly",
      "Priority email support",
      "Advanced analytics dashboard",
      "Custom reporting",
      "QuickBooks integration",
      "Up to 15 users",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Start Semi-Annual",
    popular: true,
  },
  {
    id: "annually",
    name: "Annual Plan",
    price: "$1,599",
    period: "per year",
    savings: "Save 20%",
    description: "Maximum savings for established operations",
    features: [
      "Everything in Semi-Annual",
      "24/7 priority support",
      "Advanced compliance tools",
      "Multi-location support",
      "Custom integrations",
      "Unlimited users",
      "White-label options",
      "Quarterly business reviews",
      "Training & onboarding",
    ],
    cta: "Start Annual",
    popular: false,
  },
];

const features = [
  {
    title: "Seed-to-Sale Tracking",
    description: "Complete traceability from cultivation to retail sale",
  },
  {
    title: "Compliance Ready",
    description: "Built-in compliance tools for regulatory reporting",
  },
  {
    title: "Multi-Module System",
    description: "Cultivation, manufacturing, testing, transport, and retail in one platform",
  },
  {
    title: "Accounting Integration",
    description: "Seamless QuickBooks and accounting software integration",
  },
  {
    title: "Real-Time Analytics",
    description: "Track performance metrics and make data-driven decisions",
  },
  {
    title: "Secure & Reliable",
    description: "Bank-level security with 99.9% uptime guarantee",
  },
];

export default function PlansPage() {
  return (
    <>
      <SEO 
        title="Pricing Plans - Cannabis Tracking System"
        description="Choose the perfect plan for your cannabis business"
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 relative">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <CannabisLeaf className="absolute top-24 left-16 text-emerald-500/5 dark:text-emerald-400/3" size={300} style={{ transform: "rotate(-20deg)" }} />
          <CannabisLeaf className="absolute top-48 right-12 text-emerald-500/5 dark:text-emerald-400/3" size={260} style={{ transform: "rotate(25deg)" }} />
          <CannabisLeaf className="absolute bottom-32 left-1/4 text-emerald-500/5 dark:text-emerald-400/3" size={240} style={{ transform: "rotate(40deg)" }} />
          <CannabisLeaf className="absolute bottom-20 right-1/3 text-emerald-500/5 dark:text-emerald-400/3" size={280} style={{ transform: "rotate(-30deg)" }} />
        </div>

        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <CannabisLeaf className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">Cannabis Track</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include our complete seed-to-sale platform.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 pb-16 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative group overflow-hidden ${
                  plan.popular 
                    ? "border-emerald-600 border-2 shadow-xl scale-105" 
                    : ""
                }`}
              >
                <CannabisLeaf className="absolute -top-4 -right-4 text-emerald-500/0 group-hover:text-emerald-500/5 transition-all duration-500" size={150} style={{ transform: "rotate(15deg)" }} />
                
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="mb-4">{plan.description}</CardDescription>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-emerald-600">{plan.price}</div>
                    <div className="text-sm text-gray-600">{plan.period}</div>
                    {plan.savings && (
                      <div className="text-sm font-semibold text-emerald-600">{plan.savings}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6 relative z-10">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block relative z-10">
                    <Button 
                      className={`w-full ${
                        plan.popular
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Manage Your Cannabis Business
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center group p-4 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors">
                  <div className="bg-emerald-100 dark:bg-emerald-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 relative overflow-hidden">
              <CannabisLeaf className="absolute -left-10 -bottom-10 text-white/10" size={200} style={{ transform: "rotate(30deg)" }} />
              <CannabisLeaf className="absolute -right-10 -top-10 text-white/10" size={200} style={{ transform: "rotate(-30deg)" }} />
              
              <CardContent className="py-12 relative z-10">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-xl mb-8 text-emerald-50">
                  Join hundreds of cannabis businesses using our platform
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                      Start Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-700">
                      Login to Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}