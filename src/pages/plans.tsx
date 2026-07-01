import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { GENERAL_PLANS } from "@/config/pricing";

export default function Plans() {
  return (
    <>
      <SEO 
        title="Pricing Plans - Blaze 360"
        description="Choose the perfect plan for your cannabis operation. From starter to enterprise solutions."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            14-Day Free Trial • No Credit Card Required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Scale your cannabis operation with flexible pricing that grows with your business
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {GENERAL_PLANS.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative ${
                  plan.popular 
                    ? "border-emerald-500 dark:border-emerald-400 shadow-2xl scale-105" 
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/payment">
                    <Button 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "" : "text-gray-400 dark:text-gray-600"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white/90 dark:bg-gray-900/90 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I switch plans later?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    We accept all major credit cards, ACH bank transfers, cryptocurrency (Bitcoin, Ethereum, USDC), and digital wallets (Apple Pay, Google Pay, PayPal).
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a long-term commitment?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    No contracts required. All plans are month-to-month and you can cancel anytime. We also offer annual plans with 20% discount.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer discounts for annual billing?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes! Save 20% when you choose annual billing. Contact sales for custom enterprise pricing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-6 text-emerald-50">
                Start your 14-day free trial today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-700">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}