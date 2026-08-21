// Simple barcode utilities for product tracking
// Separate from Canna ID 360™ credential system

export function generateProductBarcode(productId: string, batchNumber: string): string {
  // Generate a simple barcode for cannabis products
  const timestamp = Date.now().toString().slice(-6);
  return `CB${productId.slice(0, 4).toUpperCase()}${batchNumber.slice(0, 4)}${timestamp}`;
}

export function validateBarcode(barcode: string): boolean {
  // Basic validation for product barcodes
  return /^CB[A-Z0-9]{4}[A-Z0-9]{4}[0-9]{6}$/.test(barcode);
}

export function formatBarcodeDisplay(barcode: string): string {
  // Format barcode for display
  if (barcode.length >= 14) {
    return `${barcode.slice(0, 2)}-${barcode.slice(2, 6)}-${barcode.slice(6, 10)}-${barcode.slice(10)}`;
  }
  return barcode;
}

export function parseBarcodeData(barcode: string): { prefix: string; productCode: string; batchCode: string; timestamp: string } | null {
  if (!validateBarcode(barcode)) return null;
  
  return {
    prefix: barcode.slice(0, 2),
    productCode: barcode.slice(2, 6),
    batchCode: barcode.slice(6, 10),
    timestamp: barcode.slice(10)
  };
}