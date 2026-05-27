import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { Stethoscope, Building2, User, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"doctor" | "pharmacy" | "patient">("doctor");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError, user } = await signIn(formData.email, formData.password);
      
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Redirect based on user role
      if (user?.user_role === "doctor") {
        router.push("/prescriptions");
      } else if (user?.user_role === "pharmacy") {
        router.push("/pharmacy-dashboard");
      } else if (user?.user_role === "patient") {
        router.push("/patient-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
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
            <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="doctor" className="gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  Doctor
                </TabsTrigger>
                <TabsTrigger value="pharmacy" className="gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Pharmacy
                </TabsTrigger>
                <TabsTrigger value="patient" className="gap-1.5">
                  <User className="w-4 h-4" />
                  Patient
                </TabsTrigger>
              </TabsList>
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