import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { Loader2, AlertCircle, CheckCircle2, User, Building2, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const roleParam = router.query.role as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    role: roleParam || "business",
    // Patient fields
    phone: "",
    address: "",
    date_of_birth: "",
    // Pharmacy fields
    pharmacy_name: "",
    pharmacy_license: "",
    pharmacy_address: "",
    pharmacy_phone: "",
    // Business fields
    company_name: "",
    company_license: "",
    company_type: "",
    company_address: "",
    company_phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const profileData: any = {
        full_name: formData.full_name,
        email: formData.email,
        user_role: formData.role
      };

      // Add role-specific fields
      if (formData.role === "patient") {
        profileData.phone = formData.phone;
        profileData.address = formData.address;
        profileData.date_of_birth = formData.date_of_birth;
      } else if (formData.role === "pharmacy") {
        profileData.pharmacy_name = formData.pharmacy_name;
        profileData.pharmacy_license = formData.pharmacy_license;
        profileData.pharmacy_address = formData.pharmacy_address;
        profileData.pharmacy_phone = formData.pharmacy_phone;
      } else if (formData.role === "business") {
        profileData.company_name = formData.company_name;
        profileData.company_license = formData.company_license;
        profileData.company_type = formData.company_type;
        profileData.company_address = formData.company_address;
        profileData.company_phone = formData.company_phone;
      }

      const { error: signUpError } = await signUp(formData.email, formData.password, profileData);
      
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign Up - Blaze 360"
        description="Create your Blaze 360 account"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex items-center justify-center p-4">
        {/* Background Watermark */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.02]">
          <CannabisLeaf className="absolute top-10 right-10 text-emerald-600 -rotate-12" size={200} />
          <CannabisLeaf className="absolute bottom-20 left-20 text-green-600 rotate-45" size={250} />
        </div>

        <Card className="w-full max-w-2xl relative z-10">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-3 rounded-xl shadow-lg">
                <CannabisLeaf className="w-8 h-8 text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Blaze 360
              </h1>
            </div>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              {formData.role === "business" && "Register your cannabis business for seed-to-sale tracking"}
              {formData.role === "patient" && "Sign up as a patient to track your prescriptions"}
              {formData.role === "pharmacy" && "Register your pharmacy to manage prescriptions"}
              {formData.role === "doctor" && "Doctors should use the professional registration"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Account created successfully! Please check your email to verify your account. Redirecting to login...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        Cannabis Business
                      </div>
                    </SelectItem>
                    <SelectItem value="patient">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Patient
                      </div>
                    </SelectItem>
                    <SelectItem value="pharmacy">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Pharmacy
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.role === "doctor" && (
                  <p className="text-sm text-amber-600">
                    Doctors should use the <Link href="/doctor-signup" className="underline font-semibold">professional registration</Link>
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    {formData.role === "pharmacy" ? "Contact Name" : 
                     formData.role === "business" ? "Contact Name" : "Full Name"}
                  </Label>
                  <Input
                    id="full_name"
                    placeholder={formData.role === "pharmacy" || formData.role === "business" ? "Primary contact" : "John Doe"}
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

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
              </div>

              {/* Business Fields */}
              {formData.role === "business" && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        placeholder="Green Valley Cannabis Co."
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company_license">License Number</Label>
                      <Input
                        id="company_license"
                        placeholder="CO-CAN-12345"
                        value={formData.company_license}
                        onChange={(e) => setFormData({ ...formData, company_license: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_type">Business Type</Label>
                    <Select value={formData.company_type} onValueChange={(v) => setFormData({ ...formData, company_type: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cultivation">Cultivation</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="testing">Testing Laboratory</SelectItem>
                        <SelectItem value="retail">Retail Dispensary</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="vertically-integrated">Vertically Integrated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_address">Business Address</Label>
                    <Input
                      id="company_address"
                      placeholder="456 Cannabis Way, Denver, CO 80202"
                      value={formData.company_address}
                      onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Business Phone</Label>
                    <Input
                      id="company_phone"
                      type="tel"
                      placeholder="(303) 555-0100"
                      value={formData.company_phone}
                      onChange={(e) => setFormData({ ...formData, company_phone: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* Patient Fields */}
              {formData.role === "patient" && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, State ZIP"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* Pharmacy Fields */}
              {formData.role === "pharmacy" && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pharmacy_name">Pharmacy Name</Label>
                      <Input
                        id="pharmacy_name"
                        placeholder="Green Valley Pharmacy"
                        value={formData.pharmacy_name}
                        onChange={(e) => setFormData({ ...formData, pharmacy_name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pharmacy_license">License Number</Label>
                      <Input
                        id="pharmacy_license"
                        placeholder="CO-PH-12345"
                        value={formData.pharmacy_license}
                        onChange={(e) => setFormData({ ...formData, pharmacy_license: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pharmacy_address">Pharmacy Address</Label>
                    <Input
                      id="pharmacy_address"
                      placeholder="456 Dispensary Ave, Denver, CO 80202"
                      value={formData.pharmacy_address}
                      onChange={(e) => setFormData({ ...formData, pharmacy_address: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pharmacy_phone">Pharmacy Phone</Label>
                    <Input
                      id="pharmacy_phone"
                      type="tel"
                      placeholder="(303) 555-0100"
                      value={formData.pharmacy_phone}
                      onChange={(e) => setFormData({ ...formData, pharmacy_phone: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-600">Minimum 6 characters</p>
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
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
              <Link href="/login" className="text-emerald-600 hover:underline font-semibold">
                Sign In
              </Link>
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