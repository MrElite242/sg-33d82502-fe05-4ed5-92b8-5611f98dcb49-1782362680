import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateCredentialNumber, generateVerificationToken, isEligibleByAge } from "@/lib/cannaId";
import { supabase } from "@/integrations/supabase/client";

export default function IssueCannaId() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; credentialNumber?: string; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    jurisdiction: "",
    region: "",
    issuingAuthority: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      // Validate age (21+)
      if (!isEligibleByAge(formData.dateOfBirth)) {
        setResult({
          success: false,
          message: "Applicant must be 21 years or older to receive a Canna ID 360™ credential"
        });
        setIsSubmitting(false);
        return;
      }

      // Generate credential data
      const credentialNumber = generateCredentialNumber();
      const verificationToken = generateVerificationToken();
      const issuedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year

      // In production, generate actual QR code here
      const qrCodeData = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">QR: ${verificationToken.slice(0, 8)}...</text></svg>`;

      // Insert credential into database
      const { data, error } = await supabase
        .from("canna_id_credentials")
        .insert({
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          national_id: formData.nationalId,
          jurisdiction: formData.jurisdiction,
          region: formData.region || null,
          eligibility_status: "verified",
          status: "active",
          issued_by: "government_official",
          issued_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_status: "waived"
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setResult({
        success: true,
        credentialNumber: credentialNumber,
        message: `Canna ID 360™ credential successfully issued to ${formData.fullName}`
      });

      // Reset form
      setFormData({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        nationalId: "",
        jurisdiction: "",
        region: "",
        issuingAuthority: "",
        notes: ""
      });

    } catch (error) {
      console.error("Credential issuance error:", error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to issue credential. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Issue Canna ID 360™ | Government Portal"
        description="Government portal for issuing national cannabis user credentials"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/government">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Government Portal
              </Button>
            </Link>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Issue Canna ID 360™</h1>
                <p className="text-gray-600 dark:text-gray-400">National Cannabis User Credential System</p>
              </div>
            </div>
          </div>

          {/* Result Alert */}
          {result && (
            <Alert className={result.success ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800 mb-6" : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800 mb-6"}>
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <AlertDescription>
                <div className="space-y-2">
                  <div className={`font-semibold ${result.success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                    {result.success ? "Success" : "Error"}
                  </div>
                  <div className={result.success ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}>
                    {result.message}
                  </div>
                  {result.credentialNumber && (
                    <div className="text-sm text-green-700 dark:text-green-400 mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                      <strong>Credential Number:</strong> <span className="font-mono">{result.credentialNumber}</span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Issuance Form */}
          <Card>
            <CardHeader>
              <CardTitle>Credential Issuance Form</CardTitle>
              <CardDescription>
                Complete all fields to issue a new national cannabis user credential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Legal Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="John Michael Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationalId">National ID Number *</Label>
                      <Input
                        id="nationalId"
                        required
                        value={formData.nationalId}
                        onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                        placeholder="1234-5678-9012"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Must be 21 years or older
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({...formData, gender: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Jurisdiction Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Jurisdiction Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction/Country *</Label>
                      <Input
                        id="jurisdiction"
                        required
                        value={formData.jurisdiction}
                        onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                        placeholder="e.g., Jamaica, Thailand, Colombia"
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">Region/State (Optional)</Label>
                      <Input
                        id="region"
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        placeholder="e.g., Kingston, Bangkok, Bogotá"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="issuingAuthority">Issuing Authority *</Label>
                    <Input
                      id="issuingAuthority"
                      required
                      value={formData.issuingAuthority}
                      onChange={(e) => setFormData({...formData, issuingAuthority: e.target.value})}
                      placeholder="e.g., Ministry of Health, Cannabis Regulatory Authority"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Additional Information</h3>
                  
                  <div>
                    <Label htmlFor="notes">Internal Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes for internal records only..."
                    />
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Privacy & Security</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• Credential will be valid for 1 year from issuance date</li>
                    <li>• Verification only reveals eligibility status (YES/NO)</li>
                    <li>• Personal information is never shared during verification</li>
                    <li>• All data is encrypted and stored securely</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Issuing Credential..." : "Issue Canna ID 360™ Credential"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}