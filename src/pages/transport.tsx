import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Truck, MapPin, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Manifest {
  id: string;
  destination: string;
  driver: string;
  vehicle: string;
  departureTime: string;
  items: number;
  status: string;
}

export default function Transport() {
  const [manifests, setManifests] = useState<Manifest[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("transportManifests");
    if (saved) {
      setManifests(JSON.parse(saved));
    } else {
      const demoManifests: Manifest[] = [
        { id: "MF-2026-001", destination: "Island Dispensary #1", driver: "James Smith", vehicle: "Van-01", departureTime: "2026-01-16 09:00", items: 50, status: "In Transit" },
        { id: "MF-2026-002", destination: "Green Lab Analytics", driver: "Sarah Johnson", vehicle: "Car-03", departureTime: "2026-01-16 10:30", items: 5, status: "Delivered" },
        { id: "MF-2026-003", destination: "Resort Wellness Center", driver: "Mike Davis", vehicle: "Van-02", departureTime: "2026-01-17 08:00", items: 25, status: "Scheduled" },
      ];
      setManifests(demoManifests);
      localStorage.setItem("transportManifests", JSON.stringify(demoManifests));
    }
  }, []);

  const handleAddManifest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newManifest: Manifest = {
      id: `MF-2026-${(manifests.length + 1).toString().padStart(3, '0')}`,
      destination: formData.get("destination") as string,
      driver: formData.get("driver") as string,
      vehicle: formData.get("vehicle") as string,
      departureTime: formData.get("departureTime") as string,
      items: Number(formData.get("items")),
      status: "Scheduled"
    };
    const updatedManifests = [...manifests, newManifest];
    setManifests(updatedManifests);
    localStorage.setItem("transportManifests", JSON.stringify(updatedManifests));
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Scheduled": "bg-blue-100 text-blue-800",
      "In Transit": "bg-orange-100 text-orange-800",
      "Delivered": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <SEO title="Transport & Logistics - Marijuana Bahamas" />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-6 h-6 text-orange-600" />
              Transport Management
            </h1>
            <div className="w-32"></div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{manifests.filter(m => m.status === "In Transit").length}</p>
                    <p className="text-sm text-gray-600">Active Deliveries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{manifests.filter(m => m.status === "Scheduled").length}</p>
                    <p className="text-sm text-gray-600">Scheduled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{manifests.filter(m => m.status === "Delivered").length}</p>
                    <p className="text-sm text-gray-600">Completed (Week)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm text-gray-600">Manifest Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Manifest Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Delivery Manifests</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                    <Plus className="w-4 h-4" />
                    New Manifest
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Transport Manifest</DialogTitle>
                    <DialogDescription>Generate a new compliant delivery manifest</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddManifest} className="space-y-4">
                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <Input id="destination" name="destination" placeholder="Business Name or Address" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="driver">Driver</Label>
                        <Input id="driver" name="driver" placeholder="Driver Name" required />
                      </div>
                      <div>
                        <Label htmlFor="vehicle">Vehicle</Label>
                        <Input id="vehicle" name="vehicle" placeholder="Vehicle ID" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="departureTime">Departure Time</Label>
                      <Input id="departureTime" name="departureTime" type="datetime-local" required />
                    </div>
                    <div>
                      <Label htmlFor="items">Item Count</Label>
                      <Input id="items" name="items" type="number" min="1" required />
                    </div>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Create Manifest</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manifest ID</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Driver/Vehicle</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manifests.map((manifest) => (
                    <TableRow key={manifest.id}>
                      <TableCell className="font-medium">{manifest.id}</TableCell>
                      <TableCell>{manifest.destination}</TableCell>
                      <TableCell>
                        <div className="text-sm">{manifest.driver}</div>
                        <div className="text-xs text-gray-500">{manifest.vehicle}</div>
                      </TableCell>
                      <TableCell>{manifest.departureTime.replace('T', ' ')}</TableCell>
                      <TableCell>{manifest.items}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(manifest.status)}>{manifest.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}