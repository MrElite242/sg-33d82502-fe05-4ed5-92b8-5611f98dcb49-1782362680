import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Lock, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GENERAL_PLANS, calculateTotal, calculateAnnualPrice, TAX_RATE } from "@/config/pricing";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Payment() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  // Get selected plan from session storage or default to Professional
  const [selectedPlan] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPlanId = sessionStorage.getItem("selectedPlan");
      if (savedPlanId) {
        const plan = GENERAL_PLANS.find(p => p.id === savedPlanId);
        if (plan) return plan;
      }
      
      const savedBillingCycle = sessionStorage.getItem("billingCycle");
      if (savedBillingCycle === "annual") {
        setBillingCycle("annual");
      }
    }
    
    const professional = GENERAL_PLANS.find(p => p.id === "professional");
    return professional || GENERAL_PLANS[0];
  });

  const isAnnual = billingCycle === "annual";
  const basePrice = isAnnual ? calculateAnnualPrice(selectedPlan.price) : selectedPlan.price;
  const subtotal = basePrice;
  const tax = subtotal * TAX_RATE;
  const total = calculateTotal(subtotal);
  const monthlySavings = isAnnual ? selectedPlan.price * 12 - basePrice : 0;

  const handleStripeCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with payment",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setProcessing(true);

    try {
      // Create Stripe Checkout Session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
          userEmail: user.email,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  return (
    <>
      <SEO 
        title="Secure Payment - Canna Blaze 360"
        description="Complete your subscription payment securely with Stripe"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/plans">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-gray-600 dark:text-gray-400">Secure checkout powered by Stripe</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Payment Options */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    Secure Payment
                  </CardTitle>
                  <CardDescription>
                    All transactions are encrypted and secure via Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Billing Cycle Toggle */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Select Billing Cycle</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          billingCycle === "monthly"
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"
                            : "border-gray-200 dark:border-gray-800 hover:border-emerald-300"
                        }`}
                      >
                        <div className="font-semibold mb-1">Monthly</div>
                        <div className="text-2xl font-bold mb-1">${selectedPlan.price}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                      </button>
                      
                      <button
                        onClick={() => setBillingCycle("annual")}
                        className={`p-4 border-2 rounded-lg text-left transition-all relative ${
                          billingCycle === "annual"
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"
                            : "border-gray-200 dark:border-gray-800 hover:border-emerald-300"
                        }`}
                      >
                        <Badge className="absolute top-2 right-2 bg-emerald-600">
                          Save 20%
                        </Badge>
                        <div className="font-semibold mb-1">Annual</div>
                        <div className="text-2xl font-bold mb-1">
                          ${Math.round(calculateAnnualPrice(selectedPlan.price) / 12)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                      </button>
                    </div>
                  </div>

                  {/* Stripe Checkout Button */}
                  <div className="space-y-4">
                    <Button 
                      onClick={handleStripeCheckout}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 h-14 text-lg"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Pay ${total.toFixed(2)} with Stripe
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>14-day free trial • Cancel anytime • Powered by Stripe</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-400">256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-5 h-5 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-400">PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-400">Verified by Stripe</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{selectedPlan.name} Plan</span>
                      {selectedPlan.popular && (
                        <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Billed {billingCycle}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    {isAnnual && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Annual savings</span>
                        <span className="font-medium">-${monthlySavings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">${total.toFixed(2)}</span>
                  </div>

                  {isAnnual && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      ${Math.round(total / 12)}/month when billed annually
                    </div>
                  )}

                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">What's Included:</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {selectedPlan.features.filter(f => f.included).slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy. 
                    Your subscription will automatically renew unless cancelled.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}