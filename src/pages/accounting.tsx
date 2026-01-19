import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle, TrendingUp, DollarSign } from "lucide-react";
import { CannabisLeaf } from "@/components/CannabisLeaf";
import Link from "next/link";
import { useState } from "react";

export default function Accounting() {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Idle");

  const handleSync = () => {
    setSyncStatus("Syncing...");
    setTimeout(() => {
      setSyncStatus("Completed");
    }, 2000);
  };

  return (
    <>
      <SEO title="Accounting Integration - Marijuana Bahamas" />
      
      <div className="min-h-screen bg-gray-50 relative">
        {/* Background Watermarks */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <CannabisLeaf className="absolute top-32 left-16 text-emerald-500/5 dark:text-emerald-400/3" size={280} style={{ transform: "rotate(20deg)" }} />
          <CannabisLeaf className="absolute top-1/3 right-12 text-emerald-500/5 dark:text-emerald-400/3" size={220} style={{ transform: "rotate(-40deg)" }} />
          <CannabisLeaf className="absolute bottom-32 left-1/3 text-emerald-500/5 dark:text-emerald-400/3" size={260} style={{ transform: "rotate(15deg)" }} />
        </div>

        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-gradient-to-br from-green-700 to-emerald-700 p-2 rounded-lg">
                <CannabisLeaf className="text-white" size={24} />
              </div>
              Accounting Integration
            </h1>
            <div className="w-32"></div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 md:col-span-2 group relative overflow-hidden">
              <CannabisLeaf className="absolute top-4 right-4 text-emerald-500/0 group-hover:text-emerald-500/5 transition-all duration-300" size={60} />
              <CardHeader>
                <CardTitle>QuickBooks Online Integration</CardTitle>
                <CardDescription>
                  Automatically sync sales, inventory assets, and expenses with QuickBooks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold">QuickBooks Status</h3>
                      <p className="text-sm text-gray-500">
                        {isConnected ? "Connected to My Company Ltd." : "Not Connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={isConnected}
                      onCheckedChange={setIsConnected}
                    />
                    <Label>{isConnected ? "Active" : "Inactive"}</Label>
                  </div>
                </div>

                {isConnected && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-blue-900">Last Sync: Today at 09:30 AM</p>
                        <p className="text-sm text-blue-700">Next scheduled sync in 55 minutes</p>
                      </div>
                      <Button onClick={handleSync} disabled={syncStatus === "Syncing..."} size="sm" className="gap-2">
                        <RefreshCw className={`w-4 h-4 ${syncStatus === "Syncing..." ? "animate-spin" : ""}`} />
                        {syncStatus === "Syncing..." ? "Syncing..." : "Sync Now"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden">
              <CannabisLeaf className="absolute top-4 right-4 text-emerald-500/0 group-hover:text-emerald-500/5 transition-all duration-300" size={50} />
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Sales Receipts</Label>
                    <p className="text-xs text-gray-500">Daily summaries</p>
                  </div>
                  <Switch defaultChecked disabled={!isConnected} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Inventory Assets</Label>
                    <p className="text-xs text-gray-500">COGS updates</p>
                  </div>
                  <Switch defaultChecked disabled={!isConnected} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Customers</Label>
                    <p className="text-xs text-gray-500">Contact details</p>
                  </div>
                  <Switch disabled={!isConnected} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="group relative overflow-hidden">
            <CannabisLeaf className="absolute top-4 right-4 text-emerald-500/0 group-hover:text-emerald-500/5 transition-all duration-300" size={60} />
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2026-01-16 09:30 AM</TableCell>
                    <TableCell>Daily Sales</TableCell>
                    <TableCell>145 Trans.</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" /> Success
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">Batch #9921</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-01-16 09:30 AM</TableCell>
                    <TableCell>Inventory</TableCell>
                    <TableCell>12 Items</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" /> Success
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">Adjustments</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-01-15 05:00 PM</TableCell>
                    <TableCell>Expenses</TableCell>
                    <TableCell>3 Records</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" /> Failed
                      </div>
                    </TableCell>
                    <TableCell className="text-red-500">Auth Error</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}