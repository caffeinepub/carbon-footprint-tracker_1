import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { TransportMode, type Trip } from "../backend";

const MODE_EMOJI: Record<TransportMode, string> = {
  [TransportMode.car]: "🚗",
  [TransportMode.bus]: "🚌",
  [TransportMode.train]: "🚆",
  [TransportMode.bicycle]: "🚴",
  [TransportMode.walk]: "🚶",
  [TransportMode.plane]: "✈️",
};

const MODE_LABELS: Record<TransportMode, string> = {
  [TransportMode.car]: "Car",
  [TransportMode.bus]: "Bus",
  [TransportMode.train]: "Metro/Train",
  [TransportMode.bicycle]: "Bicycle",
  [TransportMode.walk]: "Walk",
  [TransportMode.plane]: "Plane",
};

const CO2_COLORS = (grams: number): string => {
  if (grams === 0) return "text-green-600 bg-green-50";
  if (grams < 1000) return "text-blue-600 bg-blue-50";
  if (grams < 5000) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
};

interface TripHistoryProps {
  trips: Trip[];
}

export default function TripHistory({ trips }: TripHistoryProps) {
  const sorted = trips
    .slice()
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 20);

  if (sorted.length === 0) {
    return (
      <Card
        data-ocid="history.empty_state"
        className="shadow-card border border-border rounded-xl"
      >
        <CardContent className="py-16 text-center">
          <p className="text-5xl mb-3">🗺️</p>
          <p className="text-lg font-semibold text-eco-navy font-display">
            No trips yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Log your first trip to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((trip, i) => {
        const ts = Number(trip.timestamp) / 1_000_000;
        const date = new Date(ts);
        const colorClass = CO2_COLORS(trip.co2Grams);
        const key = `${trip.transportMode}-${Number(trip.timestamp)}-${i}`;
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
            data-ocid={`history.item.${i + 1}`}
          >
            <Card className="shadow-card border border-border rounded-xl hover:shadow-card-hover transition-shadow">
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-2xl flex-shrink-0">
                    {MODE_EMOJI[trip.transportMode]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-eco-navy font-display">
                        {MODE_LABELS[trip.transportMode]}
                      </span>
                      <span className="text-muted-foreground text-sm">·</span>
                      <span className="text-sm text-muted-foreground">
                        {trip.distanceKm.toFixed(1)} km
                      </span>
                      {trip.userName && (
                        <>
                          <span className="text-muted-foreground text-sm">
                            ·
                          </span>
                          <span className="text-xs text-muted-foreground italic">
                            {trip.userName}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold font-display flex-shrink-0 ${colorClass}`}
                  >
                    {trip.co2Grams === 0
                      ? "0g CO₂ 🌿"
                      : `${(trip.co2Grams / 1000).toFixed(2)} kg CO₂`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
