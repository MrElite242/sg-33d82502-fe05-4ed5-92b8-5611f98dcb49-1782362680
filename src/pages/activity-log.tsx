import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Search, 
  Download, 
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Leaf,
  Package,
  ShoppingCart,
  Users,
  Settings,
  TrendingUp,
  Truck,
  FlaskConical,
  Factory,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  module: string;
  action: string;
  details: string;
  severity: "info" | "warning" | "critical";
  ipAddress?: string;
}

export default function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadActivityLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterModule, filterSeverity, filterUser, logs]);

  const loadActivityLogs = () => {
    const savedLogs = localStorage.getItem("activityLogs");
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      setLogs(parsedLogs);
    } else {
      // Generate sample activity logs
      const sampleLogs: ActivityLogEntry[] = [
        {
          id: "log-001",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          user: "Emma Thompson",
          userId: "user-001",
          module: "Retail",
          action: "Sale Completed",
          details: "Transaction TXN-1234567890 processed - $127.50 - Payment: Card",
          severity: "info",
          ipAddress: "192.168.1.100"
        },
        {
          id: "log-002",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          user: "David Rodriguez",
          userId: "user-004",
          module: "Inventory",
          action: "Stock Updated",
          details: "Blue Dream Flower (SKU: FLW-001) - Stock reduced from 150g to 146.5g",
          severity: "info",
          ipAddress: "192.168.1.101"
        },
        {
          id: "log-003",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: "Michael Chen",
          userId: "user-002",
          module: "Cultivation",
          action: "Batch Status Changed",
          details: "Batch BATCH-001 moved from Vegetative to Flowering stage",
          severity: "info",
          ipAddress: "192.168.1.102"
        },
        {
          id: "log-004",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          user: "Emma Thompson",
          userId: "user-001",
          module: "Staff",
          action: "User Role Modified",
          details: "Updated permissions for Robert Taylor - Changed role from Budtender to Senior Budtender",
          severity: "warning",
          ipAddress: "192.168.1.100"
        },
        {
          id: "log-005",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          user: "Sarah Johnson",
          userId: "user-003",
          module: "Manufacturing",
          action: "Product Created",
          details: "New product batch created: Live Resin Cartridge - Batch BATCH-002",
          severity: "info",
          ipAddress: "192.168.1.103"
        },
        {
          id: "log-006",
          timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
          user: "James Wilson",
          userId: "user-006",
          module: "Cultivation",
          action: "Environmental Alert",
          details: "Temperature exceeded threshold in Grow Room A: 84°F (Max: 82°F)",
          severity: "warning",
          ipAddress: "192.168.1.104"
        },
        {
          id: "log-007",
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          user: "Lisa Anderson",
          userId: "user-005",
          module: "Retail",
          action: "Sale Completed",
          details: "Transaction TXN-1234567889 processed - $85.00 - Payment: Cash",
          severity: "info",
          ipAddress: "192.168.1.105"
        },
        {
          id: "log-008",
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          user: "Michael Chen",
          userId: "user-002",
          module: "Testing",
          action: "Lab Results Received",
          details: "Sample SAMPLE-001 passed all tests - THC: 24.5%, CBD: 0.8%",
          severity: "info",
          ipAddress: "192.168.1.102"
        },
        {
          id: "log-009",
          timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
          user: "Emma Thompson",
          userId: "user-001",
          module: "Inventory",
          action: "Low Stock Alert",
          details: "CBD Topical (SKU: TOP-001) below minimum threshold - Current: 30 units",
          severity: "warning",
          ipAddress: "192.168.1.100"
        },
        {
          id: "log-010",
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          user: "Robert Taylor",
          userId: "user-008",
          module: "Retail",
          action: "Sale Completed",
          details: "Transaction TXN-1234567888 processed - $195.75 - Payment: Debit",
          severity: "info",
          ipAddress: "192.168.1.106"
        },
        {
          id: "log-011",
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          user: "Maria Garcia",
          userId: "user-007",
          module: "Cultivation",
          action: "Harvest Completed",
          details: "Batch BATCH-001 harvested - Yield: 1,247g dry weight",
          severity: "info",
          ipAddress: "192.168.1.107"
        },
        {
          id: "log-012",
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          user: "Emma Thompson",
          userId: "user-001",
          module: "Staff",
          action: "New User Created",
          details: "Added new staff member: John Doe - Role: Budtender",
          severity: "info",
          ipAddress: "192.168.1.100"
        },
        {
          id: "log-013",
          timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          user: "Sarah Johnson",
          userId: "user-003",
          module: "Transport",
          action: "Delivery Completed",
          details: "Delivery DELIV-001 completed successfully - 15 items delivered",
          severity: "info",
          ipAddress: "192.168.1.103"
        },
        {
          id: "log-014",
          timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
          user: "Michael Chen",
          userId: "user-002",
          module: "Settings",
          action: "System Configuration",
          details: "Updated tax rate from 10% to 12%",
          severity: "warning",
          ipAddress: "192.168.1.102"
        },
        {
          id: "log-015",
          timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
          user: "David Rodriguez",
          userId: "user-004",
          module: "Inventory",
          action: "Product Added",
          details: "New product: Shatter Concentrate (SKU: CONC-002) - Initial stock: 50g",
          severity: "info",
          ipAddress: "192.168.1.101"
        },
        {
          id: "log-016",
          timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
          user: "Emma Thompson",
          userId: "user-001",
          module: "Authentication",
          action: "Failed Login Attempt",
          details: "Multiple failed login attempts detected for user: admin@example.com",
          severity: "critical",
          ipAddress: "203.0.113.42"
        },
        {
          id: "log-017",
          timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
          user: "Lisa Anderson",
          userId: "user-005",
          module: "Retail",
          action: "Void Transaction",
          details: "Transaction TXN-1234567887 voided - Reason: Customer request",
          severity: "warning",
          ipAddress: "192.168.1.105"
        },
        {
          id: "log-018",
          timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
          user: "James Wilson",
          userId: "user-006",
          module: "Cultivation",
          action: "Batch Created",
          details: "New cultivation batch started: BATCH-003 - Strain: Sour Diesel - Count: 50 plants",
          severity: "info",
          ipAddress: "192.168.1.104"
        },
        {
          id: "log-019",
          timestamp: new Date(Date.now() - 1000 * 60 * 840).toISOString(),
          user: "Michael Chen",
          userId: "user-002",
          module: "Analytics",
          action: "Report Generated",
          details: "Monthly revenue report generated for May 2026",
          severity: "info",
          ipAddress: "192.168.1.102"
        },
        {
          id: "log-020",
          timestamp: new Date(Date.now() - 1000 * 60 * 960).toISOString(),
          user: "Emma Thompson",
          userId: "user-001",
          module: "Staff",
          action: "Permission Updated",
          details: "Updated module access for Sarah Johnson - Added Analytics module",
          severity: "info",
          ipAddress: "192.168.1.100"
        }
      ];

      localStorage.setItem("activityLogs", JSON.stringify(sampleLogs));
      setLogs(sampleLogs);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Module filter
    if (filterModule !== "all") {
      filtered = filtered.filter(log => log.module === filterModule);
    }

    // Severity filter
    if (filterSeverity !== "all") {
      filtered = filtered.filter(log => log.severity === filterSeverity);
    }

    // User filter
    if (filterUser !== "all") {
      filtered = filtered.filter(log => log.userId === filterUser);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Cultivation": return <Leaf className="w-4 h-4" />;
      case "Manufacturing": return <Factory className="w-4 h-4" />;
      case "Inventory": return <Package className="w-4 h-4" />;
      case "Retail": return <ShoppingCart className="w-4 h-4" />;
      case "Staff": return <Users className="w-4 h-4" />;
      case "Testing": return <FlaskConical className="w-4 h-4" />;
      case "Transport": return <Truck className="w-4 h-4" />;
      case "Analytics": return <TrendingUp className="w-4 h-4" />;
      case "Settings": return <Settings className="w-4 h-4" />;
      case "Authentication": return <User className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case "warning":
        return <Badge className="bg-amber-500 text-white text-xs">Warning</Badge>;
      case "info":
      default:
        return <Badge variant="secondary" className="text-xs">Info</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleString();
    }
  };

  const exportToCSV = () => {
    const headers = ["Timestamp", "User", "Module", "Action", "Details", "Severity", "IP Address"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.user,
        log.module,
        log.action,
        `"${log.details.replace(/"/g, '""')}"`,
        log.severity,
        log.ipAddress || "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(logs.map(log => log.userId)))
    .map(userId => {
      const log = logs.find(l => l.userId === userId);
      return { id: userId, name: log?.user || "" };
    });

  return (
    <>
      <SEO 
        title="Activity Log - Canna Blaze 360"
        description="System-wide activity log and audit trail"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    ← Back
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">System-wide audit trail</p>
                  </div>
                </div>
              </div>

              <Button onClick={exportToCSV} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
                    <p className="text-2xl font-bold text-red-600">
                      {logs.filter(l => l.severity === "critical").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {logs.filter(l => l.severity === "warning").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueUsers.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Module</label>
                  <Select value={filterModule} onValueChange={setFilterModule}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="Cultivation">Cultivation</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                      <SelectItem value="Settings">Settings</SelectItem>
                      <SelectItem value="Authentication">Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity</label>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User</label>
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                  Showing {currentLogs.length} of {filteredLogs.length} events
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterModule("all");
                    setFilterSeverity("all");
                    setFilterUser("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log Table */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Complete audit trail of all system actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            {log.user}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getModuleIcon(log.module)}
                            <span className="text-sm">{log.module}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{log.action}</TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                          {log.details}
                        </TableCell>
                        <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {log.ipAddress || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}