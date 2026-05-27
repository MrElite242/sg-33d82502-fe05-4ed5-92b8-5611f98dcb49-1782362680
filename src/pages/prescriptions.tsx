import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Send, CheckCircle2, Clock, XCircle, ArrowLeft, Search, Hospital, UserCog, PenTool, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Prescription {
  id: string;
  patientName: string;
  patientEmail: string;
  patientDOB: string;
  medication: string;
  dosage: string;
  quantity: string;
  refills: string;
  instructions: string;
  pharmacy: string;
  pharmacyAddress: string;
  status: "pending" | "sent" | "filled" | "cancelled";
  createdAt: string;
  doctorName: string;
  doctorSignature: string;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  cannabisLicense: string;
}

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Doctor info (would come from auth in production)
  const doctorInfo = {
    name: "Dr. Sarah Johnson",
    license: "MD-12345",
    signature: "Dr. Sarah Johnson, MD",
    npiNumber: "1234567890",
    verified: true
  };

  useEffect(() => {
    // Load prescriptions from localStorage
    const saved = localStorage.getItem("prescriptions");
    if (saved) {
      setPrescriptions(JSON.parse(saved));
    } else {
      const demoData: Prescription[] = [
        {
          id: "RX-001",
          patientName: "John Smith",
          patientEmail: "john.smith@email.com",
          patientDOB: "1985-03-15",
          medication: "CBD Oil 500mg",
          dosage: "10mg twice daily",
          quantity: "30ml bottle",
          refills: "2",
          instructions: "Take with food. May cause drowsiness.",
          pharmacy: "Green Wellness Pharmacy",
          pharmacyAddress: "123 Main St, Denver, CO 80202",
          status: "sent",
          createdAt: "2026-01-28",
          doctorName: doctorInfo.name,
          doctorSignature: doctorInfo.signature
        },
        {
          id: "RX-002",
          patientName: "Emily Davis",
          patientEmail: "emily.davis@email.com",
          patientDOB: "1990-07-22",
          medication: "THC Capsules 10mg",
          dosage: "One capsule at bedtime",
          quantity: "30 capsules",
          refills: "1",
          instructions: "Do not operate machinery after taking.",
          pharmacy: "Herbal Care Dispensary",
          pharmacyAddress: "456 Oak Ave, Denver, CO 80203",
          status: "filled",
          createdAt: "2026-01-27",
          doctorName: doctorInfo.name,
          doctorSignature: doctorInfo.signature
        }
      ];
      setPrescriptions(demoData);
      localStorage.setItem("prescriptions", JSON.stringify(demoData));
    }

    // Load pharmacies
    const pharmacyData: Pharmacy[] = [
      {
        id: "PH-001",
        name: "Green Wellness Pharmacy",
        address: "123 Main St",
        city: "Denver",
        state: "CO",
        zip: "80202",
        phone: "(303) 555-0100",
        hours: "Mon-Fri 9AM-6PM",
        cannabisLicense: "C11-0000001-LIC"
      },
      {
        id: "PH-002",
        name: "Herbal Care Dispensary",
        address: "456 Oak Ave",
        city: "Denver",
        state: "CO",
        zip: "80203",
        phone: "(303) 555-0200",
        hours: "Mon-Sat 8AM-8PM",
        cannabisLicense: "C11-0000002-LIC"
      },
      {
        id: "PH-003",
        name: "Natural Health Cannabis",
        address: "789 Pine Blvd",
        city: "Boulder",
        state: "CO",
        zip: "80301",
        phone: "(303) 555-0300",
        hours: "Daily 10AM-7PM",
        cannabisLicense: "C11-0000003-LIC"
      },
      {
        id: "PH-004",
        name: "Healing Leaf Pharmacy",
        address: "321 Elm St",
        city: "Aurora",
        state: "CO",
        zip: "80010",
        phone: "(303) 555-0400",
        hours: "Mon-Fri 9AM-5PM",
        cannabisLicense: "C11-0000004-LIC"
      }
    ];
    setPharmacies(pharmacyData);
  }, []);

  const handleCreatePrescription = (formData: any) => {
    const newPrescription: Prescription = {
      id: `RX-${String(prescriptions.length + 1).padStart(3, '0')}`,
      ...formData,
      status: "sent",
      createdAt: new Date().toISOString().split('T')[0],
      doctorName: doctorInfo.name,
      doctorSignature: doctorInfo.signature
    };
    const updated = [...prescriptions, newPrescription];
    setPrescriptions(updated);
    localStorage.setItem("prescriptions", JSON.stringify(updated));
    setIsCreateDialogOpen(false);
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch = rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || rx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      sent: { label: "Sent to Pharmacy", className: "bg-blue-100 text-blue-800 border-blue-300" },
      filled: { label: "Filled", className: "bg-green-100 text-green-800 border-green-300" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-300" }
    };
    const variant = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <>
      <SEO title="E-Prescriptions - Medical Cannabis" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{doctorInfo.name}</p>
                <p className="text-xs text-gray-600">License: {doctorInfo.license}</p>
              </div>
              {doctorInfo.verified && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              E-Prescription Management
            </h1>
            <p className="text-gray-600">Create and manage medical cannabis prescriptions</p>
          </div>

          <Tabs defaultValue="prescriptions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="prescriptions">My Prescriptions</TabsTrigger>
              <TabsTrigger value="pharmacies">Pharmacy Directory</TabsTrigger>
              <TabsTrigger value="create">Create New Prescription</TabsTrigger>
            </TabsList>

            {/* Prescriptions List */}
            <TabsContent value="prescriptions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Prescription History</CardTitle>
                      <CardDescription>View and manage all prescriptions</CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                      <FileText className="w-4 h-4" />
                      New Prescription
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by patient name or RX number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="filled">Filled</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>RX Number</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Medication</TableHead>
                          <TableHead>Pharmacy</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPrescriptions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              No prescriptions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPrescriptions.map((rx) => (
                            <TableRow key={rx.id}>
                              <TableCell className="font-mono font-semibold">{rx.id}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{rx.patientName}</div>
                                  <div className="text-xs text-gray-500">{rx.patientEmail}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{rx.medication}</div>
                                  <div className="text-xs text-gray-500">{rx.dosage}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{rx.pharmacy}</div>
                                  <div className="text-xs text-gray-500">{rx.pharmacyAddress}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{rx.createdAt}</TableCell>
                              <TableCell>{getStatusBadge(rx.status)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">View</Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pharmacy Directory */}
            <TabsContent value="pharmacies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Licensed Cannabis Pharmacies</CardTitle>
                  <CardDescription>Directory of verified dispensaries accepting e-prescriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pharmacies.map((pharmacy) => (
                      <Card key={pharmacy.id} className="border-2 hover:border-blue-300 transition-colors">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Hospital className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                                <p className="text-xs text-gray-500">License: {pharmacy.cannabisLicense}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p>{pharmacy.address}</p>
                              <p>{pharmacy.city}, {pharmacy.state} {pharmacy.zip}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{pharmacy.phone}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Hours:</span>
                            <span className="font-medium">{pharmacy.hours}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Prescription */}
            <TabsContent value="create" className="space-y-6">
              <PrescriptionForm 
                pharmacies={pharmacies} 
                onSubmit={handleCreatePrescription}
                doctorInfo={doctorInfo}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function PrescriptionForm({ pharmacies, onSubmit, doctorInfo }: any) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientDOB: "",
    medication: "",
    dosage: "",
    quantity: "",
    refills: "0",
    instructions: "",
    pharmacy: "",
    pharmacyAddress: ""
  });

  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

  const handlePharmacySelect = (pharmacyId: string) => {
    const pharmacy = pharmacies.find((p: Pharmacy) => p.id === pharmacyId);
    if (pharmacy) {
      setFormData({
        ...formData,
        pharmacy: pharmacy.name,
        pharmacyAddress: `${pharmacy.address}, ${pharmacy.city}, ${pharmacy.state} ${pharmacy.zip}`
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signatureConfirmed) {
      onSubmit(formData);
      // Reset form
      setFormData({
        patientName: "",
        patientEmail: "",
        patientDOB: "",
        medication: "",
        dosage: "",
        quantity: "",
        refills: "0",
        instructions: "",
        pharmacy: "",
        pharmacyAddress: ""
      });
      setSignatureConfirmed(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New E-Prescription</CardTitle>
        <CardDescription>Fill out the prescription details and send to pharmacy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientEmail">Email *</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientDOB">Date of Birth *</Label>
                <Input
                  id="patientDOB"
                  type="date"
                  value={formData.patientDOB}
                  onChange={(e) => setFormData({...formData, patientDOB: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Medication Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Medication Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="medication">Medication Name *</Label>
                <Input
                  id="medication"
                  placeholder="e.g., CBD Oil 500mg, THC Capsules 10mg"
                  value={formData.medication}
                  onChange={(e) => setFormData({...formData, medication: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage Instructions *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 10mg twice daily"
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 30 capsules, 30ml bottle"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refills">Number of Refills</Label>
                <Select value={formData.refills} onValueChange={(value) => setFormData({...formData, refills: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4,5].map(num => (
                      <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="e.g., Take with food. May cause drowsiness."
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Pharmacy Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Hospital className="w-5 h-5" />
              Select Pharmacy
            </h3>
            <div className="space-y-2">
              <Label htmlFor="pharmacy">Choose Pharmacy *</Label>
              <Select onValueChange={handlePharmacySelect} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a licensed pharmacy" />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies.map((pharmacy: Pharmacy) => (
                    <SelectItem key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.name} - {pharmacy.city}, {pharmacy.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.pharmacy && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium">{formData.pharmacy}</p>
                    <p className="text-sm text-gray-600">{formData.pharmacyAddress}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* E-Signature */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Electronic Signature
            </h3>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm font-medium">Prescriber Information:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {doctorInfo.name}</p>
                  <p><span className="font-medium">License:</span> {doctorInfo.license}</p>
                  <p><span className="font-medium">NPI:</span> {doctorInfo.npiNumber}</p>
                  <p className="font-serif text-lg mt-2">{doctorInfo.signature}</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="signatureConfirm"
                    checked={signatureConfirmed}
                    onChange={(e) => setSignatureConfirmed(e.target.checked)}
                    className="w-4 h-4"
                    required
                  />
                  <Label htmlFor="signatureConfirm" className="text-sm cursor-pointer">
                    I certify that this prescription is medically necessary and accurate
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={!signatureConfirmed}
            >
              <Send className="w-4 h-4" />
              Send Prescription to Pharmacy
            </Button>
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}