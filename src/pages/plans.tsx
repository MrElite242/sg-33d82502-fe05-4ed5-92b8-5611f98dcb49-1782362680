import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PricingComparison } from "@/components/PricingComparison";

export default function Plans() {
  const router = useRouter();

  const handleSelectPlan = (planId: string, billingCycle: "monthly" | "annual") => {
    // Store selection and redirect to payment
    sessionStorage.setItem("selectedPlan", planId);
    sessionStorage.setItem("billingCycle", billingCycle);
    router.push("/payment");
  };

  return (
    <>
      <SEO 
        title="Pricing Plans - Canna Blaze 360"
        description="Choose the perfect plan for your cannabis operation. From starter to enterprise solutions with flexible monthly or annual billing."
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

        {/* Pricing Comparison Component */}
        <PricingComparison planType="general" onSelectPlan={handleSelectPlan} />

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-lg mb-2">Can I switch plans later?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any charges or credits.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-lg mb-2">What happens after the trial?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your 14-day free trial gives you full access to your chosen plan. No credit card required 
                to start. After the trial, you'll be prompted to add payment information.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a 
                full refund within your first 30 days.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-lg mb-2">How does annual billing work?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Annual billing gives you 2 months free (20% discount). You pay once per year and save 
                compared to monthly billing. You can still upgrade or downgrade anytime.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of cannabis businesses using Canna Blaze 360
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}