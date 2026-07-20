import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Settings, 
  Zap, 
  ThermometerSun,
  Sprout,
  Factory,
  FlaskConical,
  Truck,
  Store,
  Leaf,
  User,
  AlertCircle,
  LogOut,
  FileText,
  CheckCircle
} from "lucide-react";
import { CannabisLeaf } from "@/components/CannabisLeaf";

interface DashboardStats {
  activePlants: number;
  batchesInProduction: number;
  pendingTests: number;
  activeDeliveries: number;
  dailySales: number;
  complianceStatus: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const { toast } = useToast();
  const isAuthenticated = !!user;
  const [stats, setStats] = useState<DashboardStats>({
    activePlants: 0,
    batchesInProduction: 0,
    pendingTests: 0,
    activeDeliveries: 0,
    dailySales: 0,
    complianceStatus: "compliant"
  });

  // Humidity alert state for Caribbean/Tropics region
  const [humidityAlert, setHumidityAlert] = useState({
    show: false,
    level: 0,
    severity: "normal" as "normal" | "warning" | "critical"
  });

  // Detect if user is in Caribbean/Tropics region (could come from profile settings)
  const userRegion = "caribbean-tropics"; // In production, get from user profile
  const isCaribbean = userRegion === "caribbean-tropics";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Simulate humidity monitoring for Caribbean/Tropics region
  useEffect(() => {
    if (isCaribbean) {
      // Simulate real-time humidity reading (in production, get from IoT sensors)
      const simulatedHumidity = 78; // Current humidity percentage
      
      let severity: "normal" | "warning" | "critical" = "normal";
      
      if (simulatedHumidity > 85) {
        severity = "critical";
      } else if (simulatedHumidity > 75) {
        severity = "warning";
      }

      setHumidityAlert({
        show: severity !== "normal",
        level: simulatedHumidity,
        severity
      });

      // Show toast notification for critical humidity
      if (severity === "critical") {
        toast({
          title: "⚠️ Critical Humidity Alert",
          description: `Humidity at ${simulatedHumidity}% - Immediate action required to prevent mold`,
          variant: "destructive",
        });
      }
    }
  }, [isCaribbean, toast]);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardStats");
    if (saved) {
      setStats(JSON.parse(saved));
    } else {
      const demoStats = {
        activePlants: 1247,
        batchesInProduction: 8,
        pendingTests: 3,
        activeDeliveries: 12,
        dailySales: 24500,
        complianceStatus: "compliant"
      };
      setStats(demoStats);
      localStorage.setItem("dashboardStats", JSON.stringify(demoStats));
    }
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>);

  }

  const quickStats = [
  {
    label: "Active Plants",
    value: stats.activePlants.toLocaleString(),
    icon: Sprout,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    label: "Batches in Production",
    value: stats.batchesInProduction.toString(),
    icon: Factory,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    label: "Pending Tests",
    value: stats.pendingTests.toString(),
    icon: FlaskConical,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    label: "Active Deliveries",
    value: stats.activeDeliveries.toString(),
    icon: Truck,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    label: "Daily Sales",
    value: `$${stats.dailySales.toLocaleString()}`,
    icon: Store,
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  }];


  return (
    <>
      <SEO title="Dashboard - Cannabis Tracking System" />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <CannabisLeaf className="absolute top-20 left-10 text-emerald-600/5 rotate-12" size={300} />
          <CannabisLeaf className="absolute top-1/3 right-20 text-green-600/3 -rotate-45" size={400} />
          <CannabisLeaf className="absolute bottom-40 left-1/4 text-emerald-700/4 rotate-90" size={250} />
          <CannabisLeaf className="absolute bottom-20 right-10 text-green-500/5 -rotate-12" size={350} />
        </div>

        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-2 rounded-lg shadow-lg">
                <CannabisLeaf className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold">Canna 360 Track</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{user.full_name || user.email}</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 capitalize">
                  {user.user_role || "User"}
                </Badge>
              </div>
              <Link href="/account">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Account
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || "User"}</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your operations today</p>
          </div>

          {/* Compliance Status Banner */}
          <Card className={`mb-8 border-2 ${stats.complianceStatus === "compliant" ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                {stats.complianceStatus === "compliant" ?
                <CheckCircle className="w-6 h-6 text-green-600" /> :

                <AlertCircle className="w-6 h-6 text-yellow-600" />
                }
                <div>
                  <h3 className="font-semibold">
                    {stats.complianceStatus === "compliant" ? "All Systems Compliant" : "Action Required"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stats.complianceStatus === "compliant" ?
                    "All operations meeting regulatory requirements" :
                    "3 items need attention"}
                  </p>
                </div>
              </div>
              <Button variant="outline">View Details</Button>
            </CardContent>
          </Card>

          {/* Caribbean/Tropics Humidity Alert */}
          {isCaribbean && humidityAlert.show && (
            <Card className={`mb-6 border-2 ${
              humidityAlert.severity === "critical" 
                ? "bg-red-50 border-red-500 dark:bg-red-950/30 dark:border-red-600" 
                : "bg-amber-50 border-amber-500 dark:bg-amber-950/30 dark:border-amber-600"
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      humidityAlert.severity === "critical" 
                        ? "bg-red-100 dark:bg-red-900" 
                        : "bg-amber-100 dark:bg-amber-900"
                    }`}>
                      <AlertTriangle className={`w-6 h-6 ${
                        humidityAlert.severity === "critical" 
                          ? "text-red-600" 
                          : "text-amber-600"
                        }`} />
                    </div>
                    <div>
                      <CardTitle className={`flex items-center gap-2 ${
                        humidityAlert.severity === "critical" 
                          ? "text-red-900 dark:text-red-100" 
                          : "text-amber-900 dark:text-amber-100"
                        }`}>
                        {humidityAlert.severity === "critical" ? "Critical" : "Warning"} - High Humidity Detected
                        <Badge className={
                          humidityAlert.severity === "critical" 
                            ? "bg-red-600 text-white" 
                            : "bg-amber-600 text-white"
                        }>
                          Caribbean / Tropics Region
                        </Badge>
                      </CardTitle>
                      <CardDescription className={
                        humidityAlert.severity === "critical" 
                          ? "text-red-700 dark:text-red-300" 
                          : "text-amber-700 dark:text-amber-300"
                        }>
                        Current humidity: <strong>{humidityAlert.level}%</strong> - 
                        {humidityAlert.severity === "critical" 
                          ? " Immediate action required to prevent mold and mildew" 
                          : " Monitor closely to prevent mold risk"}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Humidity Level Gauge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Humidity Level</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Safe: ≤65%</span>
                        <span className="text-xs text-amber-600">Warning: 65-75%</span>
                        <span className="text-xs text-red-600">Critical: &gt;75%</span>
                      </div>
                    </div>
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                          humidityAlert.level > 75 
                            ? "bg-gradient-to-r from-red-500 to-red-600" 
                            : humidityAlert.level > 65 
                            ? "bg-gradient-to-r from-amber-500 to-amber-600" 
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${Math.min(humidityAlert.level, 100)}%` }}
                      />
                      {/* Safe zone marker */}
                      <div className="absolute top-0 left-[65%] w-0.5 h-full bg-white/50"></div>
                      <div className="absolute top-0 left-[75%] w-0.5 h-full bg-white/50"></div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4 text-blue-600" />
                        Immediate Actions
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Increase ventilation and air circulation</li>
                        <li>• Run dehumidifiers continuously</li>
                        <li>• Reduce plant density in grow rooms</li>
                        <li>• Monitor for mold signs on leaves</li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                        Long-term Solutions
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Install industrial dehumidification system</li>
                        <li>• Upgrade HVAC with humidity control</li>
                        <li>• Consider climate-controlled greenhouses</li>
                        <li>• Schedule preventive maintenance</li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Activate Emergency Protocols
                    </Button>
                    <Button variant="outline">
                      View Equipment Options
                    </Button>
                    <Button variant="ghost">
                      Dismiss for 1 Hour
                    </Button>
                  </div>

                  {/* Regional Context */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      <strong>Caribbean / Tropics Region Alert:</strong> Your region experiences naturally high humidity (65-90%). 
                      Maintaining proper environmental controls is critical for successful cultivation. Consider strain selection 
                      optimized for tropical climates with natural mold resistance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="relative overflow-hidden group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <CannabisLeaf className="text-emerald-600" size={60} />
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>);

            })}
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cultivation">Cultivation</TabsTrigger>
              <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="retail">Retail</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Access Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/inventory">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Inventory</div>
                            <div className="text-xs text-gray-500">Stock & Batches</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/cultivation">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <Sprout className="w-4 h-4 text-green-600" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Cultivation</div>
                            <div className="text-xs text-gray-500">Plant Tracking</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/manufacturing">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <Factory className="w-4 h-4 text-purple-600" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Manufacturing</div>
                            <div className="text-xs text-gray-500">Production</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/retail">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <Store className="w-4 h-4 text-pink-600" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Retail POS</div>
                            <div className="text-xs text-gray-500">Point of Sale</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/analytics">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Analytics</div>
                            <div className="text-xs text-gray-500">Insights & Reports</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/staff">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <User className="w-4 h-4 text-indigo-600" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Staff</div>
                            <div className="text-xs text-gray-500">Team Management</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/activity-log">
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <AlertCircle className="w-4 h-4 text-slate-600" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Activity Log</div>
                            <div className="text-xs text-gray-500">Audit Trail</div>
                          </div>
                        </Button>
                      </Link>
                    </div>

                    {user?.user_role === "doctor" && (
                      <Link href="/prescriptions">
                        <Card className="cursor-pointer hover:shadow-lg transition-all border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600">
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div className="font-semibold text-sm text-blue-700">Prescriptions</div>
                          </CardContent>
                        </Card>
                      </Link>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Batch #1247 moved to flowering</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Lab results received for Batch #1243</p>
                          <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Delivery #89 completed</p>
                          <p className="text-xs text-gray-500">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Harvest Batch #1238</p>
                          <p className="text-xs text-gray-500">Due today</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <FlaskConical className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Submit samples for testing</p>
                          <p className="text-xs text-gray-500">Due tomorrow</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Schedule deliveries</p>
                          <p className="text-xs text-gray-500">Due in 2 days</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">3 items running low on stock</p>
                          <p className="text-xs text-gray-500">Consider reordering</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pb-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Total inventory value: $147,250</p>
                          <p className="text-xs text-gray-500">Across 6 SKUs</p>
                        </div>
                      </div>
                    </div>
                    <Link href="/inventory">
                      <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                        View Full Inventory
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cultivation">
              <Card>
                <CardHeader>
                  <CardTitle>Cultivation Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage your cultivation operations from this panel.</p>
                  <Link href="/cultivation">
                    <Button className="gap-2">
                      <Sprout className="w-4 h-4" />
                      Go to Cultivation Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manufacturing">
              <Card>
                <CardHeader>
                  <CardTitle>Manufacturing Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track extraction and product manufacturing processes.</p>
                  <Link href="/manufacturing">
                    <Button className="gap-2">
                      <Factory className="w-4 h-4" />
                      Go to Manufacturing Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing">
              <Card>
                <CardHeader>
                  <CardTitle>Testing Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">View lab results and compliance testing status.</p>
                  <Link href="/testing">
                    <Button className="gap-2">
                      <FlaskConical className="w-4 h-4" />
                      Go to Testing Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transport">
              <Card>
                <CardHeader>
                  <CardTitle>Transport Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage deliveries and transport manifests.</p>
                  <Link href="/transport">
                    <Button className="gap-2">
                      <Truck className="w-4 h-4" />
                      Go to Transport Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="retail">
              <Card>
                <CardHeader>
                  <CardTitle>Retail Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Access point of sale and retail inventory management.</p>
                  <Link href="/retail">
                    <Button className="gap-2">
                      <Store className="w-4 h-4" />
                      Go to Retail Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accounting">
              <Card>
                <CardHeader>
                  <CardTitle>Accounting Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Configure QuickBooks and other accounting integrations.</p>
                  <Link href="/accounting">
                    <Button className="gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Go to Accounting Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>);

}