import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  ArrowLeft,
  BarChart3,
  Calendar,
  Award,
  AlertCircle
} from "lucide-react";
import { CannabisLeaf } from "@/components/CannabisLeaf";

interface SalesData {
  date: string;
  revenue: number;
  transactions: number;
}

interface TopProduct {
  sku: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  trend: "up" | "down" | "stable";
}

interface InventoryTurnover {
  category: string;
  turnoverRate: number;
  daysToSell: number;
  stockValue: number;
}

export default function Analytics() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [timeRange, setTimeRange] = useState("7days");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [inventoryTurnover, setInventoryTurnover] = useState<InventoryTurnover[]>([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    avgTransactionValue: 0,
    revenueGrowth: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    // Generate demo sales data for the last 7 days
    const today = new Date();
    const demoSalesData: SalesData[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      demoSalesData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 5000) + 2000,
        transactions: Math.floor(Math.random() * 30) + 10,
      });
    }
    setSalesData(demoSalesData);

    // Top selling products
    const demoTopProducts: TopProduct[] = [
      {
        sku: "FLW-001",
        name: "Blue Dream Flower",
        category: "Flower",
        unitsSold: 145,
        revenue: 7250,
        trend: "up"
      },
      {
        sku: "EDI-001",
        name: "Gummies 10mg",
        category: "Edibles",
        unitsSold: 230,
        revenue: 6900,
        trend: "up"
      },
      {
        sku: "CONC-001",
        name: "Live Resin Cartridge",
        category: "Concentrates",
        unitsSold: 88,
        revenue: 5280,
        trend: "stable"
      },
      {
        sku: "VAPE-001",
        name: "Distillate Vape",
        category: "Vapes",
        unitsSold: 112,
        revenue: 4480,
        trend: "up"
      },
      {
        sku: "TOP-001",
        name: "CBD Topical",
        category: "Topicals",
        unitsSold: 65,
        revenue: 2600,
        trend: "down"
      },
    ];
    setTopProducts(demoTopProducts);

    // Inventory turnover by category
    const demoTurnover: InventoryTurnover[] = [
      { category: "Flower", turnoverRate: 8.5, daysToSell: 12, stockValue: 45000 },
      { category: "Edibles", turnoverRate: 12.2, daysToSell: 8, stockValue: 28000 },
      { category: "Concentrates", turnoverRate: 6.8, daysToSell: 15, stockValue: 32000 },
      { category: "Vapes", turnoverRate: 9.1, daysToSell: 11, stockValue: 22000 },
      { category: "Topicals", turnoverRate: 4.3, daysToSell: 23, stockValue: 12000 },
    ];
    setInventoryTurnover(demoTurnover);

    // Calculate metrics
    const totalRev = demoSalesData.reduce((sum, day) => sum + day.revenue, 0);
    const totalTrans = demoSalesData.reduce((sum, day) => sum + day.transactions, 0);
    setMetrics({
      totalRevenue: totalRev,
      totalTransactions: totalTrans,
      avgTransactionValue: totalRev / totalTrans,
      revenueGrowth: 12.5,
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const maxRevenue = Math.max(...salesData.map(d => d.revenue));

  return (
    <>
      <SEO 
        title="Analytics - Canna Blaze 360"
        description="Business analytics and insights for your cannabis operation"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
                <h1 className="text-2xl font-bold">Analytics & Insights</h1>
              </div>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+{metrics.revenueGrowth}%</span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.totalTransactions}</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+8.2%</span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Transaction</CardTitle>
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">${metrics.avgTransactionValue.toFixed(2)}</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+3.8%</span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Inventory Value</CardTitle>
                  <Package className="w-4 h-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">$139K</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-600 font-medium">-2.1%</span>
                  <span className="text-sm text-gray-500">healthy turnover</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList>
              <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
              <TabsTrigger value="products">Top Products</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Turnover</TabsTrigger>
            </TabsList>

            {/* Revenue Trends */}
            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue</CardTitle>
                  <CardDescription>Revenue performance over the selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Bar Chart */}
                    <div className="h-80 flex items-end justify-between gap-2">
                      {salesData.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-xs font-medium text-gray-900">${(day.revenue / 1000).toFixed(1)}k</div>
                          <div 
                            className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg hover:from-emerald-700 hover:to-emerald-500 transition-all cursor-pointer relative group"
                            style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                          >
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                              ${day.revenue.toLocaleString()}<br/>
                              {day.transactions} transactions
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 font-medium">{day.date}</div>
                        </div>
                      ))}
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Peak Day</div>
                        <div className="text-lg font-bold text-gray-900">
                          {salesData.reduce((max, day) => day.revenue > max.revenue ? day : max, salesData[0])?.date}
                        </div>
                        <div className="text-sm text-emerald-600">
                          ${Math.max(...salesData.map(d => d.revenue)).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Average Daily</div>
                        <div className="text-lg font-bold text-gray-900">
                          ${(metrics.totalRevenue / salesData.length).toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(metrics.totalTransactions / salesData.length).toFixed(0)} transactions
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Trend</div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="text-lg font-bold text-green-600">+{metrics.revenueGrowth}%</span>
                        </div>
                        <div className="text-sm text-gray-500">Growing steadily</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Top Products */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Best performers ranked by revenue and units sold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.sku} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <Badge variant="secondary" className="text-xs">{product.sku}</Badge>
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{product.unitsSold} units sold</span>
                            <span>•</span>
                            <span className="font-medium text-emerald-600">${product.revenue.toLocaleString()} revenue</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.trend === "up" && (
                            <>
                              <TrendingUp className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-600">Trending</span>
                            </>
                          )}
                          {product.trend === "down" && (
                            <>
                              <TrendingDown className="w-5 h-5 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Declining</span>
                            </>
                          )}
                          {product.trend === "stable" && (
                            <span className="text-sm font-medium text-gray-500">Stable</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Category Performance */}
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">Performance by Category</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {["Flower", "Edibles", "Concentrates", "Vapes", "Topicals"].map((category) => {
                        const categoryProducts = topProducts.filter(p => p.category === category);
                        const categoryRevenue = categoryProducts.reduce((sum, p) => sum + p.revenue, 0);
                        return (
                          <div key={category} className="text-center p-4 rounded-lg border bg-gray-50">
                            <div className="text-sm text-gray-600 mb-1">{category}</div>
                            <div className="text-xl font-bold text-gray-900">${(categoryRevenue / 1000).toFixed(1)}k</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Turnover */}
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Turnover Analysis</CardTitle>
                  <CardDescription>How quickly inventory moves through your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryTurnover.map((item) => (
                      <div key={item.category} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{item.category}</h3>
                          <Badge variant={item.turnoverRate > 8 ? "default" : item.turnoverRate > 5 ? "secondary" : "destructive"}>
                            {item.turnoverRate > 8 ? "Excellent" : item.turnoverRate > 5 ? "Good" : "Slow"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600 mb-1">Turnover Rate</div>
                            <div className="text-lg font-bold text-gray-900">{item.turnoverRate}x</div>
                            <div className="text-xs text-gray-500">per month</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Days to Sell</div>
                            <div className="text-lg font-bold text-gray-900">{item.daysToSell}</div>
                            <div className="text-xs text-gray-500">average days</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Stock Value</div>
                            <div className="text-lg font-bold text-gray-900">${(item.stockValue / 1000).toFixed(0)}k</div>
                            <div className="text-xs text-gray-500">current value</div>
                          </div>
                        </div>
                        {/* Visual bar */}
                        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.turnoverRate > 8 ? "bg-green-600" : 
                              item.turnoverRate > 5 ? "bg-yellow-600" : "bg-red-600"
                            }`}
                            style={{ width: `${Math.min(item.turnoverRate * 8, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Insights */}
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Inventory Insights</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Edibles have the fastest turnover - consider increasing stock</li>
                          <li>• Topicals are moving slowly - run promotions to boost sales</li>
                          <li>• Overall inventory health is good with balanced turnover</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}