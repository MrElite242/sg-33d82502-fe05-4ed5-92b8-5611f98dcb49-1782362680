import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Check } from "lucide-react";
import { CannabisLeaf } from "@/components/CannabisLeaf";

const plans = [
  {
    id: "quarterly",
    name: "Quarterly",
    price: "$499",
    period: "/3 months",
    description: "Perfect for small operations",
    features: ["All core features", "Email support", "Basic analytics"],
  },
  {
    id: "semi-annually",
    name: "Semi-Annual",
    price: "$899",
    period: "/6 months",
    description: "Best value for growing businesses",
    badge: "Popular",
    features: ["All core features", "Priority support", "Advanced analytics", "10% savings"],
  },
  {
    id: "annually",
    name: "Annual",
    price: "$1,599",
    period: "/year",
    description: "Maximum savings for established operations",
    badge: "Best Value",
    features: ["All core features", "24/7 priority support", "Advanced analytics", "Custom integrations", "20% savings"],
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    licenseType: "semi-annually" as "quarterly" | "semi-annually" | "annually",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const success = await signup({
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        licenseType: formData.licenseType,
      });

      if (success) {
        router.push("/dashboard");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign Up - Cannabis Tracking System"
        description="Create your cannabis seed-to-sale tracking account"
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 py-12 px-4 relative">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <CannabisLeaf className="absolute top-20 left-10 text-emerald-500/5 dark:text-emerald-400/3" size={350} style={{ transform: "rotate(-15deg)" }} />
          <CannabisLeaf className="absolute top-1/4 right-20 text-emerald-500/5 dark:text-emerald-400/3" size={280} style={{ transform: "rotate(25deg)" }} />
          <CannabisLeaf className="absolute bottom-40 left-1/4 text-emerald-500/5 dark:text-emerald-400/3" size={300} style={{ transform: "rotate(45deg)" }} />
          <CannabisLeaf className="absolute bottom-10 right-10 text-emerald-500/5 dark:text-emerald-400/3" size={250} style={{ transform: "rotate(-30deg)" }} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-600 p-3 rounded-full">
                <CannabisLeaf className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600">Choose a plan and get started today</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Fill in your details and select a license plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Your Company LLC"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vendor@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Select License Plan</Label>
                  <RadioGroup
                    value={formData.licenseType}
                    onValueChange={(value) => setFormData({ ...formData, licenseType: value as any })}
                  >
                    <div className="grid gap-4">
                      {plans.map((plan) => (
                        <div key={plan.id} className="relative">
                          <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={plan.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-lg">{plan.name}</span>
                                {plan.badge && (
                                  <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {plan.features.map((feature) => (
                                  <span key={feature} className="flex items-center gap-1 text-xs text-gray-600">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 md:mt-0 md:ml-4 text-right">
                              <div className="text-2xl font-bold text-emerald-600">{plan.price}</div>
                              <div className="text-sm text-gray-600">{plan.period}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account & Start Trial"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}