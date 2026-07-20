import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { 
  ShieldCheck, 
  ArrowLeft,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  Filter,
  Eye,
  Building2,
  MapPin,
  Calendar,
  User,
  Plus,
  BarChart3
} from "lucide-react";

interface License {
  id: string;
  businessName: string;
  licenseType: "cultivation" | "retail" | "manufacturing" | "testing" | "transport" | "medical";
  licenseNumber: string;
  status: "approved" | "pending" | "rejected" | "expired";
  region: string;
  country: string;
  issuedDate: string;
  expiryDate: string;
  applicantName: string;
  applicantEmail: string;
  address: string;
}

interface ComplianceRecord {
  id: string;
  businessName: string;
  licenseNumber: string;
  recordType: "incident" | "violation" | "warning" | "notice";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  region: string;
  country: string;
  reportedDate: string;
  status: "open" | "under-review" | "resolved" | "closed";
  inspector: string;
}

interface Inspection {
  id: string;
  businessName: string;
  licenseNumber: string;
  inspectionType: "routine" | "follow-up" | "complaint-based" | "renewal";
  scheduledDate: string;
  completedDate?: string;
  inspector: string;
  region: string;
  country: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  findings: string;
  score?: number;
}

interface NationalReport {
  id: string;
  reportType: "monthly" | "quarterly" | "annual" | "incident";
  title: string;
  region: string;
  country: string;
  reportingPeriod: string;
  generatedDate: string;
  generatedBy: string;
  metrics: {
    totalLicenses: number;
    activeLicenses: number;
    pendingApplications: number;
    inspectionsCompleted: number;
    complianceIssues: number;
  };
}

interface GovernmentUser {
  userId: string;
  role: "admin" | "inspector" | "analyst" | "viewer";
  approvedRegions: string[];
  approvedCountries: string[];
}

const COUNTRIES = [
  "United States",
  "Canada",
  "Germany",
  "Netherlands",
  "Spain",
  "Italy",
  "Portugal",
  "Switzerland",
  "Australia",
  "New Zealand",
  "Israel",
  "Colombia",
  "Uruguay",
  "South Africa",
  "Thailand",
  "Jamaica"
];

const US_REGIONS = ["California", "Colorado", "Washington", "Oregon", "Nevada", "Michigan", "Illinois", "Massachusetts"];
const CANADA_REGIONS = ["Ontario", "British Columbia", "Quebec", "Alberta", "Manitoba", "Saskatchewan"];

export default function Government() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [licenses, setLicenses] = useState<License[]>([]);
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [reports, setReports] = useState<NationalReport[]>([]);
  const [governmentUser, setGovernmentUser] = useState<GovernmentUser | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [showRegionDialog, setShowRegionDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadGovernmentData();
    loadUserAccess();
  }, []);

  const loadUserAccess = () => {
    const saved = localStorage.getItem("governmentUserAccess");
    if (saved) {
      setGovernmentUser(JSON.parse(saved));
    } else {
      const defaultAccess: GovernmentUser = {
        userId: user?.id || "gov-user",
        role: "admin",
        approvedRegions: ["California", "Colorado", "Ontario"],
        approvedCountries: ["United States", "Canada"]
      };
      setGovernmentUser(defaultAccess);
      localStorage.setItem("governmentUserAccess", JSON.stringify(defaultAccess));
    }
  };

  const loadGovernmentData = () => {
    const savedLicenses = localStorage.getItem("governmentLicenses");
    const savedCompliance = localStorage.getItem("governmentCompliance");
    const savedInspections = localStorage.getItem("governmentInspections");
    const savedReports = localStorage.getItem("governmentReports");

    if (savedLicenses) {
      setLicenses(JSON.parse(savedLicenses));
    } else {
      const demoLicenses: License[] = [
        {
          id: "lic-001",
          businessName: "Green Valley Cultivation",
          licenseType: "cultivation",
          licenseNumber: "CA-CULT-2026-001",
          status: "approved",
          region: "California",
          country: "United States",
          issuedDate: "2026-01-15",
          expiryDate: "2027-01-15",
          applicantName: "John Smith",
          applicantEmail: "john@greenvalley.com",
          address: "123 Farm Road, Sacramento, CA 95814"
        },
        {
          id: "lic-002",
          businessName: "CannaRetail Express",
          licenseType: "retail",
          licenseNumber: "CO-RET-2026-045",
          status: "approved",
          region: "Colorado",
          country: "United States",
          issuedDate: "2026-02-20",
          expiryDate: "2027-02-20",
          applicantName: "Sarah Johnson",
          applicantEmail: "sarah@cannaretail.com",
          address: "456 Main Street, Denver, CO 80202"
        },
        {
          id: "lic-003",
          businessName: "Toronto Cannabis Co",
          licenseType: "retail",
          licenseNumber: "ON-RET-2026-012",
          status: "pending",
          region: "Ontario",
          country: "Canada",
          issuedDate: "2026-05-15",
          expiryDate: "2027-05-15",
          applicantName: "Mike Chen",
          applicantEmail: "mike@torontocanna.ca",
          address: "789 Queen St, Toronto, ON M5V 2B2"
        }
      ];
      setLicenses(demoLicenses);
      localStorage.setItem("governmentLicenses", JSON.stringify(demoLicenses));
    }

    if (savedCompliance) {
      setComplianceRecords(JSON.parse(savedCompliance));
    } else {
      const demoCompliance: ComplianceRecord[] = [
        {
          id: "comp-001",
          businessName: "Green Valley Cultivation",
          licenseNumber: "CA-CULT-2026-001",
          recordType: "warning",
          severity: "medium",
          description: "Inadequate plant tracking system detected during routine inspection",
          region: "California",
          country: "United States",
          reportedDate: "2026-05-10",
          status: "resolved",
          inspector: "Inspector Martinez"
        },
        {
          id: "comp-002",
          businessName: "CannaRetail Express",
          licenseType: "retail",
          recordType: "violation",
          severity: "high",
          description: "Sale to minor attempted - immediate corrective action required",
          region: "Colorado",
          country: "United States",
          reportedDate: "2026-05-20",
          status: "under-review",
          inspector: "Inspector Davis"
        }
      ];
      setComplianceRecords(demoCompliance);
      localStorage.setItem("governmentCompliance", JSON.stringify(demoCompliance));
    }

    if (savedInspections) {
      setInspections(JSON.parse(savedInspections));
    } else {
      const demoInspections: Inspection[] = [
        {
          id: "insp-001",
          businessName: "Green Valley Cultivation",
          licenseNumber: "CA-CULT-2026-001",
          inspectionType: "routine",
          scheduledDate: "2026-06-01",
          completedDate: "2026-06-01",
          inspector: "Inspector Martinez",
          region: "California",
          country: "United States",
          status: "completed",
          findings: "Minor tracking issues identified. Corrective action plan accepted.",
          score: 87
        },
        {
          id: "insp-002",
          businessName: "CannaRetail Express",
          licenseNumber: "CO-RET-2026-045",
          inspectionType: "follow-up",
          scheduledDate: "2026-06-15",
          inspector: "Inspector Davis",
          region: "Colorado",
          country: "United States",
          status: "scheduled",
          findings: "Pending inspection"
        }
      ];
      setInspections(demoInspections);
      localStorage.setItem("governmentInspections", JSON.stringify(demoInspections));
    }

    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      const demoReports: NationalReport[] = [
        {
          id: "rep-001",
          reportType: "monthly",
          title: "California Cannabis Market Report - May 2026",
          region: "California",
          country: "United States",
          reportingPeriod: "May 2026",
          generatedDate: "2026-06-01",
          generatedBy: "State Regulatory Agency",
          metrics: {
            totalLicenses: 1247,
            activeLicenses: 1189,
            pendingApplications: 34,
            inspectionsCompleted: 156,
            complianceIssues: 23
          }
        }
      ];
      setReports(demoReports);
      localStorage.setItem("governmentReports", JSON.stringify(demoReports));
    }
  };

  const updateRegionAccess = () => {
    if (!governmentUser || !selectedCountry) return;

    const updatedUser: GovernmentUser = {
      ...governmentUser,
      approvedCountries: [...new Set([...governmentUser.approvedCountries, selectedCountry])],
      approvedRegions: [...new Set([...governmentUser.approvedRegions, ...selectedRegions])]
    };

    setGovernmentUser(updatedUser);
    localStorage.setItem("governmentUserAccess", JSON.stringify(updatedUser));

    toast({
      title: "Access Updated",
      description: `Added access to ${selectedRegions.length} region(s) in ${selectedCountry}`,
    });

    setShowRegionDialog(false);
    setSelectedCountry("");
    setSelectedRegions([]);
  };

  const getAvailableRegions = (country: string) => {
    switch (country) {
      case "United States":
        return US_REGIONS;
      case "Canada":
        return CANADA_REGIONS;
      default:
        return [`${country} - National`];
    }
  };

  const canViewRecord = (region: string, country: string) => {
    if (!governmentUser) return false;
    if (governmentUser.role === "admin") return true;
    return governmentUser.approvedCountries.includes(country) && 
           governmentUser.approvedRegions.includes(region);
  };

  const filteredLicenses = licenses.filter(lic => {
    if (!canViewRecord(lic.region, lic.country)) return false;
    const matchesSearch = lic.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lic.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lic.status === statusFilter;
    const matchesRegion = regionFilter === "all" || lic.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const filteredCompliance = complianceRecords.filter(rec => 
    canViewRecord(rec.region, rec.country) &&
    (searchQuery === "" || rec.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredInspections = inspections.filter(insp =>
    canViewRecord(insp.region, insp.country) &&
    (searchQuery === "" || insp.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredReports = reports.filter(rep =>
    canViewRecord(rep.region, rep.country)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-700"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-600 text-white">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500 text-white">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500 text-white">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Government Portal - Canna Blaze 360"
        description="Government licensing, compliance monitoring, and regulatory oversight"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950">
        <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Government Regulatory Portal</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Licensing • Compliance • Inspections • Reporting
                    </p>
                  </div>
                </div>
              </div>
              {governmentUser?.role === "admin" && (
                <Dialog open={showRegionDialog} onOpenChange={setShowRegionDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                      <MapPin className="w-4 h-4" />
                      Manage Region Access
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Region Access</DialogTitle>
                      <DialogDescription>
                        Grant access to specific countries and regions for government officials
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map(country => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedCountry && (
                        <div className="space-y-2">
                          <Label>Regions</Label>
                          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                            {getAvailableRegions(selectedCountry).map(region => (
                              <Button
                                key={region}
                                variant={selectedRegions.includes(region) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setSelectedRegions(prev =>
                                    prev.includes(region)
                                      ? prev.filter(r => r !== region)
                                      : [...prev, region]
                                  );
                                }}
                                className="justify-start"
                              >
                                {region}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Alert>
                        <AlertDescription>
                          Current access: {governmentUser?.approvedCountries.length} countries, {governmentUser?.approvedRegions.length} regions
                        </AlertDescription>
                      </Alert>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={updateRegionAccess}
                        disabled={!selectedCountry || selectedRegions.length === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Add Access
                      </Button>
                      <Button variant="outline" onClick={() => setShowRegionDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Access Info */}
          <Card className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Your Access: {governmentUser?.role === "admin" ? "Administrator" : "Regional Official"}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Countries: {governmentUser?.approvedCountries.join(", ") || "None"} • 
                    Regions: {governmentUser?.approvedRegions.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Licenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{filteredLicenses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {filteredLicenses.filter(l => l.status === "approved").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {filteredLicenses.filter(l => l.status === "pending").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Inspections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {filteredInspections.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Compliance Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {filteredCompliance.filter(c => c.status === "open" || c.status === "under-review").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="licenses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="licenses">Licensing</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="inspections">Inspections</TabsTrigger>
              <TabsTrigger value="reports">National Reporting</TabsTrigger>
            </TabsList>

            {/* Licensing Tab */}
            <TabsContent value="licenses">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>License Applications & Renewals</CardTitle>
                      <CardDescription>Review and approve cannabis business licenses</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search licenses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {governmentUser?.approvedRegions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>License #</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLicenses.map(license => (
                        <TableRow key={license.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{license.businessName}</div>
                              <div className="text-xs text-gray-500">{license.applicantName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{license.licenseNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{license.licenseType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{license.region}</div>
                              <div className="text-xs text-gray-500">{license.country}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(license.status)}</TableCell>
                          <TableCell className="text-sm">{new Date(license.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Monitoring</CardTitle>
                  <CardDescription>Track violations, warnings, and incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCompliance.map(record => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{record.businessName}</h3>
                            <p className="text-sm text-gray-600">License: {record.licenseNumber}</p>
                            <p className="text-sm text-gray-600">{record.region}, {record.country}</p>
                          </div>
                          <div className="flex gap-2">
                            {getSeverityBadge(record.severity)}
                            <Badge variant="outline" className="capitalize">{record.recordType}</Badge>
                          </div>
                        </div>
                        <p className="text-sm mb-3">{record.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>Inspector: {record.inspector}</span>
                            <span>Reported: {new Date(record.reportedDate).toLocaleDateString()}</span>
                          </div>
                          <Badge variant={record.status === "resolved" ? "default" : "secondary"}>
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inspections Tab */}
            <TabsContent value="inspections">
              <Card>
                <CardHeader>
                  <CardTitle>Inspection Schedule & Results</CardTitle>
                  <CardDescription>Manage facility inspections and compliance checks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead>Inspector</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInspections.map(inspection => (
                        <TableRow key={inspection.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{inspection.businessName}</div>
                              <div className="text-xs text-gray-500">{inspection.licenseNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{inspection.inspectionType}</Badge>
                          </TableCell>
                          <TableCell>{inspection.region}</TableCell>
                          <TableCell>{new Date(inspection.scheduledDate).toLocaleDateString()}</TableCell>
                          <TableCell>{inspection.inspector}</TableCell>
                          <TableCell>
                            <Badge variant={inspection.status === "completed" ? "default" : "secondary"}>
                              {inspection.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {inspection.score ? (
                              <span className={`font-semibold ${inspection.score >= 85 ? "text-green-600" : inspection.score >= 70 ? "text-amber-600" : "text-red-600"}`}>
                                {inspection.score}/100
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* National Reporting Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>National & Regional Reports</CardTitle>
                  <CardDescription>Aggregated statistics and compliance reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReports.map(report => (
                      <div key={report.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{report.title}</h3>
                            <p className="text-sm text-gray-600">{report.region}, {report.country}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Period: {report.reportingPeriod} • Generated: {new Date(report.generatedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{report.metrics.totalLicenses}</div>
                            <div className="text-xs text-gray-600 mt-1">Total Licenses</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{report.metrics.activeLicenses}</div>
                            <div className="text-xs text-gray-600 mt-1">Active</div>
                          </div>
                          <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-amber-600">{report.metrics.pendingApplications}</div>
                            <div className="text-xs text-gray-600 mt-1">Pending</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{report.metrics.inspectionsCompleted}</div>
                            <div className="text-xs text-gray-600 mt-1">Inspections</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{report.metrics.complianceIssues}</div>
                            <div className="text-xs text-gray-600 mt-1">Issues</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}