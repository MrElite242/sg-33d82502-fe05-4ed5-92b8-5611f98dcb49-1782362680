import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Search, Ban, PlayCircle, XCircle, AlertCircle, CheckCircle2, Clock, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { maskNationalId } from "@/lib/cannaId";

interface Credential {
  id: string;
  credential_number: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  national_id_number: string;
  jurisdiction: string;
  region: string | null;
  eligibility_status: boolean;
  status: string;
  issued_at: string;
  expires_at: string;
  issuing_authority: string;
  verification_count: number;
  last_verified_at: string | null;
  notes: string | null;
}

interface AuditLog {
  id: string;
  credential_number: string;
  action_type: string;
  previous_status: string | null;
  new_status: string | null;
  action_by: string;
  action_reason: string | null;
  verification_location: string | null;
  created_at: string;
}

export default function CannaIdAdmin() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"suspend" | "revoke" | "reactivate">("suspend");

  // Load credentials on mount
  useEffect(() => {
    loadCredentials();
    loadAuditLogs();
  }, []);

  const loadCredentials = async () => {
    const { data, error } = await supabase
      .from("canna_id_credentials")
      .select("*")
      .order("issued_at", { ascending: false });

    if (error) {
      console.error("Error loading credentials:", error);
      setMessage({ type: "error", text: "Failed to load credentials" });
    } else {
      setCredentials(data || []);
    }
  };

  const loadAuditLogs = async () => {
    const { data, error } = await supabase
      .from("canna_id_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error loading audit logs:", error);
    } else {
      setAuditLogs(data || []);
    }
  };

  const handleManageCredential = async (action: "suspend" | "revoke" | "reactivate") => {
    if (!selectedCredential) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/canna-id/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          credentialId: selectedCredential.id,
          reason: actionReason,
          officialEmail: "government@cannablaze360.com" // In production, get from auth context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to manage credential");
      }

      setMessage({ type: "success", text: data.message });
      setActionReason("");
      setDialogOpen(false);
      
      // Reload credentials and audit logs
      await loadCredentials();
      await loadAuditLogs();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to manage credential"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCredentials = credentials.filter(cred =>
    cred.credential_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cred.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cred.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      case "revoked":
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Revoked</Badge>;
      case "expired":
        return <Badge className="bg-gray-500"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    const colors: { [key: string]: string } = {
      issued: "bg-blue-500",
      verified: "bg-green-500",
      suspended: "bg-yellow-500",
      revoked: "bg-red-500",
      reactivated: "bg-emerald-500",
      expired: "bg-gray-500"
    };
    return <Badge className={colors[action] || "bg-gray-500"}>{action}</Badge>;
  };

  return (
    <>
      <SEO 
        title="Canna ID 360™ Admin Portal"
        description="Government administration portal for managing cannabis credentials"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
          <div className="container mx-auto px-4">
            <Link href="/government" className="inline-flex items-center text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Government Portal
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Canna ID 360™ Admin Portal</h1>
                <p className="text-blue-100">Government Credential Management System</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {message && (
            <Alert className={message.type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="credentials" className="mt-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>

            {/* Credentials Management Tab */}
            <TabsContent value="credentials">
              <Card>
                <CardHeader>
                  <CardTitle>Issued Credentials</CardTitle>
                  <CardDescription>
                    View, suspend, revoke, or reactivate cannabis credentials
                  </CardDescription>
                  <div className="mt-4">
                    <Label htmlFor="search">Search Credentials</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by credential number, name, or jurisdiction..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Credential #</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Jurisdiction</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Issued</TableHead>
                          <TableHead>Verifications</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCredentials.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                              No credentials found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCredentials.map((cred) => (
                            <TableRow key={cred.id}>
                              <TableCell className="font-mono text-sm">{cred.credential_number}</TableCell>
                              <TableCell>{cred.full_name}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{cred.jurisdiction}</div>
                                  {cred.region && <div className="text-sm text-gray-500">{cred.region}</div>}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(cred.status)}</TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {new Date(cred.issued_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="text-center">
                                  <div className="font-bold text-blue-600">{cred.verification_count}</div>
                                  {cred.last_verified_at && (
                                    <div className="text-xs text-gray-500">
                                      Last: {new Date(cred.last_verified_at).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {cred.status === "active" && (
                                    <>
                                      <Dialog open={dialogOpen && selectedCredential?.id === cred.id} onOpenChange={(open) => {
                                        setDialogOpen(open);
                                        if (open) {
                                          setSelectedCredential(cred);
                                          setActionType("suspend");
                                        }
                                      }}>
                                        <DialogTrigger asChild>
                                          <Button size="sm" variant="outline" className="text-yellow-600 hover:text-yellow-700">
                                            <Ban className="w-3 h-3 mr-1" />
                                            Suspend
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Suspend Credential</DialogTitle>
                                            <DialogDescription>
                                              Temporarily suspend this credential. It can be reactivated later.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div>
                                              <Label>Credential: {cred.credential_number}</Label>
                                              <p className="text-sm text-gray-600">{cred.full_name}</p>
                                            </div>
                                            <div>
                                              <Label htmlFor="reason">Reason for Suspension *</Label>
                                              <Textarea
                                                id="reason"
                                                value={actionReason}
                                                onChange={(e) => setActionReason(e.target.value)}
                                                placeholder="Enter reason for suspension..."
                                                rows={3}
                                              />
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                onClick={() => handleManageCredential("suspend")}
                                                disabled={isLoading || !actionReason}
                                                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                                              >
                                                {isLoading ? "Suspending..." : "Confirm Suspension"}
                                              </Button>
                                              <Button
                                                variant="outline"
                                                onClick={() => setDialogOpen(false)}
                                                disabled={isLoading}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>

                                      <Dialog open={dialogOpen && selectedCredential?.id === cred.id && actionType === "revoke"} onOpenChange={(open) => {
                                        setDialogOpen(open);
                                        if (open) {
                                          setSelectedCredential(cred);
                                          setActionType("revoke");
                                        }
                                      }}>
                                        <DialogTrigger asChild>
                                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Revoke
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Revoke Credential</DialogTitle>
                                            <DialogDescription className="text-red-600">
                                              ⚠️ This action is permanent. The credential cannot be reactivated.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div>
                                              <Label>Credential: {cred.credential_number}</Label>
                                              <p className="text-sm text-gray-600">{cred.full_name}</p>
                                            </div>
                                            <div>
                                              <Label htmlFor="revoke-reason">Reason for Revocation *</Label>
                                              <Textarea
                                                id="revoke-reason"
                                                value={actionReason}
                                                onChange={(e) => setActionReason(e.target.value)}
                                                placeholder="Enter reason for permanent revocation..."
                                                rows={3}
                                              />
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                onClick={() => handleManageCredential("revoke")}
                                                disabled={isLoading || !actionReason}
                                                className="flex-1 bg-red-600 hover:bg-red-700"
                                              >
                                                {isLoading ? "Revoking..." : "Confirm Revocation"}
                                              </Button>
                                              <Button
                                                variant="outline"
                                                onClick={() => setDialogOpen(false)}
                                                disabled={isLoading}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </>
                                  )}

                                  {cred.status === "suspended" && (
                                    <Dialog open={dialogOpen && selectedCredential?.id === cred.id} onOpenChange={(open) => {
                                      setDialogOpen(open);
                                      if (open) {
                                        setSelectedCredential(cred);
                                        setActionType("reactivate");
                                      }
                                    }}>
                                      <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                                          <PlayCircle className="w-3 h-3 mr-1" />
                                          Reactivate
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Reactivate Credential</DialogTitle>
                                          <DialogDescription>
                                            Restore this credential to active status
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <Label>Credential: {cred.credential_number}</Label>
                                            <p className="text-sm text-gray-600">{cred.full_name}</p>
                                          </div>
                                          <div>
                                            <Label htmlFor="reactivate-reason">Reason for Reactivation</Label>
                                            <Textarea
                                              id="reactivate-reason"
                                              value={actionReason}
                                              onChange={(e) => setActionReason(e.target.value)}
                                              placeholder="Enter reason for reactivation (optional)..."
                                              rows={3}
                                            />
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              onClick={() => handleManageCredential("reactivate")}
                                              disabled={isLoading}
                                              className="flex-1 bg-green-600 hover:bg-green-700"
                                            >
                                              {isLoading ? "Reactivating..." : "Confirm Reactivation"}
                                            </Button>
                                            <Button
                                              variant="outline"
                                              onClick={() => setDialogOpen(false)}
                                              disabled={isLoading}
                                            >
                                              Cancel
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}

                                  {cred.status === "revoked" && (
                                    <Badge className="bg-red-500">Permanently Revoked</Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Logs Tab */}
            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Audit Logs</CardTitle>
                  <CardDescription>
                    Complete audit trail of all credential actions and verifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date/Time</TableHead>
                          <TableHead>Credential #</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Status Change</TableHead>
                          <TableHead>Performed By</TableHead>
                          <TableHead>Reason/Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditLogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                              No audit logs yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          auditLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="text-sm">
                                {new Date(log.created_at).toLocaleString()}
                              </TableCell>
                              <TableCell className="font-mono text-sm">{log.credential_number}</TableCell>
                              <TableCell>{getActionBadge(log.action_type)}</TableCell>
                              <TableCell className="text-sm">
                                {log.previous_status && (
                                  <span className="text-gray-500">{log.previous_status} → </span>
                                )}
                                <span className="font-medium">{log.new_status || "-"}</span>
                              </TableCell>
                              <TableCell className="text-sm">{log.action_by}</TableCell>
                              <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                                {log.action_reason || log.verification_location || "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
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