import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Sprout, Calendar, Droplets, ThermometerSun, Eye, Printer, Edit, ArrowRight, Download, Search, Filter, X, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { PlantLabel } from "@/components/PlantLabel";
import { PlantTimeline } from "@/components/PlantTimeline";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Plant {
  id: string;
  strain: string;
  stage: string;
  plantedDate: string;
  batchNumber: string;
  location: string;
  health: string;
  notes: string;
  timeline: {
    stage: string;
    date: string;
    notes?: string;
    completed: boolean;
  }[];
  environmental: {
    temperature: string;
    humidity: string;
    lightCycle: string;
    phLevel: string;
  };
}

interface Filters {
  stage: string;
  strain: string;
  health: string;
  location: string;
  search: string;
}

export default function Cultivation() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  const [isStageUpdateOpen, setIsStageUpdateOpen] = useState(false);
  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    stage: "all",
    strain: "all",
    health: "all",
    location: "all",
    search: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("cultivationPlants");
    if (saved) {
      try {
        setPlants(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing cultivation data:", error);
        setPlants([]);
      }
    } else {
      const demoPlants: Plant[] = [
        {
          id: "P1001",
          strain: "Blue Dream",
          stage: "Flowering",
          plantedDate: "2025-12-01",
          batchNumber: "B1247",
          location: "Room A1",
          health: "Excellent",
          notes: "Strong growth, no pest issues",
          timeline: [
            { stage: "Seedling", date: "2025-12-01", completed: true, notes: "Germinated successfully" },
            { stage: "Vegetative", date: "2025-12-15", completed: true, notes: "Healthy vegetative growth" },
            { stage: "Flowering", date: "2026-01-05", completed: true, notes: "Flowers developing well" },
            { stage: "Harvesting", date: "TBD", completed: false },
            { stage: "Cured", date: "TBD", completed: false }
          ],
          environmental: {
            temperature: "72°F",
            humidity: "65%",
            lightCycle: "12/12",
            phLevel: "6.2"
          }
        },
        {
          id: "P1002",
          strain: "OG Kush",
          stage: "Vegetative",
          plantedDate: "2025-12-15",
          batchNumber: "B1248",
          location: "Room A2",
          health: "Good",
          notes: "Slight nutrient deficiency, adjusted feeding",
          timeline: [
            { stage: "Seedling", date: "2025-12-15", completed: true, notes: "Healthy start" },
            { stage: "Vegetative", date: "2025-12-29", completed: true, notes: "Growing steadily" },
            { stage: "Flowering", date: "TBD", completed: false },
            { stage: "Harvesting", date: "TBD", completed: false },
            { stage: "Cured", date: "TBD", completed: false }
          ],
          environmental: {
            temperature: "74°F",
            humidity: "68%",
            lightCycle: "18/6",
            phLevel: "6.0"
          }
        },
        {
          id: "P1003",
          strain: "Sour Diesel",
          stage: "Seedling",
          plantedDate: "2026-01-05",
          batchNumber: "B1249",
          location: "Room B1",
          health: "Excellent",
          notes: "New batch, monitoring closely",
          timeline: [
            { stage: "Seedling", date: "2026-01-05", completed: true, notes: "Just sprouted" },
            { stage: "Vegetative", date: "TBD", completed: false },
            { stage: "Flowering", date: "TBD", completed: false },
            { stage: "Harvesting", date: "TBD", completed: false },
            { stage: "Cured", date: "TBD", completed: false }
          ],
          environmental: {
            temperature: "70°F",
            humidity: "70%",
            lightCycle: "18/6",
            phLevel: "6.1"
          }
        },
        {
          id: "P1004",
          strain: "Blue Dream",
          stage: "Flowering",
          plantedDate: "2025-12-05",
          batchNumber: "B1247",
          location: "Room A1",
          health: "Good",
          notes: "Growing well",
          timeline: [
            { stage: "Seedling", date: "2025-12-05", completed: true, notes: "Started strong" },
            { stage: "Vegetative", date: "2025-12-20", completed: true, notes: "Healthy growth" },
            { stage: "Flowering", date: "2026-01-10", completed: true, notes: "Flowering stage" },
            { stage: "Harvesting", date: "TBD", completed: false },
            { stage: "Cured", date: "TBD", completed: false }
          ],
          environmental: {
            temperature: "73°F",
            humidity: "64%",
            lightCycle: "12/12",
            phLevel: "6.3"
          }
        },
        {
          id: "P1005",
          strain: "Purple Haze",
          stage: "Vegetative",
          plantedDate: "2025-12-20",
          batchNumber: "B1250",
          location: "Room B2",
          health: "Excellent",
          notes: "Vigorous growth",
          timeline: [
            { stage: "Seedling", date: "2025-12-20", completed: true, notes: "Quick germination" },
            { stage: "Vegetative", date: "2026-01-03", completed: true, notes: "Strong vegetative phase" },
            { stage: "Flowering", date: "TBD", completed: false },
            { stage: "Harvesting", date: "TBD", completed: false },
            { stage: "Cured", date: "TBD", completed: false }
          ],
          environmental: {
            temperature: "71°F",
            humidity: "67%",
            lightCycle: "18/6",
            phLevel: "6.1"
          }
        }
      ];
      setPlants(demoPlants);
      localStorage.setItem("cultivationPlants", JSON.stringify(demoPlants));
    }
  }, []);

  // Filtered plants based on active filters
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesStage = filters.stage === "all" || plant.stage === filters.stage;
      const matchesStrain = filters.strain === "all" || plant.strain === filters.strain;
      const matchesHealth = filters.health === "all" || plant.health === filters.health;
      const matchesLocation = filters.location === "all" || plant.location === filters.location;
      const matchesSearch = filters.search === "" || 
        plant.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        plant.strain.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStage && matchesStrain && matchesHealth && matchesLocation && matchesSearch;
    });
  }, [plants, filters]);

  // Get unique values for filter dropdowns
  const uniqueStrains = useMemo(() => [...new Set(plants.map(p => p.strain))], [plants]);
  const uniqueLocations = useMemo(() => [...new Set(plants.map(p => p.location))], [plants]);

  // Chart data
  const stageDistribution = useMemo(() => {
    const stages = ["Seedling", "Vegetative", "Flowering", "Harvesting", "Cured"];
    return stages.map(stage => ({
      name: stage,
      value: plants.filter(p => p.stage === stage).length
    })).filter(item => item.value > 0);
  }, [plants]);

  const healthDistribution = useMemo(() => {
    const healthLevels = ["Excellent", "Good", "Fair", "Poor"];
    return healthLevels.map(health => ({
      name: health,
      value: plants.filter(p => p.health === health).length
    })).filter(item => item.value > 0);
  }, [plants]);

  const strainDistribution = useMemo(() => {
    return uniqueStrains.map(strain => ({
      name: strain,
      count: plants.filter(p => p.strain === strain).length
    }));
  }, [plants, uniqueStrains]);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

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
      health: "Excellent",
      notes: "",
      timeline: [
        { stage: "Seedling", date: formData.get("plantedDate") as string, completed: true, notes: "Initial planting" },
        { stage: "Vegetative", date: "TBD", completed: false },
        { stage: "Flowering", date: "TBD", completed: false },
        { stage: "Harvesting", date: "TBD", completed: false },
        { stage: "Cured", date: "TBD", completed: false }
      ],
      environmental: {
        temperature: "72°F",
        humidity: "65%",
        lightCycle: "18/6",
        phLevel: "6.0"
      }
    };
    const updatedPlants = [...plants, newPlant];
    setPlants(updatedPlants);
    localStorage.setItem("cultivationPlants", JSON.stringify(updatedPlants));
    setIsAddDialogOpen(false);
  };

  const handleUpdateStage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlant) return;
    
    const formData = new FormData(e.currentTarget);
    const newStage = formData.get("newStage") as string;
    const stageDate = formData.get("stageDate") as string;
    const stageNotes = formData.get("stageNotes") as string;

    const updatedTimeline = selectedPlant.timeline.map(entry => {
      if (entry.stage === newStage) {
        return { ...entry, date: stageDate, notes: stageNotes, completed: true };
      }
      return entry;
    });

    const updatedPlant = {
      ...selectedPlant,
      stage: newStage,
      timeline: updatedTimeline
    };

    const updatedPlants = plants.map(p => p.id === selectedPlant.id ? updatedPlant : p);
    setPlants(updatedPlants);
    localStorage.setItem("cultivationPlants", JSON.stringify(updatedPlants));
    setSelectedPlant(updatedPlant);
    setIsStageUpdateOpen(false);
  };

  const handleUpdateNotes = (notes: string) => {
    if (!selectedPlant) return;
    const updatedPlant = { ...selectedPlant, notes };
    const updatedPlants = plants.map(p => p.id === selectedPlant.id ? updatedPlant : p);
    setPlants(updatedPlants);
    localStorage.setItem("cultivationPlants", JSON.stringify(updatedPlants));
    setSelectedPlant(updatedPlant);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "Seedling": "bg-yellow-100 text-yellow-800",
      "Vegetative": "bg-green-100 text-green-800",
      "Flowering": "bg-purple-100 text-purple-800",
      "Harvesting": "bg-blue-100 text-blue-800",
      "Cured": "bg-gray-100 text-gray-800"
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const handlePrintLabel = () => {
    if (!selectedPlant) return;
    window.print();
  };

  const clearFilters = () => {
    setFilters({
      stage: "all",
      strain: "all",
      health: "all",
      location: "all",
      search: ""
    });
  };

  const hasActiveFilters = filters.stage !== "all" || filters.strain !== "all" || 
    filters.health !== "all" || filters.location !== "all" || filters.search !== "";

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Plant ID", "Strain", "Stage", "Batch", "Location", "Planted Date", "Health", "Days in Growth", "Notes"];
    const rows = filteredPlants.map(plant => [
      plant.id,
      plant.strain,
      plant.stage,
      plant.batchNumber,
      plant.location,
      plant.plantedDate,
      plant.health,
      Math.floor((new Date().getTime() - new Date(plant.plantedDate).getTime()) / (1000 * 60 * 60 * 24)),
      plant.notes.replace(/,/g, ";") // Replace commas in notes
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plant-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredPlants, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plant-inventory-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Print Report
  const printReport = () => {
    window.print();
  };

  // Safe calculation with proper array check
  const floweringCount = plants?.filter(p => p?.stage === "Flowering")?.length || 0;

  return (
    <>
      <SEO title="Cultivation - Plant Tracking & Labeling" />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <CannabisLeaf className="absolute top-10 right-20 text-green-600/4 rotate-45" size={350} />
          <CannabisLeaf className="absolute bottom-32 left-10 text-emerald-600/5 -rotate-12" size={280} />
          <CannabisLeaf className="absolute top-1/2 left-1/3 text-green-500/3 rotate-90" size={400} />
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
              <Sprout className="w-6 h-6 text-green-600" />
              Plant Tracking & Labeling
            </h1>
            <div className="w-32"></div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <CannabisLeaf className="text-green-600" size={70} />
              </div>
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
            <Card className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <CannabisLeaf className="text-purple-600" size={70} />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{floweringCount}</p>
                    <p className="text-sm text-gray-600">Flowering</p>
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
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">65%</p>
                    <p className="text-sm text-gray-600">Avg Humidity</p>
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

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {hasActiveFilters && (
                    <Badge variant="secondary">{filteredPlants.length} results</Badge>
                  )}
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                    <X className="w-4 h-4" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by ID or strain..."
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Stage Filter */}
                <div>
                  <Label htmlFor="stageFilter">Growth Stage</Label>
                  <Select value={filters.stage} onValueChange={(value) => setFilters({...filters, stage: value})}>
                    <SelectTrigger id="stageFilter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="Seedling">Seedling</SelectItem>
                      <SelectItem value="Vegetative">Vegetative</SelectItem>
                      <SelectItem value="Flowering">Flowering</SelectItem>
                      <SelectItem value="Harvesting">Harvesting</SelectItem>
                      <SelectItem value="Cured">Cured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Strain Filter */}
                <div>
                  <Label htmlFor="strainFilter">Strain</Label>
                  <Select value={filters.strain} onValueChange={(value) => setFilters({...filters, strain: value})}>
                    <SelectTrigger id="strainFilter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Strains</SelectItem>
                      {uniqueStrains.map(strain => (
                        <SelectItem key={strain} value={strain}>{strain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <Label htmlFor="locationFilter">Location</Label>
                  <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                    <SelectTrigger id="locationFilter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {uniqueLocations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plant Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Plant Inventory ({filteredPlants.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsChartsDialogOpen(true)} className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Statistics
                </Button>
                <Button variant="outline" onClick={exportToCSV} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
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
                      <DialogDescription>Enter the details for the new plant</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPlant} className="space-y-4">
                      <div>
                        <Label htmlFor="strain">Strain</Label>
                        <Input id="strain" name="strain" placeholder="e.g., Blue Dream" required />
                      </div>
                      <div>
                        <Label htmlFor="stage">Initial Growth Stage</Label>
                        <Select name="stage" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Seedling">Seedling</SelectItem>
                            <SelectItem value="Vegetative">Vegetative</SelectItem>
                            <SelectItem value="Flowering">Flowering</SelectItem>
                            <SelectItem value="Harvesting">Harvesting</SelectItem>
                            <SelectItem value="Cured">Cured</SelectItem>
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
              </div>
            </CardHeader>
            <CardContent>
              {filteredPlants.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Sprout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No plants match your filters</p>
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear filters
                  </Button>
                </div>
              ) : (
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlants.map((plant) => (
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
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPlant(plant);
                                setIsDetailDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPlant(plant);
                                setIsLabelDialogOpen(true);
                              }}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics Charts Dialog */}
      <Dialog open={isChartsDialogOpen} onOpenChange={setIsChartsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Plant Growth Statistics
            </DialogTitle>
            <DialogDescription>
              Visual analytics and insights for your plant inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plants by Growth Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Strain Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plants by Strain</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={strainDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Health Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={healthDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Export Options */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={exportToJSON} className="gap-2">
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={printReport} className="gap-2">
                <Printer className="w-4 h-4" />
                Print Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plant Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPlant && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  Plant Details - {selectedPlant.id}
                </DialogTitle>
                <DialogDescription>
                  Complete tracking information for {selectedPlant.strain}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="environmental">Environmental</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Plant Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Plant ID:</span> {selectedPlant.id}
                        </div>
                        <div>
                          <span className="font-semibold">Strain:</span> {selectedPlant.strain}
                        </div>
                        <div>
                          <span className="font-semibold">Current Stage:</span>{" "}
                          <Badge className={getStageColor(selectedPlant.stage)}>{selectedPlant.stage}</Badge>
                        </div>
                        <div>
                          <span className="font-semibold">Batch Number:</span> {selectedPlant.batchNumber}
                        </div>
                        <div>
                          <span className="font-semibold">Location:</span> {selectedPlant.location}
                        </div>
                        <div>
                          <span className="font-semibold">Health Status:</span>{" "}
                          <Badge variant="outline" className="text-green-600">{selectedPlant.health}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Dates & Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Planted:</span> {selectedPlant.plantedDate}
                        </div>
                        <div>
                          <span className="font-semibold">Days in Growth:</span>{" "}
                          {Math.floor((new Date().getTime() - new Date(selectedPlant.plantedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                        <div>
                          <span className="font-semibold">Completed Stages:</span>{" "}
                          {selectedPlant.timeline.filter(t => t.completed).length} / {selectedPlant.timeline.length}
                        </div>
                        <div className="pt-2">
                          <Button 
                            size="sm" 
                            className="w-full gap-2"
                            onClick={() => setIsStageUpdateOpen(true)}
                          >
                            <ArrowRight className="w-4 h-4" />
                            Update Growth Stage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Growth Timeline</CardTitle>
                      <CardDescription>Track the plant through each growth stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PlantTimeline timeline={selectedPlant.timeline} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="environmental">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Environmental Conditions</CardTitle>
                      <CardDescription>Current environmental parameters</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Temperature</Label>
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="w-5 h-5 text-orange-500" />
                            <span className="text-2xl font-bold">{selectedPlant.environmental.temperature}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Humidity</Label>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-blue-500" />
                            <span className="text-2xl font-bold">{selectedPlant.environmental.humidity}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Light Cycle</Label>
                          <div className="text-2xl font-bold">{selectedPlant.environmental.lightCycle}</div>
                          <p className="text-xs text-gray-500">Hours On/Off</p>
                        </div>
                        <div className="space-y-2">
                          <Label>pH Level</Label>
                          <div className="text-2xl font-bold">{selectedPlant.environmental.phLevel}</div>
                          <p className="text-xs text-gray-500">Optimal range: 6.0-7.0</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Cultivation Notes</CardTitle>
                      <CardDescription>Add observations and care notes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={selectedPlant.notes}
                        onChange={(e) => handleUpdateNotes(e.target.value)}
                        placeholder="Add notes about plant health, treatments, observations..."
                        rows={8}
                      />
                      <p className="text-xs text-gray-500">Notes are saved automatically</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Stage Update Dialog */}
      <Dialog open={isStageUpdateOpen} onOpenChange={setIsStageUpdateOpen}>
        <DialogContent>
          {selectedPlant && (
            <>
              <DialogHeader>
                <DialogTitle>Update Growth Stage</DialogTitle>
                <DialogDescription>
                  Move {selectedPlant.strain} ({selectedPlant.id}) to the next growth stage
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateStage} className="space-y-4">
                <div>
                  <Label htmlFor="newStage">New Stage</Label>
                  <Select name="newStage" required defaultValue={selectedPlant.stage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Seedling">Seedling</SelectItem>
                      <SelectItem value="Vegetative">Vegetative</SelectItem>
                      <SelectItem value="Flowering">Flowering</SelectItem>
                      <SelectItem value="Harvesting">Harvesting</SelectItem>
                      <SelectItem value="Cured">Cured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stageDate">Date</Label>
                  <Input
                    id="stageDate"
                    name="stageDate"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="stageNotes">Stage Notes</Label>
                  <Textarea
                    id="stageNotes"
                    name="stageNotes"
                    placeholder="Add notes about this stage transition..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">Update Stage</Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Label Print Dialog */}
      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedPlant && (
            <>
              <DialogHeader>
                <DialogTitle>Plant Label - {selectedPlant.id}</DialogTitle>
                <DialogDescription>
                  Compliance label for {selectedPlant.strain}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <PlantLabel
                    plantId={selectedPlant.id}
                    strain={selectedPlant.strain}
                    plantedDate={selectedPlant.plantedDate}
                    batchNumber={selectedPlant.batchNumber}
                    location={selectedPlant.location}
                    stage={selectedPlant.stage}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePrintLabel} className="flex-1 gap-2">
                    <Printer className="w-4 h-4" />
                    Print Label
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download PDF
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-500">
                  Labels are compliant with state tracking requirements
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}