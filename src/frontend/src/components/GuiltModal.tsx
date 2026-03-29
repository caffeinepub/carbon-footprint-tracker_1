import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransportMode } from "../backend";

interface GuiltModalProps {
  open: boolean;
  onClose: () => void;
  co2Grams: number;
  transportMode: TransportMode;
  distanceKm: number;
}

const TRANSPORT_LABELS: Record<TransportMode, string> = {
  [TransportMode.car]: "Car",
  [TransportMode.bus]: "Bus",
  [TransportMode.train]: "Metro/Train",
  [TransportMode.bicycle]: "Bicycle",
  [TransportMode.walk]: "Walk",
  [TransportMode.plane]: "Plane",
};

export default function GuiltModal({
  open,
  onClose,
  co2Grams,
  transportMode,
  distanceKm,
}: GuiltModalProps) {
  const phonesCharged = Math.round(co2Grams / 8.22);
  const netflixHours = Math.round(co2Grams / 36);
  const plasticBags = Math.round(co2Grams / 10);
  const coalKg = ((co2Grams / 1000) * 0.45).toFixed(2);
  const treeMinutes = Math.round(co2Grams / 0.5);

  const isHighEmitter =
    transportMode === TransportMode.car ||
    transportMode === TransportMode.plane;

  // CO2 that would have been emitted by train vs current mode
  const trainCO2 = distanceKm * 41;
  const savedPercent =
    co2Grams > 0 ? Math.round(((co2Grams - trainCO2) / co2Grams) * 100) : 0;

  const impacts = [
    {
      icon: "📱",
      label: "Smartphones Charged",
      value: phonesCharged,
      unit: "phones",
      desc: `Your trip's emissions could charge ${phonesCharged} smartphone${phonesCharged !== 1 ? "s" : ""} to 100%.`,
    },
    {
      icon: "📺",
      label: "Netflix Streaming",
      value: netflixHours,
      unit: "hours",
      desc: `That's equivalent to ${netflixHours} hour${netflixHours !== 1 ? "s" : ""} of Netflix streaming — every hour counts!`,
    },
    {
      icon: "🌊",
      label: "Melting Ice",
      value: treeMinutes,
      unit: "min tree work",
      desc: `A single tree must work for ${treeMinutes} minutes just to absorb what you emitted today.`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="guilt.modal"
        className="max-w-md p-0 overflow-hidden rounded-2xl"
      >
        {/* Dramatic header */}
        <div
          className="px-6 pt-6 pb-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, #dc2626 0%, #ea580c 60%, #f97316 100%)",
          }}
        >
          <DialogHeader>
            <div className="text-4xl mb-2 text-center">⚠️</div>
            <DialogTitle className="text-white text-center text-xl font-bold leading-snug">
              Your Carbon Footprint Reality Check
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-orange-100 text-sm mt-2">
            You just emitted{" "}
            <span className="font-black text-white text-lg">
              {co2Grams >= 1000
                ? `${(co2Grams / 1000).toFixed(2)} kg`
                : `${co2Grams} g`}
            </span>{" "}
            of CO₂ by {TRANSPORT_LABELS[transportMode].toLowerCase()} for{" "}
            {distanceKm} km.
          </p>
        </div>

        {/* Impact cards */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            🌍 Here's what that means for our planet:
          </p>

          {impacts.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200"
            >
              <span className="text-2xl mt-0.5">{item.icon}</span>
              <div>
                <p className="font-bold text-orange-900 text-sm">
                  <span className="text-orange-600 text-lg">{item.value}</span>{" "}
                  {item.unit}
                </p>
                <p className="text-xs text-orange-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Extra guilt for car/plane */}
          {isHighEmitter && savedPercent > 0 && (
            <div className="p-3 rounded-xl bg-red-50 border-2 border-red-300">
              <p className="text-sm font-bold text-red-700">
                🚆 If you had taken the metro/train instead...
              </p>
              <p className="text-xs text-red-600 mt-1">
                You would have saved{" "}
                <span className="font-black text-red-700">{savedPercent}%</span>{" "}
                of your CO₂ emissions — that's{" "}
                <span className="font-bold">
                  {(co2Grams - trainCO2).toFixed(0)} g CO₂
                </span>{" "}
                spared from our atmosphere.
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">
              🏭 Your trip burned the equivalent of{" "}
              <span className="font-bold text-slate-800">
                {coalKg} kg of coal
              </span>
              . Small choices, repeated daily, are responsible for{" "}
              <span className="font-bold">71% of global emissions</span>. The
              future is literally shaped by decisions like the one you just
              made.
            </p>
          </div>

          {/* Plastic bags fact */}
          {plasticBags > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              🛍️ Also equivalent to manufacturing {plasticBags} plastic bag
              {plasticBags !== 1 ? "s" : ""}.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-5 pb-5">
          <Button
            data-ocid="guilt.confirm_button"
            onClick={onClose}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            🌱 I&apos;ll Do Better
          </Button>
          <Button
            data-ocid="guilt.cancel_button"
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            It&apos;s fine
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
