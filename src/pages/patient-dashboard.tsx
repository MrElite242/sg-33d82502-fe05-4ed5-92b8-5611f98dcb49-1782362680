import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, FileText, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Package, Download, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  quantity: string;
  refills: string;
  instructions: string;
  doctorName: string;
  doctorLicense: string;
  datePrescribed: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  pharmacyStatus: "pending" | "in-progress" | "ready" | "filled" | "cancelled";
  pharmacyNotes: string;
}

export default function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [patientName, setPatientName] = useState("John Smith");

  useEffect(() => {
    const saved = localStorage.getItem("patientPrescriptions");
    if (saved) {
      setPrescriptions(JSON.parse(saved));
    } else {
      const demoPrescriptions: Prescription[] = [
        {
          id: "RX-2026-001",
          medication: "Medical Cannabis - Indica Strain",
          dosage: "3.5g",
          quantity: "1 eighth",
          refills: "3",
          instructions: "Use as needed for chronic pain. Do not exceed recommended dosage.",
          doctorName: "Dr. Sarah Johnson",
          doctorLicense: "CO-MD-12345",
          datePrescribed: "2026-01-28",
          pharmacyName: "Green Valley Pharmacy",
          pharmacyAddress: "123 Main St, Denver, CO 80202",
          pharmacyPhone: "(303) 555-0100",
          pharmacyStatus: "in-progress",
          pharmacyNotes: "Your prescription is being prepared and should be ready within 2 hours."
        },
        {
          id: "RX-2025-089",
          medication: "Medical Cannabis - CBD Oil",
          dosage: "25mg CBD",
          quantity: "30ml bottle",
          refills: "2",
          instructions: "Take 0.5ml twice daily for anxiety management.",
          doctorName: "Dr. Michael Chen",
          doctorLicense: "CO-MD-67890",
          datePrescribed: "2025-12-15",
          pharmacyName: "Green Valley Pharmacy",
          pharmacyAddress: "123 Main St, Denver, CO 80202",
          pharmacyPhone: "(303) 555-0100",
          pharmacyStatus: "filled",
          pharmacyNotes: "Prescription filled on 2025-12-16. Thank you for your business!"
        },
        {
          id: "RX-2025-067",
          medication: "Medical Cannabis - Hybrid Edibles",
          dosage: "10mg THC per gummy",
          quantity: "20 gummies",
          refills: "0",
          instructions: "Take 1 gummy before bedtime for insomnia.",
          doctorName: "Dr. Sarah Johnson",
          doctorLicense: "CO-MD-12345",
          datePrescribed: "2025-11-20",
          pharmacyName: "Mountain Relief Dispensary",
          pharmacyAddress: "456 Peak Ave, Boulder, CO 80301",
          pharmacyPhone: "(303) 555-0200",
          pharmacyStatus: "filled",
          pharmacyNotes: "Prescription completed on 2025-11-21."
        }
      ];
      setPrescriptions(demoPrescriptions);
      localStorage.setItem("patientPrescriptions", JSON.stringify(demoPrescriptions));
    }
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pending", icon: Clock, color: "text-yellow-600" },
      "in-progress": { variant: "default" as const, label: "In Progress", icon: Package, color: "text-blue-600" },
      ready: { variant: "default" as const, label: "Ready for Pickup", icon: AlertCircle, color: "text-orange-600" },
      filled: { variant: "outline" as const, label: "Filled", icon: CheckCircle2, color: "text-green-600" },
      cancelled: { variant: "destructive" as const, label: "Cancelled", icon: AlertCircle, color: "text-red-600" }
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

  const getStatusMessage = (status: string) => {
    const messages = {
      pending: "Your prescription has been sent to the pharmacy and is awaiting processing.",
      "in-progress": "Your prescription is being prepared by the pharmacy.",
      ready: "Your prescription is ready for pickup! Please bring a valid ID.",
      filled: "This prescription has been completed.",
      cancelled: "This prescription has been cancelled."
    };
    return messages[status as keyof typeof messages];
  };

  const openDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailsOpen(true);
  };

  const activePrescriptions = prescriptions.filter(rx => rx.pharmacyStatus !== "filled" && rx.pharmacyStatus !== "cancelled");
  const completedPrescriptions = prescriptions.filter(rx => rx.pharmacyStatus === "filled" || rx.pharmacyStatus === "cancelled");

  return (
    <>
      <SEO title="Patient Dashboard - My Prescriptions" />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {patientName}</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">Exit Portal</Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Active Prescriptions */}
          {activePrescriptions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Active Prescriptions ({activePrescriptions.length})
              </h2>
              <div className="grid gap-4">
                {activePrescriptions.map((rx) => (
                  <Card key={rx.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{rx.medication}</h3>
                              <p className="text-sm text-gray-600">{rx.dosage} • Qty: {rx.quantity}</p>
                            </div>
                            {getStatusBadge(rx.pharmacyStatus)}
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Status Update</p>
                            <p className="text-sm text-blue-700">{getStatusMessage(rx.pharmacyStatus)}</p>
                            {rx.pharmacyNotes && (
                              <p className="text-sm text-blue-600 mt-2 italic">&quot;{rx.pharmacyNotes}&quot;</p>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600 font-semibold">Pharmacy</p>
                              <p className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {rx.pharmacyName}
                              </p>
                              <p className="text-gray-600 text-xs ml-4">{rx.pharmacyAddress}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-semibold">Prescribed By</p>
                              <p>{rx.doctorName}</p>
                              <p className="text-gray-600 text-xs">Date: {new Date(rx.datePrescribed).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:w-48">
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            onClick={() => openDetails(rx)}
                          >
                            <FileText className="w-4 h-4" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            onClick={() => window.location.href = `tel:${rx.pharmacyPhone}`}
                          >
                            <Phone className="w-4 h-4" />
                            Call Pharmacy
                          </Button>
                          {rx.pharmacyStatus === "ready" && (
                            <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                              <MapPin className="w-4 h-4" />
                              Get Directions
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Prescription History */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-600" />
              Prescription History ({completedPrescriptions.length})
            </h2>
            {completedPrescriptions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No completed prescriptions yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {completedPrescriptions.map((rx) => (
                  <Card key={rx.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{rx.medication}</h3>
                              <p className="text-sm text-gray-600">{rx.dosage} • Qty: {rx.quantity}</p>
                            </div>
                            {getStatusBadge(rx.pharmacyStatus)}
                          </div>
                          <div className="grid md:grid-cols-2 gap-3 text-sm mt-3">
                            <div>
                              <p className="text-gray-600">Pharmacy: {rx.pharmacyName}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Prescribed: {new Date(rx.datePrescribed).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDetails(rx)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Help Section */}
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-green-600" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Questions about your prescription?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Contact your pharmacy directly using the phone number shown above.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Medical questions?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Contact your prescribing physician for medical advice.
                  </p>
                </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">RX Number</p>
                  <p className="font-mono text-lg">{selectedPrescription.id}</p>
                </div>
                {getStatusBadge(selectedPrescription.pharmacyStatus)}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Medication Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Medication</p>
                    <p className="text-lg">{selectedPrescription.medication}</p>
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
                <h3 className="font-semibold mb-3">Pharmacy Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Name</p>
                    <p>{selectedPrescription.pharmacyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Address</p>
                    <p>{selectedPrescription.pharmacyAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Phone</p>
                    <p>{selectedPrescription.pharmacyPhone}</p>
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

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => window.location.href = `tel:${selectedPrescription.pharmacyPhone}`}
                >
                  <Phone className="w-4 h-4" />
                  Call Pharmacy
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}