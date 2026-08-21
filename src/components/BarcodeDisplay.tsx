import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCredentialDate, maskNationalId } from "@/lib/cannaId";
import { CalendarDays, MapPin, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface CannaIdCredential {
  id: string;
  credential_number: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  national_id_number: string;
  jurisdiction: string;
  region: string;
  eligibility_status: boolean;
  status: "active" | "suspended" | "revoked" | "expired";
  issued_at: string;
  expires_at: string;
  issuing_authority: string;
  qr_code_data: string;
}

interface BarcodeDisplayProps {
  credential: CannaIdCredential;
  showSensitiveData?: boolean;
}

export function BarcodeDisplay({ credential, showSensitiveData = false }: BarcodeDisplayProps) {
  const isExpired = new Date(credential.expires_at) < new Date();
  const statusConfig = {
    active: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Active" },
    suspended: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50", label: "Suspended" },
    revoked: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Revoked" },
    expired: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-50", label: "Expired" }
  };
  
  const currentStatus = isExpired ? "expired" : credential.status;
  const StatusIcon = statusConfig[currentStatus].icon;

  return (
    <Card className="max-w-md mx-auto overflow-hidden border-2 border-emerald-200 dark:border-emerald-800">
      {/* Header - Canna ID 360™ Branding */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 text-center">
        <div className="text-xs font-semibold tracking-wider opacity-90 mb-1">CANNA ID 360™</div>
        <div className="text-2xl font-bold">National Cannabis Credential</div>
      </div>

      {/* Credential Body */}
      <div className="p-6 space-y-4 bg-white dark:bg-gray-900">
        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <Badge className={`${statusConfig[currentStatus].bg} ${statusConfig[currentStatus].color} border-0 flex items-center gap-1.5`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig[currentStatus].label}
          </Badge>
          {credential.eligibility_status && currentStatus === "active" && (
            <Badge className="bg-blue-50 text-blue-700 border-0">Eligible</Badge>
          )}
        </div>

        {/* User Information */}
        <div className="space-y-3 border-l-4 border-emerald-500 pl-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{credential.full_name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date of Birth</div>
              <div className="font-semibold text-gray-900 dark:text-white">{formatCredentialDate(credential.date_of_birth)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gender</div>
              <div className="font-semibold text-gray-900 dark:text-white">{credential.gender}</div>
            </div>
          </div>

          {showSensitiveData && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">National ID</div>
              <div className="font-mono text-sm text-gray-700 dark:text-gray-300">{maskNationalId(credential.national_id_number)}</div>
            </div>
          )}
        </div>

        {/* Jurisdiction */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">{credential.jurisdiction}</span>
          {credential.region && <span className="text-gray-400">•</span>}
          {credential.region && <span>{credential.region}</span>}
        </div>

        {/* Credential Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Credential No.</div>
            <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{credential.credential_number}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Issued By</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{credential.issuing_authority}</div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              Issued
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCredentialDate(credential.issued_at)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              Expires
            </div>
            <div className={`text-sm font-medium ${isExpired ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
              {formatCredentialDate(credential.expires_at)}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 text-center border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Secure Verification Code</div>
        {credential.qr_code_data ? (
          <div className="inline-block p-3 bg-white rounded-lg">
            <Image 
              src={credential.qr_code_data} 
              alt="Verification QR Code" 
              width={200} 
              height={200}
              className="mx-auto"
            />
          </div>
        ) : (
          <div className="w-[200px] h-[200px] mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-sm">QR Code Unavailable</div>
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Scan to verify eligibility
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 text-xs text-gray-600 dark:text-gray-400 border-t border-blue-100 dark:border-blue-900">
        <strong className="text-blue-700 dark:text-blue-400">Privacy Protected:</strong> QR verification reveals only eligibility status. No personal information is shared during verification.
      </div>
    </Card>
  );
}