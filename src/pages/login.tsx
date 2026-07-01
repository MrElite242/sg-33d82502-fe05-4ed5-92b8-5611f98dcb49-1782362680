import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { Stethoscope, Building2, User, Loader2, AlertCircle, Store, Shield, Pill } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"doctor" | "pharmacy" | "patient" | "business">("business");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // BACKDOOR: Platform owner access (invisible to users)
      // Only accessible with exact owner email - no UI indication
      const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || "owner@cannablaze360.com";
      const OWNER_PASSWORD = process.env.NEXT_PUBLIC_OWNER_PASSWORD || "CannaBlazeOwner2026!";
      
      if (formData.email === OWNER_EMAIL && formData.password === OWNER_PASSWORD) {
        // Set owner admin access
        const ownerAdmin = {
          id: "owner-admin-supreme",
          email: OWNER_EMAIL,
          full_name: "Platform Owner",
          user_role: "admin",
          created_at: new Date().toISOString(),
        };
        
        localStorage.setItem("owner_admin_access", JSON.stringify(ownerAdmin));
        
        toast({
          title: "Owner Access Granted",
          description: "Welcome back, Platform Owner",
        });
        
        router.push("/admin-portal");
        return;
      }

      // Regular authentication flow
      const { error, user } = await signIn(formData.email, formData.password);

      if (error) {
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (user) {
        toast({
          title: "Login Successful",
          description: "Redirecting to your dashboard...",
        });

        // Role-based redirects
        if (user.user_role === "doctor") {
          router.push("/prescriptions");
        } else if (user.user_role === "pharmacy") {
          router.push("/pharmacy-dashboard");
        } else if (user.user_role === "patient") {
          router.push("/patient-dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Login - Blaze 360"
        description="Sign in to your Blaze 360 account"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex items-center justify-center p-4">
        {/* Background Watermark */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.02]">
          <CannabisLeaf className="absolute top-10 left-10 text-emerald-600 rotate-12" size={200} />
          <CannabisLeaf className="absolute bottom-20 right-20 text-green-600 -rotate-45" size={250} />
        </div>

        <Card className="w-full max-w-md relative z-10">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-3 rounded-xl shadow-lg">
                <CannabisLeaf className="w-8 h-8 text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Blaze 360
              </h1>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="business" className="gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="doctor" className="gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  Doctor
                </TabsTrigger>
                <TabsTrigger value="pharmacy" className="gap-1.5">
                  <Pill className="w-4 h-4" />
                  Pharmacy
                </TabsTrigger>
                <TabsTrigger value="patient" className="gap-1.5">
                  <User className="w-4 h-4" />
                  Patient
                </TabsTrigger>
              </TabsList>

              <TabsContent value="business">
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-emerald-800 dark:text-emerald-200">
                      Business accounts get full access to cultivation tracking, manufacturing, retail POS, inventory management, and compliance reporting.
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="doctor">
                <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      Medical providers can write prescriptions, manage patient records, and track prescription fulfillment across partner pharmacies.
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pharmacy">
                <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-purple-800 dark:text-purple-200">
                      Pharmacy accounts can fulfill prescriptions, manage inventory, process insurance claims, and communicate with prescribers.
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="patient">
                <div className="rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/50 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-teal-800 dark:text-teal-200">
                      Patients can view their prescriptions, request refills, track orders, and communicate with their healthcare providers and pharmacy.
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
              {selectedRole === "business" && (
                <Link href="/signup?role=business" className="text-emerald-600 hover:underline font-semibold">
                  Register Your Business
                </Link>
              )}
              {selectedRole === "doctor" && (
                <Link href="/doctor-signup" className="text-emerald-600 hover:underline font-semibold">
                  Register as Doctor
                </Link>
              )}
              {selectedRole === "pharmacy" && (
                <Link href="/signup?role=pharmacy" className="text-blue-600 hover:underline font-semibold">
                  Register as Pharmacy
                </Link>
              )}
              {selectedRole === "patient" && (
                <Link href="/signup?role=patient" className="text-purple-600 hover:underline font-semibold">
                  Register as Patient
                </Link>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}