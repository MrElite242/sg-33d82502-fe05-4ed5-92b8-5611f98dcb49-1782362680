import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Store, Search, Phone, MapPin, Clock, FileText, CheckCircle2, AlertCircle, Package, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

interface Prescription {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  dateOfBirth: string;
  medication: string;
  dosage: string;
  quantity: string;
  refills: string;
  instructions: string;
  doctorName: string;
  doctorLicense: string;
  datePrescribed: string;
  pharmacyStatus: "pending" | "in-progress" | "ready" | "filled" | "cancelled";
  pharmacyNotes: string;
}

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pharmacyPrescriptions");
    if (saved) {
      setPrescriptions(JSON.parse(saved));
    } else {
      const demoPrescriptions: Prescription[] = [
        {
          id: "RX-2026-001",
          patientName: "John Smith",
          patientPhone: "(555) 123-4567",
          patientEmail: "john.smith@email.com",
          dateOfBirth: "1985-03-15",
          medication: "Medical Cannabis - Indica Strain",
          dosage: "3.5g",
          quantity: "1 eighth",
          refills: "3",
          instructions: "Use as needed for chronic pain. Do not exceed recommended dosage.",
          doctorName: "Dr. Sarah Johnson",
          doctorLicense: "CO-MD-12345",
          datePrescribed: "2026-01-28",
          pharmacyStatus: "pending",
          pharmacyNotes: ""
        },
        {
          id: "RX-2026-002",
          patientName: "Emily Davis",
          patientPhone: "(555) 234-5678",
          patientEmail: "emily.davis@email.com",
          dateOfBirth: "1990-07-22",
          medication: "Medical Cannabis - CBD Oil",
          dosage: "25mg CBD",
          quantity: "30ml bottle",
          refills: "2",
          instructions: "Take 0.5ml twice daily for anxiety management.",
          doctorName: "Dr. Michael Chen",
          doctorLicense: "CO-MD-67890",
          datePrescribed: "2026-01-27",
          pharmacyStatus: "in-progress",
          pharmacyNotes: "Preparing order"
        },
        {
          id: "RX-2026-003",
          patientName: "Robert Martinez",
          patientPhone: "(555) 345-6789",
          patientEmail: "robert.m@email.com",
          dateOfBirth: "1978-11-30",
          medication: "Medical Cannabis - Hybrid Edibles",
          dosage: "10mg THC per gummy",
          quantity: "20 gummies",
          refills: "1",
          instructions: "Take 1 gummy before bedtime for insomnia.",
          doctorName: "Dr. Sarah Johnson",
          doctorLicense: "CO-MD-12345",
          datePrescribed: "2026-01-26",
          pharmacyStatus: "ready",
          pharmacyNotes: "Ready for pickup - notified patient"
        },
        {
          id: "RX-2026-004",
          patientName: "Lisa Anderson",
          patientPhone: "(555) 456-7890",
          patientEmail: "lisa.anderson@email.com",
          dateOfBirth: "1982-05-08",
          medication: "Medical Cannabis - Sativa Vape Cartridge",
          dosage: "70% THC",
          quantity: "1 cartridge (1g)",
          refills: "0",
          instructions: "Use as needed for nausea during chemotherapy.",
          doctorName: "Dr. Michael Chen",
          doctorLicense: "CO-MD-67890",
          datePrescribed: "2026-01-25",
          pharmacyStatus: "filled",
          pharmacyNotes: "Picked up by patient on 2026-01-26"
        }
      ];
      setPrescriptions(demoPrescriptions);
      localStorage.setItem("pharmacyPrescriptions", JSON.stringify(demoPrescriptions));
    }
  }, []);

  const savePrescriptions = (updatedPrescriptions: Prescription[]) => {
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem("pharmacyPrescriptions", JSON.stringify(updatedPrescriptions));
  };

  const updateStatus = (prescriptionId: string, newStatus: Prescription["pharmacyStatus"]) => {
    const updated = prescriptions.map(rx => 
      rx.id === prescriptionId 
        ? { ...rx, pharmacyStatus: newStatus }
        : rx
    );
    savePrescriptions(updated);
  };

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(rx => {
      const matchesSearch = rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rx.medication.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || rx.pharmacyStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [prescriptions, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => ({
    pending: prescriptions.filter(rx => rx.pharmacyStatus === "pending").length,
    inProgress: prescriptions.filter(rx => rx.pharmacyStatus === "in-progress").length,
    ready: prescriptions.filter(rx => rx.pharmacyStatus === "ready").length,
    filled: prescriptions.filter(rx => rx.pharmacyStatus === "filled").length
  }), [prescriptions]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pending", icon: Clock },
      "in-progress": { variant: "default" as const, label: "In Progress", icon: Package },
      ready: { variant: "default" as const, label: "Ready for Pickup", icon: AlertCircle },
      filled: { variant: "outline" as const, label: "Filled", icon: CheckCircle2 },
      cancelled: { variant: "destructive" as const, label: "Cancelled", icon: AlertCircle }
    };
    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const openDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <SEO title="Pharmacy Dashboard - Prescription Management" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Green Valley Pharmacy</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                License: CO-PH-54321
              </Badge>
              <Link href="/">
                <Button variant="outline">Exit Dashboard</Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{statusCounts.inProgress}</p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-orange-600">{statusCounts.ready}</p>
                    <p className="text-sm text-gray-600">Ready for Pickup</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">{statusCounts.filled}</p>
                    <p className="text-sm text-gray-600">Filled</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by patient name, RX number, or medication..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="ready">Ready for Pickup</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Queue ({filteredPrescriptions.length})</CardTitle>
              <CardDescription>Manage incoming medical cannabis prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPrescriptions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No prescriptions match your filters</p>
                  </div>
                ) : (
                  filteredPrescriptions.map((rx) => (
                    <Card key={rx.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold">{rx.patientName}</h3>
                                  {getStatusBadge(rx.pharmacyStatus)}
                                </div>
                                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span className="font-mono">{rx.id}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Prescribed: {new Date(rx.datePrescribed).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{rx.patientPhone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Dr. {rx.doctorName}</span>
                                  </div>
                                </div>
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="font-semibold text-sm mb-1">{rx.medication}</p>
                                  <p className="text-sm text-gray-600">{rx.dosage} • Qty: {rx.quantity} • Refills: {rx.refills}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Select 
                              value={rx.pharmacyStatus} 
                              onValueChange={(value) => updateStatus(rx.id, value as Prescription["pharmacyStatus"])}
                            >
                              <SelectTrigger className="w-full lg:w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="ready">Ready for Pickup</SelectItem>
                                <SelectItem value="filled">Filled</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              className="w-full lg:w-48"
                              onClick={() => openDetails(rx)}
                            >
                              View Full Details
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full lg:w-48 gap-2"
                              onClick={() => window.location.href = `tel:${rx.patientPhone}`}
                            >
                              <Phone className="w-4 h-4" />
                              Call Patient
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prescription Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>Complete prescription information</DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">RX Number</p>
                  <p className="font-mono">{selectedPrescription.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Status</p>
                  {getStatusBadge(selectedPrescription.pharmacyStatus)}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Name</p>
                    <p>{selectedPrescription.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date of Birth</p>
                    <p>{new Date(selectedPrescription.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Phone</p>
                    <p>{selectedPrescription.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Email</p>
                    <p>{selectedPrescription.patientEmail}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Medication Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Medication</p>
                    <p>{selectedPrescription.medication}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Dosage</p>
                      <p>{selectedPrescription.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Quantity</p>
                      <p>{selectedPrescription.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Refills</p>
                      <p>{selectedPrescription.refills}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Instructions</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedPrescription.instructions}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Prescriber Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Doctor Name</p>
                    <p>{selectedPrescription.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">License Number</p>
                    <p className="font-mono">{selectedPrescription.doctorLicense}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date Prescribed</p>
                    <p>{new Date(selectedPrescription.datePrescribed).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {selectedPrescription.pharmacyNotes && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Pharmacy Notes</h3>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedPrescription.pharmacyNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}