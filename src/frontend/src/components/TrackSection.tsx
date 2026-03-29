import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TransportMode, type Trip } from "../backend";
import { useAddTrip } from "../hooks/useQueries";
import GuiltModal from "./GuiltModal";

const EMISSION_FACTORS: Record<TransportMode, number> = {
  [TransportMode.car]: 171,
  [TransportMode.bus]: 89,
  [TransportMode.train]: 41,
  [TransportMode.bicycle]: 0,
  [TransportMode.walk]: 0,
  [TransportMode.plane]: 255,
};

const TRANSPORT_OPTIONS: {
  mode: TransportMode;
  label: string;
  emoji: string;
}[] = [
  { mode: TransportMode.car, label: "Car", emoji: "\uD83D\uDE97" },
  { mode: TransportMode.bus, label: "Bus", emoji: "\uD83D\uDE8C" },
  { mode: TransportMode.train, label: "Metro/Train", emoji: "\uD83D\uDE86" },
  { mode: TransportMode.bicycle, label: "Bicycle", emoji: "\uD83D\uDEB4" },
  { mode: TransportMode.walk, label: "Walk", emoji: "\uD83D\uDEB6" },
  { mode: TransportMode.plane, label: "Plane", emoji: "\u2708\uFE0F" },
];

interface TrackSectionProps {
  trips: Trip[];
}

export default function TrackSection({ trips }: TrackSectionProps) {
  const [userName, setUserName] = useState("");
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [distance, setDistance] = useState("");
  const [guiltCo2, setGuiltCo2] = useState<number | null>(null);
  const [guiltMode, setGuiltMode] = useState<TransportMode>(TransportMode.car);
  const [guiltDist, setGuiltDist] = useState(0);
  const [showGuilt, setShowGuilt] = useState(false);
  const addTrip = useAddTrip();

  useEffect(() => {
    const saved = localStorage.getItem("ecoUserName");
    if (saved) setUserName(saved);
  }, []);

  const handleUserNameChange = (value: string) => {
    setUserName(value);
    localStorage.setItem("ecoUserName", value);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTrips = trips.filter((t) => {
    const ts = Number(t.timestamp) / 1_000_000;
    return ts >= today.getTime();
  });

  const todayStats = todayTrips.reduce(
    (acc, t) => ({
      trips: acc.trips + 1,
      co2: acc.co2 + t.co2Grams,
      distance: acc.distance + t.distanceKm,
    }),
    { trips: 0, co2: 0, distance: 0 },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!selectedMode) {
      toast.error("Please select a transport mode.");
      return;
    }
    const km = Number.parseFloat(distance);
    if (!km || km <= 0) {
      toast.error("Please enter a valid distance.");
      return;
    }
    const co2Grams = Math.round(km * EMISSION_FACTORS[selectedMode]);
    try {
      await addTrip.mutateAsync({
        userName: userName.trim(),
        transportMode: selectedMode,
        distanceKm: km,
        co2Grams,
      });
      toast.success(`Trip logged! ${co2Grams}g CO\u2082 recorded.`);
      setDistance("");
      setSelectedMode(null);
      // Show guilt modal
      setGuiltCo2(co2Grams);
      setGuiltMode(selectedMode);
      setGuiltDist(km);
      setShowGuilt(true);
    } catch {
      toast.error("Failed to log trip. Please try again.");
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-5 gap-6">
        {/* Form card - wider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3"
        >
          <Card className="shadow-card border border-border rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-eco-navy font-display">
                Log a Trip
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select your transport mode and enter the distance.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name input */}
                <div>
                  <Label
                    htmlFor="user-name"
                    className="text-sm font-semibold text-eco-navy mb-1.5 block"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="user-name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={userName}
                    onChange={(e) => handleUserNameChange(e.target.value)}
                    data-ocid="trip_form.name.input"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-eco-navy mb-3 block">
                    Transport Mode
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TRANSPORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.mode}
                        type="button"
                        data-ocid={`trip_form.${opt.mode}.toggle`}
                        onClick={() => setSelectedMode(opt.mode)}
                        className={`
                          flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium
                          ${
                            selectedMode === opt.mode
                              ? "border-primary bg-primary/10 text-primary shadow-sm scale-[1.02]"
                              : "border-border hover:border-primary/40 hover:bg-accent text-muted-foreground"
                          }
                        `}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-xs leading-tight text-center">
                          {opt.label}
                        </span>
                        {selectedMode === opt.mode && (
                          <span className="text-[10px] font-semibold text-primary">
                            {EMISSION_FACTORS[opt.mode]}g/km
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="distance"
                    className="text-sm font-semibold text-eco-navy mb-1.5 block"
                  >
                    Distance (km)
                  </Label>
                  <div className="relative">
                    <Input
                      id="distance"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="e.g. 12.5"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      data-ocid="trip_form.distance.input"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      km
                    </span>
                  </div>
                  {selectedMode &&
                    distance &&
                    Number.parseFloat(distance) > 0 && (
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        Estimated:{" "}
                        <span className="font-semibold text-eco-navy">
                          {(
                            (Number.parseFloat(distance) *
                              EMISSION_FACTORS[selectedMode]) /
                            1000
                          ).toFixed(2)}{" "}
                          kg CO₂
                        </span>
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  data-ocid="trip_form.submit_button"
                  disabled={addTrip.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  {addTrip.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging Trip...
                    </>
                  ) : (
                    "Log Trip & Calculate CO\u2082"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="md:col-span-2"
        >
          <Card className="shadow-card border border-border rounded-xl h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-eco-navy font-display">
                Today&apos;s Summary
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <SummaryMetric
                  label="Trips Logged"
                  value={todayStats.trips.toString()}
                  unit="trips"
                  icon="\uD83D\uDDD3\uFE0F"
                />
                <SummaryMetric
                  label="CO\u2082 Emitted"
                  value={(todayStats.co2 / 1000).toFixed(2)}
                  unit="kg CO\u2082"
                  icon="\uD83D\uDCA8"
                  highlight={todayStats.co2 > 5000}
                />
                <SummaryMetric
                  label="Distance Travelled"
                  value={todayStats.distance.toFixed(1)}
                  unit="km"
                  icon="\uD83D\uDCCD"
                />
              </div>

              {todayStats.co2 > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Daily CO₂ Goal</span>
                    <span>
                      {Math.min(100, Math.round((todayStats.co2 / 5000) * 100))}
                      % of 5kg
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${todayStats.co2 > 5000 ? "bg-red-400" : todayStats.co2 > 2500 ? "bg-yellow-400" : "bg-primary"}`}
                      style={{
                        width: `${Math.min(100, (todayStats.co2 / 5000) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {todayStats.co2 < 5000
                      ? `${((5000 - todayStats.co2) / 1000).toFixed(2)} kg under your daily budget \uD83C\uDF89`
                      : "Over your daily budget \u2014 try greener options! \uD83C\uDF3F"}
                  </p>
                </div>
              )}

              {todayStats.trips === 0 && (
                <div
                  data-ocid="today_summary.empty_state"
                  className="text-center py-6"
                >
                  <p className="text-4xl mb-2">🌱</p>
                  <p className="text-sm text-muted-foreground">
                    No trips logged today.
                    <br />
                    Start your eco journey!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Guilt Modal */}
      {guiltCo2 !== null && (
        <GuiltModal
          open={showGuilt}
          onClose={() => setShowGuilt(false)}
          co2Grams={guiltCo2}
          transportMode={guiltMode}
          distanceKm={guiltDist}
        />
      )}
    </>
  );
}

function SummaryMetric({
  label,
  value,
  unit,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  unit: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-border">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <div className="text-right">
        <span
          className={`text-lg font-bold font-display ${highlight ? "text-red-500" : "text-eco-navy"}`}
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground ml-1">{unit}</span>
      </div>
    </div>
  );
}
