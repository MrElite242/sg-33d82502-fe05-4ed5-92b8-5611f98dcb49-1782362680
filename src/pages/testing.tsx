import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, FlaskConical, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface LabTest {
  id: string;
  batchId: string;
  testType: string;
  labName: string;
  dateSubmitted: string;
  status: string;
  thc: string;
  cbd: string;
}

export default function Testing() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("labTests");
    if (saved) {
      setTests(JSON.parse(saved));
    } else {
      const demoTests: LabTest[] = [
        { id: "T9001", batchId: "B1240", testType: "Potency & Safety", labName: "Green Lab Analytics", dateSubmitted: "2026-01-12", status: "Passed", thc: "22.5%", cbd: "0.1%" },
        { id: "T9002", batchId: "M5001", testType: "Potency", labName: "Green Lab Analytics", dateSubmitted: "2026-01-14", status: "Pending", thc: "-", cbd: "-" },
        { id: "T9003", batchId: "B1239", testType: "Full Panel", labName: "Quality Labs", dateSubmitted: "2026-01-10", status: "Failed", thc: "18.2%", cbd: "0.5%" },
      ];
      setTests(demoTests);
      localStorage.setItem("labTests", JSON.stringify(demoTests));
    }
  }, []);

  const handleAddTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTest: LabTest = {
      id: `T${9000 + tests.length + 1}`,
      batchId: formData.get("batchId") as string,
      testType: formData.get("testType") as string,
      labName: formData.get("labName") as string,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: "Pending",
      thc: "-",
      cbd: "-"
    };
    const updatedTests = [...tests, newTest];
    setTests(updatedTests);
    localStorage.setItem("labTests", JSON.stringify(updatedTests));
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Passed": "bg-green-100 text-green-800",
      "Failed": "bg-red-100 text-red-800",
      "Pending": "bg-yellow-100 text-yellow-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <SEO title="Testing & QA - Marijuana Bahamas" />
      
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
              <FlaskConical className="w-6 h-6 text-blue-600" />
              Testing & Quality Assurance
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
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tests.filter(t => t.status === "Pending").length}</p>
                    <p className="text-sm text-gray-600">Pending Results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tests.filter(t => t.status === "Passed").length}</p>
                    <p className="text-sm text-gray-600">Passed Tests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tests.filter(t => t.status === "Failed").length}</p>
                    <p className="text-sm text-gray-600">Failed Tests</p>
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
                    <p className="text-2xl font-bold">128</p>
                    <p className="text-sm text-gray-600">COAs on File</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lab Samples</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    New Sample
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Sample for Testing</DialogTitle>
                    <DialogDescription>Create a new lab testing request</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTest} className="space-y-4">
                    <div>
                      <Label htmlFor="batchId">Batch ID</Label>
                      <Input id="batchId" name="batchId" placeholder="e.g., B1240" required />
                    </div>
                    <div>
                      <Label htmlFor="testType">Test Type</Label>
                      <Select name="testType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full Panel">Full Panel (Potency + Safety)</SelectItem>
                          <SelectItem value="Potency">Potency Only</SelectItem>
                          <SelectItem value="Safety">Safety Only (Microbial/Heavy Metals)</SelectItem>
                          <SelectItem value="Terpene">Terpene Profile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="labName">Laboratory</Label>
                      <Select name="labName" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lab" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Green Lab Analytics">Green Lab Analytics</SelectItem>
                          <SelectItem value="Quality Labs">Quality Labs</SelectItem>
                          <SelectItem value="Island Testing Services">Island Testing Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Submit Sample</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Results (THC/CBD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.batchId}</TableCell>
                      <TableCell>{test.testType}</TableCell>
                      <TableCell>{test.labName}</TableCell>
                      <TableCell>{test.dateSubmitted}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {test.status !== "Pending" ? `${test.thc} / ${test.cbd}` : "Pending"}
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