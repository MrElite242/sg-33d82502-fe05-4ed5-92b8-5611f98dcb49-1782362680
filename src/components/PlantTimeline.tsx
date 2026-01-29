import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface TimelineEntry {
  stage: string;
  date: string;
  notes?: string;
  completed: boolean;
}

interface PlantTimelineProps {
  timeline: TimelineEntry[];
}

export function PlantTimeline({ timeline }: PlantTimelineProps) {
  return (
    <div className="space-y-4">
      {timeline.map((entry, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            {entry.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-300" />
            )}
            {index < timeline.length - 1 && (
              <div className={`w-0.5 h-full min-h-[40px] ${entry.completed ? 'bg-green-600' : 'bg-gray-300'}`} />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{entry.stage}</h4>
              {entry.completed && (
                <Badge variant="outline" className="text-green-600">Completed</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{entry.date}</p>
            {entry.notes && (
              <p className="text-sm text-gray-500 mt-2">{entry.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}