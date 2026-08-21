import { SEO } from "@/components/SEO";
import { CannaIdScanner } from "@/components/CannaIdScanner";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyCannaId() {
  return (
    <>
      <SEO 
        title="Verify Canna ID 360™ | Retailer Portal"
        description="Privacy-protected verification for cannabis user credentials"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/retail">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Retail Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify Customer Credential</h1>
                <p className="text-gray-600 dark:text-gray-400">Privacy-protected Canna ID 360™ verification</p>
              </div>
            </div>
          </div>

          {/* Scanner Component */}
          <CannaIdScanner />

          {/* Information Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">✓ Privacy Protected</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Only shows eligibility status. No personal information is exposed.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-blue-600 dark:text-blue-400 font-semibold mb-2">⚡ Instant Verification</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time verification against national registry in seconds.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-purple-600 dark:text-purple-400 font-semibold mb-2">🔒 Secure & Compliant</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All verifications are logged and audit-ready for compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}