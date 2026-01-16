import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ShoppingCart, CreditCard, User, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Retail() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulated inventory
    setProducts([
      { id: "P001", name: "Blue Dream (3.5g)", category: "Flower", price: 45.00, stock: 120 },
      { id: "P002", name: "OG Kush Pre-roll", category: "Pre-roll", price: 12.00, stock: 500 },
      { id: "P003", name: "CBD Tincture 1000mg", category: "Tincture", price: 65.00, stock: 85 },
      { id: "P004", name: "Hybrid Gummies", category: "Edible", price: 25.00, stock: 200 },
      { id: "P005", name: "Vape Cartridge 1g", category: "Vape", price: 55.00, stock: 150 },
    ]);
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = cartTotal * 0.12; // 12% tax assumption
  const finalTotal = cartTotal + tax;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO title="Retail POS - Marijuana Bahamas" />
      
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-pink-600" />
                Point of Sale
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Guest Customer</span>
              </div>
              <Button variant="outline">New Customer</Button>
            </div>
          </div>
        </header>

        <div className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden h-[calc(100vh-64px)]">
          {/* Product Catalog */}
          <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
            <Card className="flex-shrink-0">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pb-20">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:border-pink-300 transition-colors" onClick={() => addToCart(product)}>
                  <CardContent className="p-4">
                    <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-400">{product.stock} in stock</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-lg">Current Order</h2>
              <p className="text-xs text-gray-500">Transaction #89201</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">${item.price.toFixed(2)} / unit</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-md">
                        <button className="px-2 py-1 hover:bg-gray-100" onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button className="px-2 py-1 hover:bg-gray-100" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <span className="font-semibold text-sm w-16 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                        &times;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (12%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 gap-2 h-12 text-lg">
                <CreditCard className="w-5 h-5" />
                Process Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}