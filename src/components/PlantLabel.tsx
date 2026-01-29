import { Card } from "@/components/ui/card";
import { CannabisLeaf } from "@/components/CannabisLeaf";

interface PlantLabelProps {
  plantId: string;
  strain: string;
  plantedDate: string;
  batchNumber: string;
  location: string;
  stage: string;
}

export function PlantLabel({ plantId, strain, plantedDate, batchNumber, location, stage }: PlantLabelProps) {
  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-900 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-900">
        <div className="flex items-center gap-2">
          <CannabisLeaf className="text-emerald-600" size={32} />
          <div>
            <h3 className="font-bold text-sm">CANNABIS TRACKING</h3>
            <p className="text-xs text-gray-600">Seed-to-Sale System</p>
          </div>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 bg-gray-100 border-2 border-gray-900 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            {/* Simple QR code pattern simulation */}
            <rect x="0" y="0" width="20" height="20" fill="black"/>
            <rect x="80" y="0" width="20" height="20" fill="black"/>
            <rect x="0" y="80" width="20" height="20" fill="black"/>
            <rect x="30" y="10" width="10" height="10" fill="black"/>
            <rect x="50" y="10" width="10" height="10" fill="black"/>
            <rect x="70" y="10" width="10" height="10" fill="black"/>
            <rect x="10" y="30" width="10" height="10" fill="black"/>
            <rect x="30" y="30" width="10" height="10" fill="black"/>
            <rect x="50" y="30" width="10" height="10" fill="black"/>
            <rect x="70" y="30" width="10" height="10" fill="black"/>
            <rect x="10" y="50" width="10" height="10" fill="black"/>
            <rect x="30" y="50" width="10" height="10" fill="black"/>
            <rect x="50" y="50" width="10" height="10" fill="black"/>
            <rect x="70" y="50" width="10" height="10" fill="black"/>
            <rect x="10" y="70" width="10" height="10" fill="black"/>
            <rect x="30" y="70" width="10" height="10" fill="black"/>
            <rect x="50" y="70" width="10" height="10" fill="black"/>
            <rect x="70" y="70" width="10" height="10" fill="black"/>
          </svg>
        </div>
      </div>

      {/* Plant Information */}
      <div className="space-y-2 text-center mb-4">
        <div className="bg-gray-900 text-white px-3 py-2 rounded font-mono text-xl font-bold">
          {plantId}
        </div>
        <div className="font-bold text-lg">{strain}</div>
        <div className="text-sm text-gray-600">Batch: {batchNumber}</div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs border-t-2 border-gray-900 pt-3">
        <div>
          <p className="font-bold">Planted:</p>
          <p>{plantedDate}</p>
        </div>
        <div>
          <p className="font-bold">Location:</p>
          <p>{location}</p>
        </div>
        <div className="col-span-2">
          <p className="font-bold">Stage:</p>
          <p className="uppercase">{stage}</p>
        </div>
      </div>

      {/* Barcode */}
      <div className="mt-4 pt-3 border-t-2 border-gray-900">
        <div className="flex justify-center">
          <svg viewBox="0 0 200 40" className="w-full h-8">
            {/* Barcode pattern */}
            {[0, 10, 15, 25, 30, 40, 45, 50, 60, 65, 75, 80, 90, 95, 100, 110, 115, 125, 130, 140, 145, 155, 160, 170, 175, 185, 190].map((x, i) => (
              <rect key={i} x={x} y="0" width={i % 3 === 0 ? "8" : "3"} height="30" fill="black"/>
            ))}
          </svg>
        </div>
        <p className="text-center font-mono text-xs mt-1">{plantId}-{batchNumber}</p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-300">
        Compliant with state regulations
      </div>
    </div>
  );
}