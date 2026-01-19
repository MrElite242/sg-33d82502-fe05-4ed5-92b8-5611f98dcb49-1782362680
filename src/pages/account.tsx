import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { User, Building2, Calendar, CreditCard, LogOut, ArrowLeft } from "lucide-react";
import { CannabisLeaf } from "@/components/CannabisLeaf";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }

    if (user?.licenseEndDate) {
      const endDate = new Date(user.licenseEndDate);
      const today = new Date();
      const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setDaysRemaining(diff);
    }
  }, [user, isAuthenticated, loading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLicenseTypeDisplay = (type: string | null) => {
    if (!type) return "N/A";
    return type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <>
      <SEO 
        title="Account Settings - Cannabis Tracking System"
        description="Manage your account and subscription"
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 relative">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <CannabisLeaf className="absolute top-24 left-16 text-emerald-500/5 dark:text-emerald-400/3" size={300} style={{ transform: "rotate(-20deg)" }} />
          <CannabisLeaf className="absolute top-1/3 right-20 text-emerald-500/5 dark:text-emerald-400/3" size={260} style={{ transform: "rotate(35deg)" }} />
          <CannabisLeaf className="absolute bottom-32 left-1/4 text-emerald-500/5 dark:text-emerald-400/3" size={220} style={{ transform: "rotate(50deg)" }} />
          <CannabisLeaf className="absolute bottom-20 right-12 text-emerald-500/5 dark:text-emerald-400/3" size={280} style={{ transform: "rotate(-15deg)" }} />
        </div>

        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <CannabisLeaf className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">Cannabis Track</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          <div className="space-y-6">
            {/* Account Information */}
            <Card className="relative overflow-hidden group">
              <CannabisLeaf className="absolute top-4 right-4 text-emerald-500/0 group-hover:text-emerald-500/5 transition-all duration-300" size={80} style={{ transform: "rotate(15deg)" }} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Your profile and company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company Name</label>
                    <p className="text-lg flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {user.companyName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Role</label>
                    <div className="text-lg">
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Status</label>
                    <div className="text-lg">
                      <Badge 
                        variant={user.status === "active" ? "default" : "destructive"}
                        className={user.status === "active" ? "bg-emerald-600" : ""}
                      >
                        {user.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card className="relative overflow-hidden group">
              <CannabisLeaf className="absolute top-4 right-4 text-emerald-500/0 group-hover:text-emerald-500/5 transition-all duration-300" size={80} style={{ transform: "rotate(-10deg)" }} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Details
                </CardTitle>
                <CardDescription>Your current license and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">License Type</label>
                    <p className="text-lg font-semibold text-emerald-600">
                      {getLicenseTypeDisplay(user.licenseType)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Days Remaining</label>
                    <p className="text-lg font-semibold">
                      {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      License Start Date
                    </label>
                    <p className="text-lg">{formatDate(user.licenseStartDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      License End Date
                    </label>
                    <p className="text-lg">{formatDate(user.licenseEndDate)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/plans" className="flex-1">
                    <Button variant="outline" className="w-full">
                      View All Plans
                    </Button>
                  </Link>
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your payment history and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white/50">
                    <div>
                      <p className="font-medium">{getLicenseTypeDisplay(user.licenseType)} License</p>
                      <p className="text-sm text-gray-600">{formatDate(user.licenseStartDate)}</p>
                    </div>
                    <Badge className="bg-emerald-600">Paid</Badge>
                  </div>
                  <p className="text-sm text-gray-600 text-center py-4">
                    More invoices will appear here as you continue your subscription
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                >
                  Cancel Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}