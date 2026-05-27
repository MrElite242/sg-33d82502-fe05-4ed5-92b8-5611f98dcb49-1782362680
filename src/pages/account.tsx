import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Building2, FileText, Loader2, CheckCircle2, LogOut, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    practice_name: "",
    practice_address: "",
    practice_phone: "",
    pharmacy_name: "",
    pharmacy_address: "",
    pharmacy_phone: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        address: user.address || "",
        practice_name: user.practice_name || "",
        practice_address: user.practice_address || "",
        practice_phone: user.practice_phone || "",
        pharmacy_name: user.pharmacy_name || "",
        pharmacy_address: user.pharmacy_address || "",
        pharmacy_phone: user.pharmacy_phone || ""
      });
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await updateProfile(formData);

    if (!error) {
      setSuccess(true);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Account Settings - Blaze 360"
        description="Manage your account settings"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Blaze 360
              </h1>
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="capitalize">
                {user.user_role === "doctor" && <Stethoscope className="w-3 h-3 mr-1" />}
                {user.user_role === "pharmacy" && <Building2 className="w-3 h-3 mr-1" />}
                {user.user_role === "patient" && <User className="w-3 h-3 mr-1" />}
                {user.user_role}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your profile information</p>
          </div>

          {success && (
            <Alert className="mb-6 bg-green-50 text-green-900 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          value={user.email}
                          disabled
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Patient Fields */}
                  {user.user_role === "patient" && (
                    <>
                      <Separator />
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              disabled={loading}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input value={user.date_of_birth || "Not set"} disabled />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            disabled={loading}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Doctor Fields */}
                  {user.user_role === "doctor" && (
                    <>
                      <Separator />
                      <h3 className="text-lg font-semibold">Practice Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="practice_name">Practice Name</Label>
                          <Input
                            id="practice_name"
                            value={formData.practice_name}
                            onChange={(e) => setFormData({ ...formData, practice_name: e.target.value })}
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="practice_phone">Practice Phone</Label>
                          <Input
                            id="practice_phone"
                            value={formData.practice_phone}
                            onChange={(e) => setFormData({ ...formData, practice_phone: e.target.value })}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="practice_address">Practice Address</Label>
                        <Input
                          id="practice_address"
                          value={formData.practice_address}
                          onChange={(e) => setFormData({ ...formData, practice_address: e.target.value })}
                          disabled={loading}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Medical License</Label>
                          <Input value={user.medical_license || "Not set"} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>NPI Number</Label>
                          <Input value={user.npi_number || "Not set"} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>DEA Number</Label>
                          <Input value={user.dea_number || "Not set"} disabled />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Pharmacy Fields */}
                  {user.user_role === "pharmacy" && (
                    <>
                      <Separator />
                      <h3 className="text-lg font-semibold">Pharmacy Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pharmacy_name">Pharmacy Name</Label>
                          <Input
                            id="pharmacy_name"
                            value={formData.pharmacy_name}
                            onChange={(e) => setFormData({ ...formData, pharmacy_name: e.target.value })}
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>License Number</Label>
                          <Input value={user.pharmacy_license || "Not set"} disabled />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pharmacy_address">Pharmacy Address</Label>
                        <Input
                          id="pharmacy_address"
                          value={formData.pharmacy_address}
                          onChange={(e) => setFormData({ ...formData, pharmacy_address: e.target.value })}
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pharmacy_phone">Pharmacy Phone</Label>
                        <Input
                          id="pharmacy_phone"
                          value={formData.pharmacy_phone}
                          onChange={(e) => setFormData({ ...formData, pharmacy_phone: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Link href={
                      user.user_role === "doctor" ? "/prescriptions" :
                      user.user_role === "pharmacy" ? "/pharmacy-dashboard" :
                      "/patient-dashboard"
                    }>
                      <Button variant="outline">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}