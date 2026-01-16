import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, TrendingUp, BarChart2, LineChart, PieChart, FlaskConical } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StrainPerformance {
  strain: string;
  avgYield: string;
  avgThc: string;
  growthCycle: number;
  resistance: string;
  popularity: string;
}

export default function Research() {
  const [data, setData] = useState<StrainPerformance[]>([]);

  useEffect(() => {
    // Simulated research data
    const researchData: StrainPerformance[] = [
      { strain: "Blue Dream", avgYield: "450g/m²", avgThc: "18-24%", growthCycle: 65, resistance: "High", popularity: "Very High" },
      { strain: "OG Kush", avgYield: "400g/m²", avgThc: "20-26%", growthCycle: 55, resistance: "Medium", popularity: "High" },
      { strain: "Sour Diesel", avgYield: "500g/m²", avgThc: "19-25%", growthCycle: 70, resistance: "Medium", popularity: "High" },
      { strain: "Purple Haze", avgYield: "350g/m²", avgThc: "16-20%", growthCycle: 60, resistance: "Low", popularity: "Medium" },
    ];
    setData(researchData);
  }, []);

  return (
    <>
      <SEO title="Research & Analytics - Marijuana Bahamas" />
      
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
              <TrendingUp className="w-6 h-6 text-orange-600" />
              Research & Analytics
            </h1>
            <div className="w-32"></div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Blue Dream</p>
                    <p className="text-sm text-gray-600">Top Performing Strain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <LineChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">+12.5%</p>
                    <p className="text-sm text-gray-600">Yield Efficiency (YoY)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">22.4%</p>
                    <p className="text-sm text-gray-600">Avg THC Potency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strain Performance Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Strain Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strain</TableHead>
                    <TableHead>Avg Yield</TableHead>
                    <TableHead>Potency (THC)</TableHead>
                    <TableHead>Growth Cycle (Days)</TableHead>
                    <TableHead>Pest Resistance</TableHead>
                    <TableHead>Market Demand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.strain}</TableCell>
                      <TableCell>{item.avgYield}</TableCell>
                      <TableCell>{item.avgThc}</TableCell>
                      <TableCell>{item.growthCycle}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          item.resistance === "High" ? "text-green-600 border-green-200" :
                          item.resistance === "Medium" ? "text-yellow-600 border-yellow-200" :
                          "text-red-600 border-red-200"
                        }>{item.resistance}</Badge>
                      </TableCell>
                      <TableCell>{item.popularity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Charts Section Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Production Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-400">Production distribution chart visualization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Potency Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-400">Potency trend analysis chart visualization</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}