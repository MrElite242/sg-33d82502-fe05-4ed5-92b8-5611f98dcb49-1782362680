import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { Package, AlertTriangle, TrendingDown, Search, Plus, ArrowLeft, Download, Filter, Leaf, FlaskConical, Cookie, Cigarette, Droplet, CheckCircle2, XCircle, Clock, ArrowUpRight, ArrowDownRight, RefreshCw, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

interface InventoryItem {
  id: string;
  sku: string;
  batchNumber: string;
  productName: string;
  category: "flower" | "concentrate" | "edible" | "vape" | "topical";
  strain?: string;
  quantity: number;
  unit: "g" | "oz" | "lb" | "unit" | "ml";
  thcPercentage?: number;
  cbdPercentage?: number;
  location: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "reserved";
  lastUpdated: string;
  expirationDate?: string;
  supplier?: string;
  costPerUnit: number;
  retailPrice: number;
}

interface InventoryMovement {
  id: string;
  itemId: string;
  sku: string;
  productName: string;
  type: "in" | "out" | "transfer" | "adjustment";
  quantity: number;
  from?: string;
  to?: string;
  reason: string;
  performedBy: string;
  timestamp: string;
}

export default function Inventory() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // New item form
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    category: "flower",
    unit: "g",
    status: "in-stock"
  });

  // Movement form
  const [newMovement, setNewMovement] = useState({
    type: "in" as "in" | "out" | "transfer" | "adjustment",
    quantity: 0,
    reason: "",
    from: "",
    to: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load from localStorage
    const savedInventory = localStorage.getItem("inventoryItems");
    const savedMovements = localStorage.getItem("inventoryMovements");

    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      // Demo data
      const demoInventory: InventoryItem[] = [
        {
          id: "inv-001",
          sku: "FL-OG-001",
          batchNumber: "BATCH-2026-001",
          productName: "OG Kush",
          category: "flower",
          strain: "OG Kush (Indica)",
          quantity: 2500,
          unit: "g",
          thcPercentage: 24.5,
          cbdPercentage: 0.8,
          location: "Vault A-12",
          status: "in-stock",
          lastUpdated: "2026-05-26",
          expirationDate: "2027-05-26",
          supplier: "Green Valley Cultivation",
          costPerUnit: 3.50,
          retailPrice: 12.00
        },
        {
          id: "inv-002",
          sku: "CON-WAX-002",
          batchNumber: "BATCH-2026-003",
          productName: "Blue Dream Wax",
          category: "concentrate",
          strain: "Blue Dream (Hybrid)",
          quantity: 450,
          unit: "g",
          thcPercentage: 82.3,
          cbdPercentage: 1.2,
          location: "Vault B-5",
          status: "in-stock",
          lastUpdated: "2026-05-25",
          expirationDate: "2027-05-25",
          supplier: "Mountain Extracts",
          costPerUnit: 15.00,
          retailPrice: 45.00
        },
        {
          id: "inv-003",
          sku: "ED-GUM-003",
          batchNumber: "BATCH-2026-005",
          productName: "Mango Gummies 10mg",
          category: "edible",
          quantity: 120,
          unit: "unit",
          thcPercentage: 10.0,
          location: "Cooler C-3",
          status: "low-stock",
          lastUpdated: "2026-05-27",
          expirationDate: "2026-08-27",
          supplier: "Sweet Relief Edibles",
          costPerUnit: 8.00,
          retailPrice: 22.00
        },
        {
          id: "inv-004",
          sku: "VP-510-004",
          batchNumber: "BATCH-2026-007",
          productName: "Sour Diesel Cartridge",
          category: "vape",
          strain: "Sour Diesel (Sativa)",
          quantity: 85,
          unit: "unit",
          thcPercentage: 88.5,
          location: "Vault D-8",
          status: "in-stock",
          lastUpdated: "2026-05-26",
          expirationDate: "2027-05-26",
          supplier: "Cloud9 Vapes",
          costPerUnit: 18.00,
          retailPrice: 55.00
        },
        {
          id: "inv-005",
          sku: "TOP-BAL-005",
          batchNumber: "BATCH-2026-009",
          productName: "CBD Pain Relief Balm",
          category: "topical",
          quantity: 24,
          unit: "unit",
          cbdPercentage: 500,
          location: "Shelf E-2",
          status: "low-stock",
          lastUpdated: "2026-05-24",
          expirationDate: "2026-11-24",
          supplier: "Wellness Botanicals",
          costPerUnit: 12.00,
          retailPrice: 35.00
        },
        {
          id: "inv-006",
          sku: "FL-GSC-006",
          batchNumber: "BATCH-2026-002",
          productName: "Girl Scout Cookies",
          category: "flower",
          strain: "GSC (Hybrid)",
          quantity: 150,
          unit: "g",
          thcPercentage: 21.8,
          cbdPercentage: 0.5,
          location: "Vault A-15",
          status: "low-stock",
          lastUpdated: "2026-05-27",
          expirationDate: "2027-05-27",
          supplier: "Green Valley Cultivation",
          costPerUnit: 3.25,
          retailPrice: 11.00
        }
      ];
      setInventory(demoInventory);
      localStorage.setItem("inventoryItems", JSON.stringify(demoInventory));
    }

    if (savedMovements) {
      setMovements(JSON.parse(savedMovements));
    } else {
      const demoMovements: InventoryMovement[] = [
        {
          id: "mov-001",
          itemId: "inv-001",
          sku: "FL-OG-001",
          productName: "OG Kush",
          type: "in",
          quantity: 1000,
          to: "Vault A-12",
          reason: "New harvest batch received",
          performedBy: "John Inventory Manager",
          timestamp: "2026-05-26T10:30:00Z"
        },
        {
          id: "mov-002",
          itemId: "inv-003",
          sku: "ED-GUM-003",
          productName: "Mango Gummies 10mg",
          type: "out",
          quantity: 48,
          from: "Cooler C-3",
          reason: "Retail sale",
          performedBy: "Sarah Cashier",
          timestamp: "2026-05-27T14:15:00Z"
        },
        {
          id: "mov-003",
          itemId: "inv-002",
          sku: "CON-WAX-002",
          productName: "Blue Dream Wax",
          type: "transfer",
          quantity: 50,
          from: "Vault B-5",
          to: "Retail Display",
          reason: "Stock retail shelves",
          performedBy: "Mike Floor Manager",
          timestamp: "2026-05-27T09:00:00Z"
        }
      ];
      setMovements(demoMovements);
      localStorage.setItem("inventoryMovements", JSON.stringify(demoMovements));
    }
  }, []);

  const handleAddItem = () => {
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: newItem.sku || "",
      batchNumber: newItem.batchNumber || "",
      productName: newItem.productName || "",
      category: newItem.category || "flower",
      strain: newItem.strain,
      quantity: newItem.quantity || 0,
      unit: newItem.unit || "g",
      thcPercentage: newItem.thcPercentage,
      cbdPercentage: newItem.cbdPercentage,
      location: newItem.location || "",
      status: newItem.status || "in-stock",
      lastUpdated: new Date().toISOString().split("T")[0],
      expirationDate: newItem.expirationDate,
      supplier: newItem.supplier,
      costPerUnit: newItem.costPerUnit || 0,
      retailPrice: newItem.retailPrice || 0
    };

    const updated = [...inventory, item];
    setInventory(updated);
    localStorage.setItem("inventoryItems", JSON.stringify(updated));
    setShowAddDialog(false);
    setNewItem({ category: "flower", unit: "g", status: "in-stock" });
  };

  const handleRecordMovement = () => {
    if (!selectedItem) return;

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      itemId: selectedItem.id,
      sku: selectedItem.sku,
      productName: selectedItem.productName,
      type: newMovement.type,
      quantity: newMovement.quantity,
      from: newMovement.from || selectedItem.location,
      to: newMovement.to,
      reason: newMovement.reason,
      performedBy: user?.full_name || "System",
      timestamp: new Date().toISOString()
    };

    const updatedMovements = [movement, ...movements];
    setMovements(updatedMovements);
    localStorage.setItem("inventoryMovements", JSON.stringify(updatedMovements));

    // Update inventory quantity
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        let newQuantity = item.quantity;
        if (newMovement.type === "in") {
          newQuantity += newMovement.quantity;
        } else if (newMovement.type === "out") {
          newQuantity -= newMovement.quantity;
        }

        // Update status based on quantity
        let newStatus = item.status;
        if (newQuantity === 0) {
          newStatus = "out-of-stock";
        } else if (newQuantity < 100) {
          newStatus = "low-stock";
        } else {
          newStatus = "in-stock";
        }

        return {
          ...item,
          quantity: newQuantity,
          status: newStatus,
          lastUpdated: new Date().toISOString().split("T")[0]
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    localStorage.setItem("inventoryItems", JSON.stringify(updatedInventory));
    setShowMovementDialog(false);
    setSelectedItem(null);
    setNewMovement({ type: "in", quantity: 0, reason: "", from: "", to: "" });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.retailPrice), 0),
    lowStockItems: inventory.filter(i => i.status === "low-stock").length,
    outOfStockItems: inventory.filter(i => i.status === "out-of-stock").length
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flower": return <Leaf className="w-4 h-4" />;
      case "concentrate": return <FlaskConical className="w-4 h-4" />;
      case "edible": return <Cookie className="w-4 h-4" />;
      case "vape": return <Cigarette className="w-4 h-4" />;
      case "topical": return <Droplet className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />In Stock</Badge>;
      case "low-stock":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</Badge>;
      case "out-of-stock":
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Out of Stock</Badge>;
      case "reserved":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" />Reserved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "in": return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case "out": return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case "transfer": return <RefreshCw className="w-4 h-4 text-blue-600" />;
      default: return <Package className="w-4 h-4" />;
    }
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
        title="Inventory Management - Blaze 360"
        description="Track batch numbers, stock levels, and inventory movements"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
        {/* Background Watermark */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.02]">
          <CannabisLeaf className="absolute top-10 left-10 text-emerald-600 rotate-12" size={200} />
          <CannabisLeaf className="absolute bottom-20 right-20 text-green-600 -rotate-45" size={250} />
        </div>

        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-2.5 rounded-xl shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Inventory Management</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track batches and stock levels</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total SKUs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-gray-600 mt-1">Unique products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">${stats.totalValue.toLocaleString()}</div>
                <p className="text-xs text-gray-600 mt-1">Retail value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{stats.lowStockItems}</div>
                <p className="text-xs text-gray-600 mt-1">Need reorder</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.outOfStockItems}</div>
                <p className="text-xs text-gray-600 mt-1">Critical</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {stats.lowStockItems > 0 && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>{stats.lowStockItems} items</strong> are running low on stock. Consider reordering soon.
              </AlertDescription>
            </Alert>
          )}

          {stats.outOfStockItems > 0 && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{stats.outOfStockItems} items</strong> are out of stock and unavailable for sale.
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
              <TabsTrigger value="movements">Movement History</TabsTrigger>
            </TabsList>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Inventory Items</CardTitle>
                      <CardDescription>Track all products with batch numbers and stock levels</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <DialogTrigger asChild>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add New Inventory Item</DialogTitle>
                            <DialogDescription>Enter product details and initial stock</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                  id="sku"
                                  placeholder="FL-OG-001"
                                  value={newItem.sku || ""}
                                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="batch">Batch Number</Label>
                                <Input
                                  id="batch"
                                  placeholder="BATCH-2026-001"
                                  value={newItem.batchNumber || ""}
                                  onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="productName">Product Name</Label>
                              <Input
                                id="productName"
                                placeholder="OG Kush"
                                value={newItem.productName || ""}
                                onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v as any })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="flower">Flower</SelectItem>
                                    <SelectItem value="concentrate">Concentrate</SelectItem>
                                    <SelectItem value="edible">Edible</SelectItem>
                                    <SelectItem value="vape">Vape</SelectItem>
                                    <SelectItem value="topical">Topical</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="strain">Strain (optional)</Label>
                                <Input
                                  id="strain"
                                  placeholder="OG Kush (Indica)"
                                  value={newItem.strain || ""}
                                  onChange={(e) => setNewItem({ ...newItem, strain: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  placeholder="1000"
                                  value={newItem.quantity || ""}
                                  onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select value={newItem.unit} onValueChange={(v) => setNewItem({ ...newItem, unit: v as any })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="g">Grams (g)</SelectItem>
                                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                                    <SelectItem value="unit">Units</SelectItem>
                                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  placeholder="Vault A-12"
                                  value={newItem.location || ""}
                                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="thc">THC % (optional)</Label>
                                <Input
                                  id="thc"
                                  type="number"
                                  step="0.1"
                                  placeholder="24.5"
                                  value={newItem.thcPercentage || ""}
                                  onChange={(e) => setNewItem({ ...newItem, thcPercentage: parseFloat(e.target.value) })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="cbd">CBD % (optional)</Label>
                                <Input
                                  id="cbd"
                                  type="number"
                                  step="0.1"
                                  placeholder="0.8"
                                  value={newItem.cbdPercentage || ""}
                                  onChange={(e) => setNewItem({ ...newItem, cbdPercentage: parseFloat(e.target.value) })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cost">Cost Per Unit ($)</Label>
                                <Input
                                  id="cost"
                                  type="number"
                                  step="0.01"
                                  placeholder="3.50"
                                  value={newItem.costPerUnit || ""}
                                  onChange={(e) => setNewItem({ ...newItem, costPerUnit: parseFloat(e.target.value) })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="retail">Retail Price ($)</Label>
                                <Input
                                  id="retail"
                                  type="number"
                                  step="0.01"
                                  placeholder="12.00"
                                  value={newItem.retailPrice || ""}
                                  onChange={(e) => setNewItem({ ...newItem, retailPrice: parseFloat(e.target.value) })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiration">Expiration Date (optional)</Label>
                                <Input
                                  id="expiration"
                                  type="date"
                                  value={newItem.expirationDate || ""}
                                  onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="supplier">Supplier (optional)</Label>
                                <Input
                                  id="supplier"
                                  placeholder="Green Valley Cultivation"
                                  value={newItem.supplier || ""}
                                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                            <Button onClick={handleAddItem} className="bg-emerald-600 hover:bg-emerald-700">Add Item</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by product name, SKU, or batch number..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="flower">Flower</SelectItem>
                        <SelectItem value="concentrate">Concentrate</SelectItem>
                        <SelectItem value="edible">Edible</SelectItem>
                        <SelectItem value="vape">Vape</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Inventory Table */}
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU / Batch</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Potency</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.productName}</div>
                                {item.strain && <div className="text-xs text-gray-600">{item.strain}</div>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <div className="font-mono font-semibold">{item.sku}</div>
                                <div className="text-gray-600">{item.batchNumber}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="gap-1 capitalize">
                                {getCategoryIcon(item.category)}
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                {item.thcPercentage && <div>THC: {item.thcPercentage}%</div>}
                                {item.cbdPercentage && <div>CBD: {item.cbdPercentage}%</div>}
                                {!item.thcPercentage && !item.cbdPercentage && <span className="text-gray-400">-</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold">
                                {item.quantity.toLocaleString()} {item.unit}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-gray-600">{item.location}</div>
                            </TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell>
                              <div className="font-semibold text-emerald-600">
                                ${(item.quantity * item.retailPrice).toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowMovementDialog(true);
                                }}
                              >
                                Record Movement
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredInventory.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No inventory items found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Movement History Tab */}
            <TabsContent value="movements">
              <Card>
                <CardHeader>
                  <CardTitle>Movement History</CardTitle>
                  <CardDescription>Track all inventory ins, outs, and transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {movements.map((movement) => (
                      <div key={movement.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="mt-1">{getMovementIcon(movement.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold">{movement.productName}</div>
                              <div className="text-xs text-gray-600">SKU: {movement.sku}</div>
                            </div>
                            <Badge variant="outline" className="capitalize">{movement.type}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Quantity</div>
                              <div className="font-semibold">{movement.quantity} units</div>
                            </div>
                            {movement.from && (
                              <div>
                                <div className="text-gray-600">From</div>
                                <div>{movement.from}</div>
                              </div>
                            )}
                            {movement.to && (
                              <div>
                                <div className="text-gray-600">To</div>
                                <div>{movement.to}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-gray-600">Performed By</div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {movement.performedBy}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="text-gray-600">Reason: {movement.reason}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(movement.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {movements.length === 0 && (
                      <div className="text-center py-12">
                        <RefreshCw className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No movement history yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Record Movement Dialog */}
          <Dialog open={showMovementDialog} onOpenChange={setShowMovementDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Inventory Movement</DialogTitle>
                <DialogDescription>
                  {selectedItem && `${selectedItem.productName} (${selectedItem.sku})`}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="movementType">Movement Type</Label>
                  <Select value={newMovement.type} onValueChange={(v) => setNewMovement({ ...newMovement, type: v as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Stock In (Receive)</SelectItem>
                      <SelectItem value="out">Stock Out (Sale/Use)</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="movementQuantity">Quantity</Label>
                  <Input
                    id="movementQuantity"
                    type="number"
                    placeholder="100"
                    value={newMovement.quantity || ""}
                    onChange={(e) => setNewMovement({ ...newMovement, quantity: parseFloat(e.target.value) })}
                  />
                  {selectedItem && (
                    <p className="text-xs text-gray-600">
                      Current stock: {selectedItem.quantity} {selectedItem.unit}
                    </p>
                  )}
                </div>

                {newMovement.type === "transfer" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="from">From Location</Label>
                      <Input
                        id="from"
                        placeholder={selectedItem?.location || "Current location"}
                        value={newMovement.from}
                        onChange={(e) => setNewMovement({ ...newMovement, from: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to">To Location</Label>
                      <Input
                        id="to"
                        placeholder="New location"
                        value={newMovement.to}
                        onChange={(e) => setNewMovement({ ...newMovement, to: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Retail sale, Restocking, Damaged goods"
                    value={newMovement.reason}
                    onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMovementDialog(false)}>Cancel</Button>
                <Button onClick={handleRecordMovement} className="bg-emerald-600 hover:bg-emerald-700">
                  Record Movement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}