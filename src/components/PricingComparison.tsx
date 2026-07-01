import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, X, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";

type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"];

interface PricingComparisonProps {
  planType?: "general" | "doctor";
  onSelectPlan?: (planId: string, billingCycle: "monthly" | "annual") => void;
}

export function PricingComparison({ planType = "general", onSelectPlan }: PricingComparisonProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [planType]);

  async function fetchPlans() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("plan_type", planType)
        .eq("active", true)
        .order("price_monthly", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  }

  const calculateSavings = (monthly: number, annual: number) => {
    const annualIfMonthly = monthly * 12;
    const savings = annualIfMonthly - annual;
    const percentage = Math.round((savings / annualIfMonthly) * 100);
    return { amount: savings, percentage };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-48 bg-gray-200 dark:bg-gray-800" />
              <CardContent className="h-64 bg-gray-100 dark:bg-gray-900" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Label htmlFor="billing-toggle" className="text-lg font-medium">
          Monthly
        </Label>
        <div className="relative">
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-emerald-600"
          />
        </div>
        <Label htmlFor="billing-toggle" className="text-lg font-medium flex items-center gap-2">
          Annual
          <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
            <Zap className="w-3 h-3 mr-1" />
            Save up to 20%
          </Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const price = isAnnual ? plan.price_annual : plan.price_monthly;
          const displayPrice = isAnnual ? (plan.price_annual / 12).toFixed(2) : price.toFixed(2);
          const savings = calculateSavings(plan.price_monthly, plan.price_annual);
          const features = Array.isArray(plan.features) ? plan.features : [];

          return (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-xl ${
                plan.popular
                  ? "border-emerald-500 dark:border-emerald-400 shadow-2xl scale-105"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base min-h-12">
                  {plan.description}
                </CardDescription>

                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">${displayPrice}</span>
                    <span className="text-gray-600 dark:text-gray-400">/mo</span>
                  </div>
                  {isAnnual && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        ${plan.price_annual.toFixed(2)} billed annually
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Save ${savings.amount.toFixed(2)} ({savings.percentage}%)
                      </p>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  className={`w-full mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => onSelectPlan?.(plan.plan_id, isAnnual ? "annual" : "monthly")}
                >
                  Start Free Trial
                </Button>

                <ul className="space-y-3">
                  {features.map((feature: any, idx: number) => {
                    const featureName = typeof feature === "string" ? feature : feature.name;
                    const included = typeof feature === "string" ? true : feature.included;

                    return (
                      <li key={idx} className="flex items-start gap-2">
                        {included ? (
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={included ? "" : "text-gray-400 dark:text-gray-600 line-through"}>
                          {featureName}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Plan Limits */}
                {(plan.max_users || plan.max_locations || plan.storage_gb) && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Plan Limits
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {plan.max_users && (
                        <li>• {plan.max_users} {plan.max_users === 1 ? "user" : "users"}</li>
                      )}
                      {plan.max_locations && (
                        <li>• {plan.max_locations} {plan.max_locations === 1 ? "location" : "locations"}</li>
                      )}
                      {plan.storage_gb && (
                        <li>• {plan.storage_gb}GB storage</li>
                      )}
                      {!plan.max_users && !plan.max_locations && !plan.storage_gb && (
                        <li>• Unlimited</li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}