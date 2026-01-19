import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Factory, Package, Scale, Timer } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CannabisLeaf } from "@/components/CannabisLeaf";

interface ProductBatch {
  id: string;
  productName: string;
  type: string;
  sourceBatch: string;
  quantity: number;
  units: string;
  status: string;
  dateCreated: string;
}

export default function Manufacturing() {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("manufacturingBatches");
    if (saved) {
      setBatches(JSON.parse(saved));
    } else {
      const demoBatches: ProductBatch[] = [
        { id: "M5001", productName: "Blue Dream Wax", type: "Concentrate", sourceBatch: "B1240", quantity: 500, units: "g", status: "Processing", dateCreated: "2026-01-14" },
        { id: "M5002", productName: "OG Kush Pre-rolls", type: "Pre-roll", sourceBatch: "B1241", quantity: 1000, units: "units", status: "Packaging", dateCreated: "2026-01-15" },
        { id: "M5003", productName: "CBD Tincture", type: "Infusion", sourceBatch: "B1242", quantity: 200, units: "bottles", status: "Completed", dateCreated: "2026-01-10" },
      ];
      setBatches(demoBatches);
      localStorage.setItem("manufacturingBatches", JSON.stringify(demoBatches));
    }
  }, []);

  const handleAddBatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBatch: ProductBatch = {
      id: `M${5000 + batches.length + 1}`,
      productName: formData.get("productName") as string,
      type: formData.get("type") as string,
      sourceBatch: formData.get("sourceBatch") as string,
      quantity: Number(formData.get("quantity")),
      units: formData.get("units") as string,
      status: "Processing",
      dateCreated: new Date().toISOString().split('T')[0]
    };
    const updatedBatches = [...batches, newBatch];
    setBatches(updatedBatches);
    localStorage.setItem("manufacturingBatches", JSON.stringify(updatedBatches));
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Processing": "bg-blue-100 text-blue-800",
      "Packaging": "bg-yellow-100 text-yellow-800",
      "Completed": "bg-green-100 text-green-800",
      "QA Hold": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <SEO title="Manufacturing - Cannabis Tracking" />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <CannabisLeaf className="absolute top-20 left-20 text-purple-600/4 -rotate-12" size={320} />
          <CannabisLeaf className="absolute bottom-40 right-10 text-emerald-600/5 rotate-45" size={380} />
          <CannabisLeaf className="absolute top-1/3 right-1/4 text-green-600/3 rotate-90" size={280} />
        </div>

        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Factory className="w-6 h-6 text-purple-600" />
              Manufacturing
            </h1>
            <div className="w-32"></div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <CannabisLeaf className="text-purple-600" size={70} />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Factory className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{batches.filter(b => b.status === "Processing").length}</p>
                    <p className="text-sm text-gray-600">Active Processes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <CannabisLeaf className="text-blue-600" size={70} />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{batches.filter(b => b.status === "Packaging").length}</p>
                    <p className="text-sm text-gray-600">In Packaging</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <CannabisLeaf className="text-green-600" size={70} />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">124.5 kg</p>
                    <p className="text-sm text-gray-600">Total Output (Month)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <CannabisLeaf className="text-orange-600" size={70} />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Timer className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-sm text-gray-600">Efficiency Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Manufacturing Batches</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4" />
                    New Batch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Manufacturing Batch</DialogTitle>
                    <DialogDescription>Start a new processing or manufacturing run</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddBatch} className="space-y-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input id="productName" name="productName" placeholder="e.g., Blue Dream Wax" required />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Concentrate">Concentrate</SelectItem>
                          <SelectItem value="Edible">Edible</SelectItem>
                          <SelectItem value="Pre-roll">Pre-roll</SelectItem>
                          <SelectItem value="Infusion">Infusion</SelectItem>
                          <SelectItem value="Topical">Topical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sourceBatch">Source Material Batch</Label>
                      <Input id="sourceBatch" name="sourceBatch" placeholder="e.g., B1240" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" name="quantity" type="number" required />
                      </div>
                      <div>
                        <Label htmlFor="units">Units</Label>
                        <Select name="units" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Units" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">Grams</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="units">Units</SelectItem>
                            <SelectItem value="bottles">Bottles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Create Batch</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Started</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>{batch.productName}</TableCell>
                      <TableCell>{batch.type}</TableCell>
                      <TableCell>{batch.sourceBatch}</TableCell>
                      <TableCell>{batch.quantity} {batch.units}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                      </TableCell>
                      <TableCell>{batch.dateCreated}</TableCell>
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