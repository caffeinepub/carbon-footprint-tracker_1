import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { TransportMode, type Trip } from "../backend";

const EMISSION_FACTORS: Record<TransportMode, number> = {
  [TransportMode.car]: 171,
  [TransportMode.bus]: 89,
  [TransportMode.train]: 41,
  [TransportMode.bicycle]: 0,
  [TransportMode.walk]: 0,
  [TransportMode.plane]: 255,
};

interface Tip {
  icon: string;
  title: string;
  description: string;
  saving?: string;
  badge?: string;
  badgeColor?: string;
}

const STATIC_TIPS: Tip[] = [
  {
    icon: "🚆",
    title: "Take the Metro or Train",
    description:
      "Metro and trains emit 76% less CO₂ than cars per km. Switching your daily commute to metro can save over 100 kg CO₂ per month.",
    badge: "High Impact",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    icon: "🚴",
    title: "Cycle Short Distances",
    description:
      "For trips under 5 km, cycling emits zero CO₂ and is often faster in urban traffic. It also boosts your health!",
    badge: "Zero Emissions",
    badgeColor: "bg-teal-100 text-teal-700",
  },
  {
    icon: "🚌",
    title: "Choose Bus Over Car",
    description:
      "Buses produce 48% less CO₂ per km than cars. Even switching 2 car trips a week to bus makes a meaningful impact.",
    badge: "Good Choice",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];

interface TipsSectionProps {
  trips: Trip[];
}

export default function TipsSection({ trips }: TipsSectionProps) {
  const lastTrip = trips.length > 0 ? trips[trips.length - 1] : null;

  let dynamicTips: Tip[] = [];

  if (lastTrip) {
    const mode = lastTrip.transportMode;
    const km = lastTrip.distanceKm;
    const currentCO2 = lastTrip.co2Grams;

    const alternatives: { mode: TransportMode; label: string; icon: string }[] =
      [
        { mode: TransportMode.train, label: "Metro/Train", icon: "🚆" },
        { mode: TransportMode.bus, label: "Bus", icon: "🚌" },
        { mode: TransportMode.bicycle, label: "Bicycle", icon: "🚴" },
      ].filter(
        (a) =>
          a.mode !== mode && EMISSION_FACTORS[a.mode] < EMISSION_FACTORS[mode],
      );

    dynamicTips = alternatives.slice(0, 3).map((alt) => {
      const altCO2 = Math.round(km * EMISSION_FACTORS[alt.mode]);
      const saving = currentCO2 - altCO2;
      return {
        icon: alt.icon,
        title: `Switch to ${alt.label}`,
        description: `Your last trip was ${km.toFixed(1)} km by ${mode} (${(currentCO2 / 1000).toFixed(2)} kg CO₂). Switching to ${alt.label} would emit only ${(altCO2 / 1000).toFixed(2)} kg CO₂.`,
        saving:
          saving > 0
            ? `Save ${(saving / 1000).toFixed(2)} kg CO₂`
            : "Zero emissions!",
        badge: saving > 500 ? "High Saving" : "Better Choice",
        badgeColor:
          saving > 500
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700",
      };
    });
  }

  const displayTips = dynamicTips.length > 0 ? dynamicTips : STATIC_TIPS;

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {displayTips.map((tip, i) => (
        <motion.div
          key={tip.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          data-ocid={`tips.item.${i + 1}`}
        >
          <Card className="shadow-card border border-border rounded-xl h-full hover:shadow-card-hover transition-shadow">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">{tip.icon}</div>
              {tip.badge && (
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${tip.badgeColor}`}
                >
                  {tip.badge}
                </span>
              )}
              <h3 className="text-base font-bold text-eco-navy font-display mb-2">
                {tip.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.description}
              </p>
              {tip.saving && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-sm font-semibold text-primary">
                    💚 {tip.saving}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
