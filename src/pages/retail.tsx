import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ShoppingCart, CreditCard, User, Search, X, CheckCircle2, AlertCircle, Printer, Package, TrendingUp, ScanLine } from "lucide-react";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  sku: string;
  batchNumber: string;
  productName: string;
  category: "flower" | "concentrate" | "edible" | "vape" | "topical";
  quantity: number;
  unit: string;
  retailPrice: number;
  status: string;
  thcPercentage?: number;
  cbdPercentage?: number;
}

interface CartItem extends InventoryItem {
  cartQuantity: number;
}

interface Sale {
  id: string;
  transactionNumber: string;
  items: Array<{
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
  timestamp: string;
  cashier: string;
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

export default function Retail() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load inventory items as products
    const savedInventory = localStorage.getItem("inventoryItems");
    if (savedInventory) {
      const inventory: InventoryItem[] = JSON.parse(savedInventory);
      // Only show items that are in stock
      const availableProducts = inventory.filter(item => 
        item.status === "in-stock" || item.status === "low-stock"
      );
      setProducts(availableProducts);
    }

    // Load sales history
    const savedSales = localStorage.getItem("salesHistory");
    if (savedSales) {
      setSalesHistory(JSON.parse(savedSales));
    }
  }, []);

  const addToCart = (product: InventoryItem) => {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      // Check if we can add more
      if (existing.cartQuantity >= product.quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.quantity} ${product.unit} available`,
          variant: "destructive"
        });
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, cartQuantity: item.cartQuantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: product.productName,
    });
  };

  const handleBarcodeScan = (barcode: string) => {
    const found = products.find(item => 
      item.sku === barcode || 
      item.batchNumber === barcode ||
      item.sku.toLowerCase().includes(barcode.toLowerCase()) ||
      item.productName.toLowerCase().includes(barcode.toLowerCase())
    );
    
    if (found) {
      addToCart(found);
      setShowScanner(false);
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive"
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, Math.min(item.quantity, item.cartQuantity + delta));
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.retailPrice * item.cartQuantity), 0);
  const tax = cartTotal * 0.12; // 12% tax
  const finalTotal = cartTotal + tax;

  const processPayment = async () => {
    if (cart.length === 0) return;

    setProcessing(true);

    try {
      // Create sale record
      const transactionNumber = `TXN-${Date.now()}`;
      const sale: Sale = {
        id: `sale-${Date.now()}`,
        transactionNumber,
        items: cart.map(item => ({
          sku: item.sku,
          productName: item.productName,
          quantity: item.cartQuantity,
          unitPrice: item.retailPrice,
          total: item.retailPrice * item.cartQuantity
        })),
        subtotal: cartTotal,
        tax,
        total: finalTotal,
        paymentMethod,
        customerName: customerName || "Guest",
        timestamp: new Date().toISOString(),
        cashier: user?.full_name || "Cashier"
      };

      // Update inventory for each item
      const savedInventory = localStorage.getItem("inventoryItems");
      if (savedInventory) {
        let inventory: InventoryItem[] = JSON.parse(savedInventory);
        
        // Deduct sold quantities
        inventory = inventory.map(invItem => {
          const soldItem = cart.find(c => c.id === invItem.id);
          if (soldItem) {
            const newQuantity = invItem.quantity - soldItem.cartQuantity;
            
            // Update status based on new quantity
            let newStatus = invItem.status;
            if (newQuantity === 0) {
              newStatus = "out-of-stock";
            } else if (newQuantity < 100) {
              newStatus = "low-stock";
            } else {
              newStatus = "in-stock";
            }

            return {
              ...invItem,
              quantity: newQuantity,
              status: newStatus
            };
          }
          return invItem;
        });

        localStorage.setItem("inventoryItems", JSON.stringify(inventory));
      }

      // Create inventory movements
      const savedMovements = localStorage.getItem("inventoryMovements");
      const movements: InventoryMovement[] = savedMovements ? JSON.parse(savedMovements) : [];
      
      cart.forEach(item => {
        const movement: InventoryMovement = {
          id: `mov-${Date.now()}-${item.id}`,
          itemId: item.id,
          sku: item.sku,
          productName: item.productName,
          type: "out",
          quantity: item.cartQuantity,
          from: "Retail Floor",
          reason: `Retail sale - ${transactionNumber}`,
          performedBy: user?.full_name || "POS System",
          timestamp: new Date().toISOString()
        };
        movements.unshift(movement);
      });

      localStorage.setItem("inventoryMovements", JSON.stringify(movements));

      // Save sale to history
      const updatedSales = [sale, ...salesHistory];
      setSalesHistory(updatedSales);
      localStorage.setItem("salesHistory", JSON.stringify(updatedSales));

      // Update current sale for receipt
      setCurrentSale(sale);

      // Clear cart
      setCart([]);
      setCustomerName("");
      setShowPaymentDialog(false);
      setShowReceiptDialog(true);
      setProcessing(false);

      // Reload products to reflect new stock levels
      const reloadedInventory = localStorage.getItem("inventoryItems");
      if (reloadedInventory) {
        const inventory: InventoryItem[] = JSON.parse(reloadedInventory);
        const availableProducts = inventory.filter(item => 
          item.status === "in-stock" || item.status === "low-stock"
        );
        setProducts(availableProducts);
      }

      toast({
        title: "Sale Completed",
        description: `Transaction ${transactionNumber} processed successfully`,
      });
    } catch (error) {
      setProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process sale",
        variant: "destructive"
      });
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Point of Sale - Blaze 360" />
      
      <div className="min-h-screen bg-gray-50 flex flex-col relative">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <CannabisLeaf className="absolute top-20 left-10 text-pink-600 rotate-12" size={300} />
          <CannabisLeaf className="absolute bottom-20 right-20 text-pink-600 -rotate-45" size={250} />
        </div>

        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-600 to-pink-700 p-2.5 rounded-xl shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Point of Sale</h1>
                  <p className="text-xs text-gray-600">Retail Terminal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-2">
                <User className="w-3 h-3" />
                {user?.full_name || "Cashier"}
              </Badge>
              <Link href="/inventory">
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Inventory
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <Tabs defaultValue="pos" className="flex-1">
          <div className="container mx-auto px-4 py-4">
            <TabsList>
              <TabsTrigger value="pos">Point of Sale</TabsTrigger>
              <TabsTrigger value="history">Sales History</TabsTrigger>
            </TabsList>
          </div>

          {/* POS Tab */}
          <TabsContent value="pos" className="flex-1 container mx-auto px-4 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden h-[calc(100vh-180px)]">
              {/* Product Catalog */}
              <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
                <Card className="flex-shrink-0">
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder="Search products by name, SKU, or category..." 
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowScanner(!showScanner)}
                        className="border-pink-600 text-pink-600 hover:bg-pink-50"
                      >
                        <ScanLine className="w-4 h-4 mr-2" />
                        Scan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {showScanner && (
                  <Card className="flex-shrink-0">
                    <CardContent className="p-4">
                      <BarcodeScanner
                        onScan={handleBarcodeScan}
                        onClose={() => setShowScanner(false)}
                        title="Scan Product Barcode"
                        placeholder="Scan or enter SKU/Batch Number..."
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pb-20">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:border-pink-400 hover:shadow-md transition-all group relative overflow-hidden" 
                      onClick={() => addToCart(product)}
                    >
                      <CannabisLeaf 
                        className="absolute top-2 right-2 text-pink-500/0 group-hover:text-pink-500/10 transition-all duration-300" 
                        size={40} 
                      />
                      <CardContent className="p-4">
                        <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-3 flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-sm truncate mb-1">{product.productName}</h3>
                        <Badge variant="outline" className="text-xs mb-2 capitalize">{product.category}</Badge>
                        {product.thcPercentage && (
                          <p className="text-xs text-gray-600 mb-2">THC: {product.thcPercentage}%</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-pink-600">${product.retailPrice.toFixed(2)}</span>
                          <span className="text-xs text-gray-500">{product.quantity} {product.unit}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No products found</p>
                      <Link href="/inventory">
                        <Button variant="outline" className="mt-4">
                          Manage Inventory
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Section */}
              <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="font-bold text-lg">Current Order</h2>
                  <p className="text-xs text-gray-500">Transaction #{Date.now().toString().slice(-6)}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                      <p className="text-sm">Cart is empty</p>
                      <p className="text-xs mt-1">Select products to add</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.productName}</h4>
                            <p className="text-xs text-gray-500">{item.sku} • {item.category}</p>
                            <p className="text-xs text-gray-600 mt-1">${item.retailPrice.toFixed(2)} / {item.unit}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-red-400 hover:text-red-600 -mt-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button 
                              className="px-2 py-1 hover:bg-gray-100 text-sm" 
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="px-3 text-sm font-medium border-x">{item.cartQuantity}</span>
                            <button 
                              className="px-2 py-1 hover:bg-gray-100 text-sm" 
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.cartQuantity >= item.quantity}
                            >
                              +
                            </button>
                          </div>
                          <span className="font-semibold text-sm text-pink-600">
                            ${(item.retailPrice * item.cartQuantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Available: {item.quantity - item.cartQuantity} {item.unit}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 bg-gray-50 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (12%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-pink-600">${finalTotal.toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 gap-2 h-12 text-lg"
                    disabled={cart.length === 0}
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sales History Tab */}
          <TabsContent value="history" className="container mx-auto px-4 pb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sales History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {salesHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No sales yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {salesHistory.map((sale) => (
                      <div key={sale.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold">{sale.transactionNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(sale.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Customer: {sale.customerName} • Cashier: {sale.cashier}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-pink-600">${sale.total.toFixed(2)}</p>
                            <Badge variant="outline" className="mt-1">{sale.paymentMethod}</Badge>
                          </div>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead className="text-right">Qty</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sale.items.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell className="text-xs text-gray-600">{item.sku}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-semibold">${item.total.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="mt-3 pt-3 border-t text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>${sale.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span>${sale.tax.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Total: <span className="font-bold text-xl text-pink-600">${finalTotal.toFixed(2)}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name (Optional)</label>
                <Input
                  placeholder="Guest"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("cash")}
                    className={paymentMethod === "cash" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className={paymentMethod === "card" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === "debit" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("debit")}
                    className={paymentMethod === "debit" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    Debit
                  </Button>
                  <Button
                    variant={paymentMethod === "digital" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("digital")}
                    className={paymentMethod === "digital" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    Digital Wallet
                  </Button>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  This sale will automatically update inventory levels and create movement records.
                </AlertDescription>
              </Alert>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentDialog(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button 
                onClick={processPayment}
                disabled={processing}
                className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800"
              >
                {processing ? "Processing..." : `Process Payment $${finalTotal.toFixed(2)}`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Sale Completed
              </DialogTitle>
            </DialogHeader>
            {currentSale && (
              <div className="space-y-4 py-4">
                <div className="text-center border-b pb-4">
                  <h3 className="font-bold text-lg">Blaze 360 Cannabis</h3>
                  <p className="text-sm text-gray-600">Retail Receipt</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(currentSale.timestamp).toLocaleString()}</p>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between font-semibold border-b pb-2">
                    <span>Transaction: {currentSale.transactionNumber}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Customer:</span>
                    <span>{currentSale.customerName}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Cashier:</span>
                    <span>{currentSale.cashier}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Payment:</span>
                    <span className="capitalize">{currentSale.paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-b py-3 space-y-2">
                  {currentSale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-600">{item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                      </div>
                      <span className="font-semibold">${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${currentSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (12%):</span>
                    <span>${currentSale.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-pink-600">${currentSale.total.toFixed(2)}</span>
                  </div>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Inventory has been automatically updated
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={printReceipt}
                className="flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button 
                onClick={() => setShowReceiptDialog(false)}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                New Sale
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}