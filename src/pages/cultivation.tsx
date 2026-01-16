import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Sprout, Calendar, Droplets, ThermometerSun } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Plant {
  id: string;
  strain: string;
  stage: string;
  plantedDate: string;
  batchNumber: string;
  location: string;
  health: string;
}

export default function Cultivation() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cultivationPlants");
    if (saved) {
      setPlants(JSON.parse(saved));
    } else {
      const demoPlants: Plant[] = [
        { id: "P1001", strain: "Blue Dream", stage: "Flowering", plantedDate: "2025-12-01", batchNumber: "B1247", location: "Room A1", health: "Excellent" },
        { id: "P1002", strain: "OG Kush", stage: "Vegetative", plantedDate: "2025-12-15", batchNumber: "B1248", location: "Room A2", health: "Good" },
        { id: "P1003", strain: "Sour Diesel", stage: "Seedling", plantedDate: "2026-01-05", batchNumber: "B1249", location: "Room B1", health: "Excellent" },
      ];
      setPlants(demoPlants);
      localStorage.setItem("cultivationPlants", JSON.stringify(demoPlants));
    }
  }, []);

  const handleAddPlant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPlant: Plant = {
      id: `P${1000 + plants.length + 1}`,
      strain: formData.get("strain") as string,
      stage: formData.get("stage") as string,
      plantedDate: formData.get("plantedDate") as string,
      batchNumber: formData.get("batchNumber") as string,
      location: formData.get("location") as string,
      health: "Excellent"
    };
    const updatedPlants = [...plants, newPlant];
    setPlants(updatedPlants);
    localStorage.setItem("cultivationPlants", JSON.stringify(updatedPlants));
    setIsAddDialogOpen(false);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "Seedling": "bg-yellow-100 text-yellow-800",
      "Vegetative": "bg-green-100 text-green-800",
      "Flowering": "bg-purple-100 text-purple-800",
      "Harvest": "bg-blue-100 text-blue-800"
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <SEO title="Cultivation - Marijuana Bahamas" />
      
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
              <Sprout className="w-6 h-6 text-green-600" />
              Cultivation Management
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
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{plants.length}</p>
                    <p className="text-sm text-gray-600">Active Plants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {plants.filter(p => p.stage === "Flowering").length}
                    </p>
                    <p className="text-sm text-gray-600">Flowering</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">65%</p>
                    <p className="text-sm text-gray-600">Avg Humidity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ThermometerSun className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">72°F</p>
                    <p className="text-sm text-gray-600">Avg Temp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plant Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Plant Inventory</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Plant
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Plant</DialogTitle>
                    <DialogDescription>Enter the details for the new plant batch</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPlant} className="space-y-4">
                    <div>
                      <Label htmlFor="strain">Strain</Label>
                      <Input id="strain" name="strain" placeholder="e.g., Blue Dream" required />
                    </div>
                    <div>
                      <Label htmlFor="stage">Growth Stage</Label>
                      <Select name="stage" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Seedling">Seedling</SelectItem>
                          <SelectItem value="Vegetative">Vegetative</SelectItem>
                          <SelectItem value="Flowering">Flowering</SelectItem>
                          <SelectItem value="Harvest">Harvest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="plantedDate">Planted Date</Label>
                      <Input id="plantedDate" name="plantedDate" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="batchNumber">Batch Number</Label>
                      <Input id="batchNumber" name="batchNumber" placeholder="e.g., B1250" required />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" placeholder="e.g., Room A1" required />
                    </div>
                    <Button type="submit" className="w-full">Add Plant</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plant ID</TableHead>
                    <TableHead>Strain</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Planted Date</TableHead>
                    <TableHead>Health</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plants.map((plant) => (
                    <TableRow key={plant.id}>
                      <TableCell className="font-medium">{plant.id}</TableCell>
                      <TableCell>{plant.strain}</TableCell>
                      <TableCell>
                        <Badge className={getStageColor(plant.stage)}>{plant.stage}</Badge>
                      </TableCell>
                      <TableCell>{plant.batchNumber}</TableCell>
                      <TableCell>{plant.location}</TableCell>
                      <TableCell>{plant.plantedDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">{plant.health}</Badge>
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