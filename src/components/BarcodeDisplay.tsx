import { Card } from "@/components/ui/card";

interface BarcodeDisplayProps {
  value: string;
  format: string;
  label: string;
  size?: string;
}

export function BarcodeDisplay({ value, format, label, size = "medium" }: BarcodeDisplayProps) {
  return (
    <Card className="p-4">
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</div>
        <div className="font-mono font-bold text-lg mb-2">{value}</div>
        <div className="text-xs text-gray-500">Format: {format}</div>
      </div>
    </Card>
  );
}