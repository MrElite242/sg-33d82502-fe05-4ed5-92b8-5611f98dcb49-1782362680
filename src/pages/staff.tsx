import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  ArrowLeft,
  Plus,
  Shield,
  ShieldCheck,
  UserCog,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "cashier" | "inventory-clerk" | "cultivator" | "lab-tech";
  status: "active" | "inactive";
  permissions: string[];
  hireDate: string;
  lastLogin: string;
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  // Sales & POS
  { id: "pos_access", name: "POS Access", description: "Access point of sale system", category: "Sales" },
  { id: "pos_refunds", name: "Process Refunds", description: "Issue refunds and returns", category: "Sales" },
  { id: "pos_discounts", name: "Apply Discounts", description: "Apply manual discounts", category: "Sales" },
  
  // Inventory
  { id: "inventory_view", name: "View Inventory", description: "View inventory levels", category: "Inventory" },
  { id: "inventory_edit", name: "Edit Inventory", description: "Add/edit inventory items", category: "Inventory" },
  { id: "inventory_transfer", name: "Transfer Stock", description: "Transfer between locations", category: "Inventory" },
  
  // Cultivation
  { id: "cultivation_view", name: "View Cultivation", description: "View plant batches", category: "Cultivation" },
  { id: "cultivation_manage", name: "Manage Cultivation", description: "Create/edit batches", category: "Cultivation" },
  
  // Analytics & Reports
  { id: "analytics_view", name: "View Analytics", description: "Access analytics dashboard", category: "Analytics" },
  { id: "reports_export", name: "Export Reports", description: "Export data and reports", category: "Analytics" },
  
  // Staff Management
  { id: "staff_view", name: "View Staff", description: "View staff directory", category: "Staff" },
  { id: "staff_manage", name: "Manage Staff", description: "Add/edit/remove staff", category: "Staff" },
  
  // System
  { id: "system_settings", name: "System Settings", description: "Modify system configuration", category: "System" },
  { id: "audit_logs", name: "View Audit Logs", description: "Access system audit logs", category: "System" },
];

const ROLE_TEMPLATES: Record<string, string[]> = {
  admin: AVAILABLE_PERMISSIONS.map(p => p.id),
  manager: [
    "pos_access", "pos_refunds", "pos_discounts",
    "inventory_view", "inventory_edit", "inventory_transfer",
    "cultivation_view", "cultivation_manage",
    "analytics_view", "reports_export",
    "staff_view"
  ],
  cashier: ["pos_access", "inventory_view"],
  "inventory-clerk": [
    "inventory_view", "inventory_edit", "inventory_transfer",
    "cultivation_view"
  ],
  cultivator: ["cultivation_view", "cultivation_manage", "inventory_view"],
  "lab-tech": ["cultivation_view", "inventory_view", "analytics_view"]
};

export default function Staff() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "cashier" as StaffMember["role"],
    permissions: [] as string[]
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const saved = localStorage.getItem("staffMembers");
    if (saved) {
      setStaff(JSON.parse(saved));
    } else {
      const demoStaff: StaffMember[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          phone: "(555) 123-4567",
          role: "admin",
          status: "active",
          permissions: ROLE_TEMPLATES.admin,
          hireDate: "2025-01-15",
          lastLogin: "2026-05-27 10:30 AM"
        },
        {
          id: "2",
          name: "Mike Chen",
          email: "mike.c@example.com",
          phone: "(555) 234-5678",
          role: "manager",
          status: "active",
          permissions: ROLE_TEMPLATES.manager,
          hireDate: "2025-02-01",
          lastLogin: "2026-05-27 09:15 AM"
        },
        {
          id: "3",
          name: "Emily Rodriguez",
          email: "emily.r@example.com",
          phone: "(555) 345-6789",
          role: "cashier",
          status: "active",
          permissions: ROLE_TEMPLATES.cashier,
          hireDate: "2025-03-10",
          lastLogin: "2026-05-26 04:45 PM"
        },
        {
          id: "4",
          name: "David Kim",
          email: "david.k@example.com",
          phone: "(555) 456-7890",
          role: "cultivator",
          status: "active",
          permissions: ROLE_TEMPLATES.cultivator,
          hireDate: "2025-02-20",
          lastLogin: "2026-05-27 08:00 AM"
        },
        {
          id: "5",
          name: "Lisa Martinez",
          email: "lisa.m@example.com",
          phone: "(555) 567-8901",
          role: "inventory-clerk",
          status: "inactive",
          permissions: ROLE_TEMPLATES["inventory-clerk"],
          hireDate: "2025-04-05",
          lastLogin: "2026-05-20 02:30 PM"
        }
      ];
      setStaff(demoStaff);
      localStorage.setItem("staffMembers", JSON.stringify(demoStaff));
    }
  };

  const handleAddStaff = () => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: "active",
      permissions: formData.permissions.length > 0 ? formData.permissions : ROLE_TEMPLATES[formData.role],
      hireDate: new Date().toISOString().split('T')[0],
      lastLogin: "Never"
    };

    const updated = [...staff, newStaff];
    setStaff(updated);
    localStorage.setItem("staffMembers", JSON.stringify(updated));

    toast({
      title: "Staff Member Added",
      description: `${formData.name} has been added to your team`,
    });

    resetForm();
    setShowAddDialog(false);
  };

  const handleUpdateStaff = () => {
    if (!editingStaff) return;

    const updated = staff.map(s => 
      s.id === editingStaff.id 
        ? { ...s, ...formData }
        : s
    );
    setStaff(updated);
    localStorage.setItem("staffMembers", JSON.stringify(updated));

    toast({
      title: "Staff Updated",
      description: `${formData.name}'s information has been updated`,
    });

    resetForm();
    setEditingStaff(null);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staff.filter(s => s.id !== id);
    setStaff(updated);
    localStorage.setItem("staffMembers", JSON.stringify(updated));

    toast({
      title: "Staff Member Removed",
      description: "The staff member has been removed from your team",
    });
  };

  const toggleStatus = (id: string) => {
    const updated = staff.map(s => 
      s.id === id 
        ? { ...s, status: s.status === "active" ? "inactive" : "active" as "active" | "inactive" }
        : s
    );
    setStaff(updated);
    localStorage.setItem("staffMembers", JSON.stringify(updated));

    toast({
      title: "Status Updated",
      description: "Staff member status has been changed",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "cashier",
      permissions: []
    });
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      permissions: member.permissions
    });
  };

  const handleRoleChange = (role: StaffMember["role"]) => {
    setFormData({
      ...formData,
      role,
      permissions: ROLE_TEMPLATES[role]
    });
  };

  const togglePermission = (permissionId: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permissionId)
        ? formData.permissions.filter(p => p !== permissionId)
        : [...formData.permissions, permissionId]
    });
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-700 border-purple-300",
      manager: "bg-blue-100 text-blue-700 border-blue-300",
      cashier: "bg-green-100 text-green-700 border-green-300",
      "inventory-clerk": "bg-amber-100 text-amber-700 border-amber-300",
      cultivator: "bg-emerald-100 text-emerald-700 border-emerald-300",
      "lab-tech": "bg-cyan-100 text-cyan-700 border-cyan-300"
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrator",
      manager: "Manager",
      cashier: "Cashier",
      "inventory-clerk": "Inventory Clerk",
      cultivator: "Cultivator",
      "lab-tech": "Lab Technician"
    };
    return labels[role] || role;
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Staff Management - Canna Blaze 360"
        description="Manage team members, roles, and permissions"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600" />
                <h1 className="text-2xl font-bold">Staff Management</h1>
              </div>
            </div>
            <Dialog open={showAddDialog || !!editingStaff} onOpenChange={(open) => {
              if (!open) {
                setShowAddDialog(false);
                setEditingStaff(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4" />
                  Add Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
                  <DialogDescription>
                    {editingStaff ? "Update staff member information and permissions" : "Add a new team member and assign their role and permissions"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="cashier">Cashier</SelectItem>
                          <SelectItem value="inventory-clerk">Inventory Clerk</SelectItem>
                          <SelectItem value="cultivator">Cultivator</SelectItem>
                          <SelectItem value="lab-tech">Lab Technician</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label>Permissions</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFormData({ ...formData, permissions: ROLE_TEMPLATES[formData.role] })}
                      >
                        Reset to Role Default
                      </Button>
                    </div>

                    {["Sales", "Inventory", "Cultivation", "Analytics", "Staff", "System"].map((category) => {
                      const categoryPerms = AVAILABLE_PERMISSIONS.filter(p => p.category === category);
                      if (categoryPerms.length === 0) return null;

                      return (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700">{category}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {categoryPerms.map((perm) => (
                              <div key={perm.id} className="flex items-start space-x-2 p-2 rounded border hover:bg-gray-50">
                                <Checkbox
                                  id={perm.id}
                                  checked={formData.permissions.includes(perm.id)}
                                  onCheckedChange={() => togglePermission(perm.id)}
                                />
                                <div className="flex-1">
                                  <label htmlFor={perm.id} className="text-sm font-medium cursor-pointer">
                                    {perm.name}
                                  </label>
                                  <p className="text-xs text-gray-500">{perm.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={editingStaff ? handleUpdateStaff : handleAddStaff}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      disabled={!formData.name || !formData.email || !formData.phone}
                    >
                      {editingStaff ? "Update Staff Member" : "Add Staff Member"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddDialog(false);
                        setEditingStaff(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{staff.length}</div>
                <div className="text-sm text-gray-500 mt-1">Team members</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {staff.filter(s => s.status === "active").length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Currently active</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Administrators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {staff.filter(s => s.role === "admin").length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Admin access</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Recent Hires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {staff.filter(s => {
                    const hireDate = new Date(s.hireDate);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return hireDate > thirtyDaysAgo;
                  }).length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search staff by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Staff List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Directory</CardTitle>
              <CardDescription>Manage your team members and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {getRoleLabel(member.role)}
                        </Badge>
                        {member.status === "active" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Hired {new Date(member.hireDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Last login: {member.lastLogin} • {member.permissions.length} permissions
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(member.id)}
                      >
                        {member.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredStaff.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No staff members found matching your search</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}