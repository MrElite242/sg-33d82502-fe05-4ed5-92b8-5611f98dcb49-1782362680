import QRCode from "qrcode";

/**
 * Generate Canna ID 360™ credential number
 * Format: CB360-XXXXXXXX
 */
export function generateCredentialNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CB360-${code}`;
}

/**
 * Generate verification token for API verification
 */
export function generateVerificationToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Check if user is 21 or older
 */
export function isAgeEligible(dateOfBirth: Date | string): boolean {
  const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 21;
  }
  
  return age >= 21;
}

/**
 * Validate if user is eligible by age (21+)
 */
export function isEligibleByAge(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  // Check if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 21;
  }
  
  return age >= 21;
}

/**
 * Calculate credential expiration date (default: 1 year from issue)
 */
export function calculateExpirationDate(yearsValid: number = 1): Date {
  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + yearsValid);
  return expiration;
}

/**
 * Format date for credential display
 */
export function formatCredentialDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });
}

/**
 * Generate QR code for credential
 * Contains only the verification token for privacy
 */
export async function generateCredentialQRCode(verificationToken: string): Promise<string> {
  try {
    // QR code contains only verification token, not personal info
    const qrPayload = JSON.stringify({
      type: "CANNA_ID_360",
      token: verificationToken,
      timestamp: new Date().toISOString()
    });
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error("QR code generation failed:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Generate QR code data URL from verification token
 */
export async function generateQRCode(verificationToken: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationToken, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.error("QR code generation error:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Parse QR code data
 */
export function parseQRCodeData(qrData: string): { token: string; timestamp: string } | null {
  try {
    const parsed = JSON.parse(qrData);
    if (parsed.type === "CANNA_ID_360" && parsed.token) {
      return {
        token: parsed.token,
        timestamp: parsed.timestamp
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if credential is expired
 */
export function isCredentialExpired(expiresAt: Date | string): boolean {
  const expiration = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return expiration < new Date();
}

/**
 * Get credential status display
 */
export function getCredentialStatusDisplay(status: string, expiresAt: Date | string): {
  label: string;
  color: string;
  description: string;
} {
  if (isCredentialExpired(expiresAt)) {
    return {
      label: "Expired",
      color: "red",
      description: "This credential has expired and is no longer valid"
    };
  }
  
  switch (status) {
    case "active":
      return {
        label: "Active",
        color: "green",
        description: "Credential is valid and active"
      };
    case "suspended":
      return {
        label: "Suspended",
        color: "orange",
        description: "Credential is temporarily suspended"
      };
    case "revoked":
      return {
        label: "Revoked",
        color: "red",
        description: "Credential has been permanently revoked"
      };
    default:
      return {
        label: "Unknown",
        color: "gray",
        description: "Status unknown"
      };
  }
}

/**
 * Mask national ID for privacy (show only last 4 digits)
 */
export function maskNationalId(nationalId: string): string {
  if (!nationalId || nationalId.length < 4) return "****";
  return "****-****-" + nationalId.slice(-4);
}