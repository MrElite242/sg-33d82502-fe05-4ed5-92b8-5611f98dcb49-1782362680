import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, X, Sparkles, Zap } from "lucide-react";
import { GENERAL_PLANS, DOCTOR_PLANS, calculateAnnualPrice } from "@/config/pricing";

interface PricingComparisonProps {
  planType?: "general" | "doctor";
  onSelectPlan?: (planId: string, billingCycle: "monthly" | "annual") => void;
}

export function PricingComparison({ planType = "general", onSelectPlan }: PricingComparisonProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = planType === "general" ? GENERAL_PLANS : DOCTOR_PLANS;

  const calculateSavings = (monthlyPrice: number) => {
    const annualPrice = calculateAnnualPrice(monthlyPrice);
    const annualIfMonthly = monthlyPrice * 12;
    const savings = annualIfMonthly - annualPrice;
    const percentage = Math.round((savings / annualIfMonthly) * 100);
    return { amount: savings, percentage, annualPrice };
  };

  if (plans.length === 0) {
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
            Save 20%
          </Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const savings = calculateSavings(plan.price);
          const displayPrice = isAnnual ? (savings.annualPrice / 12).toFixed(0) : plan.price;

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
                        ${savings.annualPrice.toFixed(0)} billed annually
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Save ${savings.amount.toFixed(0)} ({savings.percentage}%)
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
                  onClick={() => onSelectPlan?.(plan.id, isAnnual ? "annual" : "monthly")}
                >
                  Start Free Trial
                </Button>

                <ul className="space-y-3">
                  {planType === "general" && "features" in plan && plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-gray-400 dark:text-gray-600 line-through"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                  {planType === "doctor" && "features" in plan && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}