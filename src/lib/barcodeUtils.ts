// Barcode utility functions for generating and validating barcodes

export function generateBarcode(prefix: string, id: string | number): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${randomPart}-${id}`;
}

export function generateSKU(category: string, subcategory: string, index: number): string {
  const catCode = category.substring(0, 2).toUpperCase();
  const subCode = subcategory.substring(0, 3).toUpperCase();
  const num = index.toString().padStart(3, "0");
  return `${catCode}-${subCode}-${num}`;
}

export function validateBarcode(barcode: string): boolean {
  // Basic validation - check format
  const patterns = [
    /^[A-Z]{2,3}-\d{6}-[A-Z0-9]{4}-\d+$/, // Standard format
    /^[A-Z0-9]{8,}$/, // Simple alphanumeric
    /^\d{12,13}$/ // UPC/EAN format
  ];
  
  return patterns.some(pattern => pattern.test(barcode));
}

export function getBarcodeType(barcode: string): string {
  if (/^INV-/.test(barcode)) return "Inventory";
  if (/^PLT-/.test(barcode)) return "Plant Batch";
  if (/^MFG-/.test(barcode)) return "Manufacturing";
  if (/^LAB-/.test(barcode)) return "Lab Sample";
  if (/^TRN-/.test(barcode)) return "Transport";
  if (/^STF-/.test(barcode)) return "Staff";
  if (/^RET-/.test(barcode)) return "Retail";
  return "Unknown";
}

export interface BarcodeData {
  type: string;
  id: string;
  module: string;
  createdAt: string;
}

export function parseBarcode(barcode: string): BarcodeData | null {
  const parts = barcode.split("-");
  if (parts.length < 2) return null;

  return {
    type: getBarcodeType(barcode),
    id: parts[parts.length - 1],
    module: parts[0],
    createdAt: new Date().toISOString()
  };
}