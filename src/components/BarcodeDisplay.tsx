import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useEffect, useRef } from "react";

interface BarcodeDisplayProps {
  value: string;
  format?: "barcode" | "qr";
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BarcodeDisplay({ 
  value, 
  format = "barcode", 
  label,
  showValue = true,
  size = "md"
}: BarcodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dimensions = {
    sm: { width: 200, height: 80, fontSize: 10 },
    md: { width: 300, height: 120, fontSize: 12 },
    lg: { width: 400, height: 160, fontSize: 14 }
  };

  const dim = dimensions[size];

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        generateBarcode(ctx, value, format, dim);
      }
    }
  }, [value, format, size]);

  const generateBarcode = (
    ctx: CanvasRenderingContext2D,
    code: string,
    type: "barcode" | "qr",
    dim: typeof dimensions.md
  ) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, dim.width, dim.height);

    if (type === "barcode") {
      // Simple barcode representation (bars pattern)
      ctx.fillStyle = "#000000";
      const barWidth = 3;
      const spacing = 2;
      let x = 20;
      
      for (let i = 0; i < code.length; i++) {
        const charCode = code.charCodeAt(i);
        const pattern = (charCode % 2 === 0) ? [1, 0, 1, 0] : [1, 1, 0, 0];
        
        pattern.forEach(bar => {
          if (bar === 1) {
            ctx.fillRect(x, 20, barWidth, dim.height - 60);
          }
          x += barWidth + spacing;
        });
      }

      // Add text
      ctx.fillStyle = "#000000";
      ctx.font = `${dim.fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(code, dim.width / 2, dim.height - 20);
    } else {
      // Simple QR code representation (grid pattern)
      ctx.fillStyle = "#000000";
      const gridSize = 8;
      const cellSize = (dim.height - 40) / gridSize;
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i + j + code.length) % 2 === 0) {
            ctx.fillRect(
              20 + i * cellSize,
              20 + j * cellSize,
              cellSize - 2,
              cellSize - 2
            );
          }
        }
      }

      // Add text
      ctx.fillStyle = "#000000";
      ctx.font = `${dim.fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(code, dim.width / 2, dim.height - 10);
    }
  };

  const handlePrint = () => {
    if (canvasRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print ${label || "Barcode"}</title>
              <style>
                body { margin: 0; padding: 20px; text-align: center; }
                img { max-width: 100%; }
                h3 { margin-top: 10px; }
              </style>
            </head>
            <body>
              ${label ? `<h3>${label}</h3>` : ""}
              <img src="${canvasRef.current.toDataURL()}" />
              <script>window.print(); window.close();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `${value}-${format}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        {label && (
          <h4 className="font-semibold text-sm mb-3 text-center">{label}</h4>
        )}
        <div className="flex flex-col items-center gap-3">
          <canvas
            ref={canvasRef}
            width={dim.width}
            height={dim.height}
            className="border rounded"
          />
          {showValue && (
            <p className="text-xs font-mono text-gray-600">{value}</p>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}