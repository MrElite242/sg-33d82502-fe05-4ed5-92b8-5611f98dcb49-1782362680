import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { 
  Shield, ShieldAlert, Database, Users, Settings, Lock, AlertTriangle, 
  Activity, FileText, Download, Upload, Trash2, RefreshCw, Eye, EyeOff,
  CheckCircle2, XCircle, Clock, Server, HardDrive, Wifi, Power,
  Terminal, Code, Key, UserCog, Bell, Mail, Phone, MapPin, Calendar
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  user_role: string;
  status: "active" | "suspended" | "pending";
  created_at: string;
  last_login?: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "critical";
  module: string;
  action: string;
  user: string;
  details: string;
  ip_address: string;
}

export default function AdminPortal() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDatabaseDialog, setShowDatabaseDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // System stats
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBusinesses: 0,
    totalTransactions: 0,
    systemUptime: "99.9%",
    storageUsed: "2.3 GB",
    lastBackup: "2026-05-27 14:30",
    pendingAlerts: 3
  });

  useEffect(() => {
    // Only admin users can access this page
    if (!loading && (!user || user.user_role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You must be an administrator to access this page.",
        variant: "destructive"
      });
      router.push("/dashboard");
      return;
    }

    loadSystemData();
  }, [user, loading, router]);

  const loadSystemData = () => {
    // Load all users from different localStorage keys
    const allUsers: SystemUser[] = [];

    // Load profiles
    const profiles = JSON.parse(localStorage.getItem("profiles") || "[]");
    profiles.forEach((profile: any) => {
      allUsers.push({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || "Unknown",
        user_role: profile.user_role || "patient",
        status: "active",
        created_at: profile.created_at || new Date().toISOString(),
        last_login: profile.last_login
      });
    });

    // Add demo admin
    if (allUsers.length === 0) {
      allUsers.push({
        id: "admin-001",
        email: "admin@canablaze360.com",
        full_name: "System Administrator",
        user_role: "admin",
        status: "active",
        created_at: "2026-01-01T00:00:00Z",
        last_login: new Date().toISOString()
      });
      allUsers.push({
        id: "user-001",
        email: "sarah@greenvalley.com",
        full_name: "Sarah Johnson",
        user_role: "business",
        status: "active",
        created_at: "2026-03-15T10:30:00Z",
        last_login: "2026-05-27T14:20:00Z"
      });
      allUsers.push({
        id: "user-002",
        email: "dr.smith@medcannabis.com",
        full_name: "Dr. Michael Smith",
        user_role: "doctor",
        status: "active",
        created_at: "2026-02-20T09:00:00Z",
        last_login: "2026-05-27T11:45:00Z"
      });
      allUsers.push({
        id: "user-003",
        email: "pharmacy@rxgreen.com",
        full_name: "Green Valley Pharmacy",
        user_role: "pharmacy",
        status: "active",
        created_at: "2026-04-10T14:15:00Z",
        last_login: "2026-05-27T16:30:00Z"
      });
      allUsers.push({
        id: "user-004",
        email: "john.patient@email.com",
        full_name: "John Patient",
        user_role: "patient",
        status: "pending",
        created_at: "2026-05-25T08:00:00Z"
      });
    }

    setSystemUsers(allUsers);

    // Load activity logs
    const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
    setSystemLogs(logs);

    // Update stats
    setSystemStats({
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.status === "active").length,
      totalBusinesses: allUsers.filter(u => u.user_role === "business").length,
      totalTransactions: parseInt(localStorage.getItem("totalTransactions") || "1847"),
      systemUptime: "99.9%",
      storageUsed: "2.3 GB",
      lastBackup: new Date().toLocaleString(),
      pendingAlerts: 3
    });
  };

  const handleSuspendUser = (userId: string) => {
    const updated = systemUsers.map(u => 
      u.id === userId ? { ...u, status: "suspended" as const } : u
    );
    setSystemUsers(updated);
    toast({
      title: "User Suspended",
      description: "User account has been suspended successfully."
    });
  };

  const handleActivateUser = (userId: string) => {
    const updated = systemUsers.map(u => 
      u.id === userId ? { ...u, status: "active" as const } : u
    );
    setSystemUsers(updated);
    toast({
      title: "User Activated",
      description: "User account has been activated successfully."
    });
  };

  const handleDeleteUser = (userId: string) => {
    const updated = systemUsers.filter(u => u.id !== userId);
    setSystemUsers(updated);
    toast({
      title: "User Deleted",
      description: "User account has been permanently deleted.",
      variant: "destructive"
    });
  };

  const handleBackupDatabase = () => {
    const allData = {
      users: systemUsers,
      inventory: localStorage.getItem("inventoryItems"),
      sales: localStorage.getItem("salesHistory"),
      cultivation: localStorage.getItem("plantBatches"),
      logs: localStorage.getItem("activityLogs"),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blaze360-backup-${Date.now()}.json`;
    a.click();

    toast({
      title: "Backup Created",
      description: "Database backup downloaded successfully."
    });
  };

  const handleClearCache = () => {
    // Clear all localStorage except auth
    const keysToPreserve = ["supabase.auth.token"];
    Object.keys(localStorage).forEach(key => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared successfully."
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-700 border-red-200",
      business: "bg-emerald-100 text-emerald-700 border-emerald-200",
      doctor: "bg-blue-100 text-blue-700 border-blue-200",
      pharmacy: "bg-purple-100 text-purple-700 border-purple-200",
      patient: "bg-gray-100 text-gray-700 border-gray-200"
    };
    return <Badge className={colors[role] || ""}>{role}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredUsers = systemUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.user_role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (user.user_role !== "admin") {
    return null;
  }

  return (
    <>
      <SEO 
        title="Admin Portal - Blaze 360"
        description="System administration and emergency access"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-red-950 dark:to-gray-900">
        {/* Background Watermark */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.02]">
          <Shield className="absolute top-10 left-10 text-red-600 rotate-12" size={200} />
          <ShieldAlert className="absolute bottom-20 right-20 text-orange-600 -rotate-45" size={250} />
        </div>

        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-600 to-orange-600 p-2.5 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    Admin Portal
                    <Badge className="bg-red-100 text-red-700 border-red-200">EMERGENCY ACCESS</Badge>
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full system control and monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Activity className="w-3 h-3 text-green-600" />
                System Online
              </Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Critical Alerts */}
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>{systemStats.pendingAlerts} pending alerts</strong> require immediate attention. Check System Logs for details.
            </AlertDescription>
          </Alert>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemStats.totalUsers}</div>
                <p className="text-xs text-gray-600 mt-1">{systemStats.activeUsers} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Businesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{systemStats.totalBusinesses}</div>
                <p className="text-xs text-gray-600 mt-1">Cannabis operators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{systemStats.totalTransactions.toLocaleString()}</div>
                <p className="text-xs text-gray-600 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{systemStats.storageUsed}</div>
                <p className="text-xs text-gray-600 mt-1">Uptime: {systemStats.systemUptime}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="database">
                <Database className="w-4 h-4 mr-2" />
                Database
              </TabsTrigger>
              <TabsTrigger value="system">
                <Settings className="w-4 h-4 mr-2" />
                System
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="logs">
                <FileText className="w-4 h-4 mr-2" />
                Logs
              </TabsTrigger>
            </TabsList>

            {/* Users Management */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View and manage all system users</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <select
                        className="px-3 py-2 border rounded-md"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="business">Business</option>
                        <option value="doctor">Doctor</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="patient">Patient</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.user_role)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {user.status === "active" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSuspendUser(user.id)}
                                  >
                                    Suspend
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleActivateUser(user.id)}
                                  >
                                    Activate
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Management */}
            <TabsContent value="database">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Operations</CardTitle>
                    <CardDescription>Backup, restore, and manage data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-semibold">Create Backup</div>
                            <div className="text-sm text-gray-600">Download complete database backup</div>
                          </div>
                        </div>
                        <Button onClick={handleBackupDatabase} className="bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          Backup Now
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-semibold">Restore Backup</div>
                            <div className="text-sm text-gray-600">Restore from previous backup file</div>
                          </div>
                        </div>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                        <div className="flex items-center gap-3">
                          <Trash2 className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-semibold text-red-900">Clear Cache</div>
                            <div className="text-sm text-red-700">Remove all cached data (requires reload)</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleClearCache}
                          className="border-red-600 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Cache
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Tables</CardTitle>
                    <CardDescription>Direct access to all data tables</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Users
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Inventory
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Sales
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Cultivation
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Manufacturing
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Testing
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Transport
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Prescriptions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Global settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">Maintenance Mode</div>
                          <div className="text-sm text-gray-600">Disable public access temporarily</div>
                        </div>
                        <Button variant="outline">
                          <Power className="w-4 h-4 mr-2" />
                          Enable
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">Email Notifications</div>
                          <div className="text-sm text-gray-600">System-wide email settings</div>
                        </div>
                        <Button variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">API Keys</div>
                          <div className="text-sm text-gray-600">Manage integration keys</div>
                        </div>
                        <Button variant="outline">
                          <Key className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">System Updates</div>
                          <div className="text-sm text-gray-600">Check for platform updates</div>
                        </div>
                        <Button variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Check Updates
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">System Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Version</div>
                          <div className="font-semibold">2.5.0</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Last Backup</div>
                          <div className="font-semibold">{systemStats.lastBackup}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Server Status</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span className="font-semibold">Online</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Database</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span className="font-semibold">Connected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Center */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Center</CardTitle>
                  <CardDescription>Monitor and control security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        All security checks passed. System is secure.
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600">Require 2FA for admin accounts</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Enabled</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">Failed Login Attempts</div>
                          <div className="text-sm text-gray-600">Last 24 hours</div>
                        </div>
                        <Badge variant="outline">3 attempts</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">IP Whitelist</div>
                          <div className="text-sm text-gray-600">Restrict access by IP</div>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">Session Timeout</div>
                          <div className="text-sm text-gray-600">Auto-logout after inactivity</div>
                        </div>
                        <Badge variant="outline">30 minutes</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Logs */}
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>System Activity Logs</CardTitle>
                  <CardDescription>Monitor all system events and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="mt-1">
                          {log.level === "critical" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                          {log.level === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {log.level === "info" && <Activity className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold">{log.action}</div>
                              <div className="text-xs text-gray-600">{log.module}</div>
                            </div>
                            <Badge variant="outline" className="capitalize">{log.level}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">{log.details}</div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{log.user}</span>
                            <span>{log.ip_address}</span>
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {systemLogs.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No system logs available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* User Details Dialog */}
          <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  {selectedUser && `${selectedUser.full_name} (${selectedUser.email})`}
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">User ID</Label>
                      <div className="font-mono text-sm">{selectedUser.id}</div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Role</Label>
                      <div className="mt-1">{getRoleBadge(selectedUser.user_role)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Created</Label>
                      <div className="text-sm">{new Date(selectedUser.created_at).toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Last Login</Label>
                      <div className="text-sm">
                        {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : "Never"}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Admin Actions</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reset Password</Button>
                      <Button variant="outline" size="sm">View Activity</Button>
                      <Button variant="outline" size="sm">Send Email</Button>
                      {selectedUser.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleSuspendUser(selectedUser.id);
                            setShowUserDialog(false);
                          }}
                          className="text-red-600"
                        >
                          Suspend Account
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleActivateUser(selectedUser.id);
                            setShowUserDialog(false);
                          }}
                          className="text-green-600"
                        >
                          Activate Account
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}