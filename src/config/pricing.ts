export interface PricingTier {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  popular?: boolean;
  features: Array<{
    name: string;
    included: boolean;
  }>;
}

export const GENERAL_PLANS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    interval: "month",
    description: "Perfect for small operations just getting started",
    popular: false,
    features: [
      { name: "Up to 50 plants", included: true },
      { name: "Basic cultivation tracking", included: true },
      { name: "Simple batch management", included: true },
      { name: "Retail POS", included: true },
      { name: "Email support", included: true },
      { name: "QuickBooks integration", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Multi-location support", included: false },
      { name: "Priority support", included: false },
    ]
  },
  {
    id: "professional",
    name: "Professional",
    price: 249,
    interval: "month",
    description: "Full-featured platform for growing businesses",
    popular: true,
    features: [
      { name: "Unlimited plants", included: true },
      { name: "Complete tracking modules", included: true },
      { name: "Advanced batch management", included: true },
      { name: "Full retail & manufacturing", included: true },
      { name: "QuickBooks integration", included: true },
      { name: "Advanced analytics & reports", included: true },
      { name: "Up to 3 locations", included: true },
      { name: "Priority email & chat support", included: true },
      { name: "Custom workflows", included: false },
      { name: "Canna Blaze 360™ Intelligence Premium", included: true },
      { name: "  • ROI Calculator™", included: true },
      { name: "  • Business Impact Assessment™", included: true },
      { name: "  • Cultivation Smart Growth Wheel™", included: true },
      { name: "  • Cultivation Efficiency Estimator™", included: true },
      { name: "  • Ecosystem Health Index™ (Standard)", included: true },
      { name: "  • Inventory Accuracy Assessment™", included: true },
      { name: "  • Compliance Readiness Assessment™", included: true },
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 549,
    interval: "month",
    description: "Complete solution for large-scale operations",
    popular: false,
    features: [
      { name: "Unlimited everything", included: true },
      { name: "All modules + custom features", included: true },
      { name: "Multi-state compliance", included: true },
      { name: "Unlimited locations", included: true },
      { name: "All integrations included", included: true },
      { name: "Custom reporting & analytics", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Custom development", included: true },
      { name: "Canna Blaze 360™ Intelligence Premium Pro", included: true },
      { name: "  • Ecosystem Health Index™ Pro", included: true },
      { name: "  • Executive Scorecard", included: true },
      { name: "  • Multi-location benchmarking", included: true },
      { name: "  • Predictive risk alerts", included: true },
      { name: "  • AI-powered operational insights", included: true },
      { name: "  • Executive KPI dashboard", included: true },
      { name: "  • Custom score weighting", included: true },
      { name: "  • Regulatory readiness insights", included: true },
      { name: "  • Board-ready reports", included: true },
    ]
  }
];

export interface DoctorPricingTier {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  popular?: boolean;
  features: string[];
}

export const DOCTOR_PLANS: DoctorPricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 149,
    interval: "month",
    description: "Essential tools for individual practitioners",
    features: [
      "Up to 50 prescriptions/month",
      "Basic e-prescription system",
      "Email support",
      "Standard pharmacy network",
      "Basic analytics"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    price: 299,
    interval: "month",
    description: "Advanced features for growing practices",
    popular: true,
    features: [
      "Unlimited prescriptions",
      "Full e-prescription suite",
      "Priority support",
      "Extended pharmacy network",
      "Advanced analytics & reporting",
      "Patient portal access",
      "Automatic refill management"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 649,
    interval: "month",
    description: "Complete solution for large practices",
    features: [
      "Everything in Professional",
      "Multi-provider support",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "White-label option",
      "API access"
    ]
  }
];

export const ANNUAL_DISCOUNT = 0.20;

export const TAX_RATE = 0.15;

export function getPlanById(planId: string, planType: "general" | "doctor" = "general"): PricingTier | DoctorPricingTier | null {
  const plans = planType === "doctor" ? DOCTOR_PLANS : GENERAL_PLANS;
  return plans.find(plan => plan.id === planId) || null;
}

export function calculateAnnualPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT));
}

export function calculateTotal(price: number, includeTax: boolean = true): number {
  return includeTax ? price * (1 + TAX_RATE) : price;
}